require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  
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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Authentication' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', authRoutes);

const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service berjalan di port ${PORT}`);
    });
});