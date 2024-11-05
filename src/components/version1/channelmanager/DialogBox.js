import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,} from '@mui/material';

const DialogBox = ({ openText, title, labelText, handleClose, handleFunction, }) => {
    const [value, setValue] = useState(''); // Track new channel name

    const handle = () => {
        handleFunction(value);
        setValue('')
    }

    return (
    <Dialog open={openText} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField 
          label={labelText}
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              handle(); // Trigger add channel and close dialog on Enter key press
              handleClose();
            }
          }}
          fullWidth 
          variant="outlined"
          sx ={{marginBottom:1}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={() => { handle(); handleClose(); }} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
    );
};

export default DialogBox;