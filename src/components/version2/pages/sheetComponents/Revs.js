import { useState } from "react";
import { Divider, Button, Select, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, DialogActions } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import RevCons from "./templates/RevCons";
import RevTemplate from "./templates/RevTemplate";

const Revs = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.REV))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    const [selectedSegment, setSelectedSegment] = useState('');
    const [open, setOpen] = useState(false);
    
    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.REV);
        keys.forEach((segKey) => {
          if(segKey!=="CONS"&&segKey!=="Syn") {
            console.log(segKey)
            dataManagerInstance.calcRev(segKey);}
        });
        dataManagerInstance.calcConsolidatedRev();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addRevTemplate = () => {
        dataManagerInstance.addRevSyn();
        dataManagerInstance.calcConsolidatedRev();
        setKeys(Object.keys(dataManagerInstance.rawdata.REV));
    }

    const removeRevTemplate = () => {
        if (selectedSegment) {
            dataManagerInstance.removeRev(selectedSegment); // Invoke remove function with selected segment
            setKeys(Object.keys(dataManagerInstance.rawdata.REV));
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
        <RevCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS" || segKey === "Syn") {
            return null;  // Skip over "CONS"
        }
        return (
            <div key={segKey}>
            <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: borderColor }} />
            <RevTemplate segKey={segKey} handleDataChanged={handleDataChange}/>
            </div>
        );
        })}
        <Button
        variant="contained"
        color="primary"
        onClick={addRevTemplate}
        sx={{ mt: 2, mr: 2 }}
        >
        Add New Revenue Synergy
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2 }}
        >
        Remove Revenue Synergy
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Cost to Remove</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Revenue Synergy</InputLabel>
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
          <Button onClick={removeRevTemplate} color="secondary" disabled={!selectedSegment}>
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default Revs;