// Page1.js
import React, { useState } from 'react';
import { TextField, Typography, Box, Button, Grid, Divider } from '@mui/material';
import dataManagerInstance from '../DataManagement/Data';

const GenInput = () => {
  // Initialize local state with the AVP data
  const [fileName, setFileName] = useState('');
  const [genData, setGenData] = useState(dataManagerInstance.input["GEN"]);
  const [costData, setCostData] = useState(dataManagerInstance.input["COST"])
  const [originalValue, setOriginalValue] = useState('');
  const [val, setVal] = useState('')
  const [editmode, setEditMode] = useState([])

  let percents = [0,1,2,3,4,10,11,12,14,18,21,23,25,35,36,39,40]
  let dollars = [5,6,7,8,9,13,15,16,19,20,22,24,26,27,28,29,30,31,32,33,34,37,38,41,42]


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name to display
      dataManagerInstance.handleFileUpload(event); // Call your existing upload handler
    }
  };

  const prettify_dollars = (input) => {
if (input < 1000 && input > -1000) {
      return input > 0 ? "$" + (input*1).toFixed(2) : "$(" + (input*-1).toFixed(2) + ")";
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

  const convertValToDol = (value) => {
    return parseFloat(value.replace("$", "").replace(",", "").replace("(", "-").replace(")", "")) || 0;
  }

  const convertValToPerc = (value) => {
    return parseFloat(value.replace('%', '')) / 100 || 0;
  }

  const isEditing = (table, key) => {
    return table===editmode[0] && key===editmode[1];
  }

  const handleFocus = (table, key, type) => (event) => {
    setOriginalValue(type==="percent" ? convertValToPerc(event.target.value) : type==="dollar" ? convertValToDol(event.target.value) : parseFloat(event.target.value) || 0)
    setEditMode([table, key]);
  }

  const handleInputChange = () => (event) => {
    setVal(event.target.value)
  }

  const handleBlur = (table, key, isPercent) => (event) => {
    const currVal = event.target.value;
    if(table===0) {
      if(currVal==="") {
        if(key < 0) {
          const updatedData = {...costData, Runrate: originalValue};
          setCostData(updatedData);
          dataManagerInstance.input["COST"]["Runrate"] = originalValue;
        } else {
          const updatedData = {...costData, [key]: parseFloat(currVal) || originalValue};
          setCostData(updatedData);
          dataManagerInstance.input["COST"]["Phasing"][key] = parseFloat(currVal) || originalValue;
        }
      } else {
        if(key < 0) {
          const updatedData = {...costData, Runrate: parseFloat(currVal) || originalValue};
          setCostData(updatedData);
          dataManagerInstance.input["COST"]["Runrate"] = parseFloat(currVal) || originalValue;
        } else {
          const updatedData = {...costData, [key]: parseFloat(currVal)/100 || originalValue};
          setCostData(updatedData);
          dataManagerInstance.input["COST"]["Phasing"][key] = parseFloat(currVal)/100 || originalValue;
        }
        setVal('');
      }
    }
    else if(table===1) {
      if(currVal==="") {
        const updatedData = { ...genData, [key]: originalValue };
        setGenData(updatedData);
        dataManagerInstance.input["GEN"][key] = originalValue;
      } else {
        const updatedData = { ...genData, [key]: (isPercent ? parseFloat(currVal)/100 : parseFloat(currVal)) || originalValue };
        setGenData(updatedData);
        dataManagerInstance.input["GEN"][key] = (isPercent ? parseFloat(currVal)/100 : parseFloat(currVal)) || originalValue;
        setVal('');
      }
    }
    setEditMode([])
  }

  const handleFileClick = () => {
    document.getElementById('file-input').click(); // Trigger file input
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ alignItems: 'center', marginTop: 2, width: "95%", marginLeft: 1 }}>
        {/* Save/Upload Box */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid #ccc',
              borderRadius: '8px',
              p: 3,
              maxWidth: '300px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 'bold',
                color: '#333',
                mb: 2,
              }}
            >
              Save / Upload
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 1 }}>
              <Button variant="contained" onClick={dataManagerInstance.saveDataToFile} sx={{ minWidth: '100px' }}>
                Save
              </Button>
              <Button variant="contained" onClick={handleFileClick} sx={{ minWidth: '100px' }}>
                Upload
              </Button>
            </Box>

            <input type="file" id="file-input" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />

            {fileName && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Selected file: {fileName}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Cost Phasing Box */}
        <Grid item xs={12} sm={8}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid #ccc',
              borderRadius: '8px',
              p: 3,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 'bold',
                color: '#333',
                mb: 2,
              }}
            >
              Cost Phasing
            </Typography>

            {/* Add your inputs or additional components here */}
            {/* Example placeholder input fields */}
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                <TextField
                  value={isEditing(0, -1) ? val : prettify_dollars(costData["Runrate"])}
                  onFocus={handleFocus(0, -1, "dollar")}
                  onChange={handleInputChange()}
                  onBlur={handleBlur(0, -1, false)}
                  variant="outlined"
                  size="small"
                  label={"Runrate"}
                  sx={{ minWidth: '70px' }}
                />
              {costData["Phasing"].map((item, index) => (
                <TextField
                  value={isEditing(0, index) ? val : prettify_percent(item)}
                  onFocus={handleFocus(0, index, "percent")}
                  onChange={handleInputChange()}
                  onBlur={handleBlur(0, index, true)}
                  key={index}
                  variant="outlined"
                  size="small"
                  label={`Year ${index+1}`}
                  sx={{ minWidth: '70px' }}
                />
              ))}

            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
      sx={{
        marginTop: 3,
        marginLeft: 3,
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: 3,
        backgroundColor: '#f9f9f9',
        width: '95%',
        //maxWidth: '800px',  // Adjust width as needed
        //mx: 'auto',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        Assumptions
      </Typography>

      <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: 'black' }} />

      <Grid container spacing={2} mt={1}>
      {Object.keys(genData).map((key, index) => {
          // Define constants based on conditions for each item
          const isPercent = percents.includes(index);
          const isDollar = dollars.includes(index);
          const table = 1;
          const displayValue = isEditing(table, key)
            ? val
            : isPercent
            ? prettify_percent(genData[key])
            : isDollar
            ? prettify_dollars(genData[key])
            : genData[key];

          return (
            <Grid item xs={12} sm={4} key={key} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: '40%', marginRight: 1 }}>{key}</Typography>
              <TextField
                value={displayValue}
                onFocus={handleFocus(table, key, isPercent ? "percent" : isDollar ? "dollar" : 0)}
                onChange={handleInputChange()}
                onBlur={handleBlur(table, key, isPercent)}
                variant="outlined"
                size="small"
              />
            </Grid>
          );
      })}
      </Grid>
    </Box>
    </Box>
  );
}

export default GenInput;

