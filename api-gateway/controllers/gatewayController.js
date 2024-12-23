const axios = require("axios");

// Logika untuk mengarahkan request login ke auth-service
exports.login = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/login`,
      req.body
    );
    console.log("Login request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error connecting to auth-service for login:", error.message);
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request register ke auth-service
exports.register = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/register`,
      req.body
    );
    console.log("Register request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for register:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request logout ke auth-service
exports.logout = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/logout`,
      req.body
    );
    console.log("Logout request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for logout:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request update user ke auth-service
exports.updateUser = async (req, res) => {
  try {
    const response = await axios.put(
      `${process.env.AUTH_SERVICE_URL}/api/auth/update/${req.params.id}`,
      req.body
    );
    console.log("Update user request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for update user:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request user details ke auth-service
exports.getUserDetails = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/user-details/${req.params.id}`
    );
    console.log("Get user details request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for get user details:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request user ke auth-service
exports.getUser = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/users/${req.params.id}`
    );
    console.log("Get user request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for get user:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request produk ke product-service
exports.getProducts = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products`
    );
    console.log("Get products request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to product-service for get products:",
      error.message
    );
    res.status(500).send("Error connecting to product-service");
  }
};

// Logika untuk mengarahkan request search produk ke product-service
exports.searchProducts = async (req, res) => {
  console.log("Search products request received:", req.query);

  try {
    const productResponse = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/search`,
      { params: req.query }
    );
    const productData = productResponse.data;
    console.log("Search products response from product-service:", productData);

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product data:", productData);

    const sellerResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/user-details-v2/${productData.SellerID}`
    );
    const sellerData = sellerResponse.data;
    console.log("Seller data:", sellerData);

    if (!sellerData) {
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log("Seller data:", sellerData);

    const combinedData = {
      ...productData,
      seller: sellerData,
    };
    console.log("Combined data:", combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error(
      "Error connecting to product-service for search products:",
      error.message
    );
    res.status(500).send("Error connecting to product-service");
  }
};

// Logika untuk mengarahkan request produk by category ke product-service
exports.getProductsByCategory = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/category/${req.params.categoryID}`
    );
    console.log("Get products by category request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to product-service for get products by category:",
      error.message
    );
    res.status(500).send("Error connecting to product-service");
  }
};

// Logika untuk mengarahkan request produk berdasarkan seller ID ke product-service
exports.getProductsBySeller = async (req, res) => {
  console.log("Get products by seller ID request received:", req.params);
  try {
    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/seller/${req.params.userID}`
    );
    const products = response.data;

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }

    console.log("Products data:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error(
      "Error connecting to product-service for get products by seller:",
      error.message
    );
    res.status(500).send("Error connecting to product-service");
  }
};

// Logika untuk mendapatkan data detail seller dengan produk yang dimiliki seller tersebut
exports.getSellerDetailsWithProducts = async (req, res) => {
  try {
    const sellerID = req.params.sellerID;

    // Fetch seller details
    const sellerResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/user-details-v2`,
      {
        params: { id: sellerID },
      }
    );
    const sellerData = sellerResponse.data;

    if (!sellerData) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Fetch products by seller ID using search endpoint
    const productsResponse = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/search`,
      {
        params: { sellerID: sellerID },
      }
    );
    const productsData = productsResponse.data;

    const combinedData = {
      seller: sellerData,
      products: productsData,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching seller details or products:", error.message);
    res.status(500).send("Error fetching seller details or products");
  }
};

// Logika untuk mengarahkan request users dengan query parameters ke auth-service
exports.getUsers = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/users`,
      { params: req.query }
    );
    console.log("Get users request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to auth-service for get users:",
      error.message
    );
    res.status(500).send("Error connecting to auth-service");
  }
};

// Logika untuk mengarahkan request cart ke cart-service
exports.getCart = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CART_SERVICE_URL}/cart`);
    console.log("Get cart request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to cart-service for get cart:",
      error.message
    );
    res.status(500).send("Error connecting to cart-service");
  }
};

