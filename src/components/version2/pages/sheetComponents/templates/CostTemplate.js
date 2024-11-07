import { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../../DataManagement/Data';
import { cost_labels as ROW_LABELS } from '../../../constants';

const CostTemplate = ({segKey, handleDataChanged}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);
    const [originalValue, setOriginalValue] = useState('');
    const [val, setVal] = useState('')
    const [editmode, setEditMode] = useState([])

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      if(!hasCombinedData.current) {
        const combinedData = dataManagerInstance.getCost(segKey);
        setData(combinedData);
        hasCombinedData.current = true;
      }
    }, [segKey]);

    const fadedColor = 'gainsboro'
  let perc_rows = []
  let dollar_rows = [0,2,5]
  let editable = [0,1,3,4]

  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const total_years = dataManagerInstance.numYears;
  const COLUMN_LABELS = generateColumnLabels(2025, total_years);

  const prettify_dollars = (input) => {
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

  const prettify_percent = (input) => {
    return input > 0 ? `${(input*100).toFixed(1)}%` : `(${(input*100*-1).toFixed(1)})%`;
  };

  const isEditing = (segment, yearIndex) => {
    return segment===editmode[0] && yearIndex===editmode[1];
  }

  const convertValToDol = (value) => {
    return parseFloat(value.replace("$", "").replace(",", "").replace("(", "-").replace(")", "")) || 0;
  }

  const handleFocus = (row, col) => (event) => {
    setOriginalValue(convertValToDol(event.target.value))
    setEditMode([row, col]);
  }

  const handleInputChange = (row, col) => (event) => {
    setVal(event.target.value)
  }

  const handleBlur = (row, col) => (event) => {
    const currVal = event.target.value;
    if(currVal==="") {
      data[row][col] = originalValue;
    } else {
      data[row][col] = currVal==="0" ? 0 : parseFloat(currVal) || originalValue;
      // Update things
      dataManagerInstance.calcCost(segKey)
      setVal('');
      handleDataChanged();
    }
    setEditMode([])
  }

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
  };

  const rowHeightStyle = {
    height: '20px', // Reduced row height
  };

  const firstRowBorderStyle = {
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
    backgroundColor: 'lightblue',
  };

  const percStyle = {
    fontStyle: 'italic',
    fontSize: 13
  };
  
  const dollarStyle = {
    fontWeight: "bold",
    backgroundColor: fadedColor
  }

  const labelStyle = {
    fontSize: 12,
    //maxWidth: 70,
    padding: 0,
    backgroundColor: 'yellow',
    //color: 'blue'
  }

  return <div>
    <TableContainer component={Paper} style={{ border: `2px solid black`}}>
      <Table size="small">
        <TableHead>
          <TableRow style={firstRowBorderStyle}>
          <TableCell style={headerStyle} padding="none" sx={{ width: '150px',height: '15px'}}>
            {`Cost ${segKey}`}
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
            const perc_row = perc_rows.includes(rowIndex);
            const dollar_row = dollar_rows.includes(rowIndex);
            const indentStyle = (perc_row) ? { paddingLeft: '20px', fontSize: 12, } : dollar_row ? dollarStyle : {};
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
                  return editable.includes(rowIndex) ? 
                  <TableCell style={labelStyle} key={cellIndex}>
                        <TextField
                              value={ isEditing(rowIndex, cellIndex) ? val : prettify_dollars(cellValue) + " "}
                              onFocus={handleFocus(rowIndex, cellIndex)}
                              onChange={handleInputChange(rowIndex, cellIndex)}
                              onBlur={handleBlur(rowIndex, cellIndex)}
                              variant='standard'
                              size='small'
                              InputProps={{
                                disableUnderline: true, // Removes underline on the standard variant
                                style: {fontSize: 13, textAlign: 'center', fontStyle: 'italic',}
                              }}
                              inputProps={{
                                style: { textAlign: 'right', padding: 1 }, // Centers the text inside the TextField
                              }}
                              sx={{
                                  padding: 0,       // Removes padding around text
                                  fontSize: 'inherit', // Matches surrounding text size
                                  color: 'inherit',    // Matches surrounding text color
                                  
                              }}
                            />
                        </TableCell>
                   : (
                  <TableCell
                    key={cellIndex}
                    align="right"
                    padding="none"
                    style={perc_row ? percStyle : dollar_row ? dollarStyle : {}}
                    >
                    {dollar_row ? prettify_dollars(cellValue) : perc_row ? prettify_percent(cellValue) : (cellValue*1).toFixed(1)}
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

export default CostTemplate;