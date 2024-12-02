const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const sequelize = require('./config/database');
const app = express();

app.use(bodyParser.json());
app.use('/payments', paymentRoutes);

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
    res.status(200).json({ message: 'API Endpoint Payment' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Payment Service berjalan di port ${PORT}`);
});

sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });