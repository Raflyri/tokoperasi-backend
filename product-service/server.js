const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sequelize = require('./config/database');
const path = require('path');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

// Middleware untuk melayani file statis di direktori uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Product Service berjalan di port ${PORT}`);
    });
});
