import { useState } from "react";
import { Divider, Button } from "@mui/material";
import dataManagerInstance from "../../DataManagement/Data";
import SegTemplate from "./templates/SegTemplate";
import SegCons from "./templates/SegCons";

const Segments = () => {
    const [keys, setKeys] = useState(Object.keys(dataManagerInstance.rawdata.SEG))
    const [dataChanged, setDataChanged] = useState(false); // State to trigger rerender

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
        sx={{ mt: 2 }}
        >
        Add New Segment
        </Button>
    </div>
    );
};

export default Segments;