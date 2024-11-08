const express = require('express');
const router = express.Router();
const userAddressController = require('../controllers/userAddressController');
const authenticate = require('../middleware/authenticate'); // Pastikan middleware autentikasi diimpor

// Get all addresses
router.get('/', authenticate, userAddressController.getAddresses);

// Get address by ID
router.get('/:id', authenticate, userAddressController.getAddressById);

// Create a new address
router.post('/', authenticate, userAddressController.addAddress);

// Update an address
router.put('/:id', authenticate, userAddressController.updateAddress);

// Delete an address
router.delete('/:id', authenticate, userAddressController.deleteAddress);

module.exports = router;