import { useState } from "react";
import { Divider, Button, Select, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, DialogActions } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import DisCons from "./templates/DisCons";
import DisTemplate from "./templates/DisTemplate";

const Dis = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.DIS))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    const [selectedSegment, setSelectedSegment] = useState('');
    const [open, setOpen] = useState(false);

    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.DIS);
        keys.forEach((segKey) => {
          if(segKey!=="CONS" && segKey!=="Syn") dataManagerInstance.calcDis(segKey);
        });
        dataManagerInstance.calcConsolidatedDis();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addDisTemplate = () => {
        dataManagerInstance.addDis();
        dataManagerInstance.calcConsolidatedDis();
        setKeys(Object.keys(dataManagerInstance.rawdata.DIS));
    }

    const removeDisTemplate = () => {
        if (selectedSegment) {
            dataManagerInstance.removeDis(selectedSegment); // Invoke remove function with selected segment
            setKeys(Object.keys(dataManagerInstance.rawdata.DIS));
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
        <DisCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS") {
            return null;  // Skip over "CONS"
        }
        return (
            <div key={segKey}>
            <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: borderColor }} />
            <DisTemplate segKey={segKey} handleDataChanged={handleDataChange}/>
            </div>
        );
        })}
        <Button
        variant="contained"
        color="primary"
        onClick={addDisTemplate}
        sx={{ mt: 2, mr: 2 }}
        >
        Add New Dis Synergy
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2, mr: 2 }}
        >
        Remove Dis Synergy
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Dis Synergy to Remove</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Dis Synergy</InputLabel>
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
          <Button onClick={removeDisTemplate} color="secondary" disabled={!selectedSegment}>
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default Dis;