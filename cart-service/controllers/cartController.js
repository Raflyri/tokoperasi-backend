const { Cart, CartItem } = require('../models/cartModel');

// Create Cart
exports.createCart = async (req, res) => {
    try {
        const UserID = req.user.id;
        console.log(`User with ID ${UserID} is creating a cart`);
        console.log(req.body);

        const newCart = await Cart.create({ UserID });
        console.log(`Cart created with ID ${newCart.CartID}`);

        res.status(201).json({ message: 'Cart created successfully', cart: newCart });
    } catch (error) {
        console.error('Error creating cart:', error.message);
        res.status(500).json({ message: 'Error creating cart', error: error.message });
    }
};

// Add Item to Cart
exports.addItemToCart = async (req, res) => {
    try {
        const UserID = req.user.id;
        const { ProductID, Quantity, Note } = req.body;  // Pastikan destructuring request body dengan benar
        console.log(`User with ID ${UserID} is adding item with ID ${ProductID} to cart`);
        console.log('Request Body:',req.body);

        if (!ProductID || !Quantity) {
            return res.status(400).json({ message: 'ProductID and Quantity are required' });
        }

        let cart = await Cart.findOne({ where: { UserID } });
        if (!cart) {
            cart = await Cart.create({ UserID });
        }

        const newCartItem = await CartItem.create({
            CartID: cart.CartID,
            ProductID,
            Quantity,
            Note
        });

        res.status(201).json({ message: 'Item added to cart successfully', cartItem: newCartItem });
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// Get Cart by ID
exports.getCartById = async (req, res) => {
    try {
        const UserID = req.user.UserID; // Dapatkan UserID dari middleware
        const cart = await Cart.findOne({
            where: { UserID },
            include: CartItem
        });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error: error.message });
    }
};

// Update Cart Item
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { Quantity, Note } = req.body;
        const item = await CartItem.findByPk(id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.Quantity = Quantity || item.Quantity;
        item.Note = Note || item.Note;
        await item.save();

        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
};

// Delete Cart Item
exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CartItem.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.destroy();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
};

// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        const UserID = req.user.UserID; // Dapatkan UserID dari middleware
        const cart = await Cart.findOne({ where: { UserID } });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        await CartItem.destroy({ where: { CartID: cart.CartID } });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};