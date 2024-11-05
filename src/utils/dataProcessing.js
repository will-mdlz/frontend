import DataManager from "../data/DataManager";

export const updateArray = (data, rowIndex, cellIndex, newVal, real_years, country, arrayIndex) => {
    const updatedData = [...data];
    if(rowIndex!=null) {
        updatedData[rowIndex][cellIndex] = newVal;
    }
    let totalYears = data[0].length
    let currYear = cellIndex;
    while(currYear < totalYears) {
        if (arrayIndex === 3) { //pnl updates have little care for real years
            const savArray = DataManager.getArray(country, 0);
            const revArray = DataManager.getArray(country, 1);
            const costArray = DataManager.getArray(country, 2);
            updatePnl(updatedData, currYear, savArray, revArray, costArray);
        } else if (currYear < real_years) { // These updates will be actuals
            updateReal(updatedData, currYear);
        } else { // These updates will be projections
            updateProj(updatedData, currYear, country, arrayIndex, real_years);
        }
        currYear++;
    }
    return updatedData
};

const updateReal = (array, currYear) => {
    updateRevenueReal(array, currYear);
    array[12][currYear] = array[2][currYear] - array[4][currYear] - array[6][currYear] - array[8][currYear] - array[10][currYear];
    updateEbitda(array, currYear);
    updateTaxes(array, currYear);
    updateNiu(array, currYear);
    array[22][currYear] = array[14][currYear] - 0;
    updatePwc(array, currYear);
    updateOfc(array, currYear);
    updateFcf(array, currYear);
    array[25][currYear] = array[0][currYear] * array[26][currYear];
    [3,5,7,9,11,13,15,17,28].forEach(i => {
        updatePerc(array, currYear, i);
    });
};

const updateProj = (array, currYear, country, arrayIndex, real_years) => {
    updateRevenueProj(array, currYear, arrayIndex, real_years);
    [2,4,6,8,10,14,25].forEach(i => {
        updateCell(array, currYear, i, arrayIndex, country);
    });
    array[12][currYear] = array[2][currYear] - array[4][currYear] - array[6][currYear] - array[8][currYear] - array[10][currYear];
    array[13][currYear] = array[3][currYear] - array[5][currYear] - array[7][currYear] - array[9][currYear] - array[11][currYear];
    updateEbitda(array, currYear);
    updateTaxes(array, currYear);
    updateNiu(array, currYear);
    array[22][currYear] = array[14][currYear];
    updatePwc(array, currYear);
    updateOfc(array, currYear);
    updateFcf(array, currYear);
};

const updatePnl = (array, currYear, savArray, revArray, costArray) => {
    array[0][currYear] = savArray[0][currYear] + revArray[0][currYear] + costArray[0][currYear];
    updateRevenueReal(array, currYear);
    [2,4,6,8,10,14,25].forEach(i => {
        combineCell(array, i, currYear, savArray, revArray, costArray);
    });
    array[12][currYear] = savArray[12][currYear] + revArray[12][currYear] + costArray[12][currYear];
    array[13][currYear] = savArray[13][currYear] + revArray[13][currYear] + costArray[13][currYear];
    updateEbitda(array, currYear);
    array[19][currYear] = savArray[19][currYear] + revArray[19][currYear] + costArray[19][currYear];
    array[20][currYear] = array[12][currYear] === 0 ? 0 : array[19][currYear] / array[12][currYear];
    updateNiu(array, currYear);
    array[22][currYear] = array[14][currYear];
    array[23][currYear] = savArray[23][currYear] + revArray[23][currYear] + costArray[23][currYear];
    updateOfc(array, currYear);
    updateFcf(array, currYear);
};

const updateRevenueProj = (array, year, switchVal, realYears) => {
    // If switchVal == 1
    if (switchVal === 1) {
      if (year < realYears) {
        array[0][year] = 0;
      } else if (year > realYears) {
        let previousRevenue = array[0][year - 1] !== null ? array[0][year - 1] : 0;
        let growthRate = array[1][year] !== null ? array[1][year] : 0;
        array[0][year] = previousRevenue * (1 + growthRate);
      }
    } 
    // If switchVal == 2
    else if (switchVal === 2) {
      array[0][year] = 0;
    } 
    // Default case if switchVal != 1 or 2
    else {
      if (year === 0) {
        array[0][year] = array[0][year] !== null ? array[0][year] : 0;
      } else {
        let previousRevenue = array[0][year - 1] !== null ? array[0][year - 1] : 0;
        let growthRate = array[1][year] !== null ? array[1][year] : 0;
        array[0][year] = previousRevenue * (1 + growthRate);
      }
    }
    return array;
};

const combineCell = (array, position, currYear, savArray, revArray, costArray) => {
    array[position][currYear] = savArray[position][currYear] + revArray[position][currYear] + costArray[position][currYear];
    if( array[0][currYear] === 0 ) array[position+1][currYear] = 0;
    else array[position+1][currYear] = array[position][currYear] / array[0][currYear];
};

