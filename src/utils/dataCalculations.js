import DataManager from "../data/DataManager";

const calcVolume = (isActual, array, year, numChannels, val) => {
    //map index of 0
    let index = DataManager.indicies['Volume']; //map from the row_index to the real_index
    let index_growth = index + (numChannels+1); //map from the row_index to the real_index

    if(numChannels===0) {
        if(isActual) {
            if(year!==0) {
                let percPY = ((year!==0 && array[index][year-1] !== 0)
                    ? (array[index][year] / array[index][year-1]) - 1 : 0);
                array[index_growth][year] = percPY;
            }
        } else {
            let previousRevenue = array[index][year - 1] !== null ? array[index][year - 1] : 0;
            let growthRate = array[index_growth][year] !== null ? array[1][year] : 0;
            array[index][year] = previousRevenue * (1 + growthRate);
        }
    }
    else {
        if(isActual) { // Input is amount of volume per channel
            let sum = 0;
            for(let i = index+1; i < index_growth; i++) {sum+=array[i][year];}
            array[index][year] = sum;
            if(year !== 0) { // need to update the growth
                for(let i = 0; i < (numChannels+1); i++) { 
                    // check if year-1 val is 0 -> 0, otherwise divide current year by prev year
                    let percPY = ((year!==0 && array[index+i][year-1] !== 0)
                        ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
                    array[index_growth+i][year] = percPY;
                }
            }
        } else { // Input is the % growth
            let sum = 0; // keep track of sum while updating the volume amounts
            for(let i = 1; i < (numChannels+1); i++) { // update each channel first
                let amount = array[index+i][year-1] * (1 + array[index_growth+i][year]);
                sum += amount;
                array[index+i][year] = amount;
            }
            array[index][year] = sum; // update total
            array[index_growth][year] = (array[index][year-1] === 0 ? 0
                : (array[index][year] / array[index][year-1]) - 1); // update total growth
        }
    }
};

const calcPrice = (isActual, array, year, numChannels) => {
    // THIS MUST BE PERFORMED AFTER calcRevenue TO WORK
    // map index 2
    let index = DataManager.indicies['Price/Vol'];
    let index_perc = index + (numChannels+1);
    let vol_index = DataManager.indicies['Volume'];
    let rev_index = DataManager.indicies['Revenue'];
    
    if(numChannels===0) {
        if(isActual) {
            array[index][year] = (array[vol_index][year]===0 ? 0 
                : array[rev_index][year] / array[vol_index][year]);
            array[index_perc][year] = ((year!==0 && array[index][year-1]!==0) 
                ? (array[index][year] / array[index][year-1]) - 1 : 0);
        } else {
            array[index][year] = array[index][year-1] * (1 + array[index_perc][year]);
        }
    }
    else {
        if(isActual) {
            for(let i = 1; i < (numChannels+1); i++) {
                array[index+i][year] = (array[vol_index+i][year]===0 ? 0 
                    : array[rev_index+i][year] / array[vol_index+i][year]);
                array[index_perc+i][year] = ((year!==0 && array[index+i][year-1]!==0) 
                    ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
            }
        } else {
            for(let i = 1; i < (numChannels+1); i++) {
                array[index+i][year] = array[index+i][year-1] * (1 + array[index_perc+i][year]);
            }
        }
    }
};

const calcRevenue = (isActual, array, year, numChannels, val) => {
    // map to 4
    let index = DataManager.indicies['Revenue'];
    let index_perc = index + (numChannels+1);

    if(numChannels===0) {
        if(val===1) { // gotta deal with the rev synergy
        } else if(isActual) {
            if(year!==0) {
                let percPY = ((year!==0 && array[index][year-1] !== 0)
                    ? (array[index][year] / array[index][year-1]) - 1 : 0);
                array[index_perc][year] = percPY;
            }
        } else {
            let index_vol = DataManager.indicies["Volume"];
            let index_price = DataManager.indicies['Price/Vol'];
            
            let amount = array[index_vol][year] * array[index_price][year];
            array[index][year] = amount;
            array[index_perc][year] = (array[index][year-1]!==0 
                ? (amount / array[index][year-1]) - 1 : 0);
        }
    }
    else {
        if(isActual) { // input is the amounts per channel
            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                sum += array[index+i][year];

                array[index_perc+i][year] = ((year!==0 && array[index+i][year-1]!==0) 
                ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
            }
            array[index][year] = sum;
            array[index_perc][year] = ((year!==0 && array[index][year-1]!==0) 
                ? (array[index][year] / array[index][year-1]) - 1 : 0);
        } else {
            let index_vol = DataManager.indicies["Volume"];
            let index_price = DataManager.indicies['Price/Vol'];

            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                let amount = array[index_vol+i][year] * array[index_price+i][year];
                sum += amount;
                array[index+i][year] = amount;
                array[index_perc+i][year] = (array[index+i][year-1]!==0 
                ? (amount / array[index+i][year-1]) - 1 : 0);
            }
            array[index][year] = sum;
            array[index_perc][year] = (array[index][year-1]!==0 
                ? (sum / array[index][year-1]) - 1 : 0);
        }
    }
};

const calcCOGS = (isActual, array, year, numChannels) => {
    // map to 6
    const index = DataManager.indicies["COGS"];
    const index_cpv = index + (numChannels+1);
    const index_cpv_growth = index_cpv + (numChannels+1);
    const index_vol = DataManager.indicies["Volume"];
    
    if(numChannels===0) {
        if(isActual) {
            const index_rev = DataManager.indicies["Revenue"];
            const index_gp = DataManager.indicies["Gross Profit"];

            array[index][year] = array[index_rev][year] - array[index_gp][year];
            array[index_cpv][year] = (array[index_vol][year]===0 ? 0 
                : array[index][year] / array[index_vol][year]);
            array[index_cpv_growth][year] = ((year!==0 && array[index_cpv][year-1]!==0) 
                ? (array[index_cpv][year] / array[index_cpv][year-1]) - 1 : 0);
        } else {
            let amount = array[index_cpv][year-1] * (1 + array[index_cpv_growth][year]);
            array[index_cpv][year] = amount;
            array[index][year] = amount * array[index_vol][year];
        }
    } else {
        if(isActual) { // There is no input, only calculations
            const index_rev = DataManager.indicies["Revenue"];
            const index_gp = DataManager.indicies["Gross Profit"];
            
            for(let i = 0; i < (numChannels+1); i++) {
                const amount = array[index_rev+i][year] - array[index_gp+i][year];
                array[index+i][year] = amount
                array[index_cpv+i][year] = (array[index_vol+i][year] !== 0
                    ? amount / array[index_vol+i][year] : 0);
                array[index_cpv_growth+i][year] = ((year!==0 && array[index_cpv+i][year-1]!==0) 
                    ? (array[index_cpv+i][year] / array[index_cpv+i][year-1]) - 1 : 0);
            }
        } else { // index_cpv_growth is the input
            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                const cpv = array[index_cpv+i][year-1] * (1 + array[index_cpv_growth+i][year])
                const amount = cpv * array[index_vol+i][year];
                array[index_cpv+i][year] = cpv;
                sum += amount;
                array[index+i][year] = amount;
            }
            array[index][year] = sum;
            array[index_cpv][year] = (array[index_vol][year]!==0 ? sum / array[index_vol][year] : 0);
            array[index_cpv_growth][year] = (array[index_cpv][year-1]===0 ? 0 
                : array[index_cpv][year] / array[index_cpv][year-1] - 1);
        }
    }
};

