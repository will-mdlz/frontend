import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, Button, Select, InputLabel, MenuItem, FormControl, DialogTitle } from '@mui/material';

const DialogSelect = ({open, handleFunction, handleClose, title, obj, val}) => {
    const [value, setValue] = useState(''); // Track new channel name

    const handleChange = (event) => {
        setValue(event.target.value)
    };

    const close = () => {
        handleClose();
        setValue('');
    }

    return (
        <div>
            <Dialog disableEscapeKeyDown open={open} onClose={close} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
            <FormControl margin='normal' fullWidth error>
              <InputLabel>Associated {(val===0) ? "Country" : "Currency"}</InputLabel>
              <Select
                value={value}
                label="Country"
                onChange={handleChange}
                MenuProps={{
                    style: {
                        maxHeight: 400,
                    }
                }}
              >
                {Object.keys(obj).map((countryName) => (
                <MenuItem key={countryName} value={countryName}>
                    {countryName}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={() => {handleFunction(value); close();}} color="primary">Add</Button>
            </DialogActions>
            </Dialog>
        </div>
    );

};

export default DialogSelect;