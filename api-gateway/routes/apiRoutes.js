const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');  // Import controller

// Rute login yang diarahkan ke auth-service
router.post('/api/auth/login', gatewayController.login);

// Rute register yang diarahkan ke auth-service
router.post('/api/auth/register', gatewayController.register);

// Rute logout yang diarahkan ke auth-service
router.post('/api/auth/logout', gatewayController.logout);

// Rute update user yang diarahkan ke auth-service
router.put('/api/auth/update/:id', gatewayController.updateUser);

// Rute user details yang diarahkan ke auth-service
router.get('/api/auth/user-details/:id', gatewayController.getUserDetails);

// Rute user yang diarahkan ke auth-service
router.get('/users/:id', gatewayController.getUser);

// Rute produk yang diarahkan ke product-service
router.get('/products', gatewayController.getProducts);
router.get('/products/:id', gatewayController.getProductById);
router.get('/products/search', gatewayController.searchProducts);
router.get('/products/category/:categoryID', gatewayController.getProductsByCategory);
router.get('/products/:id/details', gatewayController.getProductAndSellerDetails);

// Rute users dengan query parameters yang diarahkan ke auth-service
router.get('/api/auth/users', gatewayController.getUsers);

// Rute cart yang diarahkan ke cart-service
router.get('/cart', gatewayController.getCart);
router.post('/cart', gatewayController.addToCart);
router.delete('/cart/:id', gatewayController.removeFromCart);

// Rute orders yang diarahkan ke order-service
router.get('/orders', gatewayController.getOrders);
router.post('/orders', gatewayController.createOrder);
router.get('/orders/:id', gatewayController.getOrderById);

// Rute payments yang diarahkan ke payment-service
router.get('/payments', gatewayController.getPayments);
router.post('/payments', gatewayController.createPayment);
router.get('/payments/:id', gatewayController.getPaymentById);

// Rute shipping yang diarahkan ke shipping-service
router.get('/shipping', gatewayController.getShipping);
router.post('/shipping', gatewayController.createShipping);
router.get('/shipping/:id', gatewayController.getShippingById);

// Rute admin yang diarahkan ke admin-service
router.get('/admin', gatewayController.getAdmin);
router.post('/admin', gatewayController.createAdmin);
router.get('/admin/:id', gatewayController.getAdminById);

// Rute addresses yang diarahkan ke address-service
router.get('/addresses', gatewayController.getAddresses);
router.post('/addresses', gatewayController.createAddress);
router.get('/addresses/:id', gatewayController.getAddressById);

module.exports = router;
