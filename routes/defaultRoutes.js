const express = require('express');
const defaultControllers = require('../controllers/defaultControllers');

router = express.Router()

router.get('/', defaultControllers.loginGET);
router.get('/hendelser', defaultControllers.problems);

module.exports = router;