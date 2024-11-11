import { useState } from "react";
import { Divider, Button, Select, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, DialogActions } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import SegTemplate from "./templates/SegTemplate";
import SegCons from "./templates/SegCons";

const Segments = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.SEG))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    const [selectedSegment, setSelectedSegment] = useState('');
    const [open, setOpen] = useState(false);

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.SEG);
        keys.forEach((segKey) => {
          if(segKey!=="CONS") dataManagerInstance.calcSegment(segKey);
        });
        dataManagerInstance.calcConsolidatedSegment();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    //const keys = Object.keys(dataManagerInstance.rawdata.SEG);
    const borderColor = "black"

    const addSegTemplate = () => {
        dataManagerInstance.addSegment();
        dataManagerInstance.calcConsolidatedSegment();
        setKeys(Object.keys(dataManagerInstance.rawdata.SEG));
    }

    const removeSegTemplate = () => {
        if (selectedSegment) {
            dataManagerInstance.removeSegment(selectedSegment); // Invoke remove function with selected segment
            setKeys(Object.keys(dataManagerInstance.rawdata.SEG));
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
        <SegCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS") {
            return null;  // Skip over "CONS"
        }
        return (
            <div key={segKey}>
            <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: borderColor }} />
            <SegTemplate segKey={segKey} handleDataChanged={handleDataChange} />
            </div>
        );
        })}
        <Button
        variant="contained"
        color="primary"
        onClick={addSegTemplate}
        sx={{ mt: 2, mr: 2 }}
        >
        Add New Segment
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2 }}
        >
        Remove Segment
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Segment to Remove</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Segment</InputLabel>
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
          <Button onClick={removeSegTemplate} color="secondary" disabled={!selectedSegment}>
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default Segments;