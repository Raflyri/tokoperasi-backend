const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shippingRoutes = require('./routes/shippingRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());

app.use('/shipping', shippingRoutes);

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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Shipping' });
});

const PORT = process.env.PORT || 11000;
app.listen(PORT, () => {
    console.log(`Shipping Service berjalan di port ${PORT}`);
});