const express = require('express');
const hendelseControllers = require('../controllers/hendelseControllers');
const middleware = require('../middleware/auth');

router = express.Router();

router.get('/ny-hendelse', middleware.authenticate, hendelseControllers.newHendelseGET);
router.post('/ny-hendelse', middleware.authenticate, hendelseControllers.newHendelsePOST);
router.get('/detaljer/:hendelseId', middleware.authenticate, hendelseControllers.hendelseDetails);

module.exports = router;