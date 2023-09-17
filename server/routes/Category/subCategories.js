// routes/subcategories.js

const express = require('express');
const router = express.Router();
const SubCategory = require('../../models/Categories/subCategories'); // Import the SubCategory model

// Route to create a new subcategory
router.post('/subCategory', async (req, res) => {
  try {
    const { name, Category, parentCategory } = req.body;

    // Create a new subcategory
    const subcategory = new SubCategory({
      name,
      Category,
      parentCategory,
    });

    // Save the subcategory to the database
    await subcategory.save();

    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Error creating subcategory' });
  }
});

// Route to update a subcategory
router.put('/subCategory/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    // Find the subcategory by ID and update its name
    await SubCategory.findByIdAndUpdate(id, { name });

    res.json({ message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Error updating subcategory' });
  }
});

// Route to delete a subcategory
router.delete('/subCategory2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Find the subcategory by ID and delete it
    await SubCategory.findByIdAndDelete(id);

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Error deleting subcategory' });
  }
});

// Route for fetching subcategories by parentCategory and Category
router.get('/getSubcategories/:Category', async (req, res) => {
  try {
   // const parentCategory = req.params.parentCategory;
    const Category = req.params.Category;

    // Query the database for subcategories that match both parentCategory and Category
    const subcategories = await SubCategory.find({Category });

    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories.' });
  }
});

module.exports = router;
