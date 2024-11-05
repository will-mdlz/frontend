import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from '@mui/material';
import { RATES, CURRENCIES } from '../constants/Constants'
import DataManager from '../data/DataManager';
import ButtonTabs from './channelmanager/ButtonTabs';
import DialogBox from './channelmanager/DialogBox';
import DialogSelect from './channelmanager/DialogSelect';

const ChannelManager = ({ country, refreshDataTable, handleTabChange }) => {
  const [channels, setChannels] = useState([]); // State to store the channels list
  const [openDialog, setOpenDialog] = useState(null); // Track which dialog is open
  const [newChannelName, setNewChannelName] = useState(''); // Track new channel name
  const [selectedChannel, setSelectedChannel] = useState(''); // Track selected channel for edit/remove

  // Handle opening the dialog based on action
  const handleAction = (subtab) => {
    if(subtab === SubTabNames[0][0]) {
      setOpenDialog('add');
    } else if(subtab === SubTabNames[0][1]) {
      setOpenDialog('edit');
    } else if(subtab === SubTabNames[0][2]) {
      setOpenDialog('remove');
    } else if(subtab === SubTabNames[2][0]) {
      setOpenDialog('chtab');
    } else if(subtab === SubTabNames[2][1]) {
      setOpenDialog('chcount');
    } else if(subtab === SubTabNames[2][2]) {
      setOpenDialog('chcur');
    }
  };

  // Add a new channel to the list and update the DataManager
  const handleAddChannel = (channelName) => {
    if (!channels.includes(channelName) && channelName) {
      const updatedChannels = [...channels, channelName];
      setChannels(updatedChannels);
      DataManager.addChannel(channelName); // Call DataManager to handle further processing
      setTimeout(() => {
        refreshDataTable(); // Trigger DataTable refresh
      }, 100); // Delay to allow DataManager to update
      setNewChannelName(''); // Clear the input field
      setOpenDialog(null); // Close dialog
      handleClose();
    }
  };

  // Edit selected channel in the list and update DataManager
  const handleEditChannel = () => {
    if (!channels.includes(newChannelName) && selectedChannel && newChannelName) {
      const updatedChannels = channels.map(channel => 
        channel === selectedChannel ? newChannelName : channel
      );
      setChannels(updatedChannels);
      DataManager.editChannel(selectedChannel, newChannelName); // Call DataManager to handle further processing
      refreshDataTable();
      setNewChannelName('');
      setSelectedChannel('');
      setOpenDialog(null);
    }
  };

  // Remove selected channel from the list and update DataManager
  const handleRemoveChannel = () => {
    const updatedChannels = channels.filter(channel => channel !== selectedChannel);
    setChannels(updatedChannels);
    DataManager.removeChannel(selectedChannel); // Call DataManager to handle further processing
    refreshDataTable();
    setSelectedChannel('');
    setOpenDialog(null);
  };

  const handleChangeCountry = (value) => {
    DataManager.countryData[country].wacc = value;
  };

  const handleChangeCurrency = (value) => {
    DataManager.countryData[country].currency = value;
  };

  // Handle dialog closing
  const handleClose = () => {
    setOpenDialog(null);
    setNewChannelName(''); // Reset form
    setSelectedChannel(''); // Reset selection
  };


  const TabNames = ["Add/Remove Channel", "Save/Import Options", "Tab Settings"];
  const SubTabNames = [
    ["Add Channel", "Edit Channel", "Remove Channel"],
    ["Save Section", "Import Section"],
    ['Change Tab Name', 'Change Country', 'Change Currency']
  ];

  return (
    <div>
      <ButtonTabs 
      TabNames={TabNames}
      SubTabNames={SubTabNames}
      handleAction={handleAction}
      />
      
      <DialogBox 
        openText={openDialog==='add'}
        title={"Add Channel"}
        labelText={"Channel Name"}
        handleClose={handleClose}
        handleFunction={handleAddChannel}
      />

      {/* Edit Channel Dialog */}
      <Dialog open={openDialog === 'edit'} onClose={handleClose}>
        <DialogTitle>Edit Channel</DialogTitle>
        <DialogContent>
          <Select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select a Channel</MenuItem>
            {channels.map(channel => (
              <MenuItem key={channel} value={channel}>{channel}</MenuItem>
            ))}
          </Select>
          {selectedChannel && (
            <TextField 
              label="New Channel Name" 
              value={newChannelName} 
              onChange={(e) => setNewChannelName(e.target.value)} 
              fullWidth 
              style={{ marginTop: '16px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditChannel(); // Trigger add channel and close dialog on Enter key press
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditChannel}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Channel Dialog */}
      <Dialog open={openDialog === 'remove'} onClose={handleClose}>
        <DialogTitle>Remove Channel</DialogTitle>
        <DialogContent>
          <Select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveChannel(); // Trigger add channel and close dialog on Enter key press
              }
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select a Channel</MenuItem>
            {channels.map(channel => (
              <MenuItem key={channel} value={channel}>{channel}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRemoveChannel}>Remove</Button>
        </DialogActions>
      </Dialog>

      <DialogBox openText={openDialog==='chtab'} title={"Change Tab Name"} labelText={"Tab Name"} handleClose={handleClose} handleFunction={handleTabChange}/>
    
      <DialogSelect open={openDialog==='chcount'} title={`Current Country WACC: ${DataManager.countryData[country].wacc}`} handleClose={handleClose} obj={RATES} handleFunction={handleChangeCountry} val={0} />

      <DialogSelect open={openDialog==='chcur'} title={`Current Currency: ${DataManager.countryData[country].currency}`} handleClose={handleClose} obj={CURRENCIES} handleFunction={handleChangeCurrency} val={0} />

    </div>
  );
};

export default ChannelManager;