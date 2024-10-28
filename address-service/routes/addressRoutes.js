const express = require('express');
const router = express.Router();
const { getAddresses, addAddress } = require('../controllers/addressController');

router.get('/', getAddresses);
router.post('/', addAddress);

module.exports = router;