function updateCell(array, year, position, switchValue, country) {
    // Check if percent is null or undefined - set to 0
    if (!array[position + 1][year]) {
      array[position + 1][year] = 0;
    }
    if (switchValue === 2) {
        const savArray = DataManager.getArray(country, 0);
        
        if (!array[position + 1][year]) {
          array[position + 1][year] = 0;
        }

        array[position][year] = savArray[0][year] * array[position + 1][year]; // Cost dependent on savArray
    
      } else {
      array[position][year] = array[0][year] * array[position + 1][year]; // Revenue times respective percent
    }
};
  
const updateRevenueReal = (array, year) => {
    if (year === 0 || array[0][year - 1] === 0) {
        array[1][year] = 0;
    } else {
        array[1][year] = (array[0][year] / array[0][year - 1]) - 1;
    }
};


const updateEbitda = (array, year) => {
    array[16][year] = array[12][year] + array[14][year];
    if (array[0][year] === 0) { // Needed for rev, cost sheets
      array[17][year] = 0;
    } else {
      array[17][year] = array[16][year] / array[0][year]; // EBITDA / Revenue
    }
};

const updateTaxes = (array, year) => {
    array[19][year] = array[20][year] * array[12][year];
};

const updateNiu = (array, year) => {
    array[21][year] = array[12][year] - array[19][year] - array[18][year];
};

const updatePwc = (array, year) => {
    // CCC (Cash Conversion Cycle)
    array[32][year] = (array[29][year] || 0) + (array[30][year] || 0) - (array[31][year] || 0);
    // Accounts Receivable
    array[33][year] = array[0][year] / 365 * (array[29][year] || 0);
    // Inventory
    array[34][year] = (array[0][year] - array[2][year]) / 365 * (array[30][year] || 0);
    // Accounts Payable
    array[35][year] = (array[0][year] - array[2][year]) / 365 * (array[31][year] || 0);
    // Total Working Capital
    array[37][year] = array[33][year] + array[34][year] - array[35][year] + (array[36][year] || 0);
    if (year === 0) {
      array[38][year] = 0;
      if (!array[23][year]) {
        array[23][year] = array[38][year];
      }
    } else {
      array[38][year] = (array[37][year - 1] || 0) - array[37][year];
      array[23][year] = array[38][year];
    }
};
  
const updateOfc = (array, year) => {
    array[24][year] = array[21][year] + array[22][year] + array[23][year];
};

const updateFcf = (array, year) => {
    // Free Cash Flow (FCF)
    array[27][year] = array[24][year] - array[25][year];
    // If revenue (array[21][year]) is zero, set FCF percentage to zero
    if (array[21][year] === 0) {
      array[28][year] = 0;
    } else {
      array[28][year] = array[27][year] / array[21][year]; // Calculate FCF as a percentage of revenue
    }
};
  
const updatePerc = (array, year, position) => {
    // If the base value (array[0][year]) is zero, set the percentage to zero
    if (array[0][year] === 0) {
      array[position][year] = 0;
      return;
    }
    // Otherwise, calculate the percentage as (array[position-1][year] / array[0][year])
    array[position][year] = array[position - 1][year] / array[0][year];
};

export const combineData = (subArrays) => {
  const regionsArray = [
    createEmptyArray(39, 12),
    createEmptyArray(39, 12),
    createEmptyArray(39, 12),
    createEmptyArray(29, 12),
  ];
  const totalSheets = regionsArray.length;
  const totalYears = regionsArray[0][0].length;
  for(let sheet = 0; sheet < totalSheets; sheet++){
    for(let year = 0; year < totalYears; year++) {
      if(sheet===2) {
          const year_rev = regionsArray[0][0][year];
          [2,4,6,8,10,12,14,16,18,19,21,22,23,24,25,27].forEach(i => {
          for(let j = 0; j < subArrays.length; j++) {
            regionsArray[sheet][i][year] += subArrays[j].arrays[sheet][i][year];
          };
        });
        [3,5,7,9,11,13,15,17,26].forEach(i => {
          regionsArray[sheet][i][year] = year_rev===0 ? 0 : regionsArray[sheet][i-1][year] / year_rev
        });
        regionsArray[sheet][28][year] = regionsArray[sheet][21][year]===0 ? 0 : regionsArray[sheet][27][year] / regionsArray[sheet][21][year]
      }
      else {
        [0,2,4,6,8,10,12,14,16,18,19,21,22,23,24,25,27].forEach(i => {
          for(let j = 0; j < subArrays.length; j++) {
            regionsArray[sheet][i][year] += subArrays[j].arrays[sheet][i][year];
          };
        });
        updateRevenueReal(regionsArray[sheet], year);

        [3,5,7,9,11,13,15,17,26].forEach(i => {
          updatePerc(regionsArray[sheet], year, i);
        });
        regionsArray[sheet][28][year] = regionsArray[sheet][21][year]===0 ? 0 : regionsArray[sheet][27][year] / regionsArray[sheet][21][year]
      }
    }
  }
  return regionsArray;
};

const createEmptyArray = (x, y) => {
  return Array.from({ length: x }, () => Array(y).fill(0));
};