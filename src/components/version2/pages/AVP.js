import React from 'react';
import { Grid } from '@mui/material';
//import InputPage1 from './page1components/InputPage1';
import ReturnsAVP from './page1components/ReturnAVP';
import SynergizedPNL from './page1components/SynergizedPNL';
import dataManagerInstance from '../DataManagement/Data';

const AVP = () => {
  //const [dataChanged, setDataChanged] = React.useState(false); // State to trigger rerender

  React.useEffect(() => {
    dataManagerInstance.calcSynergizedForecast();
    //dataManagerInstance.calcConsolidatedSegment();
    //dataManagerInstance.calcAVP();
  }, [])

  // const handleDataChange = () => {
  //   const keys = Object.keys(dataManagerInstance.rawdata.SEG);
  //   keys.forEach((segKey) => {
  //     if(segKey!=="CONS") dataManagerInstance.calcSegment2(segKey);
  //   });
  //   dataManagerInstance.calcConsolidatedSegment();
  //   setDataChanged(prev => !prev); // Toggle state to trigger rerender
  // };

  const prices = [210, 220, 230, 240, 250, 260]

  const maxHeight = 680;

  return (
    <div>
      <Grid container paddingTop={1}>
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={4} >
          {/* <InputPage1 maxHeight={maxHeight} handleDataChange={handleDataChange}/> */}
        </Grid>
        <Grid item xs={12} >
          <ReturnsAVP maxHeight={maxHeight} prices={prices} />
        </Grid>
        {/* SynergizedPNL takes full width below */}
        <Grid item xs={12} paddingTop={1}>
          <SynergizedPNL />
        </Grid>
      </Grid>
    </div>
  );
};

export default AVP;
