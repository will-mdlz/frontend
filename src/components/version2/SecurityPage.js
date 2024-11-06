// SecurityPage.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function SecurityPage({ onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: '#1976d2' }}  // Blue background
    >
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          required
          InputLabelProps={{
            style: { color: 'white' }, // White label color
          }}
          InputProps={{
            style: { color: 'white' }, // White text input color
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white input background
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // White border
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#90caf9', // Lighter blue on hover
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: '100%' }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default SecurityPage;
