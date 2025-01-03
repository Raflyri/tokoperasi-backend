const emailService = require('../services/emailService');

const sendRegistrationSuccessEmail = async (req, res) => {
    const { to } = req.body;
    try {
        await emailService.sendRegistrationSuccessEmail(to);
        console.log(`Registration success email sent to ${to}`);
        res.status(200).send('Registration success email sent.');
    } catch (error) {
        console.error(`Failed to send registration success email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendLoginSuccessEmail = async (req, res) => {
    const { to } = req.body;
    try {
        await emailService.sendLoginSuccessEmail(to);
        console.log(`Login success email sent to ${to}`);
        res.status(200).send('Login success email sent.');
    } catch (error) {
        console.error(`Failed to send login success email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendResetPasswordEmail = async (req, res) => {
    const { to, resetLink } = req.body;
    try {
        await emailService.sendResetPasswordEmail(to, resetLink);
        console.log(`Reset password email sent to ${to}`);
        res.status(200).send('Reset password email sent.');
    } catch (error) {
        console.error(`Failed to send reset password email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendTestEmail = async (req, res) => {
    const to = 'raflyrizkyinriawan@gmail.com';
    try {
        await emailService.sendEmail(to, 'Test Email', 'This is a test email to verify the email service.');
        console.log(`Test email sent to ${to}`);
        res.status(200).send('Test email sent.');
    } catch (error) {
        console.error(`Failed to send test email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendLogoutSuccessEmail = async (req, res) => {
    const { to } = req.body;
    try {
        await emailService.sendEmail(to, 'Logout Successful', 'You have successfully logged out.');
        console.log(`Logout success email sent to ${to}`);
        res.status(200).send('Logout success email sent.');
    } catch (error) {
        console.error(`Failed to send logout success email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendAccountDeletionEmail = async (req, res) => {
    const { to } = req.body;
    try {
        await emailService.sendEmail(to, 'Account Deletion', 'Your account has been successfully deleted.');
        console.log(`Account deletion email sent to ${to}`);
        res.status(200).send('Account deletion email sent.');
    } catch (error) {
        console.error(`Failed to send account deletion email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

const sendResetPasswordConfirmationEmail = async (req, res) => {
    const { to } = req.body;
    try {
        await emailService.sendResetPasswordConfirmationEmail(to);
        console.log(`Password reset confirmation email sent to ${to}`);
        res.status(200).send('Password reset confirmation email sent.');
    } catch (error) {
        console.error(`Failed to send password reset confirmation email to ${to}: ${error.message}`);
        res.status(500).send(error.toString());
    }
};

module.exports = {
    sendRegistrationSuccessEmail,
    sendLoginSuccessEmail,
    sendResetPasswordEmail,
    sendResetPasswordConfirmationEmail,
    sendTestEmail,
    sendLogoutSuccessEmail,
    sendAccountDeletionEmail
};
