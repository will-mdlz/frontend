import React, {  } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Segments from './sheetComponents/Segments';
import Costs from './sheetComponents/Costs';
import Revs from './sheetComponents/Revs';
import Dis from './sheetComponents/Dis';
import Ncore from './sheetComponents/Ncore';
import dataManagerInstance from '../DataManagement/Data';

const PnLSheets = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if(newValue===0) {
      updateSegments();
    } else if(newValue===1) {
      updateCosts();
    } else if(newValue===2) {
      updateRevs();
    } else if(newValue===3) {
      updateDis();
    } else if(newValue===4) {
      updateNcore();
    }
  };

  const updateSegments = () => {
    const keys = Object.keys(dataManagerInstance.rawdata.SEG);
    keys.forEach((segKey) => {
      if(segKey!=="CONS"&&segKey!=="Syn") dataManagerInstance.calcSegmentCOGS(segKey);
    });
    dataManagerInstance.calcConsolidatedSegment();
  }

  const updateCosts = () => {
    const keys = Object.keys(dataManagerInstance.rawdata.COST);
    keys.forEach((segKey) => {
      if(segKey!=="CONS") dataManagerInstance.calcCost(segKey);
    });
    dataManagerInstance.calcConsolidatedCost();
  }

  const updateRevs = () => {
    const keys = Object.keys(dataManagerInstance.rawdata.REV);
    keys.forEach((segKey) => {
      if(segKey!=="CONS" && segKey!=="Syn") dataManagerInstance.calcRev(segKey);
    });
    dataManagerInstance.calcConsolidatedRev();
  }

  const updateDis = () => {
    const keys = Object.keys(dataManagerInstance.rawdata.DIS);
    keys.forEach((segKey) => {
      if(segKey!=="CONS") dataManagerInstance.calcDis(segKey);
    });
    dataManagerInstance.calcConsolidatedDis();
  }

  const updateNcore = () => {
    const keys = Object.keys(dataManagerInstance.rawdata.NCORE);
    keys.forEach((segKey) => {
      if(segKey!=="CONS") dataManagerInstance.calcNcore(segKey);
    });
    dataManagerInstance.calcConsolidatedNcore();
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth" // Makes the tabs evenly spaced
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Segments" />
        <Tab label="Cost Synergy" />
        <Tab label="Revenue Synergy" />
        <Tab label="Dis Synergy" />
        <Tab label="Non Core" />
      </Tabs>
      {/* You can conditionally render content based on the selected tab */}
      <Box mt={.5}>
        {value === 0 && <div><Segments/></div>}
        {value === 1 && <div><Costs /></div>}
        {value === 2 && <div><Revs /></div>}
        {value === 3 && <div><Dis /></div>}
        {value === 4 && <div><Ncore /></div>}
      </Box>
    </Box>
  );
};

export default PnLSheets;