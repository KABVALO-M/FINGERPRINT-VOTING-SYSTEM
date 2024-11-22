
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/dashboard', isAuthenticated, studentController.renderDashboard);

module.exports = router;