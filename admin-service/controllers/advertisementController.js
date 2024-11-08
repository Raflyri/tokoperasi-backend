const Advertisement = require('../models/advertisementModel');

// Get all advertisements
exports.getAdvertisements = async (req, res) => {
    try {
        const ads = await Advertisement.findAll();
        res.json(ads);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
    }
};

// Get advertisement by ID
exports.getAdvertisementById = async (req, res) => {
    try {
        const { id } = req.params;
        const ad = await Advertisement.findByPk(id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        res.json(ad);
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        res.status(500).json({ message: 'Error fetching advertisement', error: error.message });
    }
};

// Create a new advertisement
exports.addAdvertisement = async (req, res) => {
    try {
        const { Title, ImageURL, ExpiresAt } = req.body;
        const newAd = await Advertisement.create({ Title, ImageURL, ExpiresAt });
        res.status(201).json(newAd);
    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({ message: 'Error creating advertisement', error: error.message });
    }
};

// Update an advertisement
exports.updateAdvertisement = async (req, res) => {
    try {
        const { id } = req.params;
        const { Title, ImageURL, ExpiresAt } = req.body;
        const ad = await Advertisement.findByPk(id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        ad.Title = Title;
        ad.ImageURL = ImageURL;
        ad.ExpiresAt = ExpiresAt;
        await ad.save();
        res.json(ad);
    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({ message: 'Error updating advertisement', error: error.message });
    }
};

// Delete an advertisement
exports.deleteAdvertisement = async (req, res) => {
    try {
        const { id } = req.params;
        const ad = await Advertisement.findByPk(id);
        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        await ad.destroy();
        res.json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
    }
};