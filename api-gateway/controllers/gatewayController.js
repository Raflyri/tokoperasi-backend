const axios = require('axios');

// Logika untuk mengarahkan request login ke auth-service
exports.login = async (req, res) => {
  try {
    const response = await axios.post('http://auth-service:4000/login', req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send('Error connecting to auth-service');
  }
};

// Logika untuk mengarahkan request produk ke product-service
exports.getProducts = async (req, res) => {
  try {
    const response = await axios.get('http://product-service:5000/products');
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send('Error connecting to product-service');
  }
};
