import { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../../DataManagement/Data';
import { seg_labels as ROW_LABELS } from '../../../constants';
import { prettify_dollars, prettify_percent, prettify_gen } from '../../../TableFunctions'

const SegTemplate = ({segKey, handleDataChanged}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);
    const [originalValue, setOriginalValue] = useState('');
    const [val, setVal] = useState('')
    const [editmode, setEditMode] = useState([])

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      if(!hasCombinedData.current) {
        const combinedData = dataManagerInstance.getSegment(segKey);
        setData(combinedData);
        hasCombinedData.current = true;
      }
    }, [segKey]);

    const fadedColor = 'gainsboro'
  let perc_rows = [1,3,5,7,9,11,13,14,15,16,21,22]
  let dollar_rows = [0,2,8,12,17]
  let bot_bord_rows = [13];
  let cogs = [18,19]
  let editable = [4,6,10,14,15,20,22]

  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const total_years = dataManagerInstance.rawdata["SEG"][segKey][0].length;
  const COLUMN_LABELS = generateColumnLabels(dataManagerInstance.input["SA"][segKey]['startingyear'], total_years);

  // const firstEdit = (row, col) => {
  //   return (col===dataManagerInstance.input["GEN"]["Trade Year"]-dataManagerInstance.input["SA"][segKey]['startingyear']) && (row===0||row===18||row===19)
  // }

  const isEditing = (segment, yearIndex) => {
    return segment===editmode[0] && yearIndex===editmode[1];
  }

  const handleFocus = (row, col) => (event) => {
    setOriginalValue(event.target.value)
    setEditMode([row, col]);
  }

  const handleInputChange = (row, col) => (event) => {
    setVal(event.target.value)
  }

  const handleBlur = (row, col) => (event) => {
    const currVal = event.target.value;
    if(currVal!=="") {
      dataManagerInstance.rawdata["SEG"][segKey][row][col] = (perc_rows.includes(row) ? parseFloat(currVal) / 100 : parseFloat(currVal)) || originalValue
      dataManagerInstance.calcSegmentCOGS(segKey)
      setData([...dataManagerInstance.getSegment(segKey)])
      handleDataChanged();
    }
    setVal('');
    setOriginalValue("");
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
    padding: 0,
    backgroundColor: 'yellow'
  }

  return <div>
    <TableContainer component={Paper} style={{ border: `2px solid black`}}>
      <Table size="small">
        <TableHead>
          <TableRow style={firstRowBorderStyle}>
          <TableCell style={headerStyle} padding="none" sx={{ width: '150px',height: '15px'}}>
            {`Segment ${segKey}`}
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
            const bot = bot_bord_rows.includes(rowIndex)
            const cog = cogs.includes(rowIndex)
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
                key={row.id}
                style={cog ? {...rowLabelStyle, paddingLeft: '20px', fontSize: 12,} : bot ? { ...rowLabelStyle, ...indentStyle, borderBottom: "2px solid black" } : { ...rowLabelStyle, ...indentStyle }}
              >
                {ROW_LABELS[rowIndex]} 
              </TableCell>
              {row.map((cellValue, cellIndex) => {
                if (cellIndex >= total_years) return null;
                return (editable.includes(rowIndex)) && cellIndex >= dataManagerInstance.input["GEN"]["Trade Year"]-dataManagerInstance.input["SA"][segKey]['startingyear'] ? 
                <TableCell style={labelStyle} key={cellIndex}>
                      <TextField
                            value={isEditing(rowIndex, cellIndex) ? val : perc_row ? prettify_percent(cellValue) : prettify_dollars(cellValue) + " "}
                            onFocus={handleFocus(rowIndex, cellIndex)}
                            onChange={handleInputChange(rowIndex, cellIndex)}
                            onBlur={handleBlur(rowIndex, cellIndex)}
                            variant='standard'
                            size='small'
                            fullWidth
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
                  style={bot ? {...percStyle, borderBottom: "2px solid black"} : perc_row ? percStyle : dollar_row ? dollarStyle : {fontSize: 12}}
                  >
                  {dollar_row ? prettify_dollars(cellValue) : perc_row ? prettify_percent(cellValue) : prettify_gen(cellValue)}
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

export default SegTemplate;