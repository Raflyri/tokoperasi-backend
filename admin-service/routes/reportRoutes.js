const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate'); // Pastikan middleware autentikasi diimpor

// Get all reports
router.get('/', authenticate, reportController.getReports);

// Get report by ID
router.get('/:id', authenticate, reportController.getReportById);

// Create a new report
router.post('/', authenticate, reportController.addReport);

// Update a report
router.put('/:id', authenticate, reportController.updateReport);

// Delete a report
router.delete('/:id', authenticate, reportController.deleteReport);

module.exports = router;