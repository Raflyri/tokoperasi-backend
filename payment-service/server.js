const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const sequelize = require('./config/database');
const app = express();

app.use(bodyParser.json());
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Payment Service berjalan di port ${PORT}`);
});

sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.error("Unable to sync the database:", error);
    });