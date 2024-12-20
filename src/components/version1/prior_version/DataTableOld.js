import React, { useState, useEffect } from 'react';
import { IconButton, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { ROW_LABELS, YEARS, PERCENT_ROWS, DOLLAR_ROWS, PERM_EDITABLE, SHEETS,ROW_LABELS2, EDITABLE_ROWS, HIGHLIGHT_ROWS} from '../constants/Constants';
import AddIcon from '@mui/icons-material/Add'; // Plus icon
import RemoveIcon from '@mui/icons-material/Remove'; // Minus icon
import { updateArray } from '../../../utils/dataProcessing';
import { balls, calcEBIT } from '../../../utils/dataCalculations';
import DataManager from '../data/DataManager';
import '../styles.css'; // Import the CSS file

const DataTable = ({ real_years, starting_year, country, dataInput }) => {
  const [editMode, setEditMode] = useState({ row: null, cell: null, prev_value: null }); // Track which cell is in edit mode
  const [data, setData] = useState([]); // Initialize data with dataInput
  const [arrayIndex, setArrayIndex] = useState(0);  // Start with the default array index of 0
  const [priorArrayIndex, setPriorArrayIndex] = useState(0);  // Track the previous arrayIndex for dependent updates
  const [rowsVisible, setRowsVisible] = useState(false);

  useEffect(() => {
    const initialData = DataManager.getArray(country, arrayIndex);
    setData(initialData || []);
  }, [country, arrayIndex]);  // Fetch data when country or arrayIndex changes

  useEffect(() => {
  // Retrieve the previously saved tab index for this country
  const savedIndex = DataManager.getPrevIndex(country);

  if (savedIndex !== undefined) {
    setArrayIndex(savedIndex);
  }

  const handleToggleRows = () => {
    setRowsVisible(!rowsVisible);
  };

  const initialData = DataManager.getArray(country, arrayIndex);
  setData(initialData || []);
}, [country, arrayIndex]);  // Fetch data when country or arrayIndex changes

  if (!data || data.length === 0) {
    return <div>Loading...</div>; // Fallback UI if data is not available
  }
  
  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const COLUMN_LABELS = generateColumnLabels(starting_year, YEARS);

  const rowsWithBottomBorder = [0,11,12,15,16,20,21,26,27,38];

  const isRowEditable = (rowIndex, cellIndex) => {
    if (!DataManager.isEditable(country) || (arrayIndex > 0 && cellIndex < real_years) || arrayIndex === 3) {
      return false;
    }
    if ((arrayIndex===1 && rowIndex===0 && cellIndex===real_years) || PERM_EDITABLE.includes(rowIndex)){
      return true;
    }
    else if (cellIndex < real_years) {
      return EDITABLE_ROWS.includes(rowIndex); // Editable before years_real
    }
    return HIGHLIGHT_ROWS.includes(rowIndex); // Editable after years_real
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (editMode.row === rowIndex && editMode.cell === cellIndex) return;
    if (isRowEditable(rowIndex, cellIndex)){
      setEditMode({ row: rowIndex, cell: cellIndex });
    }
  };

  const handleDoubleClick = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event, rowIndex, cellIndex) => {
    const updatedValue = event.target.value;
    const updatedData = [...data];
    updatedData[rowIndex][cellIndex] = updatedValue;
    setData(updatedData);
  };

  const handleBlur = (event, rowIndex, cellIndex) => {
    if(event.target.value==="") {
      const updatedData = [...data];
      updatedData[rowIndex][cellIndex] = editMode.prev_value;
      setData(updatedData);
    } else {
      let newVal = processValue(event.target.value, rowIndex, cellIndex);
      const updatedData = updateArray(data, rowIndex, cellIndex, newVal, real_years, country, arrayIndex);
      DataManager.countryData[country].altered = true;
      setData(updatedData);
    }
    setEditMode({ row: null, cell: null });
  };

  const handleFocus = (rowIndex, cellIndex, cellValue) => {
    if (isRowEditable(rowIndex, cellIndex)){
      const updatedData = [...data];
      updatedData[rowIndex][cellIndex] = "";
      setData(updatedData);
      setEditMode({ row: rowIndex, cell: cellIndex, prev_value: cellValue});
    }
  };

  const handleKeyDown = (event, rowIndex, cellIndex) => {
    if (event.key === 'Tab' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(event, rowIndex, cellIndex, 'right')
    } else if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(event, rowIndex, cellIndex, 'down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(event, rowIndex, cellIndex, 'up');  // Move up
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(event, rowIndex, cellIndex, 'left');  // Move left
    }
  };

  const moveFocus = (event, rowIndex, cellIndex, direction) => {

    let rowcol = findEditableCell(rowIndex, cellIndex, direction)
    if(rowcol) {
      setEditMode({ row: rowcol[0], cell: rowcol[1] })
    }
    if(event.target.value==="") {
      const updatedData = [...data];
      updatedData[rowIndex][cellIndex] = editMode.prev_value;
      setData(updatedData);
    } else {
      let newVal = processValue(event.target.value, rowIndex, cellIndex);
      const updatedData = updateArray(data, rowIndex, cellIndex, newVal, real_years, country, arrayIndex);
      DataManager.countryData[country].altered = true;
      setData(updatedData);
    }
  };

  const findEditableCell = (currentRow, currentColumn, direction) => {
    let nextRow = currentRow;
    let nextColumn = currentColumn;
    const totalRows = data.length;
    const totalColumns = data[0].length;
    // Adjust nextRow and nextColumn based on direction
    switch (direction) {
      case 'right':
        nextColumn++;
        if (nextColumn >= totalColumns) {
          nextColumn = 0;  // Start at the first column
          nextRow++;       // Move to the next row
          if (nextRow >= totalRows) {
            nextRow = 0;  // Wrap to the first row
          }
        }
        break;
  
      case 'left':
        nextColumn--;
        if (nextColumn < 0) {
          nextColumn = totalColumns - 1;  // Start at the last column
          nextRow--;
          if (nextRow < 0) {
            nextRow = totalRows - 1;  // Wrap to the last row
          }
        }
        break;
  
      case 'down':
        nextRow++;
        if (nextRow >= totalRows) {
          nextRow = 0;  // Wrap to the top
          nextColumn++; // Move to the next column if available
          if (nextColumn >= totalColumns) {
            nextColumn = 0;  // Wrap to the first column
          }
        }
        break;
  
      case 'up':
        nextRow--;
        if (nextRow < 0) {
          nextRow = totalRows - 1;  // Wrap to the bottom
          nextColumn--; // Move to the previous column if available
          if (nextColumn < 0) {
            nextColumn = totalColumns - 1;  // Wrap to the last column
          }
        }
        break;
  
      default:
        throw new Error('Invalid direction');
    }
    // Keep checking in the direction until we find an editable cell or exhaust the grid
    while (nextRow >= 0 && nextRow < totalRows && nextColumn >= 0 && nextColumn < totalColumns) {
      // Check if the cell is editable
      if (isRowEditable(nextRow, nextColumn)) {
        return [nextRow, nextColumn]; // Return the next available cell as a tuple
      }
      // Move to the next cell in the same direction
      switch (direction) {
        case 'right':
          nextColumn++;
          if (nextColumn >= totalColumns) {
            nextColumn = 0;
            nextRow++;
            if (nextRow >= totalRows) {
              nextRow = 0;  // Wrap to the first row
            }
          }
          break;
        case 'left':
          nextColumn--;
          if (nextColumn < 0) {
            nextColumn = totalColumns - 1;
            nextRow--;
            if (nextRow < 0) {
              nextRow = totalRows - 1;  // Wrap to the last row
            }
          }
          break;
        case 'down':
          nextRow++;
          if (nextRow >= totalRows) {
            nextRow = 0;  // Wrap to the top
            nextColumn++;
            if (nextColumn >= totalColumns) {
              nextColumn = 0;  // Wrap to the first column
            }
          }
          break;
        case 'up':
          nextRow--;
          if (nextRow < 0) {
            nextRow = totalRows - 1;  // Wrap to the bottom
            nextColumn--;
            if (nextColumn < 0) {
              nextColumn = totalColumns - 1;  // Wrap to the last column
            }
          }
          break;
        default:
          throw new Error('Invalid direction');
      }
      // Prevent infinite loop by breaking if we return to the original position
      if (nextRow === currentRow && nextColumn === currentColumn) {
        break;
      }
    }
    return [currentRow, currentColumn]; // If no editable cell is found, return the original cell
  };

  const processValue = (input, rowIndex, cellIndex) => {
    // Ensure that the input is valid
    const _ = require('lodash');
    let returnVal = 0
    // Process it by either percent or by dollar (or unit)
    if (PERCENT_ROWS.includes(rowIndex)) { // Is a percent
      let newVal = _.trim(input, "%");
      if (!isNaN(newVal)) {
        returnVal = parseFloat(newVal) / 100;
      }
    } else { // Is a dollar
      let newVal = _.trim(input, "$");
      if (!isNaN(newVal)) {
        returnVal = parseFloat(newVal);
      }
    }
    return returnVal
  };

  const prettify_dollars = (input) => {
    if (input < 100 && input > -100) {
      return input.toFixed(1);
    } else {
      let tempStr = input.toFixed(0)
      if (input < 1000 && input > -1000) { return tempStr }
      let newStr = "";
      let count = 0;
      for(let i = tempStr.length; i > 0; i--) {
        if(count%3===0 && newStr!=="") {
          newStr = "," + newStr;
          count = 0;
        }
        newStr = tempStr.substring(i-1, i) + newStr;
        count++;
      }
      return newStr;
    }
  };

  const handleSheetChange = (event) => {
    const newIndex = event.target.value;

    // Perform dependent array updates using the previous index
    if(DataManager.countryData[country].altered) DataManager.updateDependentArrays(country, priorArrayIndex);
    DataManager.setPrevIndex(country, arrayIndex);

    // Set the new array index
    setPriorArrayIndex(arrayIndex);  // Set the current arrayIndex as prior before changing
    setArrayIndex(newIndex);  // Set the new arrayIndex to fetch new data
    DataManager.setPrevIndex(country, newIndex);
  };

  const headerStyle = {
    borderBottom: '2px solid black',
    borderRight: '2px solid black',
    textAlign: 'center',
    verticalAlign: 'middle', // Center the text vertically
  };

  const rowLabelStyle = {
    borderRight: '2px solid black',
    width: '200px', // Adjust width of the first column
  };

  const rowHeightStyle = {
    height: '20px', // Reduced row height
  };

  const rowWithBorderStyle = {
    borderBottom: '2px solid black',
  };

  const firstRowBorderStyle = {
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
    backgroundColor: 'lightblue',
  };

  const cellStyle = {
    width: '100px',  // Set a fixed width for cells
    height: '15px',  // Set a fixed height for cells
    padding: '3px',  // Add some padding
    overflow: 'hidden', // Prevent content overflow
    whiteSpace: 'nowrap', // Keep text in a single line
    textOverflow: 'ellipsis', // Handle long text with ellipsis
  };

  const inputStyle = {
    width: '100%',  // Make sure the input takes the full width of the cell
    height: '100%', // Ensure the input matches the cell height
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={rowHeightStyle} style={firstRowBorderStyle}>
          <TableCell
            style={headerStyle}
            padding="none"
            sx={{ 
              width: '150px',
              height: '15px',  // Adjust height of the cell
            }}
          >
            {/* Dropdown Select here */}
            <Select
              value={arrayIndex}
              onChange={handleSheetChange}
              variant="standard"
              inputProps={{
                style: { 
                  border: 'none',  
                  outline: 'none', 
                  height: '30px',  
                  padding: '5px',
                  fontSize: '14px'
                }
              }}
              sx={{
                width: '200px',
                margin: 0,
              }}
            >
              {SHEETS.map((sheet, index) => (
                <MenuItem key={index} value={index}>
                  {sheet}
                </MenuItem>
              ))}
            </Select>
          </TableCell>
            {COLUMN_LABELS.map((label, index) => (
              <TableCell key={index} align="center" style={headerStyle} padding="none">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={rowHeightStyle}
              style={rowsWithBottomBorder.includes(rowIndex) ? rowWithBorderStyle : {}}
            >
              <TableCell
                component="th"
                scope="row"
                align="left"
                style={rowLabelStyle}
                padding="none"
              >
                {ROW_LABELS2[rowIndex]}
              </TableCell>
              {row.map((cellValue, cellIndex) => {
                const isPercentRow = PERCENT_ROWS.includes(rowIndex);
                const displayValue = isPercentRow ? `${(cellValue * 100).toFixed(0)}%` : (cellValue*1).toFixed(0);
                return (
                <TableCell
                  key={cellIndex}
                  onDoubleClick={handleDoubleClick}
                  align="right"
                  padding="none"
                  style={{ ...cellStyle, ...(rowsWithBottomBorder.includes(rowIndex) ? rowWithBorderStyle : {}) }}
                  onClick={() => handleCellClick(rowIndex, cellIndex)} // Handle click
                  className={`
                    ${(HIGHLIGHT_ROWS.includes(rowIndex) && cellIndex >= real_years && arrayIndex !== 3 && DataManager.isEditable(country)) ? 'highlighted-cell' : ''} 
                    ${DOLLAR_ROWS.includes(rowIndex) ? 'dollar-cell' : ''}
                  `}>
                  {editMode.row === rowIndex && editMode.cell === cellIndex ? (
                    <TextField
                      value={cellValue}
                      onFocus={() => handleFocus(rowIndex, cellIndex, cellValue)}
                      onChange={(event) => handleInputChange(event, rowIndex, cellIndex)}
                      onBlur={(event) => handleBlur(event, rowIndex, cellIndex)} // Exit edit mode when focus is lost
                      onKeyDown={(event) => handleKeyDown(event, rowIndex, cellIndex)} // Handle Tab, Enter, and Arrow keys
                      autoFocus
                      variant="standard"
                      InputProps={{ style: inputStyle }}  // Apply input style
                      inputProps={{
                        style: { textAlign: 'right', padding: 0 },  // Align text to the right and remove padding
                      }}
                      fullWidth
                    />
                  ) : DOLLAR_ROWS.includes(rowIndex) ? (
                    // If the row is in DOLLAR_ROWS, display dollar sign on the left
                    <span className="dollar-cell">
                      <span style={{ textAlign: 'left' }}>$</span>
                      <span style={{ textAlign: 'right' }}>{prettify_dollars(cellValue)}</span>
                    </span>
                  ) : (
                    displayValue
                  )}
                </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
