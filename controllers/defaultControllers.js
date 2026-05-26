const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

const loginGET = (req, res) => {
    try {
        res.clearCookie('accessToken');
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');
        res.render('index', { title: 'Logg Inn' })
    } catch (error) {
        console.log(error)
    }
}

const loginPOST = async (req, res) => {
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
            {expiresIn: '7m'}
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

const problems = async (req, res) => {
    try {
        const bruker = await findUser(req)
        const results = await Hendelse.find();
        res.render('problems', { title: 'Hendelser', results, bruker })
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
    problems,
    createFlashCookie,
    findUser
}