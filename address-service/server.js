const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const addressRoutes = require('./routes/addressRoutes');
const sequelize = require('./config/database');  // Import sequelize instance
const app = express();

app.use(bodyParser.json());
app.use('/', addressRoutes);

// Konfigurasi CORS
app.use(cors({
    origin: '*', // Izinkan semua domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rute lainnya
app.get('/api-cors', (req, res) => {
    res.send('CORS bekerja!');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Address Service berjalan di port ${PORT}`);
});

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });