const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const gatewayController = require('../controllers/gatewayController');  // Import controller

// Rute login yang diarahkan ke auth-service
router.post('/login', gatewayController.login);

// Rute register yang diarahkan ke auth-service
router.post('/register', gatewayController.register);

// Rute logout yang diarahkan ke auth-service
router.post('/logout', gatewayController.logout);

// Rute update user yang diarahkan ke auth-service
router.put('/update/:id', gatewayController.updateUser);

// Rute user details yang diarahkan ke auth-service
router.get('/user-details/:id', gatewayController.getUserDetails);

// Rute user yang diarahkan ke auth-service
router.get('/users/:id', gatewayController.getUser);

// Rute users dengan query parameters yang diarahkan ke auth-service
router.get('/all-users', gatewayController.getUsers);

// Rute produk yang diarahkan ke product-service
router.get('/', gatewayController.getProducts);
router.get('/search', gatewayController.searchProducts);
router.get('/category/:categoryID', gatewayController.getProductsByCategory);

// Rute untuk mendapatkan produk berdasarkan seller ID
router.get('/seller-products/:userID', gatewayController.getProductsBySeller);

// Rute untuk mendapatkan data detail seller dengan produk yang dimiliki seller tersebut
router.get('/seller-details/:sellerID', gatewayController.getSellerDetailsWithProducts);

// Rute cart yang diarahkan ke cart-service
router.get('/cart', gatewayController.getCart);
router.get('/cart-details', authenticate, gatewayController.getCartWithDetails);
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

// Rute advertisements yang diarahkan ke advertisement-service
router.get('/ads', gatewayController.getAdvertisements);
router.get('/ads/:id', gatewayController.getAdvertisementById);

// Rute admin yang diarahkan ke admin-service
router.get('/admin', gatewayController.getAdmin);
router.post('/admin', gatewayController.createAdmin);
router.get('/admin/:id', gatewayController.getAdminById);

// Rute addresses yang diarahkan ke address-service
router.get('/addresses', gatewayController.getAddresses);
router.post('/addresses', gatewayController.createAddress);
router.get('/addresses/:id', gatewayController.getAddressById);

// Rute untuk menghapus akun dan data terkait
router.delete('/delete-account/:id', gatewayController.deleteAccount);

module.exports = router;
