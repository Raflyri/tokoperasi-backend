require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sequelize = require('./config/database');
const path = require('path');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/admin', adminRoutes);
app.use('/advertisements', advertisementRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Admin' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Admin Service berjalan di port ${PORT}`);
});

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });