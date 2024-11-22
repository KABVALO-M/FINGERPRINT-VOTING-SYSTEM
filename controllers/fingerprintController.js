const Student = require('../models/Student');
const axios = require('axios');

// Function to get the client's IP address
function getClientIp(req) {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ipAddress.includes('::') ? `[${ipAddress}]` : ipAddress;
}

async function startFingerprintVerification(req, res) {
    try {
        const fingerprintData = req.session.user.fingerprint_data;
        const clientIp = getClientIp(req); // Get the client's IP address
        console.log(clientIp);
        const verificationUrl = `http://${clientIp}:3000/verify`;

        // Send the verification request to the remote device
        if (fingerprintData) {
            const response = await axios.post(verificationUrl, {
                data: fingerprintData 
            });

            // Return the response from the remote device to the caller
            if (response.data.status == 'success') {
                req.session.isVerified = true; 
                return res.status(200).json({
                    status: 'success',
                });
            } else {
                return res.status(200).json({
                    status: 'failed',
                });
            }
        } else {
            // Handle case when fingerprintData is missing
            return res.status(400).json({
                status: 'error',
                message: 'Fingerprint data is missing or invalid',
            });
        }

    } catch (error) {
        console.error('Error initiating fingerprint verification:', error);

        // Return an error response
        return res.status(500).json({
            status: 'error',
            message: 'Failed to initiate fingerprint verification',
            error: error.message
        });
    }
}


module.exports = {
    startFingerprintVerification,
};
