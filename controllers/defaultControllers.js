//dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();

//get all schema models
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

const loginGET = (req, res) => {
    try {
        //clear jwt cookie / log out user
        res.clearCookie('accessToken');

        //get flash message and remove cookie
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        res.render('login', { 
            title: 'Logg Inn',
            bruker: null
        })
    } catch (error) {
        console.log(error)
    }
}

const loginPOST = async (req, res) => {
    //get field values from submitted form/body
    const { firstname, lastname, password } = req.body;
    try {
        //checks if user exists in database
        const user = await Bruker.findOne({fornavn: firstname, etternavn: lastname})
        if(!user) {
            createFlashCookie(res, 'Navn eller passord er feil');
            return res.redirect('/logg-inn');
        }

        //checks password
        const isValid = await verifyPassword(user, password);
        if(!isValid) {
            createFlashCookie(res, 'Navn eller passord er feil');
            return res.redirect('/logg-inn');
        }

        //give user cookie with jwt token if everything is right
        const token = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECERET, 
            {expiresIn: '30m'}
        );
        
        res.cookie('accessToken', token, {
            httpOnly: true, 
            sameSite: 'strict'
        });

        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const index = async (req, res) => {
    try {
        const bruker = await findUser(req)
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');

        //gets filter value from the query
        const filter = req.query.filter;
        const prioritetFilter = req.query.prioritetFilter;

        // get the possible enum values from schema
        const allpriorities = Hendelse.schema.path('prioritet').enumValues;

        //exclude priorities løst and arkivert
        const prioritet = allpriorities.filter(v => !['løst', 'arkivert'].includes(v));

        //set query to empty
        let query = {};

        // if there is a filter value set the query.tema to the value
        if (filter) {
            query.tema = filter;
        }

        // if there is a priority filter value set query.prioritet to the value
        if (prioritetFilter) {
            query.prioritet = prioritetFilter;
        }

        // only show hendelser with status arkivert or løst
        query.status = { $nin: [ 'arkivert', 'løst' ] };

        //get all hendelser that match the query spesifications and sort by newest first
        const results = await Hendelse.find(query)
        .sort({ opprettelseDato: -1 })
        
        res.render('index', { 
            title: 'Hendelser', 
            results, 
            bruker,
            prioritet
        })
    } catch (error) {
        console.log(error)
    }
}

const faq = async (req, res) => {
    try {
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');
        
        const bruker = await findUser(req)

        res.render('faq', {
            bruker,
            flash,
            title: 'FAQ'
        })
    } catch (error) {
        console.log(error)
    }
}

//create error message
function createFlashCookie(res, message) {
    console.log("Creating flash cookie with message:", message);
    res.cookie('flash', message, {httpOnly: true, sameSite: 'strict', maxAge: 30000});
}

//find logged in user
async function findUser(req) {
    let bruker = null;
    if (req.auth) {
        bruker = await Bruker.findById(req.auth.id);
    }
    return bruker;
}

module.exports = {
    loginGET,
    loginPOST,
    index,
    faq,
    createFlashCookie,
    findUser
}