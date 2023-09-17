import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Main from '../Main';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import '../Category/Addcategory.css'; // Import your CSS file for styling
import Home from '../../pages/home/Home';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import '../Category/single.scss';
function AddCategory() {

  const [mainCategory, setMainCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategories2, setSubcategories2] = useState([]);
  // New category
  const [newCategory, setNewCategory] = useState('');

  // New subcategory
  const [newSubCategory, setNewSubCategory] = useState('');

  // State to track whether the dialog is open or not
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/getMainCategories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching Main categories:', error);
    }
  };

  const fetchSubcategories = async (parentCategory) => {
    try {
      const response = await fetch(`http://localhost:8080/getCategoriesByParent/${parentCategory}`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories2 = async (parentCategory, category) => {
    try {
      const response = await fetch(`http://localhost:8080/getSubcategories/${category}`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories2(data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    fetchSubcategories(categoryName);
    fetchSubcategories2(categoryName);
  };

  const handleSubcategorySelect = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
    // Fetch subcategories2 here based on selectedCategory and subcategoryName
    fetchSubcategories2(selectedCategory, subcategoryName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the mainCategory already exists in categories
    if (categories.some(category => category.name === mainCategory)) {
      setErrorMessage('Category already exists.');
      setSuccessMessage('');
      return;
    }

    try {
      // Send a POST request to your Express API to add the Main Category
      const response = await fetch('http://localhost:8080/addMainCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: mainCategory }),
      });

      if (response.ok) {
        // Clear the input field on success
        setMainCategory('');
        setErrorMessage('');
        setSuccessMessage('Category added successfully.');

        // Add the new category to the categories state
        setCategories([...categories, { name: mainCategory }]);

        // Fetch the updated list of categories and update the state
        await fetchCategories();
      } else {
        // Handle any errors here
        console.error('Failed to add Main Category');
        setErrorMessage('Failed to add category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while adding category.');
      setSuccessMessage('');
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (subcategories.some(subcategory => subcategory.name === newCategory)) {
      setErrorMessage('Category already exists.');
      setSuccessMessage('');
      return;
    }
    // Check if the newCategory name is empty
    if (!newCategory.trim()) {
      setErrorMessage('Category name cannot be empty.');
      setSuccessMessage('');
      return;
    }

    if (!selectedCategory) {
      setErrorMessage('Please select a parent category.');
      setSuccessMessage('');
      return;
    }

    try {
      // Send a POST request to your Express API to add a new subcategory
      const response = await fetch('http://localhost:8080/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory, parentCategory: selectedCategory }),
      });

      if (response.ok) {
        // Clear the input field on success
        setNewCategory('');
        setErrorMessage('');
        setSuccessMessage('Category added successfully.');

        // Add the new subcategory to the subcategories state
        setSubcategories([...subcategories, { name: newCategory }]);

        // Fetch the updated list of categories and update the state
        await fetchCategories();
      } else {
        // Handle any errors here
        console.error('Failed to add Category');
        setErrorMessage('Failed to add category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while adding category.');
      setSuccessMessage('');
    }
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();
    if (subcategories2.some(category => category.name === newSubCategory)) {
      setErrorMessage('Category already exists.');
      setSuccessMessage('');
      return;
    }
    if (!newSubCategory.trim()) {
      setErrorMessage('Subcategory name cannot be empty.');
      setSuccessMessage('');
      return;
    }

    if (!selectedCategory || !selectedSubcategory) {
      setErrorMessage('Please select both parent category and subcategory.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/subCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubCategory,
          parentCategory: selectedCategory,
          Category: selectedSubcategory,
        }),
      });

      if (response.ok) {
        setNewSubCategory('');
        setErrorMessage('');
        setSuccessMessage('Subcategory added successfully.');

        // Add the new subcategory to both subcategories and subcategories2 states
        setSubcategories([...subcategories, { name: newSubCategory }]);
        setSubcategories2([...subcategories2, { name: newSubCategory }]);

        // Fetch the updated list of categories and update the state
        await fetchCategories();
      } else {
        console.error('Failed to add Subcategory');
        setErrorMessage('Failed to add subcategory.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while adding subcategory.');
      setSuccessMessage('');
    }
  };

  // Function to open the dialog for editing Main category
  const openDialog = () => {
    setIsDialogOpen(true);

  };

  const openDialog1 = () => {
    setIsDialogOpen1(true);
  };

  const openDialog2 = () => {
    setIsDialogOpen2(true);
  };

  // Function to open the dialog for editing category

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const closeDialog1 = () => {
    setIsDialogOpen1(false);
  };
  const closeDialog2 = () => {
    setIsDialogOpen2(false);
  };

  // Function to handle category update
  const handleCategoryUpdate = async () => {
    try {
      // Send a PUT request to update the category
      const response = await fetch(`http://localhost:8080/MainCategory/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory }),
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category updated successfully.');

        // Fetch the updated list of categories and update the state
        await fetchCategories();
        closeDialog();
      } else {
        // Handle any errors here
        console.error('Failed to update Category');
        setErrorMessage('Failed to update category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while updating category.');
      setSuccessMessage('');
    }
  };

  const handleCategoryUpdate1 = async () => {
    try {
      // Send a PUT request to update the category
      const response = await fetch(`http://localhost:8080/updateCategory/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory, }),
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category updated successfully.');

        // Fetch the updated list of categories and update the state
        await fetchSubcategories();
        closeDialog1();
      } else {
        // Handle any errors here
        console.error('Failed to update Category');
        setErrorMessage('Failed to update category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while updating category.');
      setSuccessMessage('');
    }
  };

  const handleCategoryUpdate2 = async () => {
    try {
      // Send a PUT request to update the category
      const response = await fetch(`http://localhost:8080/subCategory/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory }),
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category updated successfully.');
        closeDialog2();
        // Fetch the updated list of categories and update the state


        // Fetch the updated list of categories and update the state
        await fetchSubcategories2();

      } else {
        // Handle any errors here
        console.error('Failed to update Category');
        setErrorMessage('Failed to update category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while updating category.');
      setSuccessMessage('');
    }
  };

  // Function to handle category deletion
  const handleCategoryDelete = async () => {
    try {
      if (!selectedCategory) {
        setErrorMessage('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`http://localhost:8080/MainCategory/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setCategories(updatedCategories);

        // Close the dialog
        closeDialog();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        setErrorMessage('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while deleting category.');
      setSuccessMessage('');
    }
  };

  // Function to handle category deletion
  const handleCategoryDelete2 = async () => {
    try {
      if (!selectedCategory) {
        setErrorMessage('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`http://localhost:8080/deleteCategory/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setCategories(updatedCategories);
        await fetchSubcategories();
        // Close the dialog
        closeDialog1();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        setErrorMessage('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while deleting category.');
      setSuccessMessage('');
    }
  };

  // Function to handle category deletion
  const handleCategoryDelete3 = async () => {
    try {
      if (!selectedCategory) {
        setErrorMessage('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`http://localhost:8080/subCategory2/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setSubcategories2(updatedCategories);

        // Close the dialog
        closeDialog2();
        await fetchSubcategories2();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        setErrorMessage('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while deleting category.');
      setSuccessMessage('');
    }
  };



  return (
    <>

      <div className='single'>
        <Sidebar />
        <div class='singleContainer'>
          <Navbar />
<div className='main-container'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                placeholder="Add Main Category"
                variant="outlined"
                size="small"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                InputProps={{
                  style: {
                    color: 'green',
                  },
                }}
              />
              <IconButton color="primary" onClick={handleSubmit}>
                <PublishRoundedIcon />
              </IconButton>


              <br /><br /><br />
              {categories.map((category, index) => (
                <div key={index}>
                  <Button
                    variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                    style={{
                      marginBottom: '10px',
                      width: '240px',
                      backgroundColor: selectedCategory === category.name ? 'orange' : '',
                    }}
                    size="small"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    {category.name}
                  </Button>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setCategoryId(category._id); // Set the category ID
                      openDialog(); // Open the dialog when the Edit button is clicked
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              ))}


            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                placeholder="Add Category"
                variant="outlined"
                size="small"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                InputProps={{
                  style: {
                    color: 'green',
                  },
                }}
              />
              <IconButton onClick={handleSubmit2} color='primary'>
                <PublishRoundedIcon />
              </IconButton>
              <br /><br /><br />
              {subcategories.map((subcategory, index) => (
                <div key={index}>
                  <Button
                    variant={selectedSubcategory === subcategory.name ? 'contained' : 'outlined'}
                    style={{
                      marginBottom: '10px',
                      width: '240px',
                      backgroundColor: selectedSubcategory === subcategory.name ? 'orange' : '',
                    }}
                    size="small"
                    onClick={() => handleSubcategorySelect(subcategory.name)}
                  >
                    {subcategory.name}
                  </Button>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedCategory(subcategory.name);
                      setCategoryId(subcategory._id); // Set the category ID
                      openDialog1();// Open the dialog when the Edit button is clicked
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                placeholder="Add Subcategory"
                variant="outlined"
                size="small"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                InputProps={{
                  style: {
                    color: 'green',
                  },
                }}
              />
              <IconButton onClick={handleSubmit3} color='primary'>
                <PublishRoundedIcon />
              </IconButton>
              <br /><br /><br />


              {subcategories2.map((subcategory, index) => (
                <div key={index}>
                  <Button
                    variant={selectedSubcategory === subcategory.name ? 'contained' : 'outlined'}
                    style={{
                      marginBottom: '10px',
                      width: '240px',
                      backgroundColor: selectedSubcategory === subcategory.name ? 'green' : '',
                    }}
                    size="small"
                  >
                    {subcategory.name}
                  </Button>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedCategory(subcategory.name);
                      setCategoryId(subcategory._id); // Set the category ID
                      openDialog2();// Open the dialog when the Edit button is clicked
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              ))}
              {errorMessage && (
                <div style={{ color: 'red', paddingTop: '10px' }}>{errorMessage}</div>
              )}
              {successMessage && (
                <div style={{ color: 'green', paddingTop: '10px' }}>{successMessage}</div>
              )}
            </Grid>
          </Grid>
          {/* Create a Dialog for editing and deleting Main Category */}
          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogContent>
              {/* Add fields for editing category */}
              <TextField

                variant="outlined"
                size="small"
                fullWidth
                // Bind the input field to a state variable for editing
                value={selectedCategory || selectedSubcategory}
                // Add an onChange handler to update the state variable when editing
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCategoryUpdate} color="primary">
                Update
              </Button>
              <Button onClick={handleCategoryDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={isDialogOpen1} onClose={closeDialog1}>
            <DialogTitle>Edit Main Category</DialogTitle>
            <DialogContent>
              {/* Add fields for editing category */}
              <TextField

                variant="outlined"
                size="small"
                fullWidth
                // Bind the input field to a state variable for editing
                value={selectedCategory || selectedSubcategory}
                // Add an onChange handler to update the state variable when editing
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog1} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCategoryUpdate1} color="primary">
                Update
              </Button>
              <Button onClick={handleCategoryDelete2} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={isDialogOpen2} onClose={closeDialog2}>
            <DialogTitle>Edit SubCategory</DialogTitle>
            <DialogContent >
              {/* Add fields for editing category */}
              <TextField

                variant="outlined"
                size="small"
                fullWidth
                // Bind the input field to a state variable for editing
                value={selectedCategory || selectedSubcategory}
                // Add an onChange handler to update the state variable when editing
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog2} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCategoryUpdate2} color="primary">
                Update
              </Button>
              <Button onClick={handleCategoryDelete3} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCategory;
