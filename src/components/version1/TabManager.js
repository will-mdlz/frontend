import React, { useState, useEffect } from 'react';
import { Tab, Box, Divider, } from '@mui/material';
import DataTable from './DataTable'; // Adjust path as necessary
import DataManager from '../data/DataManager'; // Adjust path as necessary
import SettingsBox from './tabmanager/SettingsBox';
import AddTab from './tabmanager/AddTab';
import { REGIONS } from '../constants/Constants'; // Adjust path as necessary

const TabManager = () => {
  const [selectedTab, setSelectedTab] = useState(REGIONS[0]); // Set initial tab to the first region
  const [selectedSubtab, setSelectedSubtab] = useState(REGIONS[0]); // Handle subtab selection
  const [arrayIndex, setArrayIndex] = useState(0); // Default to 0 or based on initial setup
  const [showDialog, setShowDialog] = useState(false); // Control dialog visibility
  const [yearInfo, setYearInfo] = useState([2021, 2, 12])
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDataTable = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Trigger a re-render by changing the state
  };

  // Create dynamic TABS based on REGIONS, each with its own name as subtab
  const [TABS, setTabs] = useState(REGIONS.reduce((acc, region) => {
    acc[region] = [region]; // Each region has itself as the only subtab initially
    return acc;
  }, {}));

  // Initialize default subtab if only one is available
  useEffect(() => {
    if (TABS[selectedTab] && TABS[selectedTab].length === 1) {
      setSelectedSubtab(TABS[selectedTab][0]);
    } 
  }, [selectedTab, TABS]); // Include TABS in the dependency array

  const handleTabChange = (event, newTab) => {
    // Prevent re-selection of the already opened tab
    if (newTab === selectedTab) {
      return; // Do nothing if the tab is already open
    }
    // Update priorSubtab before changing tab
    DataManager.updateRegionArray(selectedTab, TABS[selectedTab].slice(1));
    //changing region, need to update whole of region
    if(newTab === "GLOBAL") {
      DataManager.updateRegionArray(newTab, REGIONS.slice(0,4));
    }

    setSelectedTab(newTab);
    const firstSubtab = TABS[newTab][0]; // Access the first subtab for the new tab
    setSelectedSubtab(firstSubtab);
    const prev_index = DataManager.getPrevIndex(selectedSubtab);
    setArrayIndex(prev_index); // Reset to default arrayIndex when tab changes
  };

  const handleSubtabChange = (event, newSubtab) => {
    if (newSubtab !== `add-subtab-${selectedTab}`) {
      // Update priorSubtab before changing subtab
      if(REGIONS.includes(newSubtab)) {
        DataManager.updateRegionArray(selectedTab, TABS[newSubtab].slice(1));
      }
      setSelectedSubtab(newSubtab);
      const prev_index = DataManager.getPrevIndex(newSubtab);
      setArrayIndex(prev_index); // Reset to default arrayIndex when subtab changes
    }
  };

  // Generate tabs with single subtab (itself) inline
  const renderTabsWithSubtabs = () => {
    return REGIONS.flatMap((tab, index) => [
      <Tab
        key={`main-${tab}`}
        label={tab}
        value={tab}
        onClick={() => handleTabChange(null, tab)}
        sx={{
          flexShrink: 0,
          backgroundColor: selectedTab === tab ? 'darkgreen' : 'lightgreen',
          color: selectedTab === tab ? 'white' : 'black',
          marginRight: 0.5,
          '&:hover': {
            backgroundColor: selectedTab === tab ? 'darkgreen' : 'lightgreen',
            color: selectedTab === tab ? 'white' : 'black',
            marginLeft: 1
          }
        }}
      />,
      ...(selectedTab === tab ? [
        ...TABS[tab].map((subtab) => (
          <Tab
            key={`sub-${subtab}`}
            label={subtab}
            value={subtab}
            onClick={(event) => handleSubtabChange(event, subtab)}
            sx={{
              backgroundColor: selectedSubtab === subtab ? 'darkorange' : 'lightorange',
              color: 'black',
              borderRadius: 1,
              marginLeft: 0.5,
              '&:hover': {
                backgroundColor: 'darkorange',
                color: 'white'
              }
            }}
          />
        )),
        ...(index < 4 ? [ // Add rightmost subtab only for the first 4 tabs
          <Tab
            key={`add-subtab-${tab}`}
            label="+"
            value={`add-subtab-${tab}`}
            onClick={() => handleAddSubtab(tab)}
            sx={{
              backgroundColor: 'lightblue',
              color: 'black',
              borderRadius: 1,
              marginLeft: 1,
              marginRight: 1,
              '&:hover': {
                backgroundColor: 'darkblue',
                color: 'white'
              }
            }}
          />
        ] : []),
      ] : []),
    ]);
  };

  const handleTabAdd = (newTabName, country, currency) => {
    if(newTabName && country && currency) {
      DataManager.initCountry(newTabName, country, true, selectedTab, currency);
      const updatedTabs = { ...TABS };
      if (!updatedTabs[selectedTab].includes(newTabName)) {
        updatedTabs[selectedTab].push(newTabName);
      }
      setTabs(updatedTabs);
      setSelectedSubtab(newTabName);
    }
  };

  const handleAddSubtab = (key) => {
    setShowDialog(true); // Show dialog for country selection
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };


  const handleTabNameChange = (newTabName) => {
    DataManager.countryData[newTabName] = DataManager.countryData[selectedSubtab];
    delete DataManager.countryData[selectedSubtab];
  
      // Create a new tab entry using the provided tab name
      const updatedTabs = { ...TABS };
  
      // Check if the newTabName is already present under the selectedTab
      const index = updatedTabs[selectedTab].indexOf(selectedSubtab)
      updatedTabs[selectedTab][index] = newTabName
  
      // Update the state to trigger a re-render
      setTabs(updatedTabs);
      setSelectedSubtab(newTabName);
  };

  const handleApplySettings = (startYear, actualYears, totalYears) => {
    DataManager.handleYearChange(totalYears, actualYears);
    setYearInfo([startYear, actualYears, totalYears]);
    setTimeout(() => {
      refreshDataTable(); // Trigger DataTable refresh
    }, 10); // Delay to allow DataManager to 
  };

  return (
    <Box sx={{ width: '100%' }} p={0}>
      {/* Tabs and Settings Icon in the Same Row */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Tabs Section */}
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {renderTabsWithSubtabs()}
        </Box>
  
        <SettingsBox onApply={handleApplySettings} initialStartYear={yearInfo[0]} initialActualYears={yearInfo[1]} initialTotalYears={yearInfo[2]}/>
      </Box>

      <Divider sx={{ mt: 1, borderBottomWidth: 2, backgroundColor: 'black' }} />
  
      {/* DataTable Section */}
      <Box sx={{ p: .5 }}>
        {selectedTab && (
          <DataTable
            key={refreshKey}
            real_years={yearInfo[1]} // Example value, update as necessary
            starting_year={yearInfo[0]} // Example value, update as necessary
            total_years={yearInfo[2]}
            country={selectedSubtab} // Use selected subtab if available
            startingindex={arrayIndex}
            dataInput={DataManager.getArray(selectedSubtab, arrayIndex)}
            handleTabChange={handleTabNameChange}
          />
        )}
      </Box>

      {/* Adding a tab */}
      <AddTab open={showDialog} handleClose={handleDialogClose} handleAdd={handleTabAdd}/>
    </Box>
    
  );
};

export default TabManager;
