const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const sequelize = require('./config/database');  // Import sequelize instance

app.use(bodyParser.json());
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Admin Service berjalan di port ${PORT}`);
});