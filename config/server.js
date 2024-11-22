const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));


const authRoutes = require('../routes/authRoutes');
const studentRoutes = require('../routes/studentRoutes');
const fingerprintRoutes = require('../routes/fingerprintRoutes');
const voteRoutes = require('../routes/voteRoutes');

// Use the authentication routes
app.use('/', authRoutes);
app.use('/student', studentRoutes);
app.use('/fingerprint', fingerprintRoutes);
app.use('/vote', voteRoutes);


// 404 Error Handling Middleware
app.use((req, res) => {
    res.status(404).render('404'); 
});

// Start the server
const SERVER_IP_ADDRESS = '127.0.0.1';
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER_IP_ADDRESS}:${PORT}`);
});
