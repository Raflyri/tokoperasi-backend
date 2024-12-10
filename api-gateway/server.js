require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Konfigurasi CORS
app.use(cors({
    origin: '*', // Izinkan semua domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rute lainnya
app.get('/api', (req, res) => {
    res.send('CORS bekerja!');
});

// Proxy ke Authentication Service
app.use('/api-auth', proxy(process.env.AUTH_SERVICE_URL, proxyOptions));

// Proxy ke User Data di Authentication Service
app.use('/api-users', proxy(process.env.AUTH_SERVICE_URL, proxyOptions));

// Proxy ke Product Service
app.use('/api-products', proxy(process.env.PRODUCT_SERVICE_URL, proxyOptions));

// Proxy ke Cart and Order Service
app.use('/api-orders', proxy(process.env.ORDER_SERVICE_URL, proxyOptions));

// Proxy ke Payment Service
app.use('/api-payments', proxy(process.env.PAYMENT_SERVICE_URL, proxyOptions));

// Proxy ke Shipping Service
app.use('/api-shipping', proxy(process.env.SHIPPING_SERVICE_URL, proxyOptions));

// Proxy ke Admin Service
app.use('/api-admin', proxy(process.env.ADMIN_SERVICE_URL, proxyOptions));

// Proxy ke Address Service
app.use('/api-addresses', proxy(process.env.ADDRESS_SERVICE_URL, proxyOptions));

// Proxy ke Cart Service
app.use('/api-cart', proxy(process.env.CART_SERVICE_URL, proxyOptions));

// Proxy ke Advertisement Service
app.use('/api-advertisements', proxy(process.env.ADMIN_SERVICE_URL, proxyOptions));

// Route untuk mendapatkan produk dan detail seller
app.get('/api/detail-products/:id', async (req, res) => {
    console.log('Get product by ID request received:', req.params);
    try {
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/${req.params.id}`);
        const productData = productResponse.data;
        console.log('Product data:', productData);

        if (!productData) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product data:', productData);

        const sellerResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/user-details-v2/${productData.SellerID}`);
        const sellerData = sellerResponse.data;
        console.log('Seller data:', sellerData);

        if (!sellerData) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        console.log('Seller data:', sellerData);

        const combinedData = {
            ...productData,
            seller: sellerData
        };
        console.log('Combined data:', combinedData);

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching product or seller details:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        res.status(500).send('Error fetching product or seller details');
    }
});

// Route untuk search produk dengan detail seller
app.get('/api/search-products', async (req, res) => {
    console.log('Get product by query request received:', req.query);
    try {
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/search`, {
            params: req.query
        });

        const productDataArray = productResponse.data;

        if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        console.log('Product data:', productDataArray);

        // Iterasi untuk mendapatkan data seller
        const combinedDataArray = await Promise.all(
            productDataArray.map(async (product) => {
                try {
                    const sellerResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/user-details-v2/${product.SellerID}`);
                    const sellerData = sellerResponse.data;

                    console.log(`Seller data for ProductID ${product.ProductID}:`, sellerData);

                    return {
                        ...product,
                        seller: sellerData
                    };
                } catch (error) {
                    console.error(`Error fetching seller for ProductID ${product.ProductID}:`, error.message);
                    return {
                        ...product,
                        seller: null, // Atur ke null jika data seller tidak ditemukan
                    };
                }
            })
        );

        res.status(200).json(combinedDataArray);
    } catch (error) {
        console.error('Error fetching products or seller details:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        res.status(500).send('Error fetching products or seller details');
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
