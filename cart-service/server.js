const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());
app.use('/cart', cartRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Cart Service berjalan di port ${PORT}`);
});