const calcGrossProfit = (isActual, array, year, numChannels) => {
    // map to 9
    const index = DataManager.indicies["Gross Profit"];
    const index_perc = index + (numChannels+1);
    const index_rev = DataManager.indicies["Revenue"];
    
    if(numChannels===0) {
        if(isActual) {
            let percPY = (array[index_rev][year] !== 0
                ? (array[index][year] / array[index_rev][year]) : 0);
            array[index_perc][year] = percPY;
        } else {
            const index_cogs = DataManager.indicies["COGS"];
            array[index][year] = array[index_rev][year] - array[index_cogs][year];
            let percPY = (array[index_rev][year] !== 0
                ? (array[index][year] / array[index_rev][year]) : 0);
            array[index_perc][year] = percPY;
        }
    } else {
        if(isActual) { // No Input
            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                sum += array[index+i][year];
                array[index_perc+i][year] = ((array[index_rev+i][year]!==0) 
                ? array[index+i][year] / array[index_rev+i][year] : 0);
            }
            array[index][year] = sum;
            array[index_perc][year] = (array[index_rev][year]!==0
                ? array[index][year] / array[index_rev][year] : 0);
        } else { // No Input
            const index_cogs = DataManager.indicies["COGS"];

            for(let i = 0; i < (numChannels+1); i++) {
                array[index+i][year] = array[index_rev+i][year] - array[index_cogs+i][year];
                array[index_perc+i][year] = (array[index_rev+i][year]===0 ? 0
                                            : array[index+i][year] / array[index_rev+i][year]);
            }
        }
    }
};

