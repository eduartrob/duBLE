require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config', (req, res) => {
  res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER || '' });
});

app.get('/catalogo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'catalogo.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`duBLE server running on http://localhost:${PORT}`);
});
