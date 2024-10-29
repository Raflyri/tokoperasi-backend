const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Order Service berjalan di port ${PORT}`);
});