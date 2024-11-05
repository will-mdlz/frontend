import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box, TextField, Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dataManagerInstance from '../../../DataManagement/Data'; // Adjust based on your file structure

const Section4 = ({expanded, toggleSection}) => {
    const [inputValues, setInputValues] = useState({
        block1Field1: '',
        block2Field1: '',
        block2Field2: '',
        // Add more fields as needed
      });
    
      const maxHeight = window.screen.height*.35;
      const borderColor = '#1976d2';
    
      // Initialize state with values from DataManager
      useEffect(() => {
        setInputValues({
          block1Field1: dataManagerInstance.block1Field1 || '',
          block2Field1: dataManagerInstance.block2Field1 || '',
          block2Field2: dataManagerInstance.block2Field2 || '',
          // Initialize more fields from DataManager if needed
        });
      }, []);
    
      // Function to handle input changes and update DataManager
      const handleInputChange = (field) => (event) => {
        const { value } = event.target;
        setInputValues((prevValues) => ({
          ...prevValues,
          [field]: value,
        }));
        dataManagerInstance[field] = value; // Update DataManager
      };

  return (
    <Accordion expanded={expanded} sx={{ maxHeight: maxHeight, overflowX: 'hidden', border: `2px solid ${borderColor}`}}>
    <AccordionSummary>
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Typography>General Input</Typography>
        <IconButton onClick={toggleSection}>
          {expanded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
        <Grid container spacing={2}>
        <Grid item xs={6}>
        <Paper elevation={2} sx={{ width:"90%", padding: 2, marginBottom: 2}}>
          <Typography align='center'>Info Area 1</Typography>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={6}>
              <TextField
                label="Tax Rate"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Interest Rate"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            {/* Add more fields to Block 1 if necessary */}
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                label="Debt/Equity"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Leverage"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            {/* Add more fields to Block 1 if necessary */}
          </Grid>
        </Paper>
        </Grid>
        <Grid item xs={6}>
        <Paper elevation={2} sx={{ width:"90%", padding: 2, marginBottom: 2}}>
          <Typography align='center'>Info Area 2</Typography>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={6}>
              <TextField
                label="WACC"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Perpetuity Rate"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            {/* Add more fields to Block 1 if necessary */}
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                label="Filler"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Filler"
                value={inputValues.block1Field1}
                onChange={handleInputChange('block1Field1')}
                size="small"
                width="15%"
              />
            </Grid>
            {/* Add more fields to Block 1 if necessary */}
          </Grid>
        </Paper>
        </Grid>
        </Grid>

        {/* Block 2 */}
        <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">Block 2</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field 1"
                value={inputValues.block2Field1}
                onChange={handleInputChange('block2Field1')}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field 2"
                value={inputValues.block2Field2}
                onChange={handleInputChange('block2Field2')}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>
    </AccordionDetails>
    </Accordion>
  );
};

export default Section4;
