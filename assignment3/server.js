const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/nishat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Product Schema ───────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    category: { type: String, required: true },
    rating:   { type: Number, min: 1, max: 5 },
    stock:    { type: Number, default: 0 },
    image:    { type: String },
    badge:    { type: String },          // e.g. "50% OFF", "NEW", etc.
    pieces:   { type: String },          // "1-Piece", "2-Piece", "3-Piece"
});

const Product = mongoose.model('Product', productSchema);

// ─── Seed Data (runs once if collection is empty) ─────────────────────────────
// NOTE: If you already seeded before, run this in mongo shell to re-seed:
//   use nishat
//   db.products.drop()
// Then restart the server.
async function seedDB() {
    const count = await Product.countDocuments();
    if (count > 0) return;

    const products = [
        // Unstitched
        { name: 'Printed Lawn 3-Piece', price: 3500, category: 'Unstitched', rating: 4.5, stock: 30, pieces: '3-Piece', badge: '50% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/1_513b5b20-b4f8-4ef4-814f-2568e89efca9.jpg?v=1770197698' },
        { name: 'Embroidered Chiffon 3-Piece', price: 8500, category: 'Unstitched', rating: 4.8, stock: 15, pieces: '3-Piece', badge: 'NEW', image: 'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },
        { name: 'Digital Print 2-Piece', price: 2800, category: 'Unstitched', rating: 4.2, stock: 40, pieces: '2-Piece', badge: '40% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },
        { name: 'Summer Lawn 1-Piece', price: 1500, category: 'Unstitched', rating: 4.0, stock: 60, pieces: '1-Piece', image: 'https://nishatlinenfps.com/cdn/shop/files/1_cffdc8ed-338d-4a99-a042-c69e04012ed5.jpg' },
        { name: 'Khaddar Winter 3-Piece', price: 4200, category: 'Unstitched', rating: 4.6, stock: 22, pieces: '3-Piece', badge: 'WINTER', image: 'https://nishatlinenfps.com/cdn/shop/files/6_358ae107-3bb4-4454-9c8d-6fbf91bb0d26.jpg' },

        // Ready to Wear
        { name: 'Embroidered Kurti', price: 5200, category: 'Ready to Wear', rating: 4.7, stock: 18, badge: 'BEST SELLER', image: 'https://nishatlinenfps.com/cdn/shop/files/2_piece.jpg' },
        { name: 'Printed Shirt (RTW)', price: 3100, category: 'Ready to Wear', rating: 4.1, stock: 35, image: 'https://nishatlinenfps.com/cdn/shop/files/3_pc.jpg' },
        { name: 'Casual Lawn Shirt', price: 2400, category: 'Ready to Wear', rating: 3.9, stock: 50, badge: '40% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/1_0fa93865-717e-4331-aeab-f27239b429dd.jpg' },
        { name: 'Formal Embroidered Suit', price: 9800, category: 'Ready to Wear', rating: 4.9, stock: 8, badge: 'LUXURY', image: 'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },
        { name: 'Summer Cotton Shirt', price: 1900, category: 'Ready to Wear', rating: 4.3, stock: 45, image: 'https://nishatlinenfps.com/cdn/shop/files/1_513b5b20-b4f8-4ef4-814f-2568e89efca9.jpg?v=1770197698' },

        // Luxury
        { name: 'Hand-Embroidered Chiffon', price: 18000, category: 'Luxury', rating: 5.0, stock: 5, badge: 'LUXURY', image: 'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },
        { name: 'Pure Silk 3-Piece', price: 22000, category: 'Luxury', rating: 4.9, stock: 4, badge: 'PREMIUM', image: 'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },
        { name: 'Luxury Lawn Formals', price: 14500, category: 'Luxury', rating: 4.8, stock: 10, image: 'https://nishatlinenfps.com/cdn/shop/files/3_pc.jpg' },
        { name: 'Bridal Embroidered Set', price: 35000, category: 'Luxury', rating: 5.0, stock: 3, badge: 'EXCLUSIVE', image: 'https://nishatlinenfps.com/cdn/shop/files/1_cffdc8ed-338d-4a99-a042-c69e04012ed5.jpg' },

        // Men
        { name: 'Men Kameez Shalwar', price: 3800, category: 'Men', rating: 4.4, stock: 28, image: 'https://nishatlinenfps.com/cdn/shop/files/MEN2.jpg?v=1770197779' },
        { name: 'Men Printed Kurta', price: 2700, category: 'Men', rating: 4.2, stock: 33, badge: '40% OFF', image: 'https://tse3.mm.bing.net/th/id/OIP.DSr0gI6rsFXOfontGKGlcQHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3' },
        { name: 'Men Linen Formal Shirt', price: 4500, category: 'Men', rating: 4.6, stock: 20, image: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/27610118/2024/2/14/4f018714-dd01-4ff3-bcfa-e8686f21c0d71707915574880AnoukMenGeometricPrintedPatchworkHandloomKurta1.jpg' },
        { name: 'Men Embroidered Sherwani', price: 12000, category: 'Men', rating: 4.8, stock: 7, badge: 'NEW', image: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/18740334/2022/6/15/42636d2c-1197-4567-af63-7943b741ff2e1655284550423KISAHMENNavyBlueKURTASHERWANISET1.jpg' },

        // Loose Fabric
        { name: 'Pure Cotton Fabric (per meter)', price: 850, category: 'Loose Fabric', rating: 4.0, stock: 100, image: 'https://nishatlinenfps.com/cdn/shop/files/2_7b284221-d11d-4f60-b6d4-231509e1e04d.jpg?v=1770197013&width=1500' },
        { name: 'Lawn Fabric (per meter)', price: 650, category: 'Loose Fabric', rating: 3.8, stock: 150, badge: '50% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/1_0fa93865-717e-4331-aeab-f27239b429dd.jpg' },
        { name: 'Khaddar Fabric (per meter)', price: 750, category: 'Loose Fabric', rating: 4.1, stock: 80, image: 'https://nishatlinenfps.com/cdn/shop/files/6_358ae107-3bb4-4454-9c8d-6fbf91bb0d26.jpg' },

        // Lowers
        { name: 'Cotton Trousers', price: 1200, category: 'Lowers', rating: 4.0, stock: 55, image: 'https://nishatlinenfps.com/cdn/shop/files/2_piece.jpg' },
        { name: 'Printed Trousers', price: 1500, category: 'Lowers', rating: 4.2, stock: 42, badge: '40% OFF', image: 'https://nishatlinenfps.com/cdn/shop/files/3_pc.jpg' },
        { name: 'Shalwar (plain)', price: 900, category: 'Lowers', rating: 3.7, stock: 70, image: 'https://nishatlinenfps.com/cdn/shop/files/2_piece.jpg' },

        // Fashion
        { name: 'Floral Printed Scarf', price: 800, category: 'Fashion', rating: 4.3, stock: 60, badge: 'NEW', image: 'https://nishatlinenfps.com/cdn/shop/files/1_0fa93865-717e-4331-aeab-f27239b429dd.jpg' },
        { name: 'Embroidered Dupatta', price: 2200, category: 'Fashion', rating: 4.5, stock: 35, image: 'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },
        { name: 'Silk Clutch Bag', price: 3500, category: 'Fashion', rating: 4.6, stock: 20, badge: 'TRENDING', image: 'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },
    ];

    await Product.insertMany(products);
    console.log('✅ Database seeded with', products.length, 'products');
}
seedDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page      = parseInt(req.query.page)     || 1;
        const search    = req.query.search             || '';
        const category  = req.query.category           || '';
        const minPrice  = parseFloat(req.query.minPrice) || 0;
        const maxPrice  = parseFloat(req.query.maxPrice) || 999999;
        const sort      = req.query.sort               || 'default';
        const rating    = parseFloat(req.query.rating) || 0;

        // Build filter query
        const filter = {};
        if (search)   filter.name     = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice || maxPrice < 999999) filter.price = { $gte: minPrice, $lte: maxPrice };
        if (rating)   filter.rating   = { $gte: rating };

        // Sort options
        const sortOptions = {
            default:     {},
            'price-asc': { price: 1 },
            'price-desc':{ price: -1 },
            'rating':    { rating: -1 },
            'newest':    { _id: -1 },
        };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / LIMIT);
        const products      = await Product.find(filter)
                                           .sort(sortOptions[sort] || {})
                                           .skip((page - 1) * LIMIT)
                                           .limit(LIMIT);

        // All categories for filter panel
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

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});