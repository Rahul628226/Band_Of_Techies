import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const FeatureTags = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [featureNames, setFeatureNames] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Function to fetch feature names
    const fetchFeatureNames = () => {
      axios.get('http://localhost:8080/getFeatures')
        .then((response) => {
          // Filter out duplicates and null values
          const uniqueFeatureNames = response.data
            .filter((name, index, self) => self.indexOf(name) === index && name !== null);

          // Update the state with feature names
          setFeatureNames(uniqueFeatureNames);
        })
        .catch((error) => {
          console.error('Error fetching feature names:', error);
        });
    };

    // Call the function to fetch feature names initially
    fetchFeatureNames();
  }, []);

  const handleFeatureChange = (selectedOptions) => {
    setSelectedFeatures(selectedOptions);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    // Check if the new feature already exists in the list
    if (featureNames.some((feature) => feature.name === newFeature)) {
      setMessage('Feature already exists.');
      return;
    }

    const dataToSend = {
      name: newFeature,
    };

    // Send a POST request to your server endpoint to add a new feature
    axios.post('http://localhost:8080/addFeature', dataToSend)
      .then((response) => {
        // Update the list of feature names
        setFeatureNames([...featureNames, { name: newFeature }]);
        setMessage('Feature added successfully');
        handleCloseDialog();
      })
      .catch((error) => {
        setMessage('Error adding feature: ' + error.message);
      });
  };

  const handleFormSubmit = () => {
    // Here, you can submit the selected features to your database table.
    // You should send a POST request to your backend to insert the selected features.
    // The selected features can be accessed using the `selectedFeatures` state.

    const selectedFeatureNames = selectedFeatures.map((feature) => feature.value);

    axios.post('http://localhost:8080/addProduct', { FeatureTag:selectedFeatureNames })
      .then((response) => {
        console.log('Selected features inserted into the database:', response.data);
      })
      .catch((error) => {
        console.error('Error inserting selected features:', error);
      });
  };

  return (
    <div>
      <h2>Features</h2>
      <Select
        isMulti
        options={featureNames.map((name) => ({ value: name.name, label: name.name }))}
        value={selectedFeatures}
        onChange={(selectedOptions) => {
          handleFeatureChange(selectedOptions);
        }}
      />
      <button onClick={handleOpenDialog}>Add</button>
      <p>{message}</p>
      <hr />

      <Button onClick={handleFormSubmit}>Submit Selected Features</Button>

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

export default FeatureTags;
