const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const filter = { available: true };
    const { category } = req.query;
    if (category && category !== 'todos') filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById };
