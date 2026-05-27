const express = require('express');
const adminControllers = require('../controllers/adminControllers');
const middleware = require('../middleware/auth');
const limitMiddleware = require('../middleware/rateLimiter');

router = express.Router();

router.get('/admin-oversikt', middleware.adminAuth, adminControllers.adminOverview);
router.get('/admin-brukere', middleware.adminAuth, adminControllers.adminUsers);
router.get('/admin-aktive-hendelser', middleware.adminAuth, adminControllers.adminActive);
router.get('/admin-loste-hendelser', middleware.adminAuth, adminControllers.adminSolved);
router.get('/admin-arkiv', middleware.adminAuth, adminControllers.adminArchive);

module.exports = router;