const axios = require('axios');
const Order = require('../models/orderModel');

// Get Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { UserID: req.user.id } });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { totalAmount, status, shippingAddress, paymentStatus } = req.body;
        const newOrder = await Order.create({ UserID: req.user.id, totalAmount, status, shippingAddress, paymentStatus });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Create Order from Cart
exports.createOrderFromCart = async (req, res) => {
    try {
        const UserID = req.user.id;

        // Panggil cart-service untuk mendapatkan data keranjang
        const cartResponse = await axios.get(`http://cart-service:6000/api/cart/${UserID}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });

        const cart = cartResponse.data;

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Buat pesanan baru berdasarkan data keranjang
        const newOrder = await Order.create({
            UserID,
            OrderStatus: 'pending',
            TotalAmount: cart.totalAmount,
            ShippingAddressID: req.body.ShippingAddressID,
        });

        // Tambahkan logika untuk menyimpan item pesanan jika diperlukan

        // Hapus keranjang setelah membuat pesanan
        await axios.delete(`http://cart-service:6000/api/cart/${UserID}/clear`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order from cart', error: error.message });
    }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order || order.UserID !== req.userId) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};

// Get All Orders for User
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.findAll({ where: { UserID: userId } });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

// Update Order
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, shippingAddress, paymentStatus } = req.body;
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        order.shippingAddress = shippingAddress;
        order.paymentStatus = paymentStatus;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validasi status yang diperbolehkan
        const allowedStatuses = ['pending', 'paid', 'shipped', 'completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Pastikan hanya pemilik order yang dapat memperbarui status
        if (order.UserID !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        order.OrderStatus = status;
        await order.save();

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        await order.destroy();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};

// Pay Order
exports.payOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMethod } = req.body;

        const order = await Order.findByPk(id);

        if (!order || order.UserID !== req.user.id) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        if (order.OrderStatus !== 'pending') {
            return res.status(400).json({ message: 'Order is not in a payable state' });
        }

        // Panggil payment-service untuk membuat pembayaran
        const paymentResponse = await axios.post('http://payment-service:10000/payments', {
            orderId: order.OrderID,
            amount,
            paymentMethod,
            userId: req.user.id
        }, {
            headers: {
                Authorization: req.headers.authorization
            }
        });

        if (paymentResponse.status !== 201) {
            return res.status(paymentResponse.status).json({ message: 'Payment failed', error: paymentResponse.data });
        }

        // Update status order setelah pembayaran berhasil
        order.OrderStatus = 'paid';
        await order.save();

        res.status(200).json({ message: 'Order paid successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
};
