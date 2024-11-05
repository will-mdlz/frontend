import { updateArray, combineData } from "../utils/dataProcessing";
import { REGIONS } from "../constants/Constants";

class DataManager {
  constructor() {
    this.countryData = []; // Store data for each country
    this.real_years = 2;
    this.numYears = 12;
    this.initializeData(this.numYears);
  }

  // Initialize data for a specific country with four arrays
  initCountry(country, editable, numYears) {
    if (!this.countryData[country]) {
        this.countryData[country] = {
            arrays: [
              this.createEmptyArray(39, numYears),
              this.createEmptyArray(39, numYears),
              this.createEmptyArray(39, numYears),
              this.createEmptyArray(29, numYears),
            ],
            editable: editable,
            prev_index: 0,
            altered: false, 
            offset: new Array(29).fill(0),
            mapping: this.initMapping(29),
          };
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

  updateOffset(country, index, amount) {
    // I expect the amount to be 1 every single time
    // When an index adds channels, it offsets all the rows below it by that amount,
    // So I have to remap all their original values to new indices. This makes it 
    // so that the math behind the scenes acts cleanly
    // the formula is val[i] = i + sum(offset[0:i-1])
    this.countryData[country].offset[index] += amount;
    let mapping = this.countryData[country].mapping;
    for(let i = index+1; i < mapping.length; i++) {
      mapping[i] = i + amount;
    }
    this.countryData[country].mapping = mapping;
    
    for(let i = 0; i < this.countryData[country].arrays.length; i++) { //access each sheet
      let arr = this.countryData[country].arrays[i];
      for(let j = 0; j < amount; j++) {
        // add in the row here
        let newRow = Array(this.numYears).fill(0);
        arr.splice(index, 0, newRow);
      }
      this.countryData[country].arrays[i] = arr;
    }
  }

  initMapping(x) {
    let map = new Array(x).fill(0);
    for(let i = 0; i < map.length; i++) {
      map[i] = i;
    }
    return map;
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

  initializeData(numYears) {
    REGIONS.forEach(region => {
      this.initCountry(region, false, numYears); // Initialize with editable = false
    });
  }
}

const dataManagerInstance = new DataManager();
export default dataManagerInstance;