exports.addToCart = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.CART_SERVICE_URL}/cart`,
      req.body
    );
    console.log("Add to cart request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to cart-service for add to cart:",
      error.message
    );
    res.status(500).send("Error connecting to cart-service");
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const response = await axios.delete(
      `${process.env.CART_SERVICE_URL}/cart/${req.params.id}`
    );
    console.log("Remove from cart request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to cart-service for remove from cart:",
      error.message
    );
    res.status(500).send("Error connecting to cart-service");
  }
};

exports.getCartWithDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    const cartResponse = await axios.get(`${process.env.CART_SERVICE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cartData = cartResponse.data;

    if (!cartData || !cartData.CartItems || cartData.CartItems.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    const detailedCart = await Promise.all(
      cartData.CartItems.map(async (cartItem) => {
        try {
          // Fetch product details
          const productResponse = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/products/search`,
            {
              params: { productID: cartItem.ProductID },
            }
          );
          const productDataArray = productResponse.data;

          if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
            console.error(`No product data found for ProductID: ${cartItem.ProductID}`);
            return { ...cartItem, product: null, seller: null };
          }

          // Process each product to get its seller details
          const productsWithSeller = await Promise.all(
            productDataArray.map(async (product) => {
              const sellerID = product.SellerID;
              if (!sellerID) {
                console.error(`SellerID not found for ProductID: ${product.ProductID}`);
                return { ...product, seller: null };
              }

              try {
                const sellerResponse = await axios.get(
                  `${process.env.AUTH_SERVICE_URL}/user-details-v2`,
                  {
                    params: { id: sellerID },
                  }
                );
                const sellerData = sellerResponse.data;
                return { ...product, seller: sellerData };
              } catch (sellerError) {
                console.error(
                  `Error fetching seller data for SellerID: ${sellerID}`,
                  sellerError.message
                );
                return { ...product, seller: null };
              }
            })
          );

          return { ...cartItem, product: productsWithSeller };
        } catch (productError) {
          console.error(`Error fetching product data for CartItemID: ${cartItem.CartItemID}`, productError.message);
          return { ...cartItem, product: null, seller: null };
        }
      })
    );

    res.status(200).json(detailedCart);
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    res.status(500).send('Error fetching cart details');
  }
};



// Logika untuk mengarahkan request orders ke order-service
exports.getOrders = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORDER_SERVICE_URL}/orders`);
    console.log("Get orders request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to order-service for get orders:",
      error.message
    );
    res.status(500).send("Error connecting to order-service");
  }
};

exports.createOrder = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/orders`,
      req.body
    );
    console.log("Create order request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to order-service for create order:",
      error.message
    );
    res.status(500).send("Error connecting to order-service");
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/orders/${req.params.id}`
    );
    console.log("Get order by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to order-service for get order by ID:",
      error.message
    );
    res.status(500).send("Error connecting to order-service");
  }
};

// Logika untuk mengarahkan request payments ke payment-service
exports.getPayments = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.PAYMENT_SERVICE_URL}/payments`
    );
    console.log("Get payments request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to payment-service for get payments:",
      error.message
    );
    res.status(500).send("Error connecting to payment-service");
  }
};

exports.createPayment = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.PAYMENT_SERVICE_URL}/payments`,
      req.body
    );
    console.log("Create payment request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to payment-service for create payment:",
      error.message
    );
    res.status(500).send("Error connecting to payment-service");
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.PAYMENT_SERVICE_URL}/payments/${req.params.id}`
    );
    console.log("Get payment by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to payment-service for get payment by ID:",
      error.message
    );
    res.status(500).send("Error connecting to payment-service");
  }
};

// Logika untuk mengarahkan request shipping ke shipping-service
exports.getShipping = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.SHIPPING_SERVICE_URL}/shipping`
    );
    console.log("Get shipping request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to shipping-service for get shipping:",
      error.message
    );
    res.status(500).send("Error connecting to shipping-service");
  }
};