const calcRevenueDepencendy = (isActual, array, map_index, year, numChannels) => {
    // this will be for A&C, Distribution (33, 39)
    const index = map_index;
    const index_perc = index + (numChannels+1);
    const index_rev = DataManager.indicies["Revenue"];

    if(numChannels===0) {
        if(isActual) {
            array[index_perc][year] = (array[index_rev][year]===0 ? 0 
                : array[index][year] / array[index_rev][year]);
        } else {
            array[index][year] = array[index_rev][year] * array[index_perc][year];
        }
    } else {
        if(isActual) { // Input is the amounts
            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                let amount = array[index+i][year];
                sum += amount;
                array[index_perc+i][year] = (array[index_rev+i][year]===0 ? 0
                    : amount / array[index_rev+i][year]);
            }
            array[index][year] = sum;
            array[index_perc][year] = (array[index_rev][year]===0 ? 0
                : sum / array[index_rev][year]);
        } else { // Input is the percents
            let sum = 0;
            for(let i = 1; i < (numChannels+1); i++) {
                const amount = array[index_perc+i][year] * array[index_rev+i][year];
                sum += amount;
                array[index+i][year] = amount;
            }
            array[index][year] = sum;
            array[index_perc][year] = (array[index_rev][year]===0 ? 0
                : sum / array[index_rev][year]);
        }
    }
};

const calcRevenueSingle = (isActual, array, map_index, year) => {
    // This will be for Ovh, OIE, D&A (45, 47, 49)
    const index = map_index;
    const index_perc = index + 1;
    const index_rev = DataManager.indicies['Revenue'];
    console.log(index_rev)

    if(isActual) {  // Input is the amount
        console.log(index_perc)
        array[index_perc][year] = (array[index_rev][year]===0 ? 0 : array[index][year]/array[index_rev][year]);
    } else { // Input is the percent
        array[index][year] = array[index_perc][year] * array[index_rev][year];
    }
};

const calcPWC = (array, year) => {
    const index_pwc = DataManager.indicies["Primary Working Capital"];
    const index_ds = DataManager.indicies["Days Sales"];
    const index_di = DataManager.indicies["Days Inventory"];
    const index_dp = DataManager.indicies["Days Payable"];
    const index_ccc = DataManager.indicies["Cash Conversion Cycle"];
    const index_ar = DataManager.indicies["Accounts Receivable"];
    const index_i = DataManager.indicies["Inventory"];
    const index_ap = DataManager.indicies["Accounts Payable"];
    const index_other = DataManager.indicies["Other"];
    const index_twc = DataManager.indicies["Total Working Capital"];
    const index_cashben = DataManager.indicies["Cash Benefit"];
    const index_rev = DataManager.indicies["Revenue"];
    const index_gp = DataManager.indicies["Gross Profit"];

    // CCC (Cash Conversion Cycle)
    array[index_ccc][year] = array[index_ds][year] + array[index_di][year] - array[index_dp][year];
    // Accounts Receivable
    array[index_ar][year] = array[index_rev][year] / 365 * array[index_ds][year];
    // Inventory
    array[index_i][year] = (array[index_rev][year] - array[index_gp][year]) / 365 * array[index_di][year];
    // Accounts Payable
    array[index_ap][year] = (array[index_rev][year] - array[index_gp][year]) / 365 * array[index_dp][year];
    // Total Working Capital
    array[index_twc][year] = array[index_ar][year] + array[index_i][year] - array[index_ap][year] + array[index_other][year];
    if (year === 0) {
      array[index_cashben][year] = 0;
      if (!array[index_pwc][year]) {
        array[index_pwc][year] = array[index_cashben][year];
      }
    } else {
      array[index_cashben][year] = array[index_twc][year - 1] - array[index_twc][year];
      array[index_pwc][year] = array[index_cashben][year];
    }
};

