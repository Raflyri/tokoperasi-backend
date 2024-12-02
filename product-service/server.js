const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { sequelize } = require('./config/database');
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

// Middleware untuk melayani file statis di direktori uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/products', productRoutes);
app.get('/products/:id', productRoutes); // Add this line

app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Endpoint Product' });
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Product Service berjalan di port ${PORT}`);
    });
});

