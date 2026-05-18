const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Product = require('./models/Product');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ── Multer (image uploads) ──────────────────────────────────────────
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase())
                && allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('Images only!'));
    }
});

// ── MongoDB ─────────────────────────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/TA3_nishat')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// ══════════════════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => res.render('index'));

app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page     = parseInt(req.query.page) || 1;
        const search   = req.query.search   || '';
        const category = req.query.category || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 999999;
        const sort     = req.query.sort     || 'default';
        const rating   = parseFloat(req.query.rating)   || 0;

        const filter = {};
        if (search)   filter.name  = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice || maxPrice < 999999)
            filter.price = { $gte: minPrice, $lte: maxPrice };
        if (rating) filter.rating = { $gte: rating };

        const sortOptions = {
            default:      {},
            'price-asc':  { price: 1 },
            'price-desc': { price: -1 },
            rating:       { rating: -1 },
            newest:       { _id: -1 },
        };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / LIMIT);
        const products      = await Product.find(filter)
            .sort(sortOptions[sort] || {})
            .skip((page - 1) * LIMIT)
            .limit(LIMIT);
        const categories = await Product.distinct('category');

        res.render('products', {
            products, currentPage: page, totalPages, totalProducts,
            search, category,
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || '',
            sort, rating, categories,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ══════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ══════════════════════════════════════════════════════════════════════

// Dashboard — list all products
app.get('/admin', async (req, res) => {
    try {
        const products   = await Product.find().sort({ createdAt: -1 });
        const totalStock = products.reduce((s, p) => s + p.stock, 0);
        const categories = await Product.distinct('category');
        res.render('admin/dashboard', {
            products, totalStock, categories,
            success: req.query.success || null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// New product form
app.get('/admin/products/new', (req, res) => {
    res.render('admin/new', { error: null });
});

// Create product
app.post('/admin/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;

        // Basic validation
        if (!name || !price || !category) {
            return res.render('admin/new', { error: 'Name, price and category are required.' });
        }

        const imagePath = req.file
            ? '/uploads/' + req.file.filename
            : req.body.imageUrl || '';

        await Product.create({ name, price, category, rating, stock, description, image: imagePath });
        res.redirect('/admin?success=Product+added+successfully');
    } catch (err) {
        console.error(err);
        res.render('admin/new', { error: 'Something went wrong. Try again.' });
    }
});

// Edit product form
app.get('/admin/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('admin/edit', { product, error: null });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update product
app.post('/admin/products/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;

        if (!name || !price || !category) {
            const product = await Product.findById(req.params.id);
            return res.render('admin/edit', { product, error: 'Name, price and category are required.' });
        }

        const update = { name, price, category, rating, stock, description };

        if (req.file) {
            update.image = '/uploads/' + req.file.filename;
        } else if (req.body.imageUrl) {
            update.image = req.body.imageUrl;
        }

        await Product.findByIdAndUpdate(req.params.id, update);
        res.redirect('/admin?success=Product+updated+successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete product
app.post('/admin/products/:id/delete', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin?success=Product+deleted+successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));