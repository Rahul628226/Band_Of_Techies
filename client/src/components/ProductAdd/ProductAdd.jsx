import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import Select from 'react-select';
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

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />

                <Grid container spacing={2} style={{ paddingTop: '70px', paddingLeft: '50px' }}>
                    {/* First Column */}
                    <Grid item xs={12} sm={6} md={6}>
                        <h1>first</h1>
                    </Grid>

                    {/* Second Column (Empty column in this example) */}
                    <Grid item xs={12} sm={6} md={2}>
                        <h1>second</h1>
                    </Grid>

                    {/* Third Column */}
                    <Grid item xs={12} sm={12} md={4}>
                        {/* Add a wrapper div for the content and apply CSS styles */}
                        <div style={{ overflowY: 'auto', maxHeight: '500px', border: '1px solid #ccc', padding: '20px' }}>
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
                            <hr />

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
                                isMulti  // Enable multi-select
                                options={featureNames.map((name) => ({ value: name.name, label: name.name }))}
                                value={selectedFeatures} // Use an array of selected features here
                                onChange={handleFeatureChange} // Define a function to handle feature selection
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
