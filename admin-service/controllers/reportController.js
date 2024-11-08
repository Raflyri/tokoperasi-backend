const Report = require('../models/reportModel');

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Error fetching report', error: error.message });
    }
};

// Create a new report
exports.addReport = async (req, res) => {
    try {
        const { Type, FileURL } = req.body;
        const newReport = await Report.create({ Type, FileURL });
        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Error creating report', error: error.message });
    }
};

// Update a report
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { Type, FileURL } = req.body;
        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        report.Type = Type;
        report.FileURL = FileURL;
        await report.save();
        res.json(report);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Error updating report', error: error.message });
    }
};

// Delete a report
exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.destroy();
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Error deleting report', error: error.message });
    }
};