const calcProducts = (array, year, val) => {
    const index_gp = DataManager.indicies["Gross Profit"];
    const index_ac = DataManager.indicies["A&C"];
    const index_dist = DataManager.indicies["Distribution"];
    const index_ovh = DataManager.indicies["Ovh"]; 
    const index_oie = DataManager.indicies["OIE"]; 
    const index_ebit = DataManager.indicies["EBIT"]; 
    const index_rev = DataManager.indicies["Revenue"];
    const index_da = DataManager.indicies["Depreciation/Amortization"]; 
    const index_ebitda = DataManager.indicies["EBITDA"]; 
    const index_taxes = DataManager.indicies["Taxes"];
    const index_niu = DataManager.indicies["Net Income Unlevered"];
    const index_nsp = DataManager.indicies["Non-Service Pension"];
    const index_da2 = DataManager.indicies["D&A Addback"];
    const index_pwc = DataManager.indicies["Primary Working Capital"];
    const index_ofc = DataManager.indicies["Operating Cash Flow"];
    const index_capex = DataManager.indicies["Capex"];
    const index_fcf = DataManager.indicies["Free Cash Flow"];

    //ebit
    const ebit = array[index_gp][year] - array[index_ac][year] - array[index_dist][year] - array[index_ovh][year] - array[index_oie][year];
    array[index_ebit][year] = ebit;
    array[index_ebit+1][year] = (array[index_rev][year]===0 ? 0 : ebit / array[index_rev][year])
    //ebitda
    array[index_ebitda][year] = array[index_ebit][year] + array[index_da][year];
    array[index_ebitda+1][year] = (array[index_rev][year]===0 ? 0 : array[index_ebitda][year] / array[index_rev][year])
    //taxes
    if(val===0) {
        array[index_taxes][year] = array[index_taxes+1][year] * ebit;
    }
    //niu
    array[index_niu][year] = array[index_ebit][year] - array[index_nsp][year] - array[index_taxes][year];
    //pwc
    if(val===0){calcPWC(array, year);}
    //ocf
    array[index_da2][year] = array[index_da][year]
    array[index_ofc][year] = array[index_niu][year] + array[index_da][year] + array[index_pwc][year];
    //capex
    if(val===0) array[index_capex][year] = array[index_rev][year] * array[index_capex+1][year];
    const fcf = array[index_ofc][year] - array[index_capex][year];
    array[index_fcf][year] = fcf;
    array[index_fcf+1][year] = (array[index_niu][year]===0 ? 0 : fcf / array[index_niu][year]);
}

const updateFunctions = (isActual, array, year, arrayIndex, numChannels) => {
    calcVolume(isActual, array, year, numChannels, arrayIndex);
    if(isActual) {
        calcRevenue(isActual, array, year, numChannels, arrayIndex);
        calcPrice(isActual, array, year, numChannels);
        calcGrossProfit(isActual, array, year, numChannels);
        calcCOGS(isActual, array, year, numChannels);
    } else {
        calcPrice(isActual, array, year, numChannels);
        calcRevenue(isActual, array, year, numChannels, arrayIndex);
        calcCOGS(isActual, array, year, numChannels);
        calcGrossProfit(isActual, array, year, numChannels);
    }
    calcRevenueDepencendy(isActual, array, DataManager.indicies["A&C"], year, numChannels); //A&C
    calcRevenueDepencendy(isActual, array, DataManager.indicies["Distribution"], year, numChannels); //Distribution
    calcRevenueSingle(isActual, array, DataManager.indicies["Ovh"], year, numChannels); //Ovh
    calcRevenueSingle(isActual, array, DataManager.indicies["OIE"], year, numChannels); //Oie
    calcRevenueSingle(isActual, array, DataManager.indicies["Depreciation/Amortization"], year, numChannels); //D&A
    calcProducts(array, year, 0);
};

const volRevPnlSum = (array, year, numChannels, subArrays, val) => {
    let index; 
    if(val===0) {
        index = DataManager.indicies['Volume'];
    } else {
        index = DataManager.indicies['Revenue'];
    }
    let index_growth = index + (numChannels+1); //map from the row_index to the real_index

    if(numChannels===0) {
        let amount = subArrays.reduce((sum, arr) => sum + arr[index][year], 0);
        array[index][year] = amount;
        array[index_growth][year] = ((year===0 || array[index][year-1]===0) ? 0 
            : array[index][year] / array[index][year-1] - 1);
    } else {
        let sum = 0;
        for(let i = 1; i < numChannels + 1; i++) {
            let amount = subArrays.reduce((sum, arr) => sum + arr[index+i][year], 0);
            array[index+i][year] = amount;
            array[index_growth+i][year] = ((year===0 || array[index+i][year-1]===0) ? 0 
                : amount / array[index+i][year-1] - 1);
            sum += amount;
        }
        array[index][year] = sum;
        array[index_growth][year] = ((year===0 || array[index][year-1]===0) ? 0 
            : array[index][year] / array[index][year-1] - 1);
    }
};

