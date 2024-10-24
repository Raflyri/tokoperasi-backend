const express = require('express');
const router = express.Router();
const { getShipping, createShipping } = require('../controllers/shippingController');

router.get('/', getShipping);
router.post('/', createShipping);

module.exports = router;