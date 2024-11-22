const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Database configuration
const dbConfig = {
  host: 'localhost', // replace with your database host
  user: 'root', // replace with your database user
  password: '', // replace with your database password
  database: 'voting_system' // replace with your database name
};

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Student data
const studentData = {
  firstName: 'Esmie',
  lastName: 'Luphande',
  studentNumber: 'BIT/20/SS/009',
  email: 'bit20-eluphande@mubas.ac.mw',
  class: 'BIT4',
  username: 'bit20-eluphande',
  password: 'password123', // replace with the actual password
  fingerprintData: null,
  hasVoted: false
};

// Hash the password
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Insert student data into the database
const insertStudent = async () => {
  try {
    const hashedPassword = await hashPassword(studentData.password);
    
    const query = `
      INSERT INTO Students (first_name, last_name, student_number, email, class, username, password, fingerprint_data, has_voted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      studentData.firstName,
      studentData.lastName,
      studentData.studentNumber,
      studentData.email,
      studentData.class,
      studentData.username,
      hashedPassword,
      studentData.fingerprintData,
      studentData.hasVoted
    ];
    
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error inserting student:', err);
        return;
      }
      console.log('Student inserted successfully with ID:', results.insertId);
    });
  } catch (error) {
    console.error('Error inserting student:', error);
  } finally {
    // Close the database connection
    connection.end();
  }
};

// Execute the insert function
insertStudent();
