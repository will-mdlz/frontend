import React, { useState, useEffect } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, InputAdornment } from '@mui/material';
import Settings from '@mui/icons-material/Settings'; // For settings icon

const SettingsBox = ({ onApply, initialStartYear, initialActualYears, initialTotalYears }) => {
  const [startYear, setStartYear] = useState(initialStartYear || '');
  const [actualYears, setActualYears] = useState(initialActualYears || '');
  const [totalYears, setTotalYears] = useState(initialTotalYears || '');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  // Update state if initial values change
  useEffect(() => {
    setStartYear(initialStartYear);
    setActualYears(initialActualYears);
    setTotalYears(initialTotalYears);
  }, [initialStartYear, initialActualYears, initialTotalYears]);

  const handleApply = () => {
    // Convert values to integers
    const startYearInt = parseInt(startYear, 10);
    const actualYearsInt = parseInt(actualYears, 10);
    const totalYearsInt = parseInt(totalYears, 10);
  
    // Validate the values
    if (isNaN(startYearInt) || isNaN(actualYearsInt) || isNaN(totalYearsInt)) {
      alert("Please enter valid integer values.");
      return;
    }
    if (startYearInt < 0 || actualYearsInt < 0 || totalYearsInt < 0) {
      alert("Values cannot be negative.");
      return;
    }
    if (actualYearsInt > totalYearsInt) {
      alert("Actual years cannot be greater than total years.");
      return;
    }
    if (totalYearsInt > 15) {
        alert("Let's chill out there bud");
        return;
    }

    // If validation passes, apply the values
    onApply(startYearInt, actualYearsInt, totalYearsInt);
  };

  return (
    <div>
      <IconButton
          onClick={handleOpen} // Function to handle the click
          sx={{
            backgroundColor: 'lightgray',
            color: 'black',
            '&:hover': {
              backgroundColor: 'darkgray',
              color: 'white'
            },
          }}
        >
          <Settings /> {/* Settings Icon */}
        </IconButton>
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md" // Set the maxWidth to 'md' for a larger dialog
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField 
              value={startYear} 
              onChange={(e) => setStartYear(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApply(); // Trigger add channel and close dialog on Enter key press
                  handleClose();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    Start Year:
                  </InputAdornment>
                )
              }}
              style={{ width: '250px' }} // Adjust width for better appearance
            />
          </Grid>
          <Grid item>
            <TextField 
              value={actualYears} 
              onChange={(e) => setActualYears(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApply(); // Trigger add channel and close dialog on Enter key press
                  handleClose();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    Actual Years:
                  </InputAdornment>
                )
              }}
              style={{ width: '250px' }} 
            />
          </Grid>
          <Grid item>
            <TextField 
              value={totalYears} 
              onChange={(e) => setTotalYears(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApply(); // Trigger add channel and close dialog on Enter key press
                  handleClose();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    Total Years:
                  </InputAdornment>
                )
              }}
              style={{ width: '250px' }} 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={() => {handleApply(startYear, actualYears, totalYears); handleClose();}}>Apply</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default SettingsBox;
