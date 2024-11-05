import DataManager from "../data/DataManager";

export const balls = () => {
    console.log("I am loathing")
};

const calcVolume = (isActual, country, array, year, numChannels) => {
    //map index of 0
    const index = DataManager[country].indicies['Volume']; //map from the row_index to the real_index
    const index_growth = index + (numChannels+1); //map from the row_index to the real_index

    if(isActual) { // Input is amount of volume per channel
        let sum = 0;
        for(let i = index+1; i < index_growth; i++) {sum+=array[i][year];}
        array[index][year] = sum;
        if(year !== 0) { // need to update the growth
            for(let i = 0; i < (numChannels+1); i++) { 
                // check if year-1 val is 0 -> 0, otherwise divide current year by prev year
                const percPY = ((year!==0 && array[index+i][year-1] !== 0)
                    ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
                array[index_growth+i][year] = percPY;
            }
        }
    } else { // Input is the % growth
        let sum = 0; // keep track of sum while updating the volume amounts
        for(let i = 1; i < (numChannels+1); i++) { // update each channel first
            const amount = array[index_growth+i][year-1] * (1 + array[index+i][year]);
            sum += amount;
            array[index_growth+i][year] = amount;
        }
        array[index_growth][year] = sum; // update total
        array[index][year] = (array[index_growth][year-1] === 0 ? 0
            : (array[index_growth][year] / array[index_growth][year-1]) - 1); // update total growth
    }
};

const calcPrice = (isActual, country, array, year, numChannels) => {
    // THIS MUST BE PERFORMED AFTER calcRevenue TO WORK
    // map index 2
    const index = DataManager[country].indicies['Price/Vol'];
    const index_perc = index + (numChannels+1);
    const vol_index = DataManager[country].indicies['Volume'];
    const rev_index = DataManager[country].indicies['Revenue'];
    
    if(isActual) {
        for(let i = 1; i < (numChannels+1); i++) {
            array[index+i][year] = (array[vol_index+i]===0 ? 0 
                : array[rev_index+i] / array[vol_index+i]);
            array[index_perc+i][year] = ((year!==0 && array[index+i][year-1]!==0) 
                ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
        }
    } else {
        for(let i = 1; i < (numChannels+1); i++) {
            array[index+1][year] = array[index+1][year-1] * (1 + array[index_perc+i][year]);
        }
    }
};

const calcRevenue = (isActual, country, array, year, numChannels) => {
    // map to 4
    const index = DataManager[country].indicies['Revenue'];
    const index_perc = index + (numChannels+1);

    if(isActual) { // input is the amounts per channel
        let sum = 0;
        for(let i = 1; i < (numChannels+1); i++) {
            sum += array[index+i][year];
            array[index_perc+1][year] = ((year!==0 && array[index+i][year-1]!==0) 
            ? (array[index+i][year] / array[index+i][year-1]) - 1 : 0);
        }
        array[index][year] = sum;
        array[index_perc][year] = ((year!==0 && array[index][year-1]!==0) 
            ? (array[index][year] / array[index][year-1]) - 1 : 0);
    } else {
        const index_vol = DataManager[country].indicies["Volume"];
        const index_price = DataManager[country].indicies['Price'];

        let sum = 0;
        for(let i = 1; i < (numChannels+1); i++) {
            const amount = array[index_vol+i][year] * array[index_price+i];
            sum += amount;
            array[index+i][year] = amount;
            array[index_perc+1][year] = (array[index+i][year-1]!==0 
            ? (amount / array[index+i][year-1]) - 1 : 0);
        }
        array[index][year] = sum;
        array[index_perc][year] = (array[index][year-1]!==0 
            ? (sum / array[index][year-1]) - 1 : 0);
    }
};

const calcCOGS = (isActual, country, array, year, numChannels) => {
    // map to 6
    const index = DataManager[country].indicies["COGS"];
    const index_cpv = index + (numChannels+1);
    const index_cpv_growth = index_cpv + (numChannels+1);
    const index_vol = DataManager[country].indicies["Volume"];
    
    if(isActual) { // There is no input, only calculations
        const index_rev = DataManager[country].indicies["Revenue"];
        const index_gp = DataManager[country].indicies["Gross Profit"];
        
        for(let i = 0; i < (numChannels+1); i++) {
            const amount = array[index_rev+i][year] - array[index_gp+i][year];
            array[index_cpv+1][year] = (array[index_vol+i][year] !== 0
                ? amount / array[index_vol+i][year] : 0);
            array[index_cpv_growth][year] = ((year!==0 && array[index_cpv+i][year-1]!==0) 
                ? (array[index_cpv+i][year] / array[index_cpv+i][year-1]) - 1 : 0);
        }
    } else { // index_cpv_growth is the input
        let sum = 0;
        for(let i = 1; i < (numChannels+1); i++) {
            const cpv = array[index_cpv+i][year-1] * (1 + array[index_cpv_growth+i][year])
            const amount = cpv * array[index_vol+i][year];
            array[index_cpv+i][year] = cpv;
            sum += amount;
        }
        array[index][year] = sum;
        array[index_cpv][year] = (array[index_vol][year]!==0 ? sum / array[index_vol][year] : 0);
    }
};

const calcGrossProfit = (isActual, country, array, year, numChannels) => {
    // map to 9
    const index = DataManager[country].indicies["Gross Profit"];
    const index_perc = index + (numChannels+1);
    const index_rev = DataManager[country].indicies["Revenue"];
    
    if(isActual) { // No Input
        let sum = 0;
        for(let i = 1; i < (numChannels+1); i++) {
            sum += array[index+i][year];
            array[index_perc+1][year] = ((year!==0 && array[index_rev+i][year]!==0) 
            ? array[index+i][year] / array[index_rev+i][year] : 0);
        }
        array[index][year] = sum;
        array[index_perc][year] = (array[index_rev][year]!==0
            ? array[index][year] / array[index_rev][year] : 0);
    } else { // No Input
        const index_cogs = DataManager[country].indicies["COGS"];

        for(let i = 0; i < (numChannels+1); i++) {
            array[index+i][year] = array[index_rev+i][year] - array[index_cogs+i][year];
            array[index_perc][year] = (array[index_rev+i][year]===0 ? 0
                                        : array[index+i][year] / array[index_rev+i][year]);
        }
    }
};

const calcRevenueDepencendy = (isActual, country, array, map_index, year, numChannels) => {
    // this will be for A&C, Distribution (33, 39)
    const index = map_index * (numChannels+1);
    const index_perc = index + (numChannels+1);
    const index_rev = DataManager[country].indicies["Revenue"];

    if(isActual) { // Input is the amounts
        let sum = 0;
        for(let i = 1; i < (numChannels+1); i++) {
            const amount = array[index+i][year];
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
};

const calcRevenueSingle = (isActual, country, array, map_index, year, numChannels) => {
    // This will be for Ovh, OIE, D&A (45, 47, 49)
    const index = map_index;
    const index_perc = index + 1;
    const index_rev = DataManager[country].indicies['Revenue'];

    if(isActual) {  // Input is the amount
        array[index_perc][year] = (array[index_rev][year]===0 ? 0 : array[index][year]/array[index_rev][year]);
    } else { // Input is the percent
        array[index][year] = array[index_perc][year] * array[index_rev][year];
    }
};

const calcPWC = (array, country, year, numChannels) => {
    const index_pwc = DataManager[country].indicies["Primary Working Capital"];
    const index_ds = DataManager[country].indicies["Days Sales"];
    const index_di = DataManager[country].indicies["Days Inventory"];
    const index_dp = DataManager[country].indicies["Days Payable"];
    const index_ccc = DataManager[country].indicies["Cash Conversion Cycle"];
    const index_ar = DataManager[country].indicies["Accounts Receivable"];
    const index_i = DataManager[country].indicies["Inventory"];
    const index_ap = DataManager[country].indicies["Accounts Payable"];
    const index_other = DataManager[country].indicies["Other"];
    const index_twc = DataManager[country].indicies["Total Working Capital"];
    const index_cashben = DataManager[country].indicies["Cash Benefit"];
    const index_rev = DataManager[country].indicies["Revenue"];
    const index_gp = DataManager[country].indicies["Gross Profit"];

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

const calcProducts = (array, country, year, numChannels) => {
    const index_gp = DataManager[country].indicies["Gross Profit"];
    const index_ac = DataManager[country].indicies["A&C"];
    const index_dist = DataManager[country].indicies["Distribution"];
    const index_ovh = DataManager[country].indicies["Ovh"]; 
    const index_oie = DataManager[country].indicies["OIE"]; 
    const index_ebit = DataManager[country].indicies["EBIT"]; 
    const index_rev = DataManager[country].indicies["Revenue"];
    const index_da = DataManager[country].indicies["D&A"]; 
    const index_ebitda = DataManager[country].indicies["EBITDA"]; 
    const index_taxes = DataManager[country].indicies["Taxes"];
    const index_niu = DataManager[country].indicies["Net Income Unlevered"];
    const index_nsp = DataManager[country].indicies["Non-Service Pension"];
    const index_da2 = DataManager[country].indicies["D&A Addback"];
    const index_pwc = DataManager[country].indicies["Primary Working Capital"];
    const index_ofc = DataManager[country].indicies["Operating Cash Flow"];
    const index_capex = DataManager[country].indicies["Capex"];
    const index_fcf = DataManager[country].indicies["Free Cash Flow"];

    //ebit
    const ebit = array[index_gp][year] - array[index_ac][year] - array[index_dist][year] - array[index_ovh][year] - array[index_oie][year];
    array[index_ebit][year] = ebit;
    array[index_ebit+1][year] = (array[index_rev][year]===0 ? 0 : ebit / array[index_rev][year])
    //ebitda
    array[index_ebitda][year] = array[index_ebit][year] + array[index_da][year];
    array[index_ebitda+1][year] = (array[index_rev][year]===0 ? 0 : array[index_ebitda][year] / array[index_rev][year])
    //taxes
    array[index_taxes][year] = array[index_taxes+1][year] * array[index_rev][year];
    //niu
    array[index_niu][year] = array[index_ebit][year] - array[index_nsp][year] - array[index_taxes][year];
    //pwc
    calcPWC(array, year, numChannels);
    //ocf
    array[index_da2][year] = array[index_da][year]
    array[index_ofc][year] = array[index_niu][year] + array[index_da][year] + array[index_pwc][year];
    //capex
    array[index_capex][year] = array[index_rev][year] * array[index_capex+1][year];
    const fcf = array[index_ofc][year] - array[index_capex][year];
    array[index_fcf][year] = fcf;
    array[index_fcf+1][year] = (array[index_niu][year]===0 ? 0 : fcf / array[index_niu][year]);
}

const updateFunctions = (isActual, country, array, year, numChannels) => {
    calcVolume(isActual, array, year, numChannels);
    if(isActual) {
        calcRevenue(isActual, array, year, numChannels);
        calcPrice(isActual, array, year, numChannels);
        calcGrossProfit(isActual, array, year, numChannels);
        calcCOGS(isActual, array, year, numChannels);
    } else {
        calcPrice(isActual, array, year, numChannels);
        calcRevenue(isActual, array, year, numChannels);
        calcCOGS(isActual, array, year, numChannels);
        calcGrossProfit(isActual, array, year, numChannels);
    }
    calcRevenueDepencendy(isActual, array, DataManager[country].indicies["A&C"], year, numChannels); //A&C
    calcRevenueDepencendy(isActual, array, DataManager[country].indicies["Distribution"], year, numChannels); //Distribution
    calcRevenueSingle(isActual, array, DataManager[country].indicies["Ovh"], year, numChannels); //Ovh
    calcRevenueSingle(isActual, array, DataManager[country].indicies["OIE"], year, numChannels); //Oie
    calcRevenueSingle(isActual, array, DataManager[country].indicies["D&A"], year, numChannels); //D&A
    calcProducts(array, year, numChannels);
}

export const updateArray = (data, rowIndex, cellIndex, newVal, real_years, country, arrayIndex, numChannels=0) => {
    const updatedData = [...data];
    if(rowIndex!=null) {
        updatedData[rowIndex][cellIndex] = newVal;
    }
    let totalYears = data[0].length
    let currYear = cellIndex;
    while(currYear < totalYears) {
        if (arrayIndex === 3) { //pnl updates have little care for real years
            //const savArray = DataManager[country].getArray(country, 0);
            //const revArray = DataManager[country].getArray(country, 1);
            //const costArray = DataManager[country].getArray(country, 2);
            //updatePnl(updatedData, currYear, savArray, revArray, costArray);
        } else {
            updateFunctions(currYear<totalYears, updatedData, currYear, numChannels)
        }
        currYear++;
    }
    return updatedData
};