const express = require('express');
const userControllers = require('../controllers/userControllers');
const middleware = require('../middleware/auth');

router = express.Router();

router.get('/profil/:brukerId', middleware.authenticate, userControllers.profile);
router.post('/logg-ut', middleware.authenticate, userControllers.logout);
router.post('/slett-bruker/:brukerId', middleware.authenticate, userControllers.delUser);

module.exports = router;