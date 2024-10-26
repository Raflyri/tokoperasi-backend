const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  
const sequelize = require('./config/database'); 
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service berjalan di port ${PORT}`);
    });
});