const pricePnl = (array, year, numChannels) => {
    let index = DataManager.indicies['Price/Vol'];
    let index_perc = index + (numChannels+1);
    let vol_index = DataManager.indicies['Volume'];
    let rev_index = DataManager.indicies['Revenue'];

    if(numChannels===0) {
        array[index][year] = (array[vol_index][year]===0 ? 0 
            : array[rev_index][year] / array[vol_index][year]);
        array[index_perc][year] = ((year!==0 && array[index][year-1]!==0) 
            ? (array[index][year] / array[index][year-1]) - 1 : 0);
    } else {
        for(let i = 1; i < (numChannels+1); i++) {
            array[index+i][year] = (array[vol_index+i][year]===0 ? 0 
                : array[rev_index+i][year] / array[vol_index+i][year]);
            array[index_perc+i][year] = ((year!==0 && array[index+i][year-1]!==0) 
                ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
        }
    }
}

const cogsPnl = (array, year, numChannels, subArrays) => {
    const index = DataManager.indicies["COGS"];
    const index_cpv = index + (numChannels+1);
    const index_cpv_growth = index_cpv + (numChannels+1);
    const index_vol = DataManager.indicies["Volume"];

    if(numChannels===0) {
        let amount = subArrays.reduce((sum, arr) => sum + arr[index][year], 0);
        array[index][year] = amount;
        array[index_cpv][year] = (array[index_vol][year]===0 ? 0 
            : amount / array[index_vol][year]);
        array[index_cpv_growth][year] = ((year!==0 && array[index_cpv][year-1]!==0) 
            ? (array[index_cpv][year] / array[index_cpv][year-1]) - 1 : 0);
    } else {
        let sum = 0;
        for(let i = 1; i < numChannels+1; i++) {
            let amount = subArrays.reduce((sum, arr) => sum + arr[index+i][year], 0);
            array[index+i][year] = amount;
            sum += amount;
            array[index_cpv+i][year] = (array[index_vol+i][year] !== 0
                ? amount / array[index_vol+i][year] : 0);
            array[index_cpv_growth+i][year] = ((year!==0 && array[index_cpv+i][year-1]!==0) 
                ? (array[index_cpv+i][year] / array[index_cpv+i][year-1]) - 1 : 0);
        }
        array[index][year] = sum;
        array[index_cpv][year] = (array[index_vol][year]!==0 ? sum / array[index_vol][year] : 0);
        array[index_cpv_growth][year] = (year===0 || array[index_cpv][year-1]===0 ? 0 
            : array[index_cpv][year] / array[index_cpv][year-1] - 1);
    }
};

const gpPnl = (array, year, numChannels, subArrays, val) => {
    let index;
    if(val===0) {
        index = DataManager.indicies["Gross Profit"];
    } else if(val===1) {
        index = DataManager.indicies["A&C"];
    } else if(val===2) {
        index = DataManager.indicies["Distribution"];
    }
    const index_perc = index + (numChannels+1);
    const index_rev = DataManager.indicies["Revenue"];

    if(numChannels===0) {
        array[index][year] = subArrays.reduce((sum, arr) => sum + arr[index][year], 0);
        array[index_perc][year] = (array[index_rev][year]===0 ? 0 
            : array[index][year] / array[index_rev][year])
    } else {
        let sum = 0;
        for(let i = 1; i < numChannels+1; i++) {
            let amount = subArrays.reduce((sum, arr) => sum + arr[index+i][year], 0);
            array[index+i][year] = amount;
            sum += amount;
            array[index_perc+i][year] = (array[index_rev+i][year]===0 ? 0 
                : array[index+i][year] / array[index_rev+i][year])
        }
        array[index][year] = sum;
        array[index_perc][year] = (array[index_rev][year]===0 ? 0 
            : sum / array[index_rev][year])
    }
};

const revDepPnl = (array, year, subArrays, val) => {
    let index;
    if(val===0) {
        index = DataManager.indicies["Ovh"];
    } else if(val===1) {
        index = DataManager.indicies["OIE"];
    } else if(val===2) {
        index = DataManager.indicies["Depreciation/Amortization"];
    }
    const index_perc = index + (1);
    const index_rev = DataManager.indicies["Revenue"];
    array[index][year] = subArrays.reduce((sum, arr) => sum + arr[index][year], 0);
    array[index_perc][year] = (array[index_rev][year]===0 ? 0 
        : array[index][year] / array[index_rev][year]);
};

const taxesPnl = (array, year, subArrays, val) => {
    let index;
    let index_base;
    if(val===0) {
        index = DataManager.indicies["Taxes"];
        index_base = DataManager.indicies["EBIT"];
    } else if(val===1) {
        index = DataManager.indicies["Capex"];
        index_base = DataManager.indicies["Revenue"];
    } 
    const index_perc = index + (1);
    array[index][year] = subArrays.reduce((sum, arr) => sum + arr[index][year], 0);
    array[index_perc][year] = (array[index_base][year]===0 ? 0 
        : array[index][year] / array[index_base][year]);
};

const updatePnl = (array, currYear, numChannels, savArray, revArray, costArray) => {
    const subArrays = [savArray, revArray, costArray];
    volRevPnlSum(array, currYear, numChannels, subArrays, 0)
    volRevPnlSum(array, currYear, numChannels, subArrays, 1);
    pricePnl(array, currYear, numChannels);
    cogsPnl(array, currYear, numChannels, subArrays);
    gpPnl(array, currYear, numChannels, subArrays, 0);
    gpPnl(array, currYear, numChannels, subArrays, 1);
    gpPnl(array, currYear, numChannels, subArrays, 2);
    revDepPnl(array, currYear, subArrays, 0);
    revDepPnl(array, currYear, subArrays, 1);
    revDepPnl(array, currYear, subArrays, 2);
    const index_pwc = DataManager.indicies["Primary Working Capital"];
    array[index_pwc][currYear] = subArrays.reduce((sum, arr) => sum + arr[index_pwc][currYear], 0);
    taxesPnl(array, currYear, subArrays, 0);
    taxesPnl(array, currYear, subArrays, 1);
    calcProducts(array, currYear);
};

export const updateArray = (data, rowIndex, cellIndex, newVal, real_years, country, arrayIndex) => {
    const numChannels = DataManager.channels;
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
            updatePnl(updatedData, currYear, numChannels, savArray, revArray, costArray);
        } else {
            updateFunctions(currYear<real_years, updatedData, currYear, arrayIndex, numChannels)
        }
        currYear++;
    }
    return updatedData
};

