document.addEventListener('DOMContentLoaded', function() {
    const voteButton = document.getElementById('voteButton');
    if (voteButton) {
        voteButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior of the link
            // Display the modal immediately
            document.getElementById('fingerprintModal').classList.remove('hidden');
            document.getElementById('fingerprintModal').classList.add('flex');
            scan_finger();
        })
    }
})

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('fingerprintModal').classList.add('hidden');
    document.getElementById('fingerprintModal').classList.remove('flex');
});

document.getElementById('retryButton').addEventListener('click', function() {
    // Add logic to retry the fingerprint process
    document.getElementById('fingerprintStatus').innerText = 'Initializing sensor...';
    
    // Simulate sensor initialization time before showing the "Please place your finger..." message again
    setTimeout(function() {
        document.getElementById('fingerprintStatus').innerText = 'Please place your finger on the fingerprint sensor.';
    }, 3000); // Wait for 3 seconds
});


function scan_finger(){
     // Display the "Initializing sensor..." message
     document.getElementById('fingerprintStatus').innerText = 'Initializing sensor...';
     document.getElementById('fingerprintStatus').style.color = '#3b82f2';
     document.getElementById('fingerprintIcon').style.color = '#3b82f2';

     // Simulate sensor initialization time before showing the "Please place your finger..." message
     setTimeout(function() {
         document.getElementById('fingerprintStatus').innerText = 'Please place your finger on the fingerprint sensor.';
     }, 3000); // Wait for 3 seconds
 
     // Make a request to the trigger URL
     fetch('/fingerprint/fingerprint-verification', {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json'
         }
     })
     .then(response => response.json())
     .then(data => {
         console.log(data);
         
         // Wait for the verification result and update the status
         setTimeout(function() {
             if (data.status === 'success') {
                 // Update the modal to say the fingerprint is verified
                 document.getElementById('fingerprintStatus').innerText = 'Fingerprint verified!';
                 document.getElementById('fingerprintStatus').style.color = '#027818';
                 document.getElementById('fingerprintIcon').style.color = '#027818';
                 setTimeout(function() {
                    window.location.href = '/vote';
                 }, 3000); // Wait for 3 seconds

             } else if (data.status === 'failed') {
                // Fingerprint not recognized
                document.getElementById('fingerprintStatus').innerText = 'Fingerprint not recognized. Please try again.';
                document.getElementById('fingerprintStatus').style.color = '#c7363f';
                document.getElementById('fingerprintIcon').style.color = '#c7363f';

                // Retry the scan after a short delay
                setTimeout(function() {
                    scan_finger();
                }, 3000);
            } else {
                // Unexpected response from server
                document.getElementById('fingerprintStatus').innerText = 'Unexpected error. Please try again later.';
                document.getElementById('fingerprintStatus').style.color = '#c7363f';
            }
         }, 5000); // Wait for 5 seconds to simulate verification time
     })
     .catch(error => {
         console.error('Error:', error);
         // Handle the error (e.g., show an error message in the modal)
         document.getElementById('fingerprintStatus').innerText = 'Error initializing fingerprint sensor. Please try again.';
     });
}
