require('dotenv').config();  // Load variabel lingkungan dari .env file
const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

const proxyOptions = {
    proxyErrorHandler: (err, res, next) => {
        console.error('Error while connecting to service:', err.message);
        res.status(500).send('Error connecting to service.');
    },
    timeout: 5000  // Set timeout to 5 seconds
};

// Proxy ke Authentication Service
app.use('/auth', proxy(process.env.AUTH_SERVICE_URL));

// Proxy ke Product Service
app.use('/products', proxy(process.env.PRODUCT_SERVICE_URL));

// Proxy ke Cart and Order Service
app.use('/orders', proxy(process.env.ORDER_SERVICE_URL));

// Jalankan API Gateway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway berjalan di port ${PORT}`);
});
