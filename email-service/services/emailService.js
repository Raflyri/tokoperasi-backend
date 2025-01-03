const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'mail.rbeverything.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

const sendRegistrationSuccessEmail = (to) => {
    const subject = 'Registration Successful';
    const text = 'Congratulations! You have successfully registered.';
    return sendEmail(to, subject, text);
};

const sendLoginSuccessEmail = (to) => {
    const subject = 'Login Successful';
    const text = 'You have successfully logged in.';
    return sendEmail(to, subject, text);
};

const sendResetPasswordEmail = (to, resetLink) => {
    const subject = 'Reset Password';
    const text = `Click the following link to reset your password: ${resetLink}`;
    return sendEmail(to, subject, text);
};

const sendResetPasswordConfirmationEmail = (to) => {
    const subject = 'Password Reset Successful';
    const text = 'Your password has been successfully reset.';
    return sendEmail(to, subject, text);
};

module.exports = {
    sendEmail,
    sendRegistrationSuccessEmail,
    sendLoginSuccessEmail,
    sendResetPasswordEmail,
    sendResetPasswordConfirmationEmail
};
