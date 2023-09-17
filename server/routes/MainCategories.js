const express = require('express');
const router = express.Router();
const MainCategory = require('../models/MainCategories'); // Corrected the import

// Route to add a new MainCategory
router.post('/addMainCategory', async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new MainCategory
    const mainCategory = new MainCategory({ name }); // Renamed the variable

    // Save the MainCategory to the database
    await mainCategory.save();

    res.status(201).json(mainCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update an existing MainCategory
router.put('/MainCategory/:MainCategoryId', async (req, res) => { // Corrected the route path
  try {
    const { MainCategoryId } = req.params;
    const { name } = req.body;

    // Find the MainCategory by ID and update its name
    const mainCategory = await MainCategory.findByIdAndUpdate(MainCategoryId, { name }, { new: true });

    if (!mainCategory) {
      return res.status(404).json({ error: 'MainCategory not found' });
    }

    res.json(mainCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all MainCategories
router.get('/getMainCategories', async (req, res) => { // Renamed the route
  try {
    // Retrieve all MainCategories from the database
    const mainCategories = await MainCategory.find();

    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a MainCategory
router.delete('/MainCategory/:MainCategoryId', async (req, res) => {
  try {
    const { MainCategoryId } = req.params;

    // Find the MainCategory by ID and remove it
    const deletedMainCategory = await MainCategory.findByIdAndRemove(MainCategoryId);

    if (!deletedMainCategory) {
      return res.status(404).json({ error: 'MainCategory not found' });
    }

    res.json({ message: 'MainCategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
