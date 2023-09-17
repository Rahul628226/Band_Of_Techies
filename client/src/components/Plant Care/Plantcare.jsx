import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import "../Plant Care/Platcare.css";
const steps = [
 
  {
    label: 'Plant Care Name',
    content: (
      <div>
        <TextField label="Name" variant="outlined" fullWidth />
      </div>
    ),
  },
  {
    label: 'Plant Care Photo',
    content: (
      <div>
        {/* Add an input for uploading a photo */}
        <input type="file" accept="image/*" />
      </div>
    ),
  },
  {
    label: 'Plant Care Description',
    content: (
      <div>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />
      </div>
    ),
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (<div className='single'>
 <Sidebar></Sidebar>
  <div class='singleContainer'>
    <Navbar/>
    <div className='main-container'>
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              {step.content && <div>{step.content}</div>}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
    </div>
    </div>
    </div>
  );
}
