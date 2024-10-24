const express = require('express');
const bodyParser = require('body-parser');
const addressRoutes = require('./routes/addressRoutes');
const sequelize = require('./config/database');  // Import sequelize instance
const app = express();

app.use(bodyParser.json());
app.use('/addresses', addressRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Address Service berjalan di port ${PORT}`);
});

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });