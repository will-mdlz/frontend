import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dataManagerInstance from '../../../DataManagement/Data'; // Adjust the import based on your file structure

const Section2 = ({ expanded, toggleSection }) => {
  const [inputData, setInputData] = useState(dataManagerInstance.input.COST); // Initial data from DataManager
  const [originalValue, setOriginalValue] = useState('');
  const [val, setVal] = useState('')
  const [editmode, setEditMode] = useState([])

  useEffect(() => {
    setTimeout(() => {
    }, 10); // Delay to allow DataManager to 
    const initialData = dataManagerInstance.input.COST;
    setInputData(initialData);
  }, [inputData]);  // Fetch data when country or arrayIndex changes

  const isEditing = (segment, yearIndex) => {
    return segment===editmode[0] && yearIndex===editmode[1];
  }

  const leftSize = 4;
  const maxHeight = window.screen.height*.25;
  const borderColor = '#1976d2';

  const prettify_percent = (input) => {
    return input > 0 ? `${(input*100).toFixed(1)}%` : `(${(input*100*-1).toFixed(1)})%`;
  };

  const prettify_dollars = (input) => {
    return input < 0 ? `$(${(input*1).toFixed(1)})` : `$${(input*1).toFixed(1)}`
  };

  const convertValToPerc = (value) => {
    return parseFloat(value.replace('%', '')) / 100 || 0;
  }

  const convertValToDol = (value) => {
    return parseFloat(value.replace("$", "")) || 0;
  }

  const handleInputChange = (row, col) => (event) => {
    setVal(event.target.value)
  }

  const handleFocus = (table, index) => (event) => {
    setOriginalValue(table===0 ? convertValToDol(event.target.value) : convertValToPerc(event.target.value))
    setEditMode([table, index]);
  }

  // Function to handle input blur
  const handleBlur = (table, index) => (event) => {
    const currVal = event.target.value;
    if(currVal==="") {
      if(table===0) {
        inputData["Runrate"] = originalValue;
      } else {
        inputData["Phasing"][index] = originalValue;
      }
    } else {
      if(table===0) {
        console.log(currVal)
        inputData["Runrate"] = currVal;
      } else {
        console.log(currVal)
        inputData["Phasing"][index] = currVal/100;
      }
      dataManagerInstance.costInputChange();
      setVal("")
    }
    setEditMode([])
  };

  const labelStyle = {
    fontSize: 12,
    maxWidth: 70,
    padding: 8
  }

  return (
    <Accordion expanded={expanded} sx={{ overflow: 'hidden', border: `2px solid ${borderColor}`}}>
      <AccordionSummary>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>Cost Synergy Input</Typography>
          <IconButton onClick={toggleSection}>
            {expanded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} sx={{ overflowX: 'hidden'}}>
          <Grid item xs={leftSize}>
            <TableContainer component={Paper} sx={{ overflowY: 'auto', maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}>Country/Region</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 3 Runrate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}>Total RR ($)</TableCell>
                    <TableCell>
                      <TextField
                            value={isEditing(0, -1) ? val : prettify_dollars(inputData["Runrate"])}
                            onFocus={handleFocus(0, -1)}
                            onChange={handleInputChange(0, -1)}
                            onBlur={handleBlur(0, -1)}
                            variant='standard'
                            size='small'
                            InputProps={{
                              disableUnderline: true, // Removes underline on the standard variant
                              style: {fontSize: 13, textAlign: 'center', fontStyle: 'italic',}
                            }}
                            inputProps={{
                              style: { textAlign: 'center' }, // Centers the text inside the TextField
                            }}
                            sx={{
                                padding: 0,       // Removes padding around text
                                fontSize: 'inherit', // Matches surrounding text size
                                color: 'inherit',    // Matches surrounding text color
                            }}
                          />
                      </TableCell>                  
                      </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>


          <Grid item xs={12-leftSize}>
            <TableContainer component={Paper} sx={{ width: '99%', overflow: 'auto', maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" colSpan={5} style={labelStyle}>Runrate %</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" style={labelStyle}>Year:</TableCell>
                    <TableCell align="center" style={labelStyle}>0</TableCell>
                    <TableCell align="center" style={labelStyle}>1</TableCell>
                    <TableCell align="center" style={labelStyle}>2</TableCell>
                    <TableCell align="center" style={labelStyle}>3-10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                  <TableCell align="right" style={labelStyle}>Phasing:</TableCell>
                  <TableCell align="center" style={labelStyle}>0%</TableCell>
                  <TableCell align="center">
                  <TextField
                      value={isEditing(1, 0) ? val : prettify_percent(inputData["Phasing"][0])}
                      onFocus={handleFocus(1, 0)}
                      onChange={handleInputChange(1, 0)}
                      onBlur={handleBlur(1, 0)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 100, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text colo  
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" >
                  <TextField
                      value={isEditing(1, 1) ? val : prettify_percent(inputData["Phasing"][1])}
                      onFocus={handleFocus(1, 1)}
                      onChange={handleInputChange(1, 1)}
                      onBlur={handleBlur(1, 1)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 100, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text colo  
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" style={labelStyle}>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default Section2;
