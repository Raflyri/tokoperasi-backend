const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const sequelize = require('./config/database');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use('/products', productRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Product Service berjalan di port ${PORT}`);
    });
});
