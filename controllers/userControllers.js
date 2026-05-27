const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createFlashCookie, findUser } = require('./defaultControllers.js')
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');

const profile = async (req, res) => {
    flash = {
        message: req.cookies.flash,
        type: 'error'
    };
    res.clearCookie('flash');

    try {
        const loggedInUser = await findUser(req);

        //checks if logged in user is same as in params
        if (loggedInUser._id.toString() !== req.params.brukerId) {
            createFlashCookie(res, 'Du har ikke tilgang til denne siden. Sender deg til hjemmesiden din.');
            return res.redirect(`/profil/${loggedInUser._id}`);
        }

        //finds hendelser that belongs to user excluding archived and solved
        const results = await Hendelse.find({ 
            ansvarligPerson: loggedInUser._id, 
            status: { $nin: [ 'arkivert', 'løst' ] }
        });

        res.render('profile', { 
            title: 'Profil', 
            bruker: loggedInUser, 
            flash, 
            results 
        })
    } catch (error) {
        console.log(error)
    }
}

const logout = (req, res) => {
    try {
        //logger ut bruker
        res.clearCookie('accessToken');
        res.redirect('/logg-inn');
        console.log('user logged out')
    } catch (error) {
        console.log(error)
    }
}

const delUser = async (req, res) => {
    try {
        const loggedInUser = await findUser(req);

        //checks if logged in user is same as in params
        if (loggedInUser._id.toString() !== req.params.brukerId) {
            console.log(req.params.brukerid)
            console.log(loggedInUser._id.toString())
            createFlashCookie(res, 'Du har ikke tilgang til å gjøre dette. Sender deg til hjemmesiden din.');
            return res.redirect(`/profil/${loggedInUser._id}`);
        }

        //deletes user
        const userToDelete = await Bruker.findByIdAndDelete(loggedInUser._id)
        console.log(`Bruker slettet: ${userToDelete.fornavn, userToDelete.etternavn}`)
        
        res.redirect('/logg-inn')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    profile,
    logout,
    delUser
}