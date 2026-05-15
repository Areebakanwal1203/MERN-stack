const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/nishat')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// HOME
app.get('/', (req, res) => {
    res.render('index');
});

// PRODUCTS ROUTE (same as before)
app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page = parseInt(req.query.page) || 1;

        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 999999;
        const sort = req.query.sort || 'default';
        const rating = parseFloat(req.query.rating) || 0;

        const filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice || maxPrice < 999999)
            filter.price = { $gte: minPrice, $lte: maxPrice };
        if (rating) filter.rating = { $gte: rating };

        const sortOptions = {
            default: {},
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            rating: { rating: -1 },
            newest: { _id: -1 },
        };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / LIMIT);

        const products = await Product.find(filter)
            .sort(sortOptions[sort] || {})
            .skip((page - 1) * LIMIT)
            .limit(LIMIT);

        const categories = await Product.distinct('category');

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            search,
            category,
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || '',
            sort,
            rating,
            categories,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));