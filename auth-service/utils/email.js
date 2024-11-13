const nodemailer = require('nodemailer');

// Dekode password dari Base64
const emailPass = Buffer.from(process.env.EMAIL_PASS_BASE64, 'base64').toString('utf-8');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Ganti dengan penyedia email Anda
    auth: {
        user: process.env.EMAIL_USER,
        pass: emailPass
    }
});

exports.sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};