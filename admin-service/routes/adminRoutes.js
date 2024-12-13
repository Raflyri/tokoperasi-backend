const express = require('express');
const router = express.Router();
const { getAdmins, addAdmin } = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate'); // Corrected import

router.get('/', authenticate, getAdmins);
router.post('/', authenticate, addAdmin);

module.exports = router;