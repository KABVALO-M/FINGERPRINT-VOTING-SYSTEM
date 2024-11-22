exports.renderDashboard = (req, res) => {
     // Extract user information and candidacy status from the session
     const user = req.session.user;
     const isCandidate = req.session.isCandidate || false; // Default to false if not set
     const positionName = req.session.positionName || ''; // Default to empty string if not set
    res.render('student/dashboard', {  user, isCandidate, positionName });
};
