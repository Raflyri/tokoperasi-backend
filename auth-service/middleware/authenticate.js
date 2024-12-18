const jwt = require('jsonwebtoken');
const Session = require('../models/sessionsModel');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const session = await Session.findOne({ where: { Token: token, UserID: decoded.id } });

        if (!session || Date.now() > session.ExpiresAt * 1000) {
            return res.status(401).json({ message: 'Session expired or not valid' });
        }

        console.log('User authenticated:', session.UserID);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;