import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PriceIRR from './sensitivityComponents/PriceIRR';
import GrowthIRR from './sensitivityComponents/GrowthIRR';
import GrowthNPV from './sensitivityComponents/GrowthNPV';
import PriceEPS from './sensitivityComponents/PriceEPS';
import PriceGrowthIRR from './sensitivityComponents/PriceGrowthIRR';
import GrowthEPS from './sensitivityComponents/GrowthEPS';

const Sensitivities = () => {

  return (
    <div>
      <Box 
        sx={{
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          mt: 1
        }}
      >
        <Typography variant="body1" color="textSecondary">
          Note: Growth rate applies to only the consolidated segment sheet, not the individual segments. first start 
          year will be the trade year (see Control Input page) and the rate will be applied for 10 years. 
        </Typography>
      </Box>
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
          <PriceGrowthIRR />
        </Grid>
        <Grid item xs={6} >
          <PriceEPS />
        </Grid>
      </Grid>
      <Grid container spacing={1} paddingTop={4} >
        {/* InputPage1 and ReturnsAVP split the screen in half */}
        <Grid item xs={6} >
          <GrowthEPS />
        </Grid>
        <Grid item xs={6} >
          <GrowthNPV />
        </Grid>
      </Grid>
    </div>
  );
};

export default Sensitivities;
