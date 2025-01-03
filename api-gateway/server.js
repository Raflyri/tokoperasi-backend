require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const morgan = require('morgan'); // Tambahkan morgan untuk logging
const axios = require('axios'); // Tambahkan axios untuk melakukan request HTTP
const apiRoutes = require('./routes/apiRoutes'); // Import apiRoutes
const { createProxyMiddleware } = require('http-proxy-middleware'); // Import createProxyMiddleware
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

// Use apiRoutes
app.use('/api', apiRoutes);

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

// Proxy ke Email Service
app.use('/email', createProxyMiddleware({
    target: process.env.EMAIL_SERVICE_URL,
    changeOrigin: true
}));

// Route untuk mendapatkan produk dan detail seller
app.get('/api/detail-products/:id', async (req, res) => {
    console.log('Get product by ID request received:', req.params);
    try {
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/search`, {
            params: { productID: req.params.id }
        });
        const productData = productResponse.data;
        console.log('Product data:', productData);

        if (!productData) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check the structure of productData
        console.log('Product data structure:', JSON.stringify(productData, null, 2));

        const sellerID = productData.SellerID || productData.sellerID || productData.sellerId;
        console.log('Extracted SellerID:', sellerID);

        if (!sellerID) {
            return res.status(404).json({ message: 'SellerID not found in product data' });
        }

        const sellerResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/user-details-v2`, {
            params: { id: sellerID }
        });
        const sellerData = sellerResponse.data;
        console.log('Seller data:', sellerData);

        if (!sellerData) {
            return res.status(404).json({ message: 'Seller not found' });
        }

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

// Route untuk search produk dengan detail seller menggunakan path variable :id
app.get('/api/search-products/:id', async (req, res) => {
    console.log('Get product by ID request received:', req.params);
    try {
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/search`, {
            params: { productID: req.params.id }
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
                    const sellerResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/user-details-v2`, {
                        params: { id: product.SellerID }
                    });
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

// Route untuk mendapatkan produk berdasarkan seller ID dan detail user
app.get('/api/seller-products/:userID', async (req, res) => {
    console.log('Get products by seller ID request received:', req.params);
    try {
        // Fetch user details using query parameter
        const userResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/user-details-v2`, {
            params: { id: req.params.userID }
        });
        const userData = userResponse.data;

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch products by seller ID using query parameter
        const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products`, {
            params: { SellerID: req.params.userID }
        });
        const products = productResponse.data;

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        console.log('User data:', userData);
        console.log('Products data:', products);

        const combinedData = {
            user: userData,
            products: products
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching products for seller:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        res.status(500).json({ message: 'Error fetching products for seller', error: error.message });
    }
});

// Route untuk menghapus akun dan data terkait
app.delete('/api/delete-account/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        // Hapus akun dari auth-service
        await axios.delete(`${process.env.AUTH_SERVICE_URL}/delete-account/${userId}`);
        console.log(`User account ${userId} deleted from auth-service`);

        // Hapus data terkait dari service lain
        await axios.delete(`${process.env.CART_SERVICE_URL}/cart/user/${userId}`);
        console.log(`Cart data for user ${userId} deleted from cart-service`);

        await axios.delete(`${process.env.ORDER_SERVICE_URL}/orders/user/${userId}`);
        console.log(`Order data for user ${userId} deleted from order-service`);

        await axios.delete(`${process.env.ADDRESS_SERVICE_URL}/addresses/user/${userId}`);
        console.log(`Address data for user ${userId} deleted from address-service`);

        res.status(200).json({ message: 'User account and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account or related data:', error.message);
        res.status(500).send('Error deleting user account or related data');
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
