import React, { useState } from 'react';
import { Tab, Box, Button } from '@mui/material';

const ButtonTabs = ({TabNames, SubTabNames, handleAction, changed}) => {
    const margin = 2;

    const [selectedTab, setSelectedTab] = useState(null); // Main tab

    // Handle main tab change
    const handleTabChange = (event, tab) => {
        setSelectedTab((prevTab) => (prevTab === tab ? null : tab));
    };

    // Handle subtab change
    const handleSubtabClick = (event, subtab) => {
        if (handleAction) {
            handleAction(subtab); // Call the passed action handler
          }
    };

    return (
        <Box display="flex" flexDirection="row" justifyContent="flex-start" p={1}>
        {/* Main Tabs and corresponding Subtabs */}
        {TabNames.flatMap((tab, index) => [
            <Tab
            key={`main-${tab}`}
            label={tab}
            value={tab}
            onClick={() => handleTabChange(null, tab)}
            sx={{
                fontSize: '13px', // Smaller font size
                padding: '2px 4px', // Adjust padding to reduce height
                minHeight: '30px',  // Control minimum height to shrink the tab
                backgroundColor: selectedTab === tab ? 'darkcyan' : 'lavender',
                color: selectedTab === tab ? 'white' : 'black',
                borderRadius: 1,
                marginRight: margin,
                '&:hover': {
                backgroundColor: 'darkcyan',
                color: 'white',
                },
            }}
            />,
            ...(selectedTab === tab ? (
            SubTabNames[index].map((subtab) => (
                <Button
                key={`sub-${subtab}`}
                variant="contained"
                onClick={(event) => handleSubtabClick(event, subtab)}
                sx={{
                    fontSize: '11px', // Smaller font size for subtabs
                    padding: '2px 6px', // Small padding to reduce button size
                    minHeight: '22px',  // Control minimum height for subtabs
                    backgroundColor: 'white',
                    color: 'black',
                    borderColor: 'black',
                    borderRadius: 1,
                    marginRight: margin,
                    '&:hover': {
                    backgroundColor: 'darkorange',
                    color: 'white',
                    },
                }}
                >
                {subtab}
                </Button>
            ))
            ) : [])
        ])}
        </Box>
    );
};

export default ButtonTabs;
