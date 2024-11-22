const Student = require('../models/Student'); // Corrected the model import

// Handle root route '/'
exports.handleRoot = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
};

// Render login page
exports.loginPage = (req, res) => {
    const error = req.session.error || null;
    delete req.session.error; 
    res.render('login', { error });
};

// Handle login submission
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find the student by username
        const user = await Student.findByUsernameWithCandidateInfo(username);
        
        if (user && await Student.verifyPassword(user.password, password)) {
            req.session.user = user; // Store user data in session
            
            // Check if the student is a candidate
            const isCandidate = user.position_name ? true : false;
            req.session.isCandidate = isCandidate;
            req.session.positionName = user.position_name; // Store the position name

            return res.redirect('/student/dashboard');
        } else {
            return res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        req.session.error = 'An error occurred during login';
        return res.redirect('/login');
    }
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// render success page

exports.successPage = (req, res) => {
    res.render('success', { user: req.session.user });
};

// render failed page
