// Access the positions data from the data attribute
const positionsDataElement = document.getElementById('positionsData');
const requiredPositions = JSON.parse(positionsDataElement.getAttribute('data-positions'));

const selectedCandidates = {};

function toggleManifesto(manifestoId, button) {
    const manifesto = document.getElementById(manifestoId);
    if (manifesto.classList.contains('truncate-lines')) {
        manifesto.classList.remove('truncate-lines');
        button.innerText = 'Read Less';
    } else {
        manifesto.classList.add('truncate-lines');
        button.innerText = 'Read More';
    }
}

function selectCandidate(position, candidateId, button) {
    const buttons = document.querySelectorAll(`.vote-button[data-position="${position}"]`);
    buttons.forEach(btn => btn.classList.remove('bg-green-700', 'text-white'));
    buttons.forEach(btn => btn.classList.add('bg-gray-500'));
    button.classList.add('bg-green-700', 'text-white');
    selectedCandidates[position] = candidateId;
}

function submitVotes() {
    // Get the election_id from the hidden input field
    const electionIdInput = document.getElementById('electionId');
    const electionId = electionIdInput.value;
    for (let position of requiredPositions) {
        if (!selectedCandidates[position]) {
            alert(`Please select a candidate for the ${position.replace(/-/g, ' ')} position.`);
            return;
        }
    }

    const payload = {
        election_id: electionId,
        selectedCandidates: selectedCandidates
    };

    // If all candidates are selected, submit the votes to the server
    fetch('/vote/submit-votes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Your votes have been successfully submitted!');
            window.location.href = '/vote/success';
        } else {
            alert('There was an error submitting your votes. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your votes. Please try again.');
    });
}
