const db = require('../config/database'); // Adjust the path as needed

class Vote {

  // Method to get the current election, its candidates, and their positions and campaign messages
  static async getElectionWithCandidates() {
    try {
      const query = `
        SELECT 
          e.election_id,
          e.election_name,
          e.start_date,
          e.end_date,
          c.candidate_id,
          s.first_name AS candidate_first_name,
          s.last_name AS candidate_last_name,
          p.position_id,
          p.position_name,
          c.campaign_message,
          c.image_path
        FROM elections e
        LEFT JOIN candidates c ON e.election_id = c.election_id
        LEFT JOIN positions p ON c.position_id = p.position_id
        LEFT JOIN students s ON c.student_id = s.student_id
        WHERE NOW() BETWEEN e.start_date AND e.end_date
      `;
      
      const [results] = await db.promisePool.query(query);
      return results;
    } catch (error) {
      throw new Error('Error fetching election details with candidates: ' + error.message);
    }
  }

   // Method to add a ballot to the database
   static async addBallot(student_id, election_id) {
    try {
      const query = `
        INSERT INTO ballot (student_id, election_id, timestamp)
        VALUES (?, ?, NOW())
      `;
      const [result] = await db.promisePool.query(query, [student_id, election_id]);
      return result.insertId; // Return the generated ballot_id
    } catch (error) {
      throw new Error('Error adding ballot: ' + error.message);
    }
  }

  static async addVote(ballot_id, candidate_id, position_id) {
    try {
      const query = `
        INSERT INTO votes (ballot_id, candidate_id, position_id, timestamp)
        VALUES (?, ?, ?, NOW())
      `;
      await db.promisePool.query(query, [ballot_id, candidate_id, position_id]);
    } catch (error) {
      console.error('Error adding vote:', error.message);
      throw new Error('Error adding vote: ' + error.message);
    }
  }
  

  static async updateStudentVoteStatus(student_id) {
    try {
      const query = `
        UPDATE students 
        SET has_voted = 1 
        WHERE student_id = ?
      `;
      await db.promisePool.query(query, [student_id]);
    } catch (error) {
      throw new Error('Error updating student vote status: ' + error.message);
    }
  }

  static async getPastElections() {
    try {
      const query = `
        SELECT 
          e.election_id,
          e.election_name,
          e.start_date,
          e.end_date
        FROM elections e
        WHERE e.end_date < NOW()
        ORDER BY e.end_date DESC
      `;
      
      const [results] = await db.promisePool.query(query);
      return results;
    } catch (error) {
      throw new Error('Error fetching past elections: ' + error.message);
    }
  }

  static async getElectionResults(election_id) {
    try {
      const query = `
        SELECT 
          c.candidate_id,
          s.first_name AS candidate_first_name,
          s.last_name AS candidate_last_name,
          p.position_id,
          p.position_name,
          COUNT(v.vote_id) AS total_votes,
          CASE 
              WHEN COUNT(v.vote_id) = MAX(COUNT(v.vote_id)) OVER (PARTITION BY p.position_id) 
              THEN 'Winner' 
              ELSE 'Loser' 
          END AS result_status
        FROM 
          votes v
        JOIN 
          candidates c ON v.candidate_id = c.candidate_id
        JOIN 
          positions p ON c.position_id = p.position_id
        JOIN 
          students s ON c.student_id = s.student_id
        JOIN 
          elections e ON c.election_id = e.election_id
        WHERE 
          e.election_id = ?
        GROUP BY 
          c.candidate_id, p.position_id
        ORDER BY 
          p.position_id, total_votes DESC;
      `;
      
      const [results] = await db.promisePool.query(query, [election_id]);
      return results;
    } catch (error) {
      throw new Error('Error fetching election results: ' + error.message);
    }
  }
  

}

module.exports = Vote;
