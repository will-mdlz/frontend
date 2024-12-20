import { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../../DataManagement/Data';
import { seg_cons_labels as ROW_LABELS } from '../../../constants';
import { prettify_dollars, prettify_percent, prettify_gen } from '../../../TableFunctions';

const SegCons = ({dataChanged}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);
    const [originalValue, setOriginalValue] = useState('');
    const [val, setVal] = useState('')
    const [editmode, setEditMode] = useState([])

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      // if(!hasCombinedData.current) {
        const keys = Object.keys(dataManagerInstance.rawdata.SEG);
        keys.forEach((num) => {
            //if(num!=="CONS") dataManagerInstance.calcSegment2(num);
            if(num!=="CONS"&&num!=="Syn") dataManagerInstance.calcSegmentCOGS(num);
        })
        dataManagerInstance.calcConsolidatedSegment();
        const combinedData = dataManagerInstance.getSegment("CONS");
        setData(combinedData);
        hasCombinedData.current = true;
      //}
    }, [dataChanged]);

    const fadedColor = 'gainsboro'
  let perc_rows = [1,3,5,7,9,11,13,15,17,19,21,25,27,29,30,31]
  let dollar_rows = [0,2,4,6,8,10,12,14,16,18,22,24,28,32]
  let bot_bord_rows = [28];
  let cogs = [33,34]
  let editable = [11,17]

  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const total_years = dataManagerInstance.numYears;
  const COLUMN_LABELS = generateColumnLabels(2025, total_years);

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
      if(row===11) dataManagerInstance.rawdata["Corp Exp"][col] = parseFloat(currVal)/100 || originalValue;
      if(row===17) dataManagerInstance.rawdata["Corp Dep"][col] = parseFloat(currVal)/100 || originalValue;
      dataManagerInstance.calcConsolidatedSegment();
      const combinedData = dataManagerInstance.getSegment("CONS");
      setData(combinedData);
    }
    setVal('');
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
            Consolidated Segments
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
            const indentStyle = (perc_row) ? { paddingLeft: '20px', fontSize: 12, } : dollar_row ? dollarStyle : {fontSize: 13};
            const bot = bot_bord_rows.includes(rowIndex);
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
                style={cog ? {...rowLabelStyle, paddingLeft: '20px', fontSize: 12,} : bot ? { ...rowLabelStyle, ...indentStyle, borderBottom: "2px solid black" } : { ...rowLabelStyle, ...indentStyle }}
              >
                {ROW_LABELS[rowIndex]} 
              </TableCell>

              {row.map((cellValue, cellIndex) => {
                if (cellIndex >= total_years) return null;
                return editable.includes(rowIndex) ? (
                  <TableCell style={labelStyle} key={cellIndex}>
                      <TextField
                            value={isEditing(rowIndex, cellIndex) ? val : prettify_percent(cellValue) + " "}
                            onFocus={handleFocus(rowIndex, cellIndex)}
                            onChange={handleInputChange(rowIndex, cellIndex)}
                            onBlur={handleBlur(rowIndex, cellIndex)}
                            variant='standard'
                            size='small'
                            fullWidth
                            InputProps={{
                              disableUnderline: true, // Removes underline on the standard variant
                              style: {fontSize: 13, textAlign: 'center', fontStyle: 'italic', color: 'blue'}
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
                ) 
                : (
                <TableCell
                  key={cellIndex}
                  align="right"
                  padding="none"
                  style={bot ? {...dollarStyle, borderBottom: "2px solid black"} : perc_row ? percStyle : dollar_row ? dollarStyle : {fontSize: 12}}
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

export default SegCons;