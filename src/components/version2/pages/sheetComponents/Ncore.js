import { useState } from "react";
import { Divider, Button, Select, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, DialogActions } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import NcoreCons from "./templates/NcoreCons";
import NcoreTemplate from "./templates/NcoreTemplate";

const Ncore = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.NCORE))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    const [selectedSegment, setSelectedSegment] = useState('');
    const [open, setOpen] = useState(false);

    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.NCORE);
        keys.forEach((segKey) => {
          if(segKey!=="CONS") dataManagerInstance.calcNcore(segKey);
        });
        dataManagerInstance.calcConsolidatedNcore();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addNcoreTemplate = () => {
        dataManagerInstance.addNcore();
        dataManagerInstance.calcConsolidatedNcore();
        setKeys(Object.keys(dataManagerInstance.rawdata.NCORE));
    }

    const removeNcoreTemplate = () => {
        if (selectedSegment) {
            dataManagerInstance.removeNcore(selectedSegment); // Invoke remove function with selected segment
            setKeys(Object.keys(dataManagerInstance.rawdata.NCORE));
            setDataChanged(!dataChanged)
            handleClose();
        }
    }

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setSelectedSegment('');
        setOpen(false);
    };

    return (
    <div>
        <NcoreCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS") {
            return null;  // Skip over "CONS"
        }
        return (
            <div key={segKey}>
            <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: borderColor }} />
            <NcoreTemplate segKey={segKey} handleDataChanged={handleDataChange}/>
            </div>
        );
        })}
        <Button
        variant="contained"
        color="primary"
        onClick={addNcoreTemplate}
        sx={{ mt: 2, mr: 2 }}
        >
        Add New Non-Core
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2, mr: 2 }}
        >
        Remove Non-Core
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Non-Core to Remove</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Non-Core</InputLabel>
            <Select
              value={selectedSegment}
              onChange={(event) => setSelectedSegment(event.target.value)}
              label="Segment"
            >
                {keys
                .filter(segment => segment !== "CONS")
                .map((segment) => (
                    <MenuItem key={segment} value={segment}>
                    {segment}
                    </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={removeNcoreTemplate} color="secondary" disabled={!selectedSegment}>
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default Ncore;