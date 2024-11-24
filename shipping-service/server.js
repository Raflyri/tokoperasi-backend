const express = require('express');
const bodyParser = require('body-parser');
const shippingRoutes = require('./routes/shippingRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());
app.use('/shipping', shippingRoutes);

const PORT = process.env.PORT || 11000;
app.listen(PORT, () => {
    console.log(`Shipping Service berjalan di port ${PORT}`);
});