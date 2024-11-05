import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import dataManagerInstance from '../../../DataManagement/Data';
import { row_labels as labels } from '../../../constants';

const PnLTemplate = ({val}) => {
    const [data, setData] = useState([]);
    const hasCombinedData = useRef(false);

    useEffect(() => {
      // Fetch the combined data only once when the component mounts
      if(!hasCombinedData.current) {
        dataManagerInstance.calcSynergizedForecast();
        const combinedData = val === 0 ? dataManagerInstance.getCombinedStandalone() : dataManagerInstance.getCombinedSynergized();
        setData(combinedData);
        hasCombinedData.current = true;
      }
    }, [val, data]);

  let num_before = 0;
    const fadedColor = 'gainsboro'
  let perc_rows = [1,3,5,7,9,11]
  let dollar_rows = [0,2,8,10]

  const generateColumnLabels = (startingYear, numberOfYears) => {
    const labels = [];
    for (let i = 0; i < numberOfYears; i++) {
      labels.push(startingYear + i);
    }
    return labels;
  };

  const generateRowLabels = () => {
    let row_labels = [];
    if(val===0) {
        Object.keys(dataManagerInstance.rawdata.SEG).forEach((key) => {
            if(key!=="CONS") {
                row_labels.push(`Segment ${key}`);
                num_before++;
            }
        })
    } else {
        row_labels.push("Base Revenue");
        row_labels.push("Revenue Synergies");
        num_before = 2;
    }
    for(let i = 0; i < labels.length; i++) {
        row_labels.push(labels[i]);
    }

    perc_rows = [1,3,5,7,9,11]
    dollar_rows = [0,2,8,10]

    return row_labels;
  };

  const total_years = dataManagerInstance.numYears;
  const COLUMN_LABELS = generateColumnLabels(2025, total_years);
  const ROW_LABELS = generateRowLabels();

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
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow style={firstRowBorderStyle}>
          <TableCell style={headerStyle} padding="none" sx={{ width: '150px',height: '15px'}}>
            {val===0 ? "Standalone Forecast" : "Synergized Forecast"}
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
            const prior_row = rowIndex < num_before;
            const perc_row = perc_rows.includes(rowIndex-num_before);
            const dollar_row = dollar_rows.includes(rowIndex-num_before);
            const indentStyle = (prior_row || perc_row) ? { paddingLeft: '20px', fontSize: 12, } : dollar_row ? dollarStyle : {};
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

export default PnLTemplate;