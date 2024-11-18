const axios = require('axios');

const FAZPASS_API_KEY = process.env.FAZPASS_API_KEY;
const FAZPASS_BASE_URL = 'https://api.fazpass.com'; // Ganti dengan URL API Fazpass yang sesuai
const PHONE_GATEWAY_KEY = '8db5bab2-c45d-463c-82b4-afe0e3e1c724'; // Ganti dengan gateway_key yang sesuai untuk nomor telepon
const EMAIL_GATEWAY_KEY = '7ea44772-6ffc-42b3-a7fc-17b1571c16f8'; // Ganti dengan gateway_key yang sesuai untuk email

exports.generateOTPSMS = async (phone) => {
    try {
        const response = await axios.post(`${FAZPASS_BASE_URL}/v1/otp/request`, {
            phone,
            gateway_key: PHONE_GATEWAY_KEY
        }, {
            headers: {
                'Authorization': `Bearer ${FAZPASS_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error generating OTP for phone:', error);
        throw new Error('Error generating OTP for phone');
    }
};

exports.generateOTPEmail = async (email) => {
    try {
        const response = await axios.post(`${FAZPASS_BASE_URL}/v1/otp/request`, {
            Email: email,
            gateway_key: EMAIL_GATEWAY_KEY
        }, {
            headers: {
                'Authorization': `Bearer ${FAZPASS_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error generating OTP for email:', error);
        throw new Error('Error generating OTP for email');
    }
};

exports.validateOTP = async (otp_id, otp) => {
    try {
        const response = await axios.post(`${FAZPASS_BASE_URL}/v1/otp/verify`, {
            otp_id,
            otp
        }, {
            headers: {
                'Authorization': `Bearer ${FAZPASS_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error validating OTP:', error);
        throw new Error('Error validating OTP');
    }
};