import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
//import InputPage1 from './page1components/InputPage1';
import ReturnsAVP from './page1components/ReturnAVP';
import SynergizedPNL from './page1components/SynergizedPNL';
import dataManagerInstance from '../DataManagement/Data';

const AVP = () => {
  const [prices, setPrices] = useState([190, 200, 210, 220, 230, 240])
  const [numyears, setNumyears] = useState(5)

  useEffect(() => {
    dataManagerInstance.initialCalc();
    dataManagerInstance.calcSynergizedForecast();
    dataManagerInstance.calcAVP(prices, numyears);
  }, [prices, numyears])

  const maxHeight = 800;

  return (
    <div>
      <Grid container paddingTop={1}>
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={4} >
          {/* <InputPage1 maxHeight={maxHeight} handleDataChange={handleDataChange}/> */}
        </Grid>
        <Grid item xs={12} >
          <ReturnsAVP maxHeight={maxHeight} prices={prices} numyears={numyears}/>
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
