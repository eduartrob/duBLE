require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  {
    name: 'Red Velvet Clásico',
    description: 'Bizcocho húmedo con cream cheese frosting, una oda al clasicismo que enamora desde el primer bocado.',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACTTTGoCB4_OmSubC2YEVuicTwikSUwbGau28WXfmoEE1ubNRQ8IB9GqdccXxK1WDWN1ZvZrgYic583ZDfDXz9y_bs_Azh6n-oeQyEGEDH_pdLnt8kyXRxpYQXJbZMtdWBUoohVDpEHRfsH0peHCqR4z4DqbutRID4C95V6fNHjPmcUHmLhIpDB8P-6DCkPLyKJE4SYW4py8hQKOL2jnrtBatb88oZ04olmOBfl9PjpaSZI5axFXgaLkBgTpYwO84nKJ4_XVaCcY6Q',
    category: 'pasteles',
    badge: 'Favorito'
  },
  {
    name: 'Trufa de Chocolate',
    description: 'Cacao al 70%, bizcocho húmedo y ganache montada. Para los verdaderos amantes del chocolate.',
    price: 520,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2hadGoQ3FmJQgoETU_g2CsFd6fU6vumjrckix4gEANlP6n8OAFm8SQnI4r2bwrR8mEobUE0lxqNIpNNsjoZ3ky_dNU6ClRyb1kA1T0a5Bo35YVhp2yiNuEk7LnX_FcwUMFs3WTGLBZXfrnkfNsuxrmefGtHQF-PUye8kj9kU7JTbGDO-h6vMo7SYujP_6tEAYM-E5cdDlKTz-fnqXdPgv6qgCF1CIBLQvT2otD-ZE_JwRIe6xgIyBqGOkWuMRuS6I_Kq57Th-T84g',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Zanahoria & Nuez Pecana',
    description: 'Especias cálidas, nuez tostada y un frosting ligero que equilibra perfectamente el dulzor. Versión artesanal de un clásico.',
    price: 480,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8OIjYnale43w8r6woSR4gWpIriWT4EVdyT_G4amRo3O-bx3MLUVKrgQe7lrlKUqiNHaxBoGmeAkzGhflhEIbWjU4KpoZTAorcc0Gd8zuPieSR5XOSCLKgRZmnl5sbx4ofNdIdogJ82nnnPMTVGI0PdgQGw18k9aAFZGTAmMJRaVSooIdmvWjZoZq7QaQtHmBDUgbS_EwxfMAHiOg5tgo1u8dlOkJA7wc3m29MhQtE9t8ceRd60ycZj32zP9Jx9lo1lN_Sm4ooDnKe',
    category: 'pasteles',
    badge: 'Nuevo'
  },
  {
    name: 'Opera Cake',
    description: 'Almendra, café y chocolate amargo en perfecta armonía. Siete capas de pura elegancia francesa.',
    price: 560,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB_hcFP9PzFn0bAW6FIaLDYwokWLlwHF32NML2QzrRJcOSS8lO8LWCvHRDJyOvxwX2tyhtp6WSFUdShKYm3qWsWICEkGaEW1lClIMR7BYYrzyUbCwSsSMwnB5znPsmccLVmMz0zvsaYH3c6v2Wm_IpUTzCz7_TunzfSyH36nUqV3wXqjKf_XAxwSPQUhSD8ftohnZXx-tEEXLe1z6h7zwTRhoVqkM6rT7x6rx8969tXUTEM3XEOs488P9eaCZVvD7xIvoJwHgiP4-N',
    category: 'pasteles',
    badge: null
  },
  {
    name: 'Caja Macarons (12 pzas)',
    description: 'Selección de sabores de temporada: Rosa, Pistacho, Caramelo y Frambuesa. Un regalo irresistible.',
    price: 380,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATsMIqF7mi1LPBXv1CKRq99rpQgXKIbAacFhD8xPX8X3pHhfS6qiV00NdO0DFystHMqJG3R0jX6zCTK9XkgvSMX7Oz-QeoziW4dZuN-jcB2nGeF4_lcow3gKHBZ3yebLxfhMHBb5kqyLGAf8vA23oyImsDYvRIFbNakZ7hkSzTYSqolY2mGb2eAPxpD6eBnXamS9r-UK4kjtv7nMXD-0ti6etDRLzFbzz5IZQUgNn4LPthF-VI6b3cwKC10TtbXpkRKy2l7TCmXwvo',
    category: 'macarons',
    badge: 'Nuevo'
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
