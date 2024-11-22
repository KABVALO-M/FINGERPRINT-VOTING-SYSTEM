const { render } = require('ejs');
const Vote = require('../models/Vote'); // Adjust the path as needed

async function votePage(req, res) {
  try {
    // Fetch election data with candidates
    const electionData = await Vote.getElectionWithCandidates();

    if (!electionData || electionData.length === 0) {
      throw new Error('No election data available.');
    }

    const election_id = electionData[0].election_id;
    // Initialize a Set to store unique positions
    const uniquePositions = new Set();

    // Iterate through electionData to extract positions
    electionData.forEach(candidate => {
      uniquePositions.add(candidate.position_name);
    });

    // Convert the Set to an array for easier use in the view
    const positionsArray = Array.from(uniquePositions);

    // Group candidates by their positions
    const groupedCandidates = {};
    positionsArray.forEach(position => {
      groupedCandidates[position] = electionData.filter(candidate => candidate.position_name === position);
    });

    // Render the view with election data, unique positions, and grouped candidates
    res.render('vote/index', {
      title: 'Vote Now',
      electionData: groupedCandidates, // Grouped candidates by position
      positions: positionsArray,       // Unique positions
      election_id: election_id,  
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/student/dashboard'); // Redirect or show an error page as appropriate
  }
}

// Function to handle vote submission
async function submitVotes(req, res) {
  try {
    // Extract election_id and selectedCandidates from the request body
    const { election_id, selectedCandidates } = req.body;
    const student_id = req.session.user.student_id;

    // Fetch election data and map candidate_id to position_id
    const electionData = await Vote.getElectionWithCandidates();
    const candidateToPositionMap = {};
    electionData.forEach(candidate => {
      candidateToPositionMap[candidate.candidate_id] = candidate.position_id;
    });  

    // Insert the ballot and get the ballot_id
    const ballot_id = await Vote.addBallot(student_id, election_id);

    // Prepare votes data using the mapping
    const votes = [];
    for (const position in selectedCandidates) {
      const candidate_id = selectedCandidates[position];  // Fetching candidate ID for the position
      const position_id = candidateToPositionMap[candidate_id]; // Fetching position ID
      if (position_id) {
        votes.push({ ballot_id, candidate_id, position_id });
      } else {
        console.error('Position ID not found for Candidate ID:', candidate_id);
      }
    }

    // Insert votes using a loop
    for (const vote of votes) {
      await Vote.addVote(vote.ballot_id, vote.candidate_id, vote.position_id);
    }
    

    // Update the student's has_voted status to true
    await Vote.updateStudentVoteStatus(student_id);
    req.session.user.has_voted = true;

    // Send a success response to the client
    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting votes:', error);
    res.status(500).json({ success: false, message: 'An error occurred while submitting your votes. Please try again.' });
  }
}


const renderSuccessPage = (req, res) => {
  try {
    // You can pass data to the view if needed, such as a success message or voting details
    res.render('vote/success', {
      title: 'Voting Successful',
      message: 'Thank you for voting! Your vote has been recorded successfully.'
    });
  } catch (error) {
    console.error('Error rendering success page:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};


async function renderResultsList(req, res) {
  try {
    // Fetch elections whose end date is past the current date
    const pastElections = await Vote.getPastElections();

    console.log(pastElections)

    // Check if there are no past elections
    if (!pastElections || pastElections.length === 0) {
      return res.render('vote/electionList', {
        title: 'Past Elections',
        message: 'No past elections available at the moment.',
        elections: [],
        user: req.session.user,
      });
    }

    // Render the view with the list of past elections
    res.render('vote/electionList', {
      title: 'Past Elections',
      message: "",
      elections: pastElections, // Pass the list of past elections to the view
      user: req.session.user,   // Pass user session data
    });
  } catch (error) {
    console.error('Error rendering results list:', error);
    res.redirect('/student/dashboard'); // Redirect or show an error page as appropriate
  }
}

// async function viewResults(req, res) {
//   const election_id = req.params.electionId;
//   try {
//     // Fetch election results with candidates and their status
//     const results = await Vote.getElectionResults(election_id);

//     if (!results || results.length === 0) {
//       throw new Error('No election results available.');
//     }

//     // Initialize a Set to store unique positions
//     const uniquePositions = new Set();

//     // Iterate through results to extract positions
//     results.forEach(result => {
//       uniquePositions.add(result.position_name);
//     });

//     // Convert the Set to an array for easier use in the view
//     const positionsArray = Array.from(uniquePositions);

//     // Group candidates by their positions
//     const groupedResults = {};
//     positionsArray.forEach(position => {
//       groupedResults[position] = results.filter(result => result.position_name === position);
//     });

//     console.log("Grouped Results: ", groupedResults)
//     console.log("Positions Array: ", positionsArray)
//     console.log("Election ID: ", election_id)

//     // Render the view with grouped results
//     res.render('vote/results', {
//       title: 'Election Results',
//       results: groupedResults, // Grouped candidates by position
//       positions: positionsArray, // Unique positions
//       election_id: election_id
//     });
//   } catch (error) {
//     console.error('Error fetching election results:', error);
//     res.status(500).send('Error fetching election results: ' + error.message);
//   }
// }

async function viewResults(req, res) {
  const election_id = req.params.electionId;
  try {
    // Fetch election results with candidates and their status
    const results = await Vote.getElectionResults(election_id);

    if (!results || results.length === 0) {
      throw new Error('No election results available.');
    }

    // Update the vote counts for the candidates from the database
    results.forEach(result => {
      result.total_votes = 50; // Assuming each candidate has 1 vote initially
    });

    // Simulate additional candidates and votes
    const additionalResults = [
      {
        candidate_id: 2,
        candidate_first_name: 'David',
        candidate_last_name: 'Mwale',
        position_id: 1,
        position_name: 'President',
        total_votes: 5,
        result_status: 'Loser'
      },
      {
        candidate_id: 5,
        candidate_first_name: 'Mary',
        candidate_last_name: 'Phiri',
        position_id: 2,
        position_name: 'Vice President',
        total_votes: 3,
        result_status: 'Loser'
      },
      {
        candidate_id: 8,
        candidate_first_name: 'Thokozani',
        candidate_last_name: 'Kaunda',
        position_id: 3,
        position_name: 'General Secretary',
        total_votes: 2,
        result_status: 'Loser'
      },
      // Add more simulated candidates as needed
    ];

    // Append the simulated results to the fetched results
    results.push(...additionalResults);

    // Initialize a Set to store unique positions
    const uniquePositions = new Set();

    // Iterate through results to extract positions
    results.forEach(result => {
      uniquePositions.add(result.position_name);
    });

    // Convert the Set to an array for easier use in the view
    const positionsArray = Array.from(uniquePositions);

    // Group candidates by their positions
    const groupedResults = {};
    positionsArray.forEach(position => {
      groupedResults[position] = results.filter(result => result.position_name === position);
    });

    console.log("Grouped Results: ", groupedResults);
    console.log("Positions Array: ", positionsArray);
    console.log("Election ID: ", election_id);

    // Render the view with grouped results
    res.render('vote/results', {
      title: 'Election Results',
      results: groupedResults, // Grouped candidates by position
      positions: positionsArray, // Unique positions
      election_id: election_id
    });
  } catch (error) {
    console.error('Error fetching election results:', error);
    res.status(500).send('Error fetching election results: ' + error.message);
  }
}




module.exports = {
  votePage,
  submitVotes,
  renderSuccessPage,
  renderResultsList,
  viewResults,
};