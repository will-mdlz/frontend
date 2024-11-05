import React, { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, Button, TextField, Select, InputLabel, MenuItem, FormControl, DialogTitle } from '@mui/material';
import { RATES, CURRENCIES } from '../../constants/Constants'; // Adjust path as necessary 

const AddTab = ({ open, handleClose, handleAdd}) => {
    const [newTabName, setNewTabName] = useState('');
    const [country, setCountry] = useState('');
    const [currency, setCurrency] = useState('');

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value)
    }

    const clearState = () => {
        setNewTabName('');
        setCountry('');
        setCurrency('');
    }

    const close = () => {handleClose(); clearState()}

    return (
        <div>
        <Dialog disableEscapeKeyDown open={open} onClose={close} maxWidth="sm" fullWidth >
        <DialogTitle>Add Tab Name</DialogTitle>
        <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Tab Name Input */}
                <TextField
                    fullWidth
                    label="Enter Tab Name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)} // Update tab name state
                    variant="outlined"
                    margin="normal"
                />

            {/* Country Selection Dropdown */}
            <FormControl margin='normal' fullWidth error>
              <InputLabel>Associated Country</InputLabel>
              <Select
                value={country}
                label="Country"
                onChange={handleCountryChange}
                MenuProps={{
                    style: {
                        maxHeight: 400,
                    }
                }}
              >
                {Object.keys(RATES).map((countryName) => (
                <MenuItem key={countryName} value={countryName}>
                    {countryName}
                </MenuItem>
                ))}
              </Select>
            </FormControl>

          {/* Currency Selection Dropdown */}
          <FormControl margin='normal' fullWidth error>
              <InputLabel>Associated Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={handleCurrencyChange}
              >
                {Object.keys(CURRENCIES).map((countryName) => (
                <MenuItem key={countryName} value={countryName}>
                    {countryName}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
            </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={() => {handleAdd(newTabName, country, currency); close();}} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
};

export default AddTab;