const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/nishat')
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error(err));

const seedProducts = [
    { name: 'Printed Lawn 3-Piece', price: 3500, category: 'Unstitched', rating: 4.5, stock: 30, pieces: '3-Piece', badge: '50% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/1_513b5b20-b4f8-4ef4-814f-2568e89efca9.jpg?v=1770197698' },
    { name: 'Embroidered Chiffon 3-Piece', price: 8500, category: 'Unstitched', rating: 4.8, stock: 15, pieces: '3-Piece', badge: 'NEW', image: 'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },
    { name: 'Digital Print 2-Piece', price: 2800, category: 'Unstitched', rating: 4.2, stock: 40, pieces: '2-Piece', badge: '40% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },
    { name: 'Summer Lawn 1-Piece', price: 1500, category: 'Unstitched', rating: 4.0, stock: 60, pieces: '1-Piece', image: 'https://nishatlinenfps.com/cdn/shop/files/1_cffdc8ed-338d-4a99-a042-c69e04012ed5.jpg' }
];

async function seedDB() {
    const count = await Product.countDocuments();
    if (count > 0) {
        console.log("Already seeded");
        return;
    }

    await Product.insertMany(seedProducts);
    console.log("Database seeded");
    mongoose.disconnect();
}

seedDB();