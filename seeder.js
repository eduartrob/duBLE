require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  {
    name: 'Rol de Canela con Mascarpone',
    description: 'Masa esponjosa con canela y glaseado artesanal de mascarpone. Precio por pieza.',
    price: 65,
    image: '/img/rol-canela.jpeg',
    category: 'pasteles',
    badge: 'Favorito'
  },
  {
    name: 'Tarta Vasca',
    description: 'Cremosa y horneada al punto perfecto, con base especiada y textura suave irresistible.',
    price: 75,
    image: '/img/tarta-vasca.jpeg',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Cheesecake Triple Chocolate',
    description: 'Tres capas de chocolate para los verdaderos amantes del cacao intenso.',
    price: 95,
    image: '/img/cheesecake-chocolate.jpeg',
    category: 'chocolates',
    badge: null
  },
  {
    name: 'Pastel de Chocolate',
    description: 'Pastel de chocolate individual, suave y esponjoso.',
    price: 95,
    image: '/img/pastel-chocolate.jpeg',
    category: 'chocolates',
    badge: null
  },
  {
    name: 'Tarta Entera',
    description: 'Tarta artesanal entera, perfecta para compartir en cualquier celebración.',
    price: 600,
    image: '/img/tarta-entera.jpeg',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Pastel de 3 Leches',
    description: 'Bizcocho empapado en tres leches, sabor dulce de leche. Rinde 18–20 porciones.',
    price: 760,
    image: '/img/pastel-tres-leches.jpeg',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Pastel de Mantequilla',
    description: 'Relleno de compota de frutos rojos con betún de queso y buttercream. 15–18 porciones.',
    price: 790,
    image: '/img/pastel-mantequilla.jpeg',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Pastel de Zanahoria con Pistache',
    description: 'Betún de queso y dulce de leche con pistache. Pequeño (12–15 pax) $830 | Grande (25–30 pax) $1,430.',
    price: 830,
    image: '/img/pastel-zanahoria.jpeg',
    category: 'pasteles',
    badge: 'Nuevo'
  },
  {
    name: 'Pastel de Chocolate Gourmet',
    description: 'Relleno de chocolate, cubierto con buttercream. Mediano (12–15 pax) $970 | Grande (20–25 pax) $1,380.',
    price: 970,
    image: '/img/pastel-chocolate-grande.jpeg',
    category: 'chocolates',
    badge: null
  }
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`✓ ${inserted.length} productos insertados`);
  process.exit(0);
};

seed().catch(err => {
  console.error(err.message);
  process.exit(1);
});
