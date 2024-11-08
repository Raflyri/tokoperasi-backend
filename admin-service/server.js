const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sequelize = require('./config/database');  // Import sequelize instance

const app = express();

app.use(bodyParser.json());
app.use('/admin', adminRoutes);
app.use('/advertisements', advertisementRoutes);
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Admin Service berjalan di port ${PORT}`);
});

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });