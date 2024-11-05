import { useState } from "react";
import { Divider, Button } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import RevCons from "./templates/RevCons";
import RevTemplate from "./templates/RevTemplate";

const Revs = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.REV))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender
    
    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.REV);
        keys.forEach((segKey) => {
          if(segKey!=="CONS") dataManagerInstance.calcRev(segKey);
        });
        dataManagerInstance.calcConsolidatedRev();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addRevTemplate = () => {
        dataManagerInstance.addRevSyn();
        dataManagerInstance.calcConsolidatedRev();
        setKeys(Object.keys(dataManagerInstance.rawdata.REV));
    }
    
    return (
    <div>
        <RevCons dataChanged={dataChanged}/>
        {keys.map((segKey) => {
        if (segKey === "CONS") {
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
        sx={{ mt: 2 }}
        >
        Add New Revenue Synergy
        </Button>
    </div>
    );
};

export default Revs;