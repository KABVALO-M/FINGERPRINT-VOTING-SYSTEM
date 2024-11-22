const express = require('express');
const voteController = require('../controllers/voteController');
const isAuthenticated = require('../middleware/authMiddleware');


const router = express.Router();

// Route to trigger the fingerprint sensor
router.get('/', isAuthenticated, voteController.votePage);
router.post('/submit-votes', isAuthenticated, voteController.submitVotes);
router.get('/success', isAuthenticated, voteController.renderSuccessPage);
router.get('/results', isAuthenticated, voteController.renderResultsList);
router.get('/results/:electionId', voteController.viewResults);

module.exports = router;
