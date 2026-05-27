const express = require('express');
const defaultControllers = require('../controllers/defaultControllers');
const authMiddleware = require('../middleware/auth');
const limitMiddleware = require('../middleware/rateLimiter');

router = express.Router();

router.get('/logg-inn', limitMiddleware.limiter, defaultControllers.loginGET);
router.post('/logg-inn', limitMiddleware.limiter, defaultControllers.loginPOST);
router.get('/', authMiddleware.authenticate, defaultControllers.index);
router.get('/faq', authMiddleware.authenticate, defaultControllers.faq);

module.exports = router;