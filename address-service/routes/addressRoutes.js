const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate');

// Get all addresses
router.get('/', authenticate, addressController.getAddresses);

// Get address by ID
router.get('/:id', authenticate, addressController.getAddressById);

// Create a new address
router.post('/', authenticate, addressController.addAddress);

// Update an address
router.put('/:id', authenticate, addressController.updateAddress);

// Delete an address
router.delete('/:id', authenticate, addressController.deleteAddress);

module.exports = router;