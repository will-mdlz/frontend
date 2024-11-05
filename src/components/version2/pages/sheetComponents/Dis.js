import { useState } from "react";
import { Button, Divider } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import DisCons from "./templates/DisCons";
import DisTemplate from "./templates/DisTemplate";

const Dis = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.DIS))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender

    const borderColor = "black"

    const handleDataChange = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.DIS);
        keys.forEach((segKey) => {
          if(segKey!=="CONS") dataManagerInstance.calcRev(segKey);
        });
        dataManagerInstance.calcConsolidatedDis();
        setDataChanged(prev => !prev); // Toggle state to trigger rerender
      };

    const addDisTemplate = () => {
        dataManagerInstance.addDis();
        dataManagerInstance.calcConsolidatedDis();
        setKeys(Object.keys(dataManagerInstance.rawdata.DIS));
    }

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
        sx={{ mt: 2 }}
        >
        Add New Dis Synergy
        </Button>
    </div>
    );
};

export default Dis;