export const combineData = (subArrays, len, numYears) => {
    const channels = DataManager.channels;
    const regionsArray = [
        createEmptyArray(len, numYears),
        createEmptyArray(len, numYears),
        createEmptyArray(len, numYears),
        createEmptyArray(len-10, numYears),
    ];
    const totalSheets = regionsArray.length;
    for(let sheet = 0; sheet < totalSheets; sheet++){
        const sheetArrays = subArrays.map(obj => obj.arrays[sheet]);
        for(let year = 0; year < numYears; year++) {
            if(sheet===2) {
                //this is for the cost percentages
            }
            else {
                volRevPnlSum(regionsArray[sheet], year, channels, sheetArrays, 0);
                volRevPnlSum(regionsArray[sheet], year, channels, sheetArrays, 1);
                pricePnl(regionsArray[sheet], year, channels);
                cogsPnl(regionsArray[sheet], year, channels, sheetArrays)
                gpPnl(regionsArray[sheet], year, channels, sheetArrays, 0);
                gpPnl(regionsArray[sheet], year, channels, sheetArrays, 1);
                gpPnl(regionsArray[sheet], year, channels, sheetArrays, 2);
                revDepPnl(regionsArray[sheet], year, sheetArrays, 0);
                revDepPnl(regionsArray[sheet], year, sheetArrays, 1);
                revDepPnl(regionsArray[sheet], year, sheetArrays, 2);
                const index_pwc = DataManager.indicies["Primary Working Capital"];
                regionsArray[sheet][index_pwc][year] = sheetArrays.reduce((sum, arr) => sum + arr[index_pwc][year], 0);
                taxesPnl(regionsArray[sheet], year, sheetArrays, 0);
                taxesPnl(regionsArray[sheet], year, sheetArrays, 1);
                calcProducts(regionsArray[sheet], year);
            }
        }
    }
    return regionsArray;
};

const createEmptyArray = (x, y) => {
    return Array.from({ length: x }, () => Array(y).fill(0));
  };