import { useState } from "react";
import { Divider, Button } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import CostCons from "./templates/CostCons";
import CostTemplate from "./templates/CostTemplate";

const Costs = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.COST))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender

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
        sx={{ mt: 2 }}
        >
        Add New Cost Synergy
        </Button>
    </div>
    );
};

export default Costs;