require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

const clear = async () => {
  await connectDB();
  const result = await Product.deleteMany({});
  console.log(`✓ ${result.deletedCount} productos eliminados de la DB`);
  process.exit(0);
};

clear().catch(err => {
  console.error(err.message);
  process.exit(1);
});
