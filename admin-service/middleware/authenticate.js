const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;      // Original decoded token for flexibility
        req.userId = decoded.id; // Explicit userId for direct access in controllers
        next();
    } catch (error) {
        console.log('Error verifying token:', error.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;