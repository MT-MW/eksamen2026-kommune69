const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createFlashCookie } = require('../controllers/defaultControllers');
const { Bruker } = require('../models/bruker');


const authenticate = (req, res, next) => {
    console.info('Authenticating user...');
    const token = req.cookies?.accessToken;
    if (!token) {
        console.warn('No access token found. Redirecting to login.');
        createFlashCookie(res, 'Du har ikke tilgang her. Logg inn for å få tilgang')
        return res.redirect('/logg-inn');
    }
    try {
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
    const token = req.cookies?.accessToken; 

    if (!token) {
        return res.redirect('/logg-inn');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECERET);
        req.auth = decoded;

        const user = await Bruker.findOne({ _id: decoded.id });

        if (!user) {
            console.log('User not found');
            return res.redirect('/logg-inn');
        }

        if (user.rolle !== 'administrasjon') {
            console.log('access denied, no admin');
            createFlashCookie(res, 'Du har ikke riktige rettighetene til å gjøre dette');
            return res.redirect('/logg-inn');
        }

        console.log('access granted, welcome admin')
        next();

    } catch (err) {
        return res.redirect('/');
    }
};

module.exports = {
    authenticate
}
