const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());
app.use('/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Product Service berjalan di port ${PORT}`);
});
