const express = require('express');
const app = express();
const cartRoutes = require('./routes/cartRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Cart' });
});

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});
