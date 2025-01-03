const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.post('/send-registration-success', emailController.sendRegistrationSuccessEmail);
router.post('/send-login-success', emailController.sendLoginSuccessEmail);
router.post('/send-reset-password', emailController.sendResetPasswordEmail);
router.post('/send-test-email', emailController.sendTestEmail);
router.post('/send-logout-success', emailController.sendLogoutSuccessEmail);
router.post('/send-account-deletion', emailController.sendAccountDeletionEmail);
router.post('/send-reset-password-confirmation', emailController.sendResetPasswordConfirmationEmail);

module.exports = router;
