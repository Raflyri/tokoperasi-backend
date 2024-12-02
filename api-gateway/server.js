require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const morgan = require('morgan'); // Tambahkan morgan untuk logging
const axios = require('axios'); // Tambahkan axios untuk melakukan request HTTP
const app = express();

app.use(morgan('combined')); // Tambahkan middleware logging

// Middleware untuk mencatat detail response
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response for ${req.method} ${req.originalUrl}:`, body);
        return originalSend.apply(this, arguments);
    };
    next();
});

const proxyOptions = {
    proxyErrorHandler: (err, res, next) => {
        console.error('Error while connecting to service:', err.message);
        res.status(500).send('Error connecting to service.');
    },
    timeout: 5000  // Set timeout to 5 seconds
};

// Proxy ke Authentication Service
app.use('/auth', proxy(process.env.AUTH_SERVICE_URL, proxyOptions));

// Proxy ke User Data di Authentication Service
app.use('/users', proxy(process.env.AUTH_SERVICE_URL, proxyOptions));

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

// Proxy ke Cart Service
app.use('/cart', proxy(process.env.CART_SERVICE_URL, proxyOptions));

// Route untuk mendapatkan produk dan detail seller
app.get('/products/:id/details', async (req, res) => {
    console.log('Get product by ID request received:', req.params);
    try {
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/${req.params.id}`);
        const productData = productResponse.data;

        if (!productData) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product data:', productData);

        const sellerResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/user-details/${productData.SellerID}`);
        const sellerData = sellerResponse.data;

        if (!sellerData) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        console.log('Seller data:', sellerData);

        const combinedData = {
            ...productData,
            seller: sellerData
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching product or seller details:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        res.status(500).send('Error fetching product or seller details');
    }
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Gateway' });
});

// Jalankan API Gateway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway berjalan di port ${PORT}`);
});
