const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const { customer, items, total } = req.body;
    if (!customer || !items || !items.length) {
      res.status(400);
      throw new Error('Datos de orden incompletos');
    }
    const order = await Order.create({ customer, items, total });
    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders };
