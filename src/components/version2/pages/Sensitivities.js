import React from 'react';
import { Grid } from '@mui/material';
import PriceIRR from './sensitivityComponents/PriceIRR';
import GrowthIRR from './sensitivityComponents/GrowthIRR';
import GrowthNPV from './sensitivityComponents/GrowthNPV';
import PriceEPS from './sensitivityComponents/PriceEPS';
import PriceGrowthIRR from './sensitivityComponents/PriceGrowthIRR';
import GrowthEPS from './sensitivityComponents/GrowthEPS';

const Sensitivities = () => {

  return (
    <div>
      <Grid container spacing={1} paddingTop={1} >
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={6} >
          <PriceIRR />
        </Grid>
        <Grid item xs={6} >
          <GrowthIRR />
        </Grid>
      </Grid>
      <Grid container spacing={1} paddingTop={4} >
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={6} >
          <GrowthNPV />
        </Grid>
        <Grid item xs={6} >
          <PriceEPS />
        </Grid>
      </Grid>
      <Grid container spacing={1} paddingTop={4} >
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={6} >
          <PriceGrowthIRR />
        </Grid>
        <Grid item xs={6} >
          <GrowthEPS />
        </Grid>
      </Grid>
    </div>
  );
};

export default Sensitivities;
