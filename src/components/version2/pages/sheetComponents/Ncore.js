import { useState } from "react";
import { Button, Divider } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import NcoreCons from "./templates/NcoreCons";
import NcoreTemplate from "./templates/NcoreTemplate";

const Ncore = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.NCORE))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender

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
        sx={{ mt: 2 }}
        >
        Add New Non-Core
        </Button>
    </div>
    );
};

export default Ncore;