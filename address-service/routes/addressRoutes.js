const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate');

// Get all addresses
router.get('/', authenticate, addressController.getAddresses);

// Search address by addressID or userID
router.get('/search', authenticate, addressController.searchAddress);

// Get addresses by user token and addressID
router.get('/user', authenticate, addressController.getAddressesByUser);

// Create a new address
router.post('/', authenticate, addressController.addAddress);

// Update an address
router.put('/:id', authenticate, addressController.updateAddress);

// Delete an address
router.delete('/:id', authenticate, addressController.deleteAddress);

module.exports = router;