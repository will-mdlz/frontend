import React, { useState } from 'react';
import * as XLSX from 'xlsx';
// import * as constants from "../constants";
// import dataManagerInstance from './Data';

const ImportData = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // store the file object
  };

  const readFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          if (sheetName.toLowerCase().includes('segment')) {
            processSegmentData(sheetData);
          // } else if (sheetName.toLowerCase().includes('revenue synergy')) {
          //   processRevenueSynergy(sheetData);
          // } else if (sheetName.toLowerCase().includes('cost synergy')) {
          //   processCostSynergy(sheetData);
          // } else if (sheetName.toLowerCase().includes('pnl')) {
          //   processPnLData(sheetData);
          } else {
            console.log(`Unrecognized sheet: ${sheetName}`);
          }

        });
      };
      reader.readAsArrayBuffer(file); // Read file
    } else {
      alert("No file selected");
    }
  };

  const processSegmentData = (data) => {
    // const seg = dataManagerInstance.createEmptyArray(constants.seg_labels.length, dataManagerInstance.numYears)
    // const startYear = 2025 //datamanager.getStartYear
    // for(let i = 0; i < data.length; i++) {
    //   const line = data[i];
    //   console.log(i, line)
      
    // }
    console.log('kill me')
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={readFile}>Read File</button>
    </div>
  );
};

export default ImportData;
