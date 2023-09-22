import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../ProductAdd/AddProduct.css";
import InputAdornment from '@mui/material/InputAdornment';
const ProductAdd = () => {
    const [plantcareNames, setPlantcareNames] = useState([]);
    const [selectedPlantcare, setSelectedPlantcare] = useState('');
    const [plantcareData, setPlantcareData] = useState({
        name: '',
        description: '',
        image: '',
    });
    const [featureNames, setFeatureNames] = useState([]);
    const [featurenamesset, setFeatureNamesSet] = useState([]);
    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [newFeature, setNewFeature] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Make a GET request to fetch the PlantCare names
        axios.get('http://localhost:8080/getPlantcareNames')
            .then((response) => {
                // Set the received names in the state
                setPlantcareNames(response.data);
            })
            .catch((error) => {
                console.error('Error fetching PlantCare names:', error);
            });

        // Call the function to fetch feature names initially
        fetchFeatureNames();
        //product Maincategory

        fetchCategories();
    }, []);

    const [selectedFeatures, setSelectedFeatures] = useState([]);

    const handleFeatureChange = (selectedOptions) => {
        setSelectedFeatures(selectedOptions);
    };


    // Function to fetch feature names
    const fetchFeatureNames = () => {
        axios.get('http://localhost:8080/getFeatures')
            .then((response) => {
                // Filter out duplicates and null values
                const uniqueFeatureNames = response.data
                    .filter((name, index, self) => self.indexOf(name) === index && name !== null);

                // Update the Set of feature names
                setFeatureNamesSet(new Set(uniqueFeatureNames));

                // Convert the Set to an array for rendering
                setFeatureNames([...uniqueFeatureNames]);
            })
            .catch((error) => {
                console.error('Error fetching feature names:', error);
            });
    };

    //plant care
    const handleDropdownChange = (event) => {
        const selectedPlantcareName = event.target.value;
        setSelectedPlantcare(selectedPlantcareName);

        // Make a GET request to fetch PlantCare data by name
        axios.get(`http://localhost:8080/getPlantcare/${selectedPlantcareName}`)
            .then((response) => {
                // Set the received PlantCare data in the state
                setPlantcareData(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching PlantCare data for ${selectedPlantcareName}:`, error);
            });
    };

    //feature tag
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmit = () => {
        // Check if the new feature already exists in the list
        if (featureNames.some(feature => feature.name === newFeature)) {
            setMessage('Feature already exists.');

            return;
        }

        const dataToSend = {
            name: newFeature,
        };

        // Send a POST request to your server endpoint
        axios.post('http://localhost:8080/addFeature', dataToSend)
            .then((response) => {

                setMessage('Feature added successfully');
                fetchFeatureNames();


                handleCloseDialog();
            })
            .catch((error) => {

                setMessage('Error adding feature: ' + error.message);
            });
    };

    //*************************************************************************************************** */
    //Form FOR ADD PRODUCT

    //FILE UPLOAD


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [productTitle, setProductTitle] = useState('');

    const onDrop = (acceptedFiles) => {
        // Handle the dropped files here
        setSelectedFiles([...selectedFiles, ...acceptedFiles]);
    };

    const handleFileInputChange = (e) => {
        // Handle file input change (browsing method)
        const newFiles = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...newFiles]);
    };

    const removeFile = (file) => {
        // Remove a file from the selectedFiles array
        const updatedFiles = selectedFiles.filter((f) => f !== file);
        setSelectedFiles(updatedFiles);
    };

    const uploadFiles = async () => {
        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('photos', file);
            });
            formData.append('FeatureTag', selectedTags.map(tag => tag.value));
          

            // Send a POST request to your server endpoint to upload files
            await axios.post('http://localhost:8080/addProduct', formData, {
                params: {
                    title: productTitle, maincategory: selectedCategory, category: selectedsubCategory,
                    subcategory: selectedsubCategory2, stock: productStock
                },
            });

            // Reset selected files and show success message
            setSelectedFiles([]);
            setProductTitle('');
            setSelectedCategory('');
            setSelectedsubCategory('');
            setProductStock('');
            setSelectedTags([]);
            setMessage('Files uploaded successfully');
        } catch (error) {
            // Handle any errors and show an error message
            setMessage('Error uploading files: ' + error.message);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*', // You can specify the accepted file types here
    });


    //*************************************************************************************************** */

    {/*****************************************PRODUCT CATEGORY***********************************************************/ }
    const [mainCategory, setMainCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedsubCategory, setSelectedsubCategory] = useState(null);
    const [selectedsubCategory2, setSelectedsubCategory2] = useState(null);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        fetchSubcategories(categoryName);
        fetchSubcategories2(categoryName);

    }

    const handlesubcategorySelect = (categoryName) => {

        fetchSubcategories2(categoryName);
        setSelectedsubCategory(categoryName)
    }

    const handlesubcategorySelect2 = (categoryName) => {

        // fetchSubcategories2(categoryName);
        setSelectedsubCategory2(categoryName)
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/getMainCategories');
            if (response.ok) {
                const data = await response.json();
                setMainCategory(data);
            }
        } catch (error) {
            console.error('Error fetching Main categories:', error);
        }
    };

    const fetchSubcategories = async (selectedCategory) => {
        try {
            const response = await fetch(`http://localhost:8080/getCategoriesByParent/${selectedCategory}`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories2 = async (selectedsubCategory) => {
        try {
            const response = await fetch(`http://localhost:8080/getSubcategories/${selectedsubCategory}`);
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };
    {/**********************************Product STOCK and FeatureTag**************************************** */ }

    const [productStock, setProductStock] = useState('');

    const [selectedTags, setSelectedTags] = useState([]);
    const handleTagInputChange = (e) => {
        // Handle file input change (browsing method)
        const newFiles = Array.from(e.target.value);
        setSelectedTags([...selectedTags, ...newFiles]);
    };


    {/*****************************************PRODUCT CATEGORY***********************************************************/ }

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <div style={{ paddingTop: '20px', paddingLeft: '30px', paddingLeft: '30px' }}>
                    <Grid container spacing={2} style={{ paddingTop: '70px', paddingLeft: '50px', overflowY: 'auto', maxHeight: '630px' }}>
                        {/* First Column **************************************************************************** */}
                        <Grid item xs={12} sm={6} md={8} >




                            <div className="formFirst">
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Product"
                                    value={productTitle}
                                    onChange={(e) => setProductTitle(e.target.value)}

                                    Small
                                    InputProps={{
                                        style: {
                                            width: '550px',
                                            borderColor: 'blue',
                                            backgroundColor: 'white' // Change the borderColor to black
                                        },
                                    }}
                                />

                                {/* <h2>File Upload</h2> */}

                                {/* <h3>Drag and Drop or Browse to Upload Files</h3> */}

                                <div className="formSecond">
                                    {/* <h4>Selected Files</h4> */}
                                    <Grid container spacing={2} className="image-grid" sx={{ overflowX: 'auto' }}>
                                        {selectedFiles.map((file, index) => (
                                            <Grid item key={index} xs={4}>
                                                <div className="image-container">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="uploaded-image"
                                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        onClick={() => removeFile(file)}
                                                        className="delete-icon"
                                                    />
                                                </div>
                                            </Grid>
                                        ))}
                                        <div className="formThird">
                                            <div {...getRootProps()} className="dropzone" style={{ border: '.2px solid black', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <input {...getInputProps()} />
                                                <FontAwesomeIcon icon={faUpload} size="2x" />
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none' }}
                                                id="fileInput"
                                            />
                                        </div>

                                    </Grid>
                                </div>

                            </div>


                            {/* First Column  file upload **************************************************************************** */}


                            {/*************************************************Product Category******************************************* */}

                            <div className='formFour'>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    helperText="Please select Main Category"
                                    style={{ paddingRight: '15px' }}
                                >
                                    {mainCategory.map((option) => (
                                        <MenuItem
                                            key={option.name}
                                            value={option.name}
                                            onClick={() => handleCategorySelect(option.name)} // Corrected placement of onClick event
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    helperText="Please select Category"
                                    style={{ paddingRight: '22px' }}
                                >
                                    {categories.map((option) => (
                                        <MenuItem key={option.name} value={option.name}
                                            onClick={() => handlesubcategorySelect(option.name)} // Corrected placement of onClick event
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    helperText="Please select Category"
                                    style={{ paddingRight: '80px' }}
                                >
                                    {subcategories.map((option) => (
                                        <MenuItem key={option.name} value={option.name}
                                            onClick={() => handlesubcategorySelect2(option.name)}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>


                                {/*************************************************Product Category******************************************* */}

                                {/*****************************************Stock AND Price********************************************************************* */}
                                <div style={{ paddingTop: '30px' }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Stock"
                                        value={productStock}
                                        onChange={(e) => setProductStock(e.target.value)}
                                        InputProps={{
                                            style: {
                                                borderColor: 'blue',
                                                backgroundColor: 'white',
                                            },
                                            // endAdornment: (
                                            //     <InputAdornment position="end">
                                            //         Stock: {productStock} {/* Display the stock count here */}
                                            //     </InputAdornment>
                                            // ),
                                        }}
                                    />
                                </div>


                            </div>

                            <button className="upload-button" onClick={uploadFiles}>
                                Upload Files
                            </button> <p className="message">{message}</p>

                            {/*************************************************Product Category******************************************* */}
                        </Grid>

                        {/* Second Column (Empty column in this example)
                    <Grid item xs={12} sm={6} md={2}>
                        <h1>second</h1>
                    </Grid> */}

                        {/* Third Column */}
                        <Grid item xs={12} sm={12} md={3}>
                            {/* Add a wrapper div for the content and apply CSS styles */}
                            <div style={{ overflowY: 'auto', maxHeight: '500px', border: '1px solid #ccc', padding: '20px', height: '700px' }}>
                                {/* Content for the third column */}
                                <h1>Plantcare</h1>
                                <div>
                                    <label>Select PlantCare:</label>
                                    <select value={selectedPlantcare} onChange={handleDropdownChange}>
                                        <option value="">Select an option</option>
                                        {plantcareNames.map((name, index) => (
                                            <option key={index} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* Display selected PlantCare details */}
                                {selectedPlantcare && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={plantcareData.image}
                                            alt="plantcare"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginRight: '20px' }}
                                        />
                                        <div>
                                            <h2>{plantcareData.name}</h2>
                                            <textarea
                                                id="description"
                                                value={plantcareData.description}
                                                style={{ width: '100%', height: '100px', resize: 'both' }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                )}

                                <hr />

                                {/* Features Section */}
                                <h2>Features</h2>

                                <Select
                                    isMulti
                                    options={featureNames.map((name) => ({ value: name.name, label: name.name }))}
                                    value={selectedFeatures}
                                    onChange={(selectedOptions) => {
                                        handleFeatureChange(selectedOptions);
                                        handleTagInputChange(selectedFeatures); // You can pass selectedOptions or any other data you need
                                    }}
                                />

                                <Button onClick={handleOpenDialog}>Add</Button>
                                <p>{message}</p> {/* Display the message here */}
                                <hr />
                                {/* Plot Section */}
                                <h2>Pot</h2>
                                <p>Pot content goes here...</p>
                                <hr />

                                {/* Length Section */}
                                <h2>Length</h2>
                                <p>Length content goes here...</p>
                                <hr />

                                {/* Dimension Section */}
                                <h2>Dimension</h2>
                                <p>Dimension content goes here...</p>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            {/* Add Feature Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Feature"
                        variant="outlined"
                        fullWidth
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductAdd;
