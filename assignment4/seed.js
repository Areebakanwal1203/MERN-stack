const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/nishat')
    .then(async () => {
        console.log('MongoDB connected for seeding');

        await Product.deleteMany();

        await Product.insertMany([
            {
                name: "Printed Lawn Suit",
                price: 4500,
                category: "Unstitched",
                stock: 10,
                image: "/uploads/sample1.jpg"
            },
            {
                name: "Luxury Dress",
                price: 12000,
                category: "Luxury",
                stock: 5,
                image: "/uploads/sample2.jpg"
            },
            {
                name: "Casual Shirt",
                price: 2500,
                category: "Men",
                stock: 20,
                image: "/uploads/sample3.jpg"
            }
        ]);

        console.log("Database seeded successfully");
        process.exit();
    })
    .catch(err => {
        console.error(err);
    });