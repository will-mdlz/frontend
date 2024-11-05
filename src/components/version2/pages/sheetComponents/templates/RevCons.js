import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../../DataManagement/Data';
import { rev_cons_labels as ROW_LABELS } from '../../../constants';

const RevCons = ({dataChanged}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      //if(!hasCombinedData.current) {
        const keys = Object.keys(dataManagerInstance.rawdata.REV);
        keys.forEach((num) => {
            dataManagerInstance.calcRev(num);
        })
        dataManagerInstance.calcConsolidatedRev();
        const combinedData = dataManagerInstance.getRev("CONS");
        setData(combinedData);
        hasCombinedData.current = true;
      //}
    }, [dataChanged]);

    const fadedColor = 'gainsboro'
  let perc_rows = [1,7,9,11,15,17]
  let dollar_rows = [8,12,14,18]

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

  return <div>
    <TableContainer component={Paper} style={{ border: `2px solid black`}}>
      <Table size="small">
        <TableHead>
          <TableRow style={firstRowBorderStyle}>
          <TableCell style={headerStyle} padding="none" sx={{ width: '150px',height: '15px'}}>
            Consolidated Revenue
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
                  style={perc_row ? percStyle : dollar_row ? dollarStyle : {}}
                  >
                  {dollar_row ? prettify_dollars(cellValue) : perc_row ? prettify_percent(cellValue) : (cellValue*1).toFixed(0)}
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

export default RevCons;