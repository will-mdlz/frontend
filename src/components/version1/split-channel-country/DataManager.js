import { updateArray, combineData } from "../../../utils/dataProcessing";
import { REGIONS, ROW_LABELS, rowDict, SECTIONS, SECTIONS_PERC } from "../constants/Constants";

class DataManager {
  constructor() {
    this.countryData = []; // Store data for each country
    this.real_years = 2;
    this.numYears = 12;
    this.editable_rows_real = [0,2,3,5,7,9,11,13,17,23,29,32,33,34];
    this.editable_rows_proj = [1,4,6,8,10,12,14,18,26];
    this.initializeData(this.numYears);
  }

  // Initialize data for a specific country with four arrays
  initCountry(country, editable, numYears) {
    if (!this.countryData[country]) {
      this.countryData[country] = {
        arrays: [
          this.createEmptyArray(ROW_LABELS.length, numYears),
          this.createEmptyArray(ROW_LABELS.length, numYears),
          this.createEmptyArray(ROW_LABELS.length, numYears),
          this.createEmptyArray(ROW_LABELS.length-10, numYears),
        ],
        editable: editable,
        prev_index: 0,
        altered: false, 
        channels: 0,
        channelNames: [],
        indicies: {...rowDict},
        //let's add bold rows and stuff
        bold_rows: [],
        up_rows: [],
        percent_rows: [],
      };
      this.updateRows(country, rowDict);
      //this.addChannel(country, "Stuff");
      //this.addChannel(country, "Stuff2");
    }
  }

  // Create an empty array, can be customized based on your data structure
  createEmptyArray(x, y) {
    return Array.from({ length: x }, () => Array(y).fill(0));
  }

  isEditable(country) {
    // Check if country exists in the countryData object
    if (this.countryData[country]) {
      return this.countryData[country].editable;
    } else {
      console.error(`Country data for "${country}" not found.`);
      return false; // Or handle it however you need if the country data is missing
    }
  }

  // Retrieve a specific array for a country
  getArray(country, arrayIndex) {
    return this.countryData[country] ? this.countryData[country].arrays[arrayIndex] : null;
  }

  // Update a specific array for a country
  updateArray(country, arrayIndex, newArray) {
    if(this.countryData[country]) this.countryData[country].arrays[arrayIndex] = newArray;
  }

  setPrevIndex(country, arrayIndex) {
    this.countryData[country].prev_index = arrayIndex;
  }

  getPrevIndex(country) {
    return this.countryData[country] ? this.countryData[country].prev_index : 0;
  }

  updateDependentArrays(country, arrayIndex) {
    if (this.countryData[country]) {
        if (arrayIndex === 0) { //Stand alone value
        // Update 2nd array based on the 1st
            const updatedCostArray = updateArray(
                this.getArray(country, 2), //dataset
                null, //row to update
                0, // Starting at year 0
                null, //value
                this.real_years, //real years available
                country, //the country to retrieve dependables
                2 // Cost array
            );
            this.updateArray(country, 2, updatedCostArray);
        } 
        if (arrayIndex < 3) { // perform the aggreagation
            const updatedPnlArray = updateArray(
                this.getArray(country, 3), //dataset
                null, //row to update
                0, // Starting at year 0
                null, //value
                this.real_years, //real years available
                country, //the country to retrieve dependables
                3 // Cost array
            );
            this.updateArray(country, 3, updatedPnlArray);
        }
    }
  }

  updateIndices(indicies, currChannels, coeff) { //coeff = -1 when removing a row
    //assume the numChannels is the original before it was changed
    const dividend = currChannels + 1;
    const flip = indicies["Ovh"]; //THIS IS WHERE THINGS CHNAGE
    for (let key in indicies) {
      if (indicies.hasOwnProperty(key)) {
        const current_index = indicies[key];
        if(current_index < flip) {
          indicies[key] = current_index + coeff * current_index/dividend;  // Example update: increment each value by 1
        } else {
          indicies[key] = current_index + coeff * (SECTIONS.length);
        }
      }
    }
  }

