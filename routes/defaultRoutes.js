const express = require('express');
const defaultControllers = require('../controllers/defaultControllers');
const middleware = require('../middleware/auth');

router = express.Router();

router.get('/logg-inn', defaultControllers.loginGET);
router.post('/logg-inn', defaultControllers.loginPOST);
router.get('/', middleware.authenticate, defaultControllers.index);

module.exports = router;