const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');  // Import sequelize instance

const app = express();

app.use(bodyParser.json());

// Routes untuk Auth Service
app.use('/auth', authRoutes);

// Sinkronisasi database dan jalankan server
const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service berjalan di port ${PORT}`);
    });
});
