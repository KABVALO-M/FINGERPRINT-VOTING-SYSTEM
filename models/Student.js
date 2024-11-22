const db = require('../config/database'); // Adjust the path as needed
const bcrypt = require('bcrypt');

class Student {
  // // Method to find a student by username
  // static async findByUsername(username) {
  //   try {
  //     const [results] = await db.promisePool.query('SELECT * FROM Students WHERE username = ?', [username]);
  //     return results[0] || null;
  //   } catch (error) {
  //     throw new Error('Error finding student by username: ' + error.message);
  //   }
  // }

  static async findByUsernameWithCandidateInfo(username) {
    try {
      const query = `
        SELECT
          s.student_id,
          s.first_name,
          s.last_name,
          s.student_number,
          s.username,
          s.email,
          s.class,
          s.password,
          s.has_voted,
          s.fingerprint_data,
          p.position_name,
          e.election_id,
          e.election_name,
          e.start_date,
          e.end_date
        FROM students s
        LEFT JOIN candidates c ON s.student_id = c.student_id
        LEFT JOIN positions p ON c.position_id = p.position_id
        LEFT JOIN elections e ON NOW() BETWEEN e.start_date AND e.end_date
        WHERE s.username = ?`;
      
      const [results] = await db.promisePool.query(query, [username]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding student with candidate info: ' + error.message);
    }
  }


  // Method to verify the password
  static async verifyPassword(storedPassword, inputPassword) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      throw new Error('Error verifying password: ' + error.message);
    }
  }

  // Method to update student voting status
  static async updateVotingStatus(student_id, has_voted) {
    try {
      await db.promisePool.query(
        'UPDATE Students SET has_voted = ? WHERE student_id = ?',
        [has_voted, student_id]
      );
    } catch (error) {
      throw new Error('Error updating voting status: ' + error.message);
    }
  }

  static async updateFingerprintData(student_id, fingerprintData) {
    try {
      await db.promisePool.query(
        'UPDATE Students SET fingerprint_data = ? WHERE student_id = ?',
        [fingerprintData, student_id]
      );
    } catch (error) {
      throw new Error('Error updating fingerprint data: ' + error.message);
    }
  }

}

module.exports = Student;