exports.createShipping = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.SHIPPING_SERVICE_URL}/shipping`,
      req.body
    );
    console.log("Create shipping request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to shipping-service for create shipping:",
      error.message
    );
    res.status(500).send("Error connecting to shipping-service");
  }
};

exports.getShippingById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.SHIPPING_SERVICE_URL}/shipping/${req.params.id}`
    );
    console.log("Get shipping by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to shipping-service for get shipping by ID:",
      error.message
    );
    res.status(500).send("Error connecting to shipping-service");
  }
};

// Logika untuk mengarahkan request admin ke admin-service
exports.getAdmin = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ADMIN_SERVICE_URL}/admin`);
    console.log("Get admin request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to admin-service for get admin:",
      error.message
    );
    res.status(500).send("Error connecting to admin-service");
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ADMIN_SERVICE_URL}/admin`,
      req.body
    );
    console.log("Create admin request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to admin-service for create admin:",
      error.message
    );
    res.status(500).send("Error connecting to admin-service");
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ADMIN_SERVICE_URL}/admin/${req.params.id}`
    );
    console.log("Get admin by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to admin-service for get admin by ID:",
      error.message
    );
    res.status(500).send("Error connecting to admin-service");
  }
};

// Logika untuk mengarahkan request addresses ke address-service
exports.getAddresses = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ADDRESS_SERVICE_URL}/addresses`
    );
    console.log("Get addresses request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to address-service for get addresses:",
      error.message
    );
    res.status(500).send("Error connecting to address-service");
  }
};

exports.createAddress = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ADDRESS_SERVICE_URL}/addresses`,
      req.body
    );
    console.log("Create address request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to address-service for create address:",
      error.message
    );
    res.status(500).send("Error connecting to address-service");
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ADDRESS_SERVICE_URL}/addresses/${req.params.id}`
    );
    console.log("Get address by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to address-service for get address by ID:",
      error.message
    );
    res.status(500).send("Error connecting to address-service");
  }
};

// Logika untuk mengarahkan request advertisements ke advertisement-service
exports.getAdvertisements = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ADMIN_SERVICE_URL}/advertisements`
    );
    console.log("Get advertisements request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to advertisement-service for get advertisements:",
      error.message
    );
    res.status(500).send("Error connecting to advertisement-service");
  }
};

exports.getAdvertisementById = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ADMIN_SERVICE_URL}/advertisements/${req.params.id}`
    );
    console.log("Get advertisement by ID request successful:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error connecting to advertisement-service for get advertisement by ID:",
      error.message
    );
    res.status(500).send("Error connecting to advertisement-service");
  }
};

// Logika untuk mengarahkan request delete akun ke auth-service dan menghapus data terkait
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    // Hapus akun dari auth-service
    await axios.delete(
      `${process.env.AUTH_SERVICE_URL}/api/auth/delete/${userId}`
    );
    console.log(`User account ${userId} deleted from auth-service`);

    // Hapus data terkait dari service lain
    await axios.delete(`${process.env.CART_SERVICE_URL}/cart/user/${userId}`);
    console.log(`Cart data for user ${userId} deleted from cart-service`);

    await axios.delete(
      `${process.env.ORDER_SERVICE_URL}/orders/user/${userId}`
    );
    console.log(`Order data for user ${userId} deleted from order-service`);

    await axios.delete(
      `${process.env.ADDRESS_SERVICE_URL}/addresses/user/${userId}`
    );
    console.log(`Address data for user ${userId} deleted from address-service`);

    res
      .status(200)
      .json({ message: "User account and related data deleted successfully" });
  } catch (error) {
    console.error(
      "Error deleting user account or related data:",
      error.message
    );
    res.status(500).send("Error deleting user account or related data");
  }
};
