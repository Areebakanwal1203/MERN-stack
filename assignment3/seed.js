const mongoose = require('mongoose');
const Product  = require('./models/Product');

const MONGO_URI = 'mongodb://127.0.0.1:27017/nishat_outlet';

const products = [
  // ── UNSTITCHED ──
  { name:'Floral Lawn 3-Piece',        price:2850,  category:'Unstitched',    rating:5,  stock:40, description:'Elegant floral printed lawn suit with chiffon dupatta.',
    image:'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },

  { name:'Embroidered Cambric Suit',   price:3200,  category:'Unstitched',    rating:4,  stock:25, description:'Fine cambric fabric with intricate thread embroidery.',
    image:'/images/unstiched.png' },

  { name:'Digital Print Lawn',         price:1950,  category:'Unstitched',    rating:4,  stock:60, description:'Vibrant digital print on premium lawn fabric.',
    image:'https://nishatlinenfps.com/cdn/shop/files/1_513b5b20-b4f8-4ef4-814f-2568e89efca9.jpg?v=1770197698' },

  { name:'Khaddar Winter 3-Piece',     price:3500,  category:'Unstitched',    rating:5,  stock:18, description:'Warm khaddar fabric perfect for cold winters.',
    image:'https://nishatlinenfps.com/cdn/shop/files/6_358ae107-3bb4-4454-9c8d-6fbf91bb0d26.jpg' },

  { name:'Cotton Printed 2-Piece',     price:1750,  category:'Unstitched',    rating:3,  stock:35, description:'Soft cotton with traditional printed motifs.',
    image:'https://nishatlinenfps.com/cdn/shop/files/1_cffdc8ed-338d-4a99-a042-c69e04012ed5.jpg' },

  // ── READY TO WEAR ──
  { name:'Stitched Lawn Kurti',        price:3100,  category:'Ready To Wear', rating:5,  stock:30, description:'Ready-to-wear lawn kurti with side slits.',
    image:'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },

  { name:'Embroidered Chiffon Suit',   price:5500,  category:'Ready To Wear', rating:5,  stock:12, description:'Premium chiffon 3-piece with heavy embroidery.',
    image:'/images/RTWear.png' },

  { name:'Casual Printed Shirt',       price:1800,  category:'Ready To Wear', rating:4,  stock:50, description:'Comfortable everyday printed casual shirt.',
    image:'https://nishatlinenfps.com/cdn/shop/files/2_piece.jpg' },

  { name:'Formal Lawn 3-Piece',        price:4200,  category:'Ready To Wear', rating:4,  stock:20, description:'Elegant formal suit with embellished neckline.',
    image:'https://nishatlinenfps.com/cdn/shop/files/1_0fa93865-717e-4331-aeab-f27239b429dd.jpg' },

  // ── LUXURY ──
  { name:'Hand-Embroidered Organza',   price:18500, category:'Luxury',        rating:5,  stock:5,  description:'Exquisite organza with hand-done zari embroidery.',
    image:'/images/Luxury.png' },

  { name:'Velvet Bridal Suit',         price:25000, category:'Luxury',        rating:5,  stock:3,  description:'Rich velvet fabric with gold thread detailing.',
    image:'https://nishatlinenfps.com/cdn/shop/files/3_pc.jpg' },

  { name:'Raw Silk Ensemble',          price:14000, category:'Luxury',        rating:4,  stock:8,  description:'Lustrous raw silk with minimal embroidery.',
    image:'https://nishatlinenfps.com/cdn/shop/files/2_7b284221-d11d-4f60-b6d4-231509e1e04d.jpg?v=1770197013&width=600' },

  { name:'Net Embroidered 3-Piece',    price:12500, category:'Luxury',        rating:5,  stock:6,  description:'Delicate net fabric with full embroidery work.',
    image:'/images/50off.png' },

  // ── LOOSE FABRIC ──
  { name:'Cotton Dobby Fabric/meter',  price:750,   category:'Loose Fabric',  rating:4,  stock:100,description:'Dobby weave cotton sold per meter.',
    image:'/images/loosefabric.png' },

  { name:'Lawn Printed Fabric/meter',  price:550,   category:'Loose Fabric',  rating:3,  stock:200,description:'Classic lawn fabric with floral prints.',
    image:'/images/40off.png' },

  { name:'Chiffon Plain Fabric/meter', price:900,   category:'Loose Fabric',  rating:4,  stock:80, description:'Lightweight plain chiffon, available per meter.',
    image:'/images/40off2.png' },

  // ── MEN ──
  { name:'Men Lawn Kurta',             price:2200,  category:'Men',           rating:4,  stock:45, description:'Classic lawn kurta for men, perfect for summer.',
    image:'https://nishatlinenfps.com/cdn/shop/files/MEN2.jpg?v=1770197779' },

  { name:'Men Khaddar Shalwar Suit',   price:3800,  category:'Men',           rating:5,  stock:22, description:'Traditional khaddar shalwar suit for winter.',
    image:'https://nishatlinenfps.com/cdn/shop/files/1_513b5b20-b4f8-4ef4-814f-2568e89efca9.jpg?v=1770197698' },

  { name:'Men Printed Kurta',          price:1900,  category:'Men',           rating:3,  stock:60, description:'Printed casual kurta for everyday wear.',
    image:'https://nishatlinenfps.com/cdn/shop/files/embroidered-01.jpg?v=1770197717' },

  { name:'Men Waistcoat Set',          price:4500,  category:'Men',           rating:5,  stock:15, description:'Ethnic waistcoat and kurta set for formal occasions.',
    image:'https://nishatlinenfps.com/cdn/shop/files/MEN2.jpg?v=1770197779' },

  // ── LOWERS ──
  { name:'Tulip Shalwar',              price:850,   category:'Lowers',        rating:4,  stock:70, description:'Comfortable tulip-style shalwar in assorted colours.',
    image:'/images/lowers.png' },

  { name:'Trouser Plain',              price:700,   category:'Lowers',        rating:3,  stock:90, description:'Simple plain trouser, easy to pair with any shirt.',
    image:'https://nishatlinenfps.com/cdn/shop/files/3_pc.jpg' },

  { name:'Palazzo Pants',              price:1100,  category:'Lowers',        rating:4,  stock:40, description:'Wide-leg palazzo pants in lawn fabric.',
    image:'https://nishatlinenfps.com/cdn/shop/files/2_piece.jpg' },

  // ── FASHION ──
  { name:'Printed Silk Scarf',         price:650,   category:'Fashion',       rating:4,  stock:55, description:'Lightweight printed scarf, great for all seasons.',
    image:'https://nishatlinenfps.com/cdn/shop/files/1_0fa93865-717e-4331-aeab-f27239b429dd.jpg' },

  { name:'Embroidered Tote Bag',       price:1500,  category:'Fashion',       rating:5,  stock:20, description:'Stylish embroidered tote bag for everyday use.',
    image:'https://nishatlinenfps.com/cdn/shop/files/6_358ae107-3bb4-4454-9c8d-6fbf91bb0d26.jpg' },

  { name:'Cotton Dupatta',             price:950,   category:'Fashion',       rating:3,  stock:65, description:'Soft cotton dupatta with lace border detailing.',
    image:'https://nishatlinenfps.com/cdn/shop/files/2_5f1e2a32-2d9b-4cfc-b7ff-36ef2df1d362.jpg?v=1770197743' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    console.log('Cleared old products');
    await Product.insertMany(products);
    console.log('Seeded ' + products.length + ' products!');
    await mongoose.disconnect();
    console.log('Done. Now run: node server.js');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}
seed();