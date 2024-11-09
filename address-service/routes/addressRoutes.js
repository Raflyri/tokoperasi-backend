const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======
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
>>>>>>> 95192612bce36d7f78911807e3fb1e0fb7576a06

module.exports = router;