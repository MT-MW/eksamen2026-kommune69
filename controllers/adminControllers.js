const { createFlashCookie, findUser } = require('./defaultControllers.js')
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

const adminOverview = async (req, res) => {
    try {
        //get logged in user
        const bruker = await findUser(req);
        //get flash and remove cookie
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //get all active hendelser
        const active = await Hendelse.find({
            status: { $in: [ 'registrert', 'under behandling' ] }
        })
        //get all solved hendelser
        const solved = await Hendelse.find({
            status: { $in: 'løst' }
        })
        //get all archived hendelser
        const archive = await Hendelse.find({
            status: { $in: 'arkivert' }
        })
        //get all users
        const brukere = await Bruker.find()

        res.render('adminOverview', {
            title: 'Admin Oversikt',
            active,
            solved,
            archive,
            brukere,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

const adminUsers = async (req, res) => {
    try {
        //get logged in user
        const bruker = await findUser(req);
        //get flash and remove cookie
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //get all users
        const brukere = await Bruker.find()
        .populate('tildelteHendelser')

        res.render('adminUsers', {
            title: 'Admin Brukere Oversikt',
            brukere,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

const adminActive = async (req, res) => {
    try {
        const bruker = await findUser(req);
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //get all active hendelser
        const results = await Hendelse.find({
            status: { $in: [ 'registrert', 'under behandling' ] }
        })

        res.render('adminActive', {
            title: 'Admin Aktive Hendelser',
            results,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

const adminSolved = async (req, res) => {
    try {
        const bruker = await findUser(req);
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //get all solved hendelser
        const results = await Hendelse.find({
            status: { $in: 'løst' }
        })

        res.render('adminSolved', {
            title: 'Admin Løste Hendelser',
            results,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

const adminArchive = async (req, res) => {
    try {
        const bruker = await findUser(req);
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //get all archived hendelser
        const results = await Hendelse.find({
            status: { $in: 'arkivert' }
        })

        res.render('adminArchive', {
            title: 'Admin Arkiv',
            results,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    adminOverview,
    adminUsers,
    adminActive,
    adminSolved,
    adminArchive
}