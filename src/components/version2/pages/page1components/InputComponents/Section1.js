import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dataManagerInstance from '../../../DataManagement/Data'; // Adjust the import based on your file structure

const Section1 = ({ expanded, toggleSection, handleDataChange }) => {
  const [inputData, setInputData] = useState(dataManagerInstance.input.SA); // Initial data from DataManager
  const [originalValue, setOriginalValue] = useState('');
  const [val, setVal] = useState('')
  const [editmode, setEditMode] = useState([])

  useEffect(() => {
    setTimeout(() => {
    }, 10); // Delay to allow DataManager to 
    const initialData = dataManagerInstance.input.SA;
    setInputData(initialData);
  }, [inputData]);  // Fetch data when country or arrayIndex changes

  const segments = Object.keys(dataManagerInstance.input.SA); // Retrieve segment keys

  const leftSize = 4;
  const maxHeight = window.screen.height*.25
  const borderColor = '#1976d2'

  const prettify_percent = (input) => {
    return input > 0 ? `${(input*100).toFixed(1)}%` : `(${(input*100*-1).toFixed(1)})%`;
  };

  const isEditing = (segment, yearIndex) => {
    return segment===editmode[0] && yearIndex===editmode[1];
  }

  const convertValToPerc = (value) => {
    return parseFloat(value.replace('%', '')) / 100 || 0;
  }

  const handleFocus = (row, col) => (event) => {
    setOriginalValue(convertValToPerc(event.target.value))
    setEditMode([row, col]);
  }

  const handleInputChange = (row, col) => (event) => {
    setVal(event.target.value)
  }

  const handleBlur = (row, col) => (event) => {
    const currVal = event.target.value;
    if(currVal==="") {
      if(col < 0) { //handle first table
        dataManagerInstance.input.SA[row].NRCAGR = originalValue
      } else { //handle second table
        dataManagerInstance.input.SA[row].Proj[col] = originalValue
      }

    } else {
      console.log(currVal)
      if(col < 0) { //handle first table
        dataManagerInstance.input.SA[row].NRCAGR = currVal/100;
      } else { //handle second table
        dataManagerInstance.input.SA[row].Proj[col] = currVal/100;
      }
      // Update things
      dataManagerInstance.segInputChange(row);
      setVal('')
      handleDataChange();
    }
    setEditMode([])
  }

  const labelStyle = {
    fontSize: 12,
    maxWidth: 70,
    padding: 8
  }

  return (
    <Accordion expanded={expanded} sx={{ overflow: 'hidden', border: `2px solid ${borderColor}`}}>
      <AccordionSummary>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>Stand Alone Input</Typography>
          <IconButton onClick={toggleSection}>
            {expanded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} sx={{ overflowX: 'hidden'}}>
          <Grid item xs={leftSize}>
            <TableContainer component={Paper} sx={{ maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}>Segment</TableCell>
                    <TableCell align="center" style={labelStyle}>NR CAGR Yr 1-10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow hover key={segment}>
                      <TableCell align='right' style={labelStyle}>{`Seg ${segment}`}</TableCell>
                      <TableCell style={labelStyle}>
                      <TextField
                            value={ isEditing(segment, -1) ? val : prettify_percent(inputData[segment]["NRCAGR"])}
                            onFocus={handleFocus(segment, -1)}
                            onChange={handleInputChange(segment, -1)}
                            onBlur={handleBlur(segment, -1)}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>


          <Grid item xs={12-leftSize}>
            <TableContainer component={Paper} sx={{ width: '99.7%',overflow: 'auto', maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" colSpan={3} style={labelStyle}>OI Margin (%Rev)</TableCell>
                    <TableCell align="center" colSpan={1} style={labelStyle}>CAGR %</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}>Segments</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 1</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 2</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 3</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 3-10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow hover key={segment}>
                      <TableCell align='right'  style={labelStyle}>{`Seg ${segment}`}</TableCell>
                      {[0, 1, 2, 3].map((yearIndex) => (
                        <TableCell align='center' key={yearIndex}  style={labelStyle}>
                          <TextField
                            value={isEditing(segment, yearIndex) ? val : prettify_percent(inputData[segment]["Proj"][yearIndex])}
                            onFocus={handleFocus(segment, yearIndex)}
                            onChange={handleInputChange(segment, yearIndex)}
                            onBlur={handleBlur(segment, yearIndex)}
                            variant='standard'
                            size='small'
                            InputProps={{
                              disableUnderline: true, // Removes underline on the standard variant
                              style: {fontSize: 13, textAlign: 'center',fontStyle: 'italic',}
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
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default Section1;
