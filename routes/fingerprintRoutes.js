const express = require('express');
const fingerprintController = require('../controllers/fingerprintController');

const router = express.Router();

// Route to trigger the fingerprint sensor
router.get('/fingerprint-verification', fingerprintController.startFingerprintVerification);

module.exports = router;
