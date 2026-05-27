const express = require('express');
const hendelseControllers = require('../controllers/hendelseControllers');
const authMiddleware = require('../middleware/auth');
const limitMiddleware = require('../middleware/rateLimiter');

router = express.Router();

router.get('/ny-hendelse', authMiddleware.authenticate, hendelseControllers.newHendelseGET);
router.post('/ny-hendelse', authMiddleware.authenticate,limitMiddleware.limiter, hendelseControllers.newHendelsePOST);
router.get('/detaljer/:hendelseId', authMiddleware.authenticate, hendelseControllers.hendelseDetails);
router.get('/nytt-tiltak/:hendelseId', authMiddleware.authenticate, hendelseControllers.newTiltakGET);
router.post('/nytt-tiltak/:hendelseId', authMiddleware.authenticate, limitMiddleware.limiter, hendelseControllers.newTiltakPOST);

module.exports = router;