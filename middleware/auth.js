const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createFlashCookie } = require('../controllers/defaultControllers');
const { Bruker } = require('../models/bruker');


const authenticate = (req, res, next) => {
    console.info('Authenticating user...');

    //checks if user has accesstoken and sets token as the value, if user doesnt have accesstoken tken = undefined
    const token = req.cookies?.accessToken;

    //if there is no token redirect user to log in
    if (!token) {
        console.warn('No access token found. Redirecting to login.');
        createFlashCookie(res, 'Du har ikke tilgang her. Logg inn for å få tilgang')
        return res.redirect('/logg-inn');
    }

    try {
        //verifies token, checks if token is the same as JWT_SECERET
        const decoded = jwt.verify(token, process.env.JWT_SECERET);
        req.auth = decoded;
        console.info('User authenticated successfully.');
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.redirect('/logg-inn');
    }
}

const adminAuth = async (req, res, next) => { 
    //checks if user has accesstoken and sets token as the value, if user doesnt have accesstoken tken = undefined
    const token = req.cookies?.accessToken; 

    //if no token redirect to home
    if (!token) {
        console.warn('No access token found. Redirecting to login.');
        createFlashCookie(res, 'Du har ikke tilgang her. Logg inn for å få tilgang')
        return res.redirect('/logg-inn');
    }

    try {
        //verifies token, checks if token is the same as JWT_SECERET
        const decoded = jwt.verify(token, process.env.JWT_SECERET);
        req.auth = decoded;

        //gets user from the db that matches logged in users id
        const user = await Bruker.findOne({ _id: decoded.id });

        //if there is no mathing user redirect to login
        if (!user) {
            console.log('User not found');
            return res.redirect('/logg-inn');
        }

        //if user isnt in avdeling administrasjon redirect to login
        if (user.avdeling !== 'administrasjon') {
            console.log('access denied, no admin');
            createFlashCookie(res, 'Du har ikke rettighetene til å gjøre dette');
            return res.redirect('/logg-inn');
        }

        //give access to admin
        console.log('access granted, welcome admin')
        next();

    } catch (err) {
        return res.redirect('/');
    }
};

module.exports = {
    authenticate,
    adminAuth
}
