const express = require('express');
const userControllers = require('../controllers/userControllers');
const middleware = require('../middleware/auth');
const limitMiddleware = require('../middleware/rateLimiter');

router = express.Router();

router.get('/profil/:brukerId', middleware.authenticate, userControllers.profile);
router.post('/logg-ut', middleware.authenticate, limitMiddleware.limiter, userControllers.logout);
router.post('/slett-bruker/:brukerId', middleware.authenticate, limitMiddleware.limiter, userControllers.delUser);

module.exports = router;