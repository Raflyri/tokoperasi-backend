const express = require('express');
const cors = require('cors');
const app = express();
const cartRoutes = require('./routes/cartRoutes');

// Middleware
app.use(express.json());

// Konfigurasi CORS
app.use(cors({
    origin: '*', // Izinkan semua domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rute lainnya
app.get('/api', (req, res) => {
    res.send('CORS bekerja!');
});

// Routes
app.use('/', cartRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Cart' });
});

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});
