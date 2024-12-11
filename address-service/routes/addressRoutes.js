const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate');

// Get all addresses
router.get('/', addressController.getAddresses);

// Get address by ID
router.get('/:id', addressController.getAddressById);

// Create a new address
router.post('/', addressController.addAddress);

// Update an address
router.put('/:id', addressController.updateAddress);

// Delete an address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;