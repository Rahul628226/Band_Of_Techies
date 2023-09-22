const express = require('express');
const router = express.Router();
const Product = require('../../models/AddProduct/AddProduct'); // Import the Product model
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Image/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); 
    cb(null, uniqueSuffix + fileExtension); 
  },
});
const upload = multer({ storage: storage });

// Define your route for adding product details
// Define your route for adding product details
router.post('/addProduct', upload.array('photos', 5), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename); // Get an array of uploaded image filenames

    // Create a new Product document
    const newProduct = new Product({
      title: req.query.title, // Get the product title from the query parameter
      maincategory: req.query.maincategory,
      category: req.query.category,
      subcategory: req.query.subcategory,
      stock: req.query.stock,
      photos: images,
      FeatureTag: req.query.FeatureTag, // Get the FeatureTag array from the query parameter
    });

    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
