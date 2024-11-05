import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dataManagerInstance from '../../../DataManagement/Data'; // Adjust the import based on your file structure

const Section3 = ({ expanded, toggleSection, handleDataChange }) => {
  const [inputData, setInputData] = useState(dataManagerInstance.input.REV); // Initial data from DataManager
  const [originalValue, setOriginalValue] = useState('');
  const [val, setVal] = useState('')
  const [editmode, setEditMode] = useState([])

  useEffect(() => {
    setTimeout(() => {
    }, 10); // Delay to allow DataManager to 
    dataManagerInstance.updateRevInput();
    const initialData = dataManagerInstance.input.REV;
    setInputData(initialData);
  }, [inputData]);  // Fetch data when country or arrayIndex changes

  const leftSize = 3;
  const maxHeight = window.screen.height*.25;
  const borderColor = '#1976d2';

  const isEditing = (segment, yearIndex) => {
    return segment===editmode[0] && yearIndex===editmode[1];
  }

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

  const handleFocus = (table, index) => (event) => {
    setOriginalValue(table===0 ? convertValToDol(event.target.value) : convertValToPerc(event.target.value))
    setEditMode([table, index]);
  }

  const handleInputChange = (row, col) => (event) => {
    setVal(event.target.value)
  }

   // Function to handle input blur
   const handleBlur = (table, index) => (event) => {
    const currVal = event.target.value;
    if(currVal==="") {
      if(table===0) {
        if(index===0) {
          inputData["Single Syn"] = originalValue;
        } else {
          inputData["OI Margin Impact"] = originalValue;
        }
      } else if(table===1) {
        inputData["Runrate Phasing"][index] = originalValue;
      } else {
        inputData["OI Phasing"][index] = originalValue;
      }
    } else {
      if(table===0) {
        if(index===0) {
          inputData["Single Syn"] = currVal;
        } else {
          inputData["OI Margin Impact"] = currVal;
        }
      } else if(table===1) {
        inputData["Runrate Phasing"][index] = currVal/100;
      } else {
        inputData["OI Phasing"][index] = currVal/100;
      }
      setVal("")
    }
    dataManagerInstance.revInputChange();
    setEditMode([])
  };

  const labelStyle = {
    fontSize: 12,
    maxWidth: 30,
    padding: 8
  }

  return (
    <Accordion expanded={expanded} sx={{ overflow: 'hidden', border: `2px solid ${borderColor}`}}>
      <AccordionSummary>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>Revenue Synergy Input</Typography>
          <IconButton onClick={toggleSection}>
            {expanded ? <RemoveIcon/> : <AddIcon />}
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} sx={{ overflowX: 'hidden'}}>
          <Grid item xs={leftSize}>
            <TableContainer component={Paper} sx={{ overflow: 'auto', maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}></TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 5 Runrate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center"style={labelStyle}>Single Syn</TableCell>
                    <TableCell align="center"style={labelStyle}>
                        <TextField
                        value={isEditing(0, 0) ? val : prettify_dollars(inputData["Single Syn"])}
                        onFocus={handleFocus(0, 0)}
                        onChange={handleInputChange(0, 0)}
                        onBlur={handleBlur(0, 0)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                        />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" style={labelStyle}>OI Margin Impact</TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(0, 1) ? val : prettify_dollars(inputData["OI Margin Impact"])}
                        onFocus={handleFocus(0, 1)}
                        onChange={handleInputChange(0, 1)}
                        onBlur={handleBlur(0, 1)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
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
          <Grid item xs={12 - leftSize}>
            <TableContainer
                component={Paper}
                sx={{
                width: '99.7%',
                overflowX: 'auto', // Enable horizontal scroll
                maxHeight: maxHeight,
                border: `1px solid ${borderColor}`,
                }}>
                <Table stickyHeader size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                    <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" colSpan={6} style={labelStyle}>Runrate %</TableCell>
                    <TableCell align="center" style={labelStyle}>CAGR %</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell align="center" style={labelStyle}></TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 0</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 1</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 2</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 3</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 4</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 5</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 5-10</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableCell align="right"style={labelStyle}>Phasing:</TableCell>
                    <TableCell align="center"style={labelStyle}>0%</TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(1, 0) ? val : prettify_percent(inputData["Runrate Phasing"][0])}
                        onFocus={handleFocus(1, 0)}
                        onChange={handleInputChange(1, 0)}
                        onBlur={handleBlur(1, 0)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                        />
                    </TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(1, 1) ? val : prettify_percent(inputData["Runrate Phasing"][1])}
                        onFocus={handleFocus(1, 1)}
                        onChange={handleInputChange(1, 1)}
                        onBlur={handleBlur(1, 1)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                        />
                    </TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(1, 2) ? val : prettify_percent(inputData["Runrate Phasing"][2])}
                        onFocus={handleFocus(1, 2)}
                        onChange={handleInputChange(1, 2)}
                        onBlur={handleBlur(1, 2)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                        />
                    </TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(1, 3) ? val : prettify_percent(inputData["Runrate Phasing"][3])}
                        onFocus={handleFocus(1, 3)}
                        onChange={handleInputChange(1, 3)}
                        onBlur={handleBlur(1, 3)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                        />
                    </TableCell>
                    <TableCell align="center" style={labelStyle}>100%</TableCell>
                    <TableCell align="center" style={labelStyle}>
                        <TextField
                        value={isEditing(1, 4) ? val : prettify_percent(inputData["Runrate Phasing"][4])}
                        onFocus={handleFocus(1, 4)}
                        onChange={handleInputChange(1, 4)}
                        onBlur={handleBlur(1, 4)}
                        variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
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

            <TableContainer component={Paper} sx={{ marginTop: 1, width: '99.7%', overflowX: 'auto', maxHeight: maxHeight, border: `1px solid ${borderColor}`}}>
              <Table stickyHeader size='small' sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" colSpan={6} style={labelStyle}>Revenue %</TableCell>
                    <TableCell align="center" style={labelStyle}>CAGR %</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell align="center" style={labelStyle}></TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 0</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 1</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 2</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 3</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 4</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 5</TableCell>
                    <TableCell align="center" style={labelStyle}>Yr 5-10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                  <TableCell align="center" style={labelStyle}>OI Margin:</TableCell>
                  <TableCell align="center" style={labelStyle}>{0}</TableCell>
                  <TableCell align="center" style={labelStyle}>
                    <TextField
                      value={isEditing(2, 0) ? val : prettify_percent(inputData["OI Phasing"][0])}
                      onFocus={handleFocus(2, 0)}
                      onChange={handleInputChange(2, 0)}
                      onBlur={handleBlur(2, 0)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                  <TextField
                      value={isEditing(2, 1) ? val : prettify_percent(inputData["OI Phasing"][1])}
                      onFocus={handleFocus(2, 1)}
                      onChange={handleInputChange(2, 1)}
                      onBlur={handleBlur(2, 1)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={isEditing(2, 2) ? val : prettify_percent(inputData["OI Phasing"][2])}
                      onFocus={handleFocus(2, 2)}
                      onChange={handleInputChange(2, 2)}
                      onBlur={handleBlur(2, 2)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                  <TextField
                      value={isEditing(2, 3) ? val : prettify_percent(inputData["OI Phasing"][3])}
                      onFocus={handleFocus(2, 3)}
                      onChange={handleInputChange(2, 3)}
                      onBlur={handleBlur(2, 3)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                  <TextField
                      value={isEditing(2, 4) ? val : prettify_percent(inputData["OI Phasing"][4])}
                      onFocus={handleFocus(2, 4)}
                      onChange={handleInputChange(2, 4)}
                      onBlur={handleBlur(2, 4)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                  <TextField
                      value={isEditing(2, 5) ? val : prettify_percent(inputData["OI Phasing"][5])}
                      onFocus={handleFocus(2, 5)}
                      onChange={handleInputChange(2, 5)}
                      onBlur={handleBlur(2, 5)}
                      variant='standard'
                      size='small'
                      InputProps={{
                        disableUnderline: true, // Removes underline on the standard variant
                        style: {fontSize: 13, textAlign: 'center', maxWidth: 30, fontStyle: 'italic',}
                      }}
                      sx={{
                          padding: 0,       // Removes padding around text
                          fontSize: 'inherit', // Matches surrounding text size
                          color: 'inherit',    // Matches surrounding text color
                          
                      }}/>
                  </TableCell>
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

export default Section3;