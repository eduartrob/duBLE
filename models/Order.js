const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  customer: {
    name:    { type: String, required: true },
    address: { type: String, required: true },
    phone:   { type: String, required: true },
    notes:   { type: String, default: '' }
  },
  items:  { type: [orderItemSchema], required: true },
  total:  { type: Number, required: true },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'entregado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
