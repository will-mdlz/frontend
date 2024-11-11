import { useState } from "react";
import { Divider, Button, Select, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, DialogActions } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import CostCons from "./templates/CostCons";
import CostTemplate from "./templates/CostTemplate";

const Costs = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.COST))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    const [selectedSegment, setSelectedSegment] = useState('');
    const [open, setOpen] = useState(false);

    //const keys = Object.keys(dataManagerInstance.rawdata.COST);
    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.COST);
        keys.forEach((segKey) => {
          if(segKey!=="CONS") dataManagerInstance.calcCost(segKey);
        });
        dataManagerInstance.calcConsolidatedCost();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addCostTemplate = () => {
        dataManagerInstance.addCostSyn();
        dataManagerInstance.calcConsolidatedCost();
        setKeys(Object.keys(dataManagerInstance.rawdata.COST));
        console.log(keys)
    }

    const removeCostTemplate = () => {
        if (selectedSegment) {
            dataManagerInstance.removeCost(selectedSegment); // Invoke remove function with selected segment
            setKeys(Object.keys(dataManagerInstance.rawdata.COST));
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
        <CostCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS") {
            return null;  // Skip over "CONS"
        }
        return (
            <div key={segKey}>
            <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: borderColor }} />
            <CostTemplate segKey={segKey} handleDataChanged={handleDataChange}/>
            </div>
        );
        })}
        <Button
        variant="contained"
        color="primary"
        onClick={addCostTemplate}
        sx={{ mt: 2, mr: 2}}
        >
        Add New Cost Synergy
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2 }}
        >
        Remove Cost
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Cost to Remove</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Cost</InputLabel>
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
          <Button onClick={removeCostTemplate} color="secondary" disabled={!selectedSegment}>
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default Costs;