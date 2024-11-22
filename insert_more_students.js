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

// Array of student data
const students = [
  // BIT Students
  // { firstName: 'Chisomo', lastName: 'Nkhoma', studentNumber: 'BIT/20/SS/010', email: 'bit20-cnkhoma@mubas.ac.mw', class: 'BIT4', username: 'bit20-cnkhoma', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Aubrey', lastName: 'Chirwa', studentNumber: 'BIT/20/SS/011', email: 'bit20-achirwa@mubas.ac.mw', class: 'BIT4', username: 'bit20-achirwa', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Tiyamike', lastName: 'Manda', studentNumber: 'BIT/20/SS/012', email: 'bit20-tmanda@mubas.ac.mw', class: 'BIT4', username: 'bit20-tmanda', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Grace', lastName: 'Phiri', studentNumber: 'BIT/20/SS/013', email: 'bit20-gphiri@mubas.ac.mw', class: 'BIT4', username: 'bit20-gphiri', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Mike', lastName: 'Chilima', studentNumber: 'BIT/20/SS/014', email: 'bit20-mchilima@mubas.ac.mw', class: 'BIT4', username: 'bit20-mchilima', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Ethel', lastName: 'Nyirenda', studentNumber: 'BIT/20/SS/015', email: 'bit20-enyirenda@mubas.ac.mw', class: 'BIT4', username: 'bit20-enyirenda', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'John', lastName: 'Chibwana', studentNumber: 'BIT/20/SS/016', email: 'bit20-jchibwana@mubas.ac.mw', class: 'BIT4', username: 'bit20-jchibwana', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Mary', lastName: 'Banda', studentNumber: 'BIT/20/SS/017', email: 'bit20-mbanda@mubas.ac.mw', class: 'BIT4', username: 'bit20-mbanda', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Tawonga', lastName: 'Kazembe', studentNumber: 'BIT/20/SS/018', email: 'bit20-tkazembe@mubas.ac.mw', class: 'BIT4', username: 'bit20-tkazembe', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Christopher', lastName: 'Mpinganjira', studentNumber: 'BIT/20/SS/019', email: 'bit20-cmpinganjira@mubas.ac.mw', class: 'BIT4', username: 'bit20-cmpinganjira', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Mwawi', lastName: 'Mkandawire', studentNumber: 'BIT/20/SS/020', email: 'bit20-mmkandawire@mubas.ac.mw', class: 'BIT4', username: 'bit20-mmkandawire', password: 'password123', fingerprintData: null, hasVoted: false },

  // // BIS Students
  // { firstName: 'Chimwemwe', lastName: 'Phiri', studentNumber: 'BIS/20/SS/001', email: 'bis20-cphiri@mubas.ac.mw', class: 'BIS3', username: 'bis20-cphiri', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Brenda', lastName: 'Mwale', studentNumber: 'BIS/20/SS/002', email: 'bis20-bmwale@mubas.ac.mw', class: 'BIS3', username: 'bis20-bmwale', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Loveness', lastName: 'Chiponda', studentNumber: 'BIS/20/SS/003', email: 'bis20-lchiponda@mubas.ac.mw', class: 'BIS3', username: 'bis20-lchiponda', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Steven', lastName: 'Zimba', studentNumber: 'BIS/20/SS/004', email: 'bis20-szimba@mubas.ac.mw', class: 'BIS3', username: 'bis20-szimba', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Martha', lastName: 'Kanyemba', studentNumber: 'BIS/20/SS/005', email: 'bis20-mkanyemba@mubas.ac.mw', class: 'BIS3', username: 'bis20-mkanyemba', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Patrick', lastName: 'Chilowa', studentNumber: 'BIS/20/SS/006', email: 'bis20-pchilowa@mubas.ac.mw', class: 'BIS3', username: 'bis20-pchilowa', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Nancy', lastName: 'Ngoma', studentNumber: 'BIS/20/SS/007', email: 'bis20-nngoma@mubas.ac.mw', class: 'BIS3', username: 'bis20-nngoma', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'James', lastName: 'Sakata', studentNumber: 'BIS/20/SS/008', email: 'bis20-jsakata@mubas.ac.mw', class: 'BIS3', username: 'bis20-jsakata', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Pauline', lastName: 'Kalimbe', studentNumber: 'BIS/20/SS/009', email: 'bis20-pkalimbe@mubas.ac.mw', class: 'BIS3', username: 'bis20-pkalimbe', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Diana', lastName: 'Lungu', studentNumber: 'BIS/20/SS/010', email: 'bis20-dlungu@mubas.ac.mw', class: 'BIS3', username: 'bis20-dlungu', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Oscar', lastName: 'Zulu', studentNumber: 'BIS/20/SS/011', email: 'bis20-ozulu@mubas.ac.mw', class: 'BIS3', username: 'bis20-ozulu', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Patricia', lastName: 'Chikondi', studentNumber: 'BIS/20/SS/012', email: 'bis20-pchikondi@mubas.ac.mw', class: 'BIS3', username: 'bis20-pchikondi', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Kelvin', lastName: 'Jere', studentNumber: 'BIS/20/SS/013', email: 'bis20-kjere@mubas.ac.mw', class: 'BIS3', username: 'bis20-kjere', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Samantha', lastName: 'Mwafulirwa', studentNumber: 'BIS/20/SS/014', email: 'bis20-smwafulirwa@mubas.ac.mw', class: 'BIS3', username: 'bis20-smwafulirwa', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Richard', lastName: 'Kafwafwa', studentNumber: 'BIS/20/SS/015', email: 'bis20-rkafwafwa@mubas.ac.mw', class: 'BIS3', username: 'bis20-rkafwafwa', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Joyce', lastName: 'Kasanga', studentNumber: 'BIS/20/SS/016', email: 'bis20-jkasanga@mubas.ac.mw', class: 'BIS3', username: 'bis20-jkasanga', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Michael', lastName: 'Kachitsa', studentNumber: 'BIS/20/SS/017', email: 'bis20-mkachitsa@mubas.ac.mw', class: 'BIS3', username: 'bis20-mkachitsa', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Elizabeth', lastName: 'Mwangonde', studentNumber: 'BIS/20/SS/018', email: 'bis20-emwangonde@mubas.ac.mw', class: 'BIS3', username: 'bis20-emwangonde', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Victor', lastName: 'Kasunda', studentNumber: 'BIS/20/SS/019', email: 'bis20-vkasunda@mubas.ac.mw', class: 'BIS3', username: 'bis20-vkasunda', password: 'password123', fingerprintData: null, hasVoted: false },
  // { firstName: 'Faith', lastName: 'Kawanga', studentNumber: 'BIS/20/SS/020', email: 'bis20-fkawanga@mubas.ac.mw', class: 'BIS3', username: 'bis20-fkawanga', password: 'password123', fingerprintData: null, hasVoted: false }
  
  // BSC1 Students
  { firstName: 'Lucy', lastName: 'Mkwapatira', studentNumber: 'BSC/23/SS/001', email: 'bsc23-lmkwapatira@mubas.ac.mw', class: 'BSC1', username: 'bsc23-lmkwapatira', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Blessings', lastName: 'Ngalande', studentNumber: 'BSC/23/SS/002', email: 'bsc23-bngalande@mubas.ac.mw', class: 'BSC1', username: 'bsc23-bngalande', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Lilian', lastName: 'Mvula', studentNumber: 'BSC/23/SS/003', email: 'bsc23-lmvula@mubas.ac.mw', class: 'BSC1', username: 'bsc23-lmvula', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Francis', lastName: 'Chikoti', studentNumber: 'BSC/23/SS/004', email: 'bsc23-fchikoti@mubas.ac.mw', class: 'BSC1', username: 'bsc23-fchikoti', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Angela', lastName: 'Kamwendo', studentNumber: 'BSC/23/SS/005', email: 'bsc23-akamwendo@mubas.ac.mw', class: 'BSC1', username: 'bsc23-akamwendo', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Brighton', lastName: 'Msiska', studentNumber: 'BSC/23/SS/006', email: 'bsc23-bmsiska@mubas.ac.mw', class: 'BSC1', username: 'bsc23-bmsiska', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Edith', lastName: 'Nkhoma', studentNumber: 'BSC/23/SS/007', email: 'bsc23-enkhoma@mubas.ac.mw', class: 'BSC1', username: 'bsc23-enkhoma', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Felix', lastName: 'Mhone', studentNumber: 'BSC/23/SS/008', email: 'bsc23-fmhone@mubas.ac.mw', class: 'BSC1', username: 'bsc23-fmhone', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Monica', lastName: 'Nyirenda', studentNumber: 'BSC/23/SS/009', email: 'bsc23-mnyirenda@mubas.ac.mw', class: 'BSC1', username: 'bsc23-mnyirenda', password: 'password123', fingerprintData: null, hasVoted: false },
  { firstName: 'Austin', lastName: 'Kamanga', studentNumber: 'BSC/23/SS/010', email: 'bsc23-akamanga@mubas.ac.mw', class: 'BSC1', username: 'bsc23-akamanga', password: 'password123', fingerprintData: null, hasVoted: false },
   // BSC2 Students
   { firstName: 'John', lastName: 'Phiri', studentNumber: 'BSC/22/SS/001', email: 'bsc22-jphiri@mubas.ac.mw', class: 'BSC2', username: 'bsc22-jphiri', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Mwawi', lastName: 'Khumalo', studentNumber: 'BSC/22/SS/002', email: 'bsc22-mkhumalo@mubas.ac.mw', class: 'BSC2', username: 'bsc22-mkhumalo', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Thandiwe', lastName: 'Manda', studentNumber: 'BSC/22/SS/003', email: 'bsc22-tmanda@mubas.ac.mw', class: 'BSC2', username: 'bsc22-tmanda', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Chikondi', lastName: 'Kalua', studentNumber: 'BSC/22/SS/004', email: 'bsc22-ckalua@mubas.ac.mw', class: 'BSC2', username: 'bsc22-ckalua', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Aubrey', lastName: 'Nyirenda', studentNumber: 'BSC/22/SS/005', email: 'bsc22-anyirenda@mubas.ac.mw', class: 'BSC2', username: 'bsc22-anyirenda', password: 'password123', fingerprintData: null, hasVoted: false },
   
   // BSC3 Students
   { firstName: 'Zione', lastName: 'Mbewe', studentNumber: 'BSC/21/SS/001', email: 'bsc21-zmbewe@mubas.ac.mw', class: 'BSC3', username: 'bsc21-zmbewe', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Peter', lastName: 'Kamwendo', studentNumber: 'BSC/21/SS/002', email: 'bsc21-pkamwendo@mubas.ac.mw', class: 'BSC3', username: 'bsc21-pkamwendo', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Grace', lastName: 'Msowoya', studentNumber: 'BSC/21/SS/003', email: 'bsc21-gmsowoya@mubas.ac.mw', class: 'BSC3', username: 'bsc21-gmsowoya', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Brian', lastName: 'Mpinganjira', studentNumber: 'BSC/21/SS/004', email: 'bsc21-bmpinganjira@mubas.ac.mw', class: 'BSC3', username: 'bsc21-bmpinganjira', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Ellen', lastName: 'Banda', studentNumber: 'BSC/21/SS/005', email: 'bsc21-ebanda@mubas.ac.mw', class: 'BSC3', username: 'bsc21-ebanda', password: 'password123', fingerprintData: null, hasVoted: false },
   
   // BSC4 Students
   { firstName: 'James', lastName: 'Chirwa', studentNumber: 'BSC/20/SS/001', email: 'bsc20-jchirwa@mubas.ac.mw', class: 'BSC4', username: 'bsc20-jchirwa', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Dorothy', lastName: 'Mwase', studentNumber: 'BSC/20/SS/002', email: 'bsc20-dmwase@mubas.ac.mw', class: 'BSC4', username: 'bsc20-dmwase', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Leonard', lastName: 'Nkhata', studentNumber: 'BSC/20/SS/003', email: 'bsc20-lnkhata@mubas.ac.mw', class: 'BSC4', username: 'bsc20-lnkhata', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Mary', lastName: 'Gondwe', studentNumber: 'BSC/20/SS/004', email: 'bsc20-mgondwe@mubas.ac.mw', class: 'BSC4', username: 'bsc20-mgondwe', password: 'password123', fingerprintData: null, hasVoted: false },
   { firstName: 'Maxwell', lastName: 'Chisale', studentNumber: 'BSC/20/SS/005', email: 'bsc20-mchisale@mubas.ac.mw', class: 'BSC4', username: 'bsc20-mchisale', password: 'password123', fingerprintData: null, hasVoted: false }
];

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
const insertStudents = async () => {
  try {
    for (const student of students) {
      const hashedPassword = await hashPassword(student.password);
      
      const query = `
        INSERT INTO Students (first_name, last_name, student_number, email, class, username, password, fingerprint_data, has_voted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        student.firstName,
        student.lastName,
        student.studentNumber,
        student.email,
        student.class,
        student.username,
        hashedPassword,
        student.fingerprintData,
        student.hasVoted
      ];
      
      connection.query(query, values, (err, results) => {
        if (err) {
          console.error('Error inserting student:', err);
          return;
        }
        console.log('Student inserted successfully with ID:', results.insertId);
      });
    }
  } catch (error) {
    console.error('Error inserting students:', error);
  } finally {
    // Close the database connection
    connection.end();
  }
};

// Execute the insert function
insertStudents();
