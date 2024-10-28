const express = require('express');
const router = express.Router();
const { getAdmins, addAdmin } = require('../controllers/adminController');

router.get('/', getAdmins);
router.post('/', addAdmin);

module.exports = router;