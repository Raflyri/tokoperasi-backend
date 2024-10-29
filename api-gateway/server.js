require('dotenv').config();
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
app.use('/auth', proxy(process.env.AUTH_SERVICE_URL, proxyOptions));

// Proxy ke Product Service
app.use('/products', proxy(process.env.PRODUCT_SERVICE_URL, proxyOptions));

// Proxy ke Cart and Order Service
app.use('/orders', proxy(process.env.ORDER_SERVICE_URL, proxyOptions));

// Proxy ke Payment Service
app.use('/payments', proxy(process.env.PAYMENT_SERVICE_URL, proxyOptions));

// Proxy ke Shipping Service
app.use('/shipping', proxy(process.env.SHIPPING_SERVICE_URL, proxyOptions));

// Proxy ke Admin Service
app.use('/admin', proxy(process.env.ADMIN_SERVICE_URL, proxyOptions));

// Proxy ke Address Service
app.use('/addresses', proxy(process.env.ADDRESS_SERVICE_URL, proxyOptions));

// Jalankan API Gateway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway berjalan di port ${PORT}`);
});
