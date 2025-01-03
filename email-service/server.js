const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const emailRoutes = require('./routes/emailRoutes');
const emailService = require('./services/emailService');

const app = express();
app.use(express.json());

app.use('/email', emailRoutes);

const PORT = process.env.PORT || 3200;
app.listen(PORT, async () => {
    console.log(`Email service running on port ${PORT}`);
    
    // Send test email when service starts
    try {
        await emailService.sendEmail('raflyrizkyinriawan@gmail.com', 'Service Started', 'The email service is now active.');
        console.log('Test email sent to raflyrizkyinriawan@gmail.com');
    } catch (error) {
        console.error(`Failed to send test email: ${error.message}`);
    }
});
