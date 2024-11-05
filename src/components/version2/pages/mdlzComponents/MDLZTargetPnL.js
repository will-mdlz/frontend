import { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';
import { mdlz_labels, target_labels } from '../../constants';

const MDLZTargetPnL = ({val}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);
    const [editMode, setEditMode] = useState([]);
    const [tempVal, setTempVal] = useState("")

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      if(!hasCombinedData.current) {
        const combinedData = val===1 ? dataManagerInstance.rawdata["MDLZ"] : dataManagerInstance.rawdata["TARGET"];
        setData(combinedData);
        hasCombinedData.current = true;
      }
    }, [val]);

    const fadedColor = 'gainsboro'

  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const total_years = dataManagerInstance.numYears;
  const startingYear = dataManagerInstance.startYear+1;
  const COLUMN_LABELS = generateColumnLabels(startingYear, total_years-1);
  const ROW_LABELS = val===1 ? mdlz_labels : target_labels;

  const handleFocus = (row, col) => (event) => {
      setEditMode([row, col])
  }

  const handleInputChange = (row, col) => (event) => {
    setTempVal(event.target.value)
  }

  const handleBlur = (row, col) => (event) => {
    const currVal = event.target.value;
    if(currVal==="") {

    } else {
      data[row][col] = handleVal(currVal);
      setTempVal('')
    }
    setEditMode([])
  }

  const handleVal = (currVal) => {
    return parseFloat(currVal.replace(/[$,]/g, '')) || 0;
  }

  const editing = (row, col) => {
    return editMode[0]===row&&editMode[1]===col;
  }

  const prettify_dollars = (input) => {
    if(input < 100 && input > -100) {
        return input > 0 ? "$" + (input*1).toFixed(2) : "$(" + (input*-1).toFixed(2) + ")";
    }
    if (input < 1000 && input > -1000) {
      return input > 0 ? "$" + (input*1).toFixed(1) : "$(" + (input*-1).toFixed(1) + ")";
    } else {
      let tempStr = input > 0 ? (input*1).toFixed(0) : (input*-1).toFixed(0);
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
      return input > 0 ? "$" + newStr : "$(" + newStr + ")";
    }
  };

  const headerStyle = {
    borderBottom: '2px solid black',
    borderRight: '2px solid black',
    textAlign: 'center',
    verticalAlign: 'middle', // Center the text vertically
    width: '400px'
  };

  const rowLabelStyle = {
    borderRight: '2px solid black',
    width: '400px', // Adjust width of the first column
    backgroundColor: fadedColor
  };

  const rowHeightStyle = {
    height: '20px', // Reduced row height
  };

  const firstRowBorderStyle = {
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
    backgroundColor: 'lightblue',
  };
  
  const dollarStyle = {
    fontWeight: "bold",
    backgroundColor: "yellow"
  }

  return <div>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow style={firstRowBorderStyle}>
          <TableCell style={headerStyle} padding="none" sx={{ width: '150px',height: '15px'}}>
            {val===1 ? "MDLZ P&L" : "Target P&L"}
          </TableCell>
            {COLUMN_LABELS.map((label, index) => (
              <TableCell key={index} align="center" style={headerStyle} padding="none">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => {
            const indentStyle = {fontWeight: 'bold'};
            return (
            <TableRow
              key={rowIndex}
              sx={rowHeightStyle}
            >
              <TableCell
                component="th"
                scope="row"
                align="left"
                padding="none"
                style={{ ...rowLabelStyle, ...indentStyle }}
              >
                {ROW_LABELS[rowIndex]} 
              </TableCell>
              {row.map((cellValue, cellIndex) => {
                if (cellIndex >= total_years) return null;
                return (
                <TableCell
                  key={cellIndex}
                  align="right"
                  padding="none"
                  style={dollarStyle}
                  >
                  <TextField
                    value={editing(rowIndex, cellIndex) ? tempVal : prettify_dollars(cellValue)}
                    onFocus={handleFocus(rowIndex, cellIndex)}
                    onChange={handleInputChange(rowIndex, cellIndex)}
                    onBlur={handleBlur(rowIndex, cellIndex)}
                    variant='standard'
                    size='small'
                    InputProps={{
                      disableUnderline: true, // Removes underline on the standard variant
                      style: {fontSize: 13, textAlign: 'center', fontStyle: 'italic',}
                    }}
                    sx={{
                        padding: 0,       // Removes padding around text
                        fontSize: 'inherit', // Matches surrounding text size
                        color: 'inherit',    // Matches surrounding text color
                        
                    }}
                  />
                </TableCell>
                );
              })}
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  </div>;
};

export default MDLZTargetPnL;