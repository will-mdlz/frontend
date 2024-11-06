import React, { useState } from 'react';
import { Menu, MenuItem, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AVP from './pages/AVP';
import PnLSheets from './pages/PnLSheets';
import MDLZPnL from './pages/MDLZPnL';
import Sensitivities from './pages/Sensitivities';
import GenInput from './pages/GenInput';
import dataManagerInstance from './DataManagement/Data';

const PageManager = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState('Page1');  // Default to Page1

  dataManagerInstance.initialCalc();
  dataManagerInstance.calcConsolidatedSegment();

  const pages = {
    Page1: <AVP />,
    Page2: <Sensitivities />,
    Page3: <PnLSheets />,
    Page4: <MDLZPnL />,
    Page5: <GenInput />,
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (page) => {
    setAnchorEl(null);
    if (page) setCurrentPage(page);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1, fontStyle: 'italic', color: 'gold' }}>
            M&A Tool V1.0
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleMenuClose(null)}
          >
            <MenuItem onClick={() => handleMenuClose('Page1')}>Analysis at Various Prices</MenuItem>
            <MenuItem onClick={() => handleMenuClose('Page2')}>Sensitivity Tables</MenuItem>
            <MenuItem onClick={() => handleMenuClose('Page3')}>P&L Sheets</MenuItem>
            <MenuItem onClick={() => handleMenuClose('Page4')}>Mondelez P&L</MenuItem>
            <MenuItem onClick={() => handleMenuClose('Page5')}>Control Input</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div>
        {pages[currentPage]}
      </div>
    </>
  );
};

export default PageManager;
