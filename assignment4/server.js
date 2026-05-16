const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('./models/Product');

const app = express();

// ── App Config ─────────────────────────────
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ── MongoDB ────────────────────────────────
mongoose.connect('mongodb://localhost:27017/nishat')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// ── Multer Setup ───────────────────────────
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ── PUBLIC ROUTES ─────────────────────────
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page = parseInt(req.query.page) || 1;

        const products = await Product.find()
            .skip((page - 1) * LIMIT)
            .limit(LIMIT);

        res.render('products', { products });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// ── ADMIN ROUTES ──────────────────────────

// Dashboard
app.get('/admin', async (req, res) => {
    const products = await Product.find();
    const totalStock = products.reduce((a, b) => a + b.stock, 0);
    const categories = await Product.distinct('category');

    res.render('admin/dashboard', {
        products,
        totalStock,
        categories,
        success: null
    });
});

// Add product page
app.get('/admin/products/new', (req, res) => {
    res.render('admin/new', { error: null });
});

// Create product
app.post('/admin/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;

        const image = req.file ? '/uploads/' + req.file.filename : '';

        await Product.create({ name, price, category, stock, image });

        res.redirect('/admin');
    } catch (err) {
        res.status(500).send('Error');
    }
});

// Edit page
app.get('/admin/products/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/edit', { product });
});

// Update product
app.post('/admin/products/:id', upload.single('image'), async (req, res) => {
    const update = req.body;

    if (req.file) {
        update.image = '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, update);
    res.redirect('/admin');
});

// Delete product
app.post('/admin/products/:id/delete', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

// ── SERVER START ───────────────────────────
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});