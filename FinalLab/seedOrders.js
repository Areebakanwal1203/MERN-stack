require('dotenv').config();
const mongoose = require('mongoose');
const Order    = require('./models/Order');
const Product  = require('./models/Product');
const User     = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/TA3_nishat';

async function seedOrders() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get existing users and products from DB
    const users    = await User.find();
    const products = await Product.find();

    if (users.length === 0 || products.length === 0) {
        console.log('No users or products found. Run node seed.js first.');
        process.exit(1);
    }

    // Delete old test orders
    await Order.deleteMany({});
    console.log('Old orders cleared');

    // Create 10 fake orders
    const fakeOrders = [];

    for (let i = 0; i < 4; i++) {
        const randomUser    = users[Math.floor(Math.random() * users.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity      = Math.floor(Math.random() * 4) + 1;
        const total         = randomProduct.price * quantity;

        fakeOrders.push({
            user:   randomUser._id,
            items:  [{ product: randomProduct._id, quantity }],
            total,
            status: ['pending', 'confirmed', 'shipped', 'delivered'][i % 4]
        });
    }

    await Order.insertMany(fakeOrders);
    console.log('4 fake orders inserted successfully!');
    process.exit(0);
}

seedOrders().catch(err => {
    console.error(err);
    process.exit(1);
});