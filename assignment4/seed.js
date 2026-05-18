const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/TA3_nishat')
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error(err));

const seedProducts = [
  {
    name: 'Printed Lawn 3-Piece',
    price: 3500,
    category: 'Unstitched',
    rating: 4.5,
    stock: 30,
    pieces: '3-Piece',
    badge: '50% OFF',
    image: '/images/A1.png'
  },
  {
    name: 'Embroidered Chiffon 3-Piece',
    price: 8500,
    category: 'Unstitched',
    rating: 4.8,
    stock: 15,
    pieces: '3-Piece',
    badge: 'NEW',
    image: '/images/A2.png'
  },
  {
    name: 'Digital Print 2-Piece',
    price: 2800,
    category: 'Unstitched',
    rating: 4.2,
    stock: 40,
    pieces: '2-Piece',
    badge: '40% OFF',
    image: '/images/A3.png'
  },
  {
    name: 'Summer Lawn 1-Piece',
    price: 1500,
    category: 'Unstitched',
    rating: 4.0,
    stock: 60,
    pieces: '1-Piece',
    image: '/images/A4.png'
  },
  {
    name: 'Luxury Embroidered Lawn',
    price: 5200,
    category: 'Unstitched',
    rating: 4.6,
    stock: 25,
    pieces: '3-Piece',
    badge: 'NEW',
    image: '/images/A5.png'
  },
  {
    name: 'Floral Printed Lawn Suit',
    price: 3100,
    category: 'Unstitched',
    rating: 4.3,
    stock: 35,
    pieces: '3-Piece',
    image: '/images/A7.png'
  },
  {
    name: 'Cotton Summer Collection',
    price: 2600,
    category: 'Unstitched',
    rating: 4.1,
    stock: 50,
    pieces: '2-Piece',
    badge: '20% OFF',
    image: '/images/A8.png'
  },
  {
    name: 'Classic Embroidered Kurti',
    price: 4200,
    category: 'Ready to Wear',
    rating: 4.7,
    stock: 18,
    pieces: '1-Piece',
    image: '/images/A9.png'
  },
  {
    name: 'Elegant Lawn Printed Suit',
    price: 3900,
    category: 'Unstitched',
    rating: 4.4,
    stock: 22,
    pieces: '3-Piece',
    image: '/images/A10.png'
  },
  {
    name: 'Premium Chiffon Dupatta Set',
    price: 7800,
    category: 'Unstitched',
    rating: 4.9,
    stock: 12,
    pieces: '3-Piece',
    badge: 'NEW',
    image: '/images/Luxury.png'
  },
  {
    name: 'Printed Cotton 2-Piece',
    price: 2400,
    category: 'Unstitched',
    rating: 4.0,
    stock: 55,
    pieces: '2-Piece',
    image: '/images/loosefabric.png'
  },
  {
    name: 'Luxury Formal Wear',
    price: 9500,
    category: 'Luxury',
    rating: 4.8,
    stock: 10,
    pieces: '3-Piece',
    badge: 'NEW',
    image: '/images/A3.png'
  },
  {
    name: 'Casual Printed Kurta',
    price: 2800,
    category: 'Unstitched',
    rating: 4.2,
    stock: 40,
    pieces: '1-Piece',
    image: '/images/A4.png'
  },
  {
    name: 'Winter Embroidered Shawl',
    price: 3300,
    category: 'Luxury',
    rating: 4.5,
    stock: 20,
    pieces: '1-Piece',
    image: '/images/A9.png'
  },
  {
    name: 'Modern Lawn 3-Piece Suit',
    price: 4600,
    category: 'Unstitched',
    rating: 4.6,
    stock: 28,
    pieces: '3-Piece',
    image: '/images/A5.png'
  },
  {
    name: 'Men Cotton Kurta',
    price: 3000,
    category: 'Men',
    rating: 4.3,
    stock: 33,
    pieces: '2-Piece',
    image: '/images/A11.png'
  },
   {
    name: 'Elegant Lawn Printed Suit',
    price: 3900,
    category: 'Unstitched',
    rating: 4.4,
    stock: 22,
    pieces: '3-Piece',
    image: '/images/unstiched.png'
  },
];


async function seedDB() {
  // Drop existing data so re-seed always works cleanly
  await Product.deleteMany({});
  console.log('Old products cleared');

  await Product.insertMany(seedProducts);
  console.log('Database seeded successfully with', seedProducts.length, 'products');
  mongoose.disconnect();
}

seedDB();