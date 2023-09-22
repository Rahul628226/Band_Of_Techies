import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Demo = () => {
  const [featureNames, setFeatureNames] = useState([]);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Function to fetch feature names
  const fetchFeatureNames = () => {
    axios
      .get('http://localhost:8080/getFeatures')
      .then((response) => {
        // Filter out duplicates and null values
        const uniqueFeatureNames = response.data.filter(
          (name, index, self) => self.indexOf(name) === index && name !== null
        );

        // Update the state with feature names
        setFeatureNames(uniqueFeatureNames);
      })
      .catch((error) => {
        console.error('Error fetching feature names:', error);
      });
  };

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to handle changes in selected features
  const handleFeatureChange = (selectedOptions) => {
    setSelectedFeatures(selectedOptions);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Check if the new feature already exists in the list
    if (featureNames.some((feature) => feature.name === newFeature)) {
      setMessage('Feature already exists.');
      return;
    }

    const dataToSend = {
      name: newFeature,
    };

    // Send a POST request to your server endpoint
    axios
      .post('http://localhost:8080/addFeature', dataToSend)
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
    <div>
      <h2>Features</h2>

      <Select
        isMulti
        options={featureNames.map((name) => ({ value: name, label: name }))}
        value={selectedFeatures}
        onChange={handleFeatureChange}
      />

      <button onClick={handleOpenDialog}>Add</button>
      <p>{message}</p> {/* Display the message here */}
      <hr />
      {/* Add more content here */}
    </div>
  );
};

export default Demo;