  updateRows(country, indicies) {
    const bold_list = [];
    const up_list = [];
    const perc_list = [];
    const channels = this.countryData[country].channels
    
    const vol_index = indicies["Volume"];
    const pv_index = indicies["Price/Vol"];
    const rev_index = indicies["Revenue"];
    const cogs_index = indicies["COGS"];
    const gp_index = indicies["Gross Profit"];
    const ebit_index = indicies["EBIT"];
    const ebitda_index = indicies["EBITDA"];
    const niu_index = indicies["Net Income Unlevered"];
    const twc_index = indicies["Total Working Capital"];
    const fcf_index = indicies["Free Cash Flow"];
    const ac_index = indicies["A&C"];
    const dis_index = indicies["Distribution"];
    const ovh_index = indicies["Ovh"];

    //bold_list.push(vol_index);
    bold_list.push(rev_index);
    bold_list.push(ebit_index);
    bold_list.push(ebitda_index);
    bold_list.push(niu_index);
    bold_list.push(indicies["Operating Cash Flow"]);
    bold_list.push(fcf_index);
    bold_list.push(twc_index);

    up_list.push(vol_index);
    up_list.push(pv_index);
    up_list.push(rev_index);
    up_list.push(cogs_index);
    up_list.push(gp_index);
    up_list.push(ac_index);
    up_list.push(dis_index);
    up_list.push(ovh_index);
    up_list.push(ebit_index);
    up_list.push(ebit_index+1);
    up_list.push(ebitda_index);
    up_list.push(ebitda_index+1);
    up_list.push(niu_index);
    up_list.push(niu_index+1);
    up_list.push(fcf_index);
    up_list.push(fcf_index+1);
    up_list.push(indicies['Days Sales']);
    up_list.push(indicies["Cash Benefit"]);

    perc_list.push(vol_index+channels+1);
    perc_list.push(rev_index+channels+1);
    perc_list.push(cogs_index+2*(channels+1));
    perc_list.push(gp_index+channels+1);
    perc_list.push(ac_index+channels+1);
    perc_list.push(dis_index+channels+1);
    for(let i = 1; i < channels+1; i++) { //offset of 1 so that we get the volume one
      perc_list.push(vol_index+channels+i+1);
      perc_list.push(pv_index+channels+i+1);
      perc_list.push(rev_index+channels+i+1);
      perc_list.push(cogs_index+2*(channels+1)+i);
      perc_list.push(gp_index+channels+i+1);
      perc_list.push(ac_index+channels+i+1);
      perc_list.push(dis_index+channels+i+1);
    }
    perc_list.push(ovh_index+1);
    perc_list.push(indicies["OIE"]+1);
    perc_list.push(ebit_index+1);
    perc_list.push(ebitda_index+1)
    perc_list.push(indicies["D&A"]+1);
    perc_list.push(indicies["Taxes"]+1);
    perc_list.push(indicies["Capex"]+1);
    perc_list.push(fcf_index+1);
    if(channels===0) {
      perc_list.push(pv_index+1);
    }



    this.countryData[country].up_rows = up_list;
    this.countryData[country].bold_rows = bold_list;
    this.countryData[country].percent_rows = perc_list;
  }

  addChannel(country, channelName) {
    if(this.countryData[country].channelNames.includes(channelName)) return
    this.countryData[country].channelNames.push(channelName)
    const indicies = this.countryData[country].indicies;
    const currChannels = this.countryData[country].channels;

    for(let i = 0; i < this.countryData[country].arrays.length; i++) { //access each sheet
      let arr = this.countryData[country].arrays[i];
      let num_added = 0;
      for (let key of SECTIONS) {
        const section_index = indicies[key];
        let newRow = Array(this.numYears).fill(0);
        arr.splice(section_index+num_added+currChannels+1, 0, newRow);
        num_added++;
      }
      this.countryData[country].arrays[i] = arr;
    }
    this.updateIndices(indicies, currChannels, 1);
    this.countryData[country].indicies = indicies;
    this.countryData[country].channels = currChannels + 1;
    this.updateRows(country, indicies);
  }

  updateRegionArray(region, countries) {
    let toChange = false;
    for(let i = 0; i < countries.length; i++) {
      if(this.countryData[countries[i]].altered) {
        this.updateDependentArrays(countries[i], 0)
        this.countryData[region].altered = true;
        this.countryData[countries[i]].altered = false;
        toChange = true;
      }
    }
    if(toChange) {
      const prev_ind = this.getPrevIndex(region);
      const countryArrays = countries.map(country => this.countryData[country])
      const combinedData = combineData(countryArrays);
      this.countryData[region] = {
        arrays: combinedData,
        editable: false,
        prev_index: prev_ind,
        altered: true
      };
    }
    if(region==="GLOBAL") {
      this.countryData["GLOBAL"].altered = false;
    }
  }

  editChannel(country, channelName, newChannelName) {
    if(this.countryData[country].channelNames.includes(newChannelName)) return
    const channels = this.countryData[country].channelNames;
    const index = channels.indexOf(channelName);
    console.log(index)
    channels[index] = newChannelName;
  }

  removeChannel(country, channelName) {
    const index = this.countryData[country].channelNames.indexOf(channelName)
    this.countryData[country].channelNames.splice(index, 1)

    const indicies = this.countryData[country].indicies;
    const currChannels = this.countryData[country].channels;

    for(let i = 0; i < this.countryData[country].arrays.length; i++) { //access each sheet
      let arr = this.countryData[country].arrays[i];
      let num_added = 0;
      for (let key of SECTIONS) {
        const section_index = indicies[key];
        arr.splice(section_index+num_added+index+1, 1);
        num_added--;
      }
      this.countryData[country].arrays[i] = arr;
    }

    this.updateIndices(indicies, currChannels, -1);
    this.countryData[country].indicies = indicies;
    this.countryData[country].channels = currChannels - 1;
    this.updateRows(country, indicies);
  }

  mapIndicies(country) {
    const row_labels = []

    const numChannels = this.countryData[country].channels;
    const channelLabels = this.countryData[country].channelNames;

    for(let i = 0; i < ROW_LABELS.length; i++) {
      const initial_label = ROW_LABELS[i];
      row_labels.push(initial_label);
      const index = SECTIONS.indexOf(initial_label);
      if(numChannels !== 0 && index >= 0) {
        for(let j = 0; j < numChannels; j++){
          if(SECTIONS_PERC.includes(index)) {
            if(index <= 8) {
              row_labels.push(channelLabels[j] + " PY%");
            }
            else {
              row_labels.push(channelLabels[j] + " %NR");
            }
          } else {
            row_labels.push(channelLabels[j]);
          }
        }
      }
    }

    return row_labels;
  };

  initializeData(numYears) {
    REGIONS.forEach(region => {
      this.initCountry(region, false, numYears); // Initialize with editable = false
    });
  }
}

const dataManagerInstance = new DataManager();
export default dataManagerInstance;