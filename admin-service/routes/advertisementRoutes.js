const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const authenticate = require('../middleware/authenticate'); // Pastikan middleware autentikasi diimpor

// Get all advertisements
router.get('/', authenticate, advertisementController.getAdvertisements);

// Get advertisement by ID
router.get('/:id', authenticate, advertisementController.getAdvertisementById);

// Create a new advertisement
router.post('/', authenticate, advertisementController.addAdvertisement);

// Update an advertisement
router.put('/:id', authenticate, advertisementController.updateAdvertisement);

// Delete an advertisement
router.delete('/:id', authenticate, advertisementController.deleteAdvertisement);

module.exports = router;