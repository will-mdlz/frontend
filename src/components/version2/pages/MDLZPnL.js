// Page1.js
import React from 'react';
import MDLZTargetPnL from './mdlzComponents/MDLZTargetPnL';
import { Divider } from '@mui/material';

const MDLZPnL = () => {
  return <div>
    <MDLZTargetPnL val={1}/>
    <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: 'black' }} />
    <MDLZTargetPnL val={2}/>
  </div>;
};

export default MDLZPnL;
