import * as XLSX from 'xlsx';
import * as constants from "../constants";
import { seg1, seg2, seg3, cost1, cost2, rev1, rev2, rev3, rev4, rev5, rev6, rev7, rev8, rev9, dis1, dis2, ncore1, ncore2, corpDep, corpExp, mdlz, target } from "../rawdata/rawdata";

class DataManager {
    constructor() {
        this.input = {};
        this.rawdata = {};
        this.extrarawdata = {};
        this.numSegments = 0;
        this.numCosts = 0;
        this.numRevs = 0;
        this.numDis = 0;
        this.numCore = 0;
        // this.startYear = 2025;
        // this.tradeYear = 2025;
        this.numYears = 11;

        this.initializeData();
        this.initializeSheetData();
        
        // this.addSegment(1);
        // this.addSegment(2);
        // this.addSegment(3);

        // this.addCostSyn(1);
        // this.addCostSyn(2);

        // this.addRevSyn(1, [3]);
        // this.addRevSyn(2, [1]);
        // this.addRevSyn(3, [3]);
        // this.addRevSyn(4, [3]);
        // this.addRevSyn(5, [3]);
        // this.addRevSyn(6, [3]);
        // this.addRevSyn(7, [1]);
        // this.addRevSyn(8, [1]);
        // this.addRevSyn(9, [1]);

        // this.addDis(1);
        // this.addDis(2);

        // this.addNcore(1);
        // this.addNcore(2);

    }

    initializeData = () => {
        this.input["SA"] = {};
        this.input["COST"] = {"Runrate": 57, "Phasing": [.333,.666, 1]};
        this.input["REV"] = {"Single Syn": 0, "OI Margin Impact": 0, "Runrate Phasing": [0,.25,.50,.75,0], "OI Phasing": [0,0,0,0,0,0]};
        this.input["DIS"] = {};
        this.input["NCORE"] = {};
        this.input["GEN"] = this.initGen();
        this.input["CALC"] = this.initCalc();
        this.input["AVP"] = this.initAVP();
    };

    initializeSheetData = () => {
        this.rawdata["Standalone Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        this.rawdata["Synergized Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        this.rawdata["SEG"] = {"CONS": this.createEmptyArray(constants.seg_cons_labels.length, this.numYears)};
        this.rawdata["REV"] = {"CONS": this.createEmptyArray(constants.rev_cons_labels.length, this.numYears)};
        this.rawdata["COST"] = {"CONS": this.createEmptyArray(constants.cost_cons_labels.length, this.numYears)};
        this.rawdata["DIS"] = {"CONS": this.createEmptyArray(constants.dis_cons_labels.length, this.numYears)};
        this.rawdata["NCORE"] = {"CONS": this.createEmptyArray(constants.ncore_cons_labels.length, this.numYears)};
        this.rawdata["MAP"] = {"REV": {}}
        this.rawdata["MDLZ"] = mdlz;
        this.rawdata["TARGET"] = target;
        this.rawdata["Corp Exp"] = corpExp;
        this.rawdata["Corp Dep"] = corpDep;

        // this.extrarawdata["Standalone Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        // this.extrarawdata["Synergized Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        // this.extrarawdata["SEG"] = {"CONS": this.createEmptyArray(constants.seg_cons_labels.length, this.numYears)};
        // this.extrarawdata["REV"] = {"CONS": this.createEmptyArray(constants.rev_cons_labels.length, this.numYears)};
        // this.extrarawdata["COST"] = {"CONS": this.createEmptyArray(constants.cost_cons_labels.length, this.numYears)};
        // this.extrarawdata["DIS"] = {"CONS": this.createEmptyArray(constants.dis_cons_labels.length, this.numYears)};
        // this.extrarawdata["NCORE"] = {"CONS": this.createEmptyArray(constants.ncore_cons_labels.length, this.numYears)};
        // this.extrarawdata["MAP"] = {"REV": {}}
        // this.extrarawdata["MDLZ"] = mdlz;
        // this.extrarawdata["TARGET"] = target;
    }

    reset = () => {
        this.numSegments = 0;
        this.numCosts = 0;
        this.numRevs = 0;
        this.numDis = 0;
        this.numCore = 0;
        this.initializeData();
        this.initializeSheetData();
    }

    createEmptyArray(x, y, val=0) {
        return Array.from({ length: x }, () => Array(y).fill(val));
    }

    addSegment = (val=0) => {
        this.numSegments++;
        this.input["SA"][this.numSegments]  = {"NRCAGR": 0, "Proj": [0,0,0,0], "startingyear": 2025};
        this.rawdata["SEG"][this.numSegments] = this.createEmptyArray(constants.seg_labels.length, this.numYears, 0);
        //this.extrarawdata["SEG"][this.numSegments] = this.createEmptyArray(constants.seg_labels.length, this.numYears, 0);
        if(val===1) {
            this.rawdata["SEG"][this.numSegments] = seg1;
            //this.extrarawdata["SEG"][this.numSegments] = seg1;
        } else if(val===2) {
            this.rawdata["SEG"][this.numSegments] = seg2;
            //this.extrarawdata["SEG"][this.numSegments] = seg2;
        } else if(val===3) {
            this.rawdata["SEG"][this.numSegments] = seg3;
            //this.extrarawdata["SEG"][this.numSegments] = seg3;
        }
    };

    getSegment = (key) => {
        return this.rawdata["SEG"][key];
    };

    removeSegment = (key) => {
        delete this.input["SA"][key];
        delete this.rawdata["SEG"][key];
        this.calcConsolidatedSegment();
    };

    addCostSyn = (val) => {
        this.numCosts++;
        this.input["COST"][this.numCosts] = {"startingyear": 2025}
        this.rawdata["COST"][this.numCosts] = this.createEmptyArray(constants.cost_labels.length, this.numYears, 0);
        if(val===1) {
            this.rawdata["COST"][this.numCosts] = cost1;
            //this.extrarawdata["COST"][this.numCosts] = cost1;
        } else if(val===2) {
            this.rawdata["COST"][this.numCosts] = cost2;
            //this.extrarawdata["COST"][this.numCosts] = cost2;
        }
    }

    getCost = (key) => {
        return this.rawdata["COST"][key];
    }

    removeCost = (key) => {
        delete this.input["COST"][key];
        delete this.rawdata["COST"][key];
        this.calcConsolidatedCost();
    };

    addRevSyn = (val, segs) => {
        this.numRevs++;
        this.input["REV"][this.numRevs] = {"startingyear": 2025}
        this.rawdata["REV"][this.numRevs] = this.createEmptyArray(constants.rev_labels.length, this.numYears, 0);
        if(val===1) {
            this.rawdata["REV"][this.numRevs] = rev1;
            this.mapRev(segs, this.numRevs);
        } else if(val===2) {
            this.rawdata["REV"][this.numRevs] = rev2;
            this.mapRev(segs, this.numRevs);
        } else if(val===3) {
            this.rawdata["REV"][this.numRevs] = rev3;
            this.mapRev(segs, this.numRevs);
        } else if(val===4) {
            this.rawdata["REV"][this.numRevs] = rev4;
            this.mapRev(segs, this.numRevs);
        } else if(val===5) {
            this.rawdata["REV"][this.numRevs] = rev5;
            this.mapRev(segs, this.numRevs);
        } else if(val===6) {
            this.rawdata["REV"][this.numRevs] = rev6;
            this.mapRev(segs, this.numRevs);
        } else if(val===7) {
            this.rawdata["REV"][this.numRevs] = rev7;
            this.mapRev(segs, this.numRevs);
        } else if(val===8) {
            this.rawdata["REV"][this.numRevs] = rev8;
            this.mapRev(segs, this.numRevs);
        } else if(val===9) {
            this.rawdata["REV"][this.numRevs] = rev9;
            this.mapRev(segs, this.numRevs);
        }
    }

    mapRev = (segs, rev) => {
        let m = this.rawdata["MAP"]["REV"];
        segs.forEach((num) => {
            if(!m[num]) {
                m[num] = [rev];
            } else {
                let l = m[num];
                l.push(rev);
                m[num] = l;
            }
        })
        this.rawdata["MAP"]["REV"] = m;
    }

    getRev = (key) => {
        return this.rawdata["REV"][key];
    }

    removeRev = (key) => {
        delete this.input["REV"][key];
        delete this.rawdata["REV"][key];
        let map = this.rawdata["MAP"]["REV"];
        Object.keys(map).forEach((num) => {
            let segmap = map[num];
            map[num] = segmap.filter(item => item !== parseInt(key));
        })
        this.rawdata["MAP"]["REV"] = map;
        this.calcConsolidatedRev();
    };

    addDis = (val) => {
        this.numDis++;
        this.input["DIS"][this.numDis] = {"startingyear": 2025}
        this.rawdata["DIS"][this.numDis] = this.createEmptyArray(constants.dis_labels.length, this.numYears, 0);
        if(val===1) {
            this.rawdata["DIS"][this.numDis] = dis1;
        } else if(val===2) {
            this.rawdata["DIS"][this.numDis] = dis2;
        }
    }

    getDis = (key) => {
        return this.rawdata["DIS"][key];
    }

    removeDis = (key) => {
        delete this.input["DIS"][key];
        delete this.rawdata["DIS"][key];
        this.calcConsolidatedDis();
    };

    getNcore = (key) => {
        return this.rawdata["NCORE"][key];
    }

    addNcore = (val) => {
        this.numCore++;
        this.input["NCORE"][this.numCore] = {"startingyear": 2025}
        this.rawdata["NCORE"][this.numCore] = this.createEmptyArray(constants.ncore_labels.length, this.numYears, 0);
        if(val===1) {
            this.rawdata["NCORE"][this.numCore] = ncore1;
        } else if(val===2) {
            this.rawdata["NCORE"][this.numCore] = ncore2;
        }
    }

    removeNcore = (key) => {
        delete this.input["NCORE"][key];
        delete this.rawdata["NCORE"][key];
        this.calcConsolidatedNcore();
    };
    
    initAVP = () => { //in the future we will start on prices, for now auto this case
        return {
            "Premium to Current Price": [191.78, .095, .147, .199, .251, .304, .356],
            "% Premium to 52-Week High": [211.92, -.009, .038, .085, .133, .18, .227],
            "Equity Value": [42.7, 44.7, 46.8, 48.8, 50.8, 52.9],
            "Enterprise Value": [43.7, 47.6, 49.7, 51.7, 53.8, 55.8, 57.8],
            "EV / 2025E EBITDA": [2513, 19.0, 19.8, 20.6, 21.4, 22.2, 23.0],
            "EV / 2026E EBITDA": [3243, 14.7, 15.3, 15.9, 16.6, 17.2, 17.8],
            "% Cash": [.394, .375, .359, .344, .330, 6.719],
            "% Equity": [.606, .625, .641, .656, .670, -15.619],
            "% of MDLZ Shares Issued": [.257, .278, .300, .321, .339, .361],
            "% of MDLZ Ownership": [.792, .78, .767, .755, .744, 1.193],
            "% Target Ownership": [.208, .22, .233, .245, .256, -.193],
            "Implied Trust Ownership": [.058, .061, .064, .068, .071, -.053],
            "Cost Only Synergies": [.102, .096, .0, .086, .081, .478],
            "Cost & Revenue Synergies": [.109, .103, .0, .093, .088, .083],
            "2026E ACC": [-.39, -.45, -.51, -.57, -.63, 1.61],
            "2026E DIL": [-.103, -.12, -.136, -.152, -.168, .43],
            "2027E ACC": [-.16, -.24, -.31, -.37, -.44, 2.13],
            "2027E DIL": [-.04, -.058, -.076, -.092, -.109, .526],
            "2028E ACC": [.06, -.02, -.1, -.18, -.26, 2.67],
            "2028E DIL": [.014, -.005, -.024, -.042, -.059, 60.7],
            "Target Shares of Synergies": [3.1, 3.3, 3.5, 3.7, 3.9, -2.9],
            "MDLZ Shares of Synergies": [12, 11.8, 11.6, 11.4, 11.2, 18]
        }
    }

    initGen = () => {
        return {
            "Standalone Tax Rate": .24, "MDLZ Tax Rate": .24, "Interest Rate": .03, "WACC": .08, "PGR": .03,
            "Target Share Price": 191.78, "52-Week High": 211.92, "Purchase Price per Share": 230, "SO": 202.29, "Target Net Debt": 4949, 
            "% Cash": .359, "% Equity": .641,"% Interest Deductible": .7, "Dividends / Share": 2.09,
            "Trust % Ownership": .277, "MDLZ 2025 FDSO": 1332, "Total FDSO": 1736,
            "Transaction Years": 15, "Amortization %": .15, "Target BV Equity": 4010,
            "Target Rollover Debt": 5416, "Target Rollover Debt Rate": .0355, "MDLZ Debt": 21394, "MDLZ Debt Rate": .027, "Acquisition Debt": 18499, "Acquisition Rate": .055, 
            "Beginning Cash": 2184, "Ending Cash": 2000, "Minimum Cash Balance": -2000, "OTC": 1845,
            "FDSO at Offer": 203.361, "MDLZ Current FDSO": 1347, "MDLZ Share Price": 74.18, "Target Current Cash": 467, "Non-Core Divestiture": 322,
            "Debt Issurance Fees": .0055, "Transaction Fees %": .004, "Control Fees": 55, "KKR": 1669, "Target NWC Change": -.05, "CAPEX % of NR": .04, "Year 1 OTC": 799, "Year 2 OTC": 799,
            "Trade Year": 2025,
        }
    }

    initCalc = () => {
        return {
            "Total Target Debt": this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"],
            "Debt Issurance Fees": this.input["GEN"]["Acquisition Debt"] * this.input["GEN"]["Debt Issurance Fees"],
            "Source wo Equity": this.input["GEN"]["Acquisition Debt"] + this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"] + this.input["GEN"]["Non-Core Divestiture"],
        }
    }

    updateAll = () => {
        this.calcConsolidatedSegment();
        this.calcConsolidatedCost();
        this.calcConsolidatedRev();
        this.calcConsolidatedDis();
        this.calcConsolidatedNcore();
        this.calcSynergizedForecast();
    }

    // #### CALC AVP THINGS //

    calcAVP = (prices) => {
        this.input["AVP"]["Premium to Current Price"] = this.calcPremium(prices);
        this.input["AVP"]["% Premium to 52-Week High"] = this.calcHigh(prices);
        this.input["AVP"]["Equity Value"] = this.calcEquity(prices);
        this.input["AVP"]["Enterprise Value"] = this.calcEnterpriseValue(prices);
        this.input["AVP"]["EV / 2025E EBITDA"] = this.calcEVEBITDA(2025, prices);
        this.input["AVP"]["EV / 2026E EBITDA"] = this.calcEVEBITDA(2026, prices);
        this.calcCashEquity(prices);
        this.calcSharesIssue(prices,2030, 2028, 15);
        // this.epsStuff(prices, 2026);
        // this.epsStuff(prices, 2027);
        // this.epsStuff(prices, 2028);
        const eps1 = this.epsStuff(prices, 2026);
        this.input["AVP"][`2026E ACC`] = eps1[0]
        this.input["AVP"][`2026E DIL`] = eps1[1]
        const eps2 = this.epsStuff(prices, 2027);
        this.input["AVP"][`2027E ACC`] = eps2[0]
        this.input["AVP"][`2027E DIL`] = eps2[1]
        const eps3 = this.epsStuff(prices, 2028);
        this.input["AVP"][`2028E ACC`] = eps3[0]
        this.input["AVP"][`2028E DIL`] = eps3[1]
    }

    calcPremium = (prices) => {
        const tsp = this.input["GEN"]["Target Share Price"]
        let prem = [tsp]
        for(let i = 0; i < prices.length; i++) {
            prem.push(prices[i]/tsp - 1);
        }
        return prem
    }

    calcHigh = (prices) => {
        const weekHigh = this.input["GEN"]["52-Week High"];
        let high = [weekHigh]
        for(let i = 0; i < prices.length; i++) {
            high.push(prices[i]/weekHigh - 1);
        }
        return high;
    }

    calcEquity = (prices) => {
        let l = []
        for(let i = 0; i < prices.length; i++) {
            l.push(this.input["GEN"]["FDSO at Offer"] * prices[i]  / 1000)
        }
        return l
    }

    calcEnterpriseValue = (prices) => {
        let l = [((this.input["GEN"]["Target Share Price"]*this.input["GEN"]["SO"])+this.input["GEN"]["Target Net Debt"])/1000];
        for(let i = 0; i < prices.length; i++) {
            l.push((this.input["GEN"]["FDSO at Offer"] * prices[i] + this.input["GEN"]["Target Net Debt"])/1000);
        }
        return l
    }

    // need to snag real ebitda from the things
    calcEVEBITDA = (year, prices, val) => {
        let l = [] 
        if(val){
            l.push(val)
        } else { //get real EBITDA
            l.push(this.rawdata["Synergized Forecast"][10][year-this.input["GEN"]["Trade Year"]])
        }
        for(let i = 0; i < prices.length; i++) {
            l.push( this.input["AVP"]["Enterprise Value"][i+1] / (l[0]/1000) );
        }
       return l
    }

    
    calcCashEquity = (prices) => {
        let l1 = [];
        let l2 = [];
        for(let i = 0; i < prices.length; i++) {
            const purchase_equity_value = (prices[i]*this.input["GEN"]["FDSO at Offer"]);
            const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
            const trans_fees = implied_ev * this.input["GEN"]["Transaction Fees %"];
            const uses = purchase_equity_value + this.input["CALC"]["Total Target Debt"] + this.input["CALC"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
            const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - this.input["CALC"]["Total Target Debt"] - this.input["GEN"]["Non-Core Divestiture"]

            const val1 = this.input["GEN"]["Acquisition Debt"] + this.input["GEN"]["Non-Core Divestiture"];
            const val2 = this.input["CALC"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
            const cash_issued = val1 - val2;

            const total = equity_issued + cash_issued;

            l1.push(cash_issued/total)
            l2.push(equity_issued/total)
        }
        this.input["AVP"]["% Cash"] = l1;
        this.input["AVP"]["% Equity"] = l2;
    }

    calcSharesIssue = (prices, revyear, costyear, multiple) => {
        let l = [];
        let l1 = [];
        let l2 = [];
        let l3 = [];
        let l4 = [];
        let l5 = [];
        const syn = this.calcCombinedNPV(revyear, costyear, multiple)
        for(let i = 0; i < prices.length; i++) {
            const purchase_equity_value = (prices[i]*this.input["GEN"]["FDSO at Offer"]);
            const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
            const trans_fees = implied_ev * this.input["GEN"]["Transaction Fees %"];
            const uses = purchase_equity_value + this.input["CALC"]["Total Target Debt"] + this.input["CALC"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
            const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - this.input["CALC"]["Total Target Debt"] - this.input["GEN"]["Non-Core Divestiture"]
            const shares_issued = equity_issued/this.input["GEN"]["MDLZ Share Price"];
            l.push(shares_issued/this.input["GEN"]["MDLZ Current FDSO"])

            l1.push(1-shares_issued/(shares_issued+this.input["GEN"]["MDLZ 2025 FDSO"]))
            l2.push(1-l1[i]);
            l3.push(l2[i] * this.input["GEN"]["Trust % Ownership"])

            l5.push(l1[i]*syn/1000);
            l4.push((1-l1[i])*syn/1000);
        }
        this.input["AVP"]["% of MDLZ Shares Issued"] = l;
        this.input["AVP"]["% of MDLZ Ownership"] = l1;
        this.input["AVP"]["% Target Ownership"] = l2;
        this.input["AVP"]["Implied Trust Ownership"] = l3;
        this.input["AVP"]["Target Shares of Synergies"] = l4;
        this.input["AVP"]["MDLZ Shares of Synergies"] = l5;
    };

    calcCombinedNPV = (revyear, costyear, multiple) => {
        const revval = this.rawdata["REV"]["CONS"][5][revyear-this.input["GEN"]["Trade Year"]];
        const revexp = this.rawdata["REV"]["CONS"][14][revyear-this.input["GEN"]["Trade Year"]];
        const keys = Object.keys(this.rawdata["COST"])
        let costval = 0
        keys.forEach((key) => {
            if(key!=="CONS") {
                costval += this.rawdata["COST"][key][5][this.numYears-1];
            }
        })
        const costexp = this.rawdata["DIS"]["CONS"][4][costyear-this.input["GEN"]["Trade Year"]];

        const factorrev = Math.pow(1/(1+this.input["GEN"]["WACC"]),(-.5 + revyear - this.input["GEN"]["Trade Year"]));
        const factorcost = Math.pow(1/(1+this.input["GEN"]["WACC"]),(-.5 + costyear - this.input["GEN"]["Trade Year"]));

        const revsyn = (revval-revexp) * multiple * factorrev;

        const costsyn = (costval+costexp) * multiple * factorcost;

        const otc1 = this.input["GEN"]["Year 1 OTC"] * Math.pow(1/(1+this.input["GEN"]["WACC"]),.5);
        const otc2 = this.input["GEN"]["Year 2 OTC"] * Math.pow(1/(1+this.input["GEN"]["WACC"]),1.5);
        const otc = otc1 + otc2;

        return revsyn + costsyn - otc;
    }

    // ### GET ARRAYS FOR SHEETS 

    getCombinedStandalone = () => {
        let initialData = [...this.rawdata["Standalone Forecast"]];
        const keys = Object.keys(this.rawdata.SEG);
        for(let i = keys.length-2; i >= 0; i--) {
            const currRow = this.rawdata["SEG"][keys[i]][0];
            initialData.unshift(currRow);
        }
        return initialData;
    };
    
    getCombinedSynergized = () => {
        let initialData = [...this.rawdata["Synergized Forecast"]];
        const rowNC = this.rawdata["NCORE"]["CONS"][0];
        const rowSF = this.rawdata["Standalone Forecast"][0];
        let row2 = []
        for(let year = 0; year<rowSF.length; year++) {
            row2.push(rowSF[year] - rowNC[year])
        }
        const row1 = this.rawdata["REV"]["CONS"][0];
        initialData.unshift(row1);
        initialData.unshift(row2);
        return initialData
    };

    // ### Seg calculations

    initalExtraCalc = () => {
        
    }

    calcSegment = (key) => {
        const data = this.rawdata["SEG"][key];
        if(data) {
            for(let year = 0; year < data[0].length; year++) {
                data[1][year] = year===0 ? 0 : data[0][year-1]===0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
                data[8][year] = data[2][year] - data[4][year] - data[6][year];
                data[12][year] = data[8][year] + parseFloat(data[10][year]);
                [3,5,7,9,11,13].forEach((num) => {
                    data[num][year] = data[0][year] === 0 ? 0 : data[num-1][year]/data[0][year];
                });
            }
            //this.updateSAInput(key);
        }
    }

    calcSegment2 = (key) => {
        const oi_marg = this.input["SA"][key]["Proj"]
        const data = this.rawdata["SEG"][key];
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            if(year<3) {
                data[8][year] = data[0][year] * oi_marg[year];
            } else {
                data[8][year] = data[8][year-1] * (1+oi_marg[3]);
            }
            data[12][year] = data[8][year] + data[10][year];
            [3,5,7,9,11,13].forEach((num) => {
                data[num][year] = data[num-1][year]/data[0][year];
            });
        }
        this.updateSAInput(key);
    }

    updateSAInput = (key) => {
        const data = this.rawdata["SEG"][key];
        const input_data = this.input["SA"][key];

        const nrcagr = this.getSegCAGR(0, 0, this.numYears-1, key);
        if(input_data) {
            input_data["NRCAGR"] = nrcagr
            input_data["Proj"].forEach((num, index) => {
                if(index < 3) {
                    input_data["Proj"][index] = data[0][index]===0 ? 0 : data[8][index] / data[0][index];
                } else {
                    const cagr = this.getSegCAGR(8, index, this.numYears-1, key);
                    input_data["Proj"][index] = cagr;
                }
            })
        }
    }

    getSegCAGR = (slot, fy, ly, key) => {
        const data = this.rawdata["SEG"][key];
        const v1 = data[slot][fy];
        const v2 = data[slot][ly];
        const yeardif = ly - fy;
        return Math.pow(v2 / v1, 1 / yeardif) - 1;
    }

    initialCalc = () => {
        const keys = Object.keys(dataManagerInstance.rawdata.SEG);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                this.calcSegment(segKey);
            }
        })
        
        this.calcConsolidatedSegment();
    }

    calcConsolidatedSegment = () => {
        const data = this.createEmptyArray(constants.seg_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.SEG);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                const seg = dataManagerInstance.rawdata["SEG"][segKey];
                const tradeYear = this.input["GEN"]["Trade Year"]
                const segStartYear = dataManagerInstance.input["SA"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif>=0) {
                    for(let year = 0; year < data[0].length; year++) {
                        [0,2,4,6,8].forEach((num) => {
                            data[num][year] += parseFloat(seg[num][year+yearDif] || 0);
                        });
                        data[14][year] += seg[10][year+yearDif] || 0;
                    }
                } else {
                    const offset = yearDif * -1;
                    for(let year = 0; year < seg[0].length; year++) {
                        if(year+offset > data[0].length) break
                        [0,2,4,6,8].forEach((num) => {
                            data[num][year+offset] += parseFloat(seg[num][year] || 0);
                        });
                        data[14][year+offset] += seg[10][year] || 0;
                    }
                }
            }
        })
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[10][year] = this.rawdata["Corp Exp"][year] * data[0][year];
            data[11][year] = this.rawdata["Corp Exp"][year];
            data[16][year] = this.rawdata["Corp Dep"][year] * data[0][year];
            data[17][year] = this.rawdata["Corp Dep"][year];
            data[12][year] = data[8][year] - data[10][year];
            data[21][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[20][year] = data[21][year] * data[12][year];
            data[22][year] = data[12][year] - data[20][year];
            data[23][year] = data[14][year] + data[16][year];

            data[18][year] = data[12][year] + data[14][year] + data[16][year];
            data[25][year] = this.input["GEN"]["CAPEX % of NR"];
            data[24][year] = data[25][year] * data[0][year];
            data[27][year] = this.input["GEN"]["Target NWC Change"]*-1;
            data[26][year] = year===0 ? 0 : (data[0][year]-data[0][year-1])*data[27][year];

            data[28][year] = data[22][year] + data[23][year] - data[24][year] - data[26][year];
            [3,5,7,9,11,13,15,17,19,25].forEach((num) => {
                data[num][year] = data[num-1][year] / data[0][year];
            })
        }
        for(let i = 0; i < 8; i++){
            this.rawdata["Standalone Forecast"][i] = data[i];
        }
        this.rawdata["Standalone Forecast"][8] = data[12]
        this.rawdata["Standalone Forecast"][9] = data[13]
        this.rawdata["Standalone Forecast"][10] = data[18]
        this.rawdata["Standalone Forecast"][11] = data[19]
        this.rawdata["SEG"]["CONS"] = data;
    }

    calcCost = (key, val=0) => {
        const data = val===0 ? this.rawdata["COST"][key] : this.extrarawdata["COST"][key];
        for(let year = 0; year < data[0].length; year++) {
            data[2][year] = data[0][year] - data[1][year];
            data[5][year] = data[2][year] - data[3][year] - data[4][year];
        }
    }

    calcConsolidatedCost = () => {
        const data = this.createEmptyArray(constants.cost_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.COST);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                const seg = dataManagerInstance.rawdata["COST"][segKey];
                const tradeYear = this.input["GEN"]["Trade Year"]
                const segStartYear = dataManagerInstance.input["COST"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif >= 0) {
                    for(let year = 0; year < data[0].length; year++) {
                        data[0][year] += parseFloat(seg[0][year+yearDif] || 0); //REV
                        data[1][year] += parseFloat(seg[2][year+yearDif] || 0); //GP
                        data[2][year] += parseFloat(seg[3][year+yearDif] || 0); //A&C
                        data[3][year] += parseFloat(seg[4][year+yearDif] || 0); //SG&A
                    }
                } else {
                    const offset = yearDif * -1;
                    for(let year = 0; year < seg[0].length; year++) {
                        if(year+offset > data[0].length) break
                        data[0][year+offset] += parseFloat(seg[0][year] || 0); //REV
                        data[1][year+offset] += parseFloat(seg[2][year] || 0); //GP
                        data[2][year+offset] += parseFloat(seg[3][year] || 0); //A&C
                        data[3][year+offset] += parseFloat(seg[4][year] || 0); //SG&A
                    }
                }
            }
        })
        const runrate = this.input["COST"]["Runrate"]
        for(let year = 0; year < data[0].length; year++) {
            data[4][year] = data[1][year] - data[2][year] - data[3][year];
            if(year===1) {
                data[4][year] += this.input["COST"]["Phasing"][0] * runrate;
            } else if(year===2) {
                data[4][year] += this.input["COST"]["Phasing"][1] * runrate
            } else if(year>=3) {
                data[4][year] += this.input["COST"]["Phasing"][2] * runrate;
            } 
            //data[4][year] += year >= 3 ? runrate : year===2 ? this.input["COST"]["Phasing"][1] * runrate : year===1 ? this.input["COST"]["Phasing"][0] * runrate : 0
            data[6][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[5][year] = data[4][year] * data[6][year];
            data[7][year] = data[4][year] - data[5][year];
            data[8][year] = data[7][year]
        }
        this.rawdata["COST"]["CONS"] = data;
    }

    updateRevInput = () => {
        const data = this.rawdata["REV"]["CONS"];
        const input_data = this.input["REV"];

        const singlesyn = data[0][5];
        
        if(input_data) {
            input_data["Single Syn"] = singlesyn;
            input_data["Runrate Phasing"][0] = data[0][1]/singlesyn;
            input_data["Runrate Phasing"][1] = data[0][2]/singlesyn;
            input_data["Runrate Phasing"][2] = data[0][3]/singlesyn;
            input_data["Runrate Phasing"][3] = data[0][4]/singlesyn;
            input_data["Runrate Phasing"][4] = this.getRevCAGR(0, 5, this.numYears-1, "CONS")


            input_data["OI Phasing"][0] = data[0][1]===0 ? 0 : data[5][1] / data[0][1];
            input_data["OI Phasing"][1] = data[0][2]===0 ? 0 : data[5][2] / data[0][2];
            input_data["OI Phasing"][2] = data[0][3]===0 ? 0 : data[5][3] / data[0][3];
            input_data["OI Phasing"][3] = data[0][4]===0 ? 0 : data[5][4] / data[0][4];
            input_data["OI Phasing"][4] = data[0][5]===0 ? 0 : data[5][5] / data[0][5];
            input_data["OI Phasing"][5] = this.getRevCAGR(5, 5, this.numYears-1, "CONS");
        }
    };

    getRevCAGR = (slot, fy, ly, key) => {
        const data = this.rawdata["REV"][key];
        const v1 = data[slot][fy];
        const v2 = data[slot][ly];
        const yeardif = ly - fy;
        return Math.pow(v2 / v1, 1 / yeardif) - 1;
    }

    calcRev = (key) => {
        const data = this.rawdata["REV"][key];
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : data[0][year-1] === 0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[8][year] = data[2][year] - data[4][year] - data[6][year];
            [3,5,7,9].forEach((num) => {
                data[num][year] = data[0][year]===0 ? 0 : data[num-1][year]/data[0][year];
            })
        }
    }

    calcRevDepreciation = (year) => {
        const m = this.rawdata["MAP"]["REV"];
        const keys = Object.keys(m);
        let dep = 0;
        keys.forEach((num) => { //num is the segment
            const depperc = this.rawdata["SEG"][num] ? this.rawdata["SEG"][num][11][year] : 0;
            let amount = 0;
            m[num].forEach((rev) => { //rev is the rev
                amount += this.rawdata["REV"][rev][0][year];
            })
            dep += amount * depperc;
        })
        return dep;
    }

    calcConsolidatedRev = () => {
        const data = this.createEmptyArray(constants.rev_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.REV);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                const seg = dataManagerInstance.rawdata["REV"][segKey];
                const tradeYear = this.input["GEN"]["Trade Year"]
                const segStartYear = dataManagerInstance.input["REV"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif>=0) {
                    for(let year = 0; year < data[0].length; year++) {
                        data[0][year] += parseFloat(seg[0][year+yearDif] || 0);
                        data[2][year] += parseFloat(seg[2][year+yearDif] || 0);
                        data[3][year] += parseFloat(seg[4][year+yearDif] || 0);
                        data[4][year] += parseFloat(seg[6][year+yearDif] || 0);
                        data[5][year] += parseFloat(seg[8][year+yearDif] || 0);
                    }
                } else {
                    const offset = yearDif * -1;
                    for(let year = 0; year < seg[0].length; year++) {
                        if(year+offset > data[0].length) break
                        data[0][year+offset] += parseFloat(seg[0][year] || 0);
                        data[2][year+offset] += parseFloat(seg[2][year] || 0);
                        data[3][year+offset] += parseFloat(seg[4][year] || 0);
                        data[4][year+offset] += parseFloat(seg[6][year] || 0);
                        data[5][year+offset] += parseFloat(seg[8][year] || 0);
                    }
                }
            }
        })
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : data[0][year-1] === 0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[6][year] = this.calcRevDepreciation(year);
            data[7][year] = data[0][year]===0 ? 0 : data[6][year] / data[0][year];
            data[8][year] = data[6][year] + data[5][year];
            data[9][year] = data[0][year]===0 ? 0 : data[8][year]/data[0][year];
            data[11][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[10][year] = data[11][year] * data[5][year];
            data[12][year] = data[5][year] - data[10][year]; 
            data[13][year] = data[6][year];
            data[15][year] = this.input["GEN"]["CAPEX % of NR"];
            data[14][year] = data[15][year] * data[0][year];
            data[17][year] = this.input["GEN"]["Target NWC Change"]*-1;
            data[16][year] = year===0 ? 0 : (data[0][year]-data[0][year-1])*data[17][year];
            data[18][year] = data[12][year] + data[13][year] - data[14][year] - data[16][year];
        }
        this.rawdata["REV"]["CONS"] = data;
        this.updateRevInput();
    }

    calcDis = (key) => {
        const data = this.rawdata["DIS"][key];
        for(let year = 0; year < data[0].length; year++) {
            data[4][year] = data[1][year] - data[2][year] - data[3][year];
        }
    }

    calcConsolidatedDis = () => {
        const data = this.createEmptyArray(constants.dis_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.DIS);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                const seg = dataManagerInstance.rawdata["DIS"][segKey];
                const tradeYear = this.input["GEN"]["Trade Year"]
                const segStartYear = dataManagerInstance.input["DIS"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif>=0) {
                    for(let year = 0; year < data[0].length; year++) {
                        [0,1,2,3].forEach((num) => {
                            data[num][year] += parseFloat(seg[num][year+yearDif] || 0);
                        })
                    }
                } else {
                    const offset = yearDif * -1;
                    for(let year = 0; year < seg[0].length; year++) {
                        if(year+offset > data[0].length) break;
                        [0,1,2,3].forEach((num) => {
                            data[num][year+offset] += parseFloat(seg[num][year] || 0);
                        })
                    }
                }
            }
        })
        for(let year = 0; year < data[0].length; year++) {
            data[4][year] = data[1][year]-data[2][year]-data[3][year];
            data[6][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[5][year] = data[4][year] * data[6][year];
            data[7][year] = data[4][year] - data[5][year];
            data[8][year] = data[7][year];
        }
        this.rawdata["DIS"]["CONS"] = data;
    }

    calcNcore = (key) => {
        const data = this.rawdata["NCORE"][key];
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : data[0][year-1] === 0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[8][year] = data[2][year] - data[4][year] - data[6][year];
            data[12][year] = data[8][year] + data[10][year];
            [3,5,7,9,11,13].forEach((num) => {
                data[num][year] = data[0][year]===0 ? 0 : data[num-1][year]/data[0][year];
            })
        }
    }

    calcConsolidatedNcore = () => {
        const data = this.createEmptyArray(constants.ncore_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.NCORE);
        keys.forEach((segKey) => {
            if(segKey!=="CONS") {
                const seg = dataManagerInstance.rawdata["NCORE"][segKey];
                const tradeYear = this.input["GEN"]["Trade Year"]
                const segStartYear = dataManagerInstance.input["NCORE"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif>=0) {
                    for(let year = 0; year < data[0].length; year++) {
                        data[0][year] += parseFloat(seg[0][year+yearDif] || 0);
                        data[2][year] += parseFloat(seg[2][year+yearDif] || 0);
                        data[3][year] += parseFloat(seg[4][year+yearDif] || 0);
                        data[4][year] += parseFloat(seg[6][year+yearDif] || 0);
                        data[7][year] += parseFloat(seg[10][year+yearDif] || 0);
                    }
                } else {
                    const offset = yearDif * -1;
                    for(let year = 0; year < seg[0].length; year++) {
                        if(year+offset > data[0].length) break;
                        data[0][year+offset] += parseFloat(seg[0][year] || 0);
                        data[2][year+offset] += parseFloat(seg[2][year] || 0);
                        data[3][year+offset] += parseFloat(seg[4][year] || 0);
                        data[4][year+offset] += parseFloat(seg[6][year] || 0);
                        data[7][year+offset] += parseFloat(seg[10][year] || 0);
                    }
                }
            }
        })
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : data[0][year-1] === 0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[5][year] = data[2][year] - data[3][year] - data[4][year]; //OI
            data[6][year] = data[0][year] === 0 ? 0 : data[5][year]/data[0][year]; //OI MArgin
            data[8][year] = data[0][year] === 0 ? 0 : data[7][year]/data[0][year]; //DA Margin
            data[9][year] = data[5][year] + data[7][year]; //EBITDA
            data[10][year]  = data[0][year] === 0 ? 0 : data[9][year]/data[0][year]; //EBITDA Margin
            data[12][year] = this.input["GEN"]["Standalone Tax Rate"]; //Tax rate
            data[11][year] = data[12][year] * data[5][year]; //Tax
            data[13][year] = data[5][year] - data[11][year]; //NOPAT
            data[14][year] = data[7][year];
            data[16][year] = this.input["GEN"]["CAPEX % of NR"];
            data[15][year] = data[16][year] * data[0][year];
            data[18][year] = this.input["GEN"]["Target NWC Change"]*-1;
            data[17][year] = year===0 ? 0 : (data[0][year]-data[0][year-1])*data[18][year];
            data[19][year] = data[13][year] + data[14][year] - data[15][year] - data[17][year];
        }
        this.rawdata["NCORE"]["CONS"] = data;
    }

    calcSynergizedForecast = () => {
        this.calcConsolidatedSegment();
        this.calcConsolidatedCost();
        this.calcConsolidatedRev();
        this.calcConsolidatedDis();
        this.calcConsolidatedNcore();
        const seg = this.getSegment("CONS");
        const cost = this.getCost("CONS");
        const rev = this.getRev("CONS");
        const dis = this.getDis("CONS");
        const ncore = this.getNcore("CONS");
        const standalone = this.rawdata["Standalone Forecast"];
        let syn = this.createEmptyArray(constants.row_labels.length, this.numYears);

        for(let year = 0; year < seg[0].length; year++) {
            if(this.input["GEN"]["Trade Year"] + year <= this.tradeYear) {
                for(let num = 0; num < standalone.length; num++) {
                    syn[num][year] = standalone[num][year];
                }
            } else {
                syn[0][year] = seg[0][year] + cost[0][year] + rev[0][year] + dis[0][year] - ncore[0][year]; //REV
                syn[1][year] = year===0 ? 0 : syn[0][year-1]===0 ? 0 : (syn[0][year]/syn[0][year-1]) - 1;
                syn[2][year] = seg[2][year] + cost[1][year] + rev[2][year] + dis[1][year] - ncore[2][year]; //GP
                syn[3][year] = syn[0][year] === 0 ? 0 : syn[2][year]/syn[0][year];
                syn[4][year] = seg[4][year] + cost[2][year] + rev[3][year] + dis[2][year] - ncore[3][year]; //A&C
                syn[5][year] = syn[0][year] === 0 ? 0 : syn[4][year]/syn[0][year];
                syn[6][year] = seg[6][year] + seg[10][year] + cost[3][year] + rev[4][year] + dis[3][year] - ncore[4][year]; // SG&A / Corp Exp
                syn[7][year] = syn[0][year] === 0 ? 0 : syn[6][year]/syn[0][year];
                //syn[8][year] = seg[12][year] + cost[4][year] + rev[5][year] + dis[4][year] - dis[5][year]; // EBIT
                syn[8][year] = syn[2][year] - syn[4][year] - syn[6][year];
                syn[9][year] = syn[0][year] === 0 ? 0 : syn[8][year]/syn[0][year];
                syn[10][year] = seg[18][year] + cost[4][year] + rev[8][year] + dis[4][year] - ncore[9][year]; // EBITDA
                syn[11][year] = syn[0][year] === 0 ? 0 : syn[10][year]/syn[0][year];
            }
        }

        this.rawdata["Synergized Forecast"] = syn;
    };

    // IRR THINGS

    getFCFList = (val, segData=null) => {
        let p = [];
        const seg = segData===null ? this.getSegment("CONS") : segData;

        const cost = this.getCost("CONS");
        const rev = this.getRev("CONS");
        const dis = this.getDis("CONS");
        const ncore = this.getNcore("CONS");
        const yr1c = this.input["GEN"]["Year 1 OTC"] * -1;
        const yr2c = this.input["GEN"]["Year 2 OTC"] * -1;
        for(let year = 0; year < seg[0].length; year++) {
            if(year + this.input["GEN"]["Trade Year"] > this.input["GEN"]["Trade Year"]) {
                let amount = 0;
                if(val===1) {
                    amount += (year + this.input["GEN"]["Trade Year"] - this.input["GEN"]["Trade Year"])===1 ? yr1c : 0;
                    amount += (year + this.input["GEN"]["Trade Year"] - this.input["GEN"]["Trade Year"])===2 ? yr2c : 0;
                    amount += seg[28][year] + cost[8][year] + rev[18][year] + dis[8][year] - ncore[19][year];
                } else if(val===2) {
                    amount += (year + this.input["GEN"]["Trade Year"] - this.input["GEN"]["Trade Year"])===1 ? yr1c : 0;
                    amount += (year + this.input["GEN"]["Trade Year"] - this.input["GEN"]["Trade Year"])===2 ? yr2c : 0;
                    amount += seg[28][year] + cost[8][year] + dis[8][year] - ncore[19][year];
                } else if(val===3) {
                    amount += seg[28][year];
                }
                p.push(amount);
            }
        }
        const perp_val = p[p.length-1] * (1 + this.input["GEN"]["PGR"]) / (this.input["GEN"]["WACC"] - this.input["GEN"]["PGR"])
        p.push(perp_val)
        return p;
    }

    getIRR = (prices, val, segData=null) => {
        this.calcConsolidatedCost();
        this.calcConsolidatedRev();
        const fcfList = this.getFCFList(val, segData);
        let p = [];
        const nc = this.input["GEN"]["Non-Core Divestiture"];
        const kkr = this.input['GEN']["KKR"];
        for(let i = 0; i < prices.length; i++) {
            const purchase_equity_value = (prices[i]*this.input["GEN"]["FDSO at Offer"]);
            const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
            const fees = this.input["CALC"]['Debt Issurance Fees'] + implied_ev * this.input["GEN"]["Transaction Fees %"] + this.input["GEN"]["Control Fees"];
            const price = 0 - implied_ev + nc - kkr - fees;
            let x = [price]
            fcfList.forEach((num) => {
                x.push(num);
            })
            const currIRR = this.calculateIRR(x);
            p.push(currIRR);
        }
        return p;
    }

    calculateIRR(cashFlows, tol = 1e-6, maxIter = 1000) {
        let low = -0.9999;  // Start closer to -1 to avoid infinite NPV
        let high = 2.0;     // Increased upper bound for broader range
        let midRate;
    
        for (let i = 0; i < maxIter; i++) {
            midRate = (low + high) / 2;
            const npv = this.calculateNPV(cashFlows, midRate, .5);
    
            if (Math.abs(npv) < tol) {
                return midRate; // Convert to percentage
            }
    
            // Adjust bounds based on the NPV sign
            if (npv > 0) {
                low = midRate;
            } else {
                high = midRate;
            }
        }
    
        //throw new Error("IRR calculation did not converge within the bounds.");
        return "DNC"
    }

    calculateNPV = (cashFlows, rate, initial_offset = 0) => {
        let npv = 0;
        cashFlows.forEach((fcf, t) => {
            const offset = t===0 ? 0 : t===cashFlows.length-1 ? t-initial_offset-1 : t - initial_offset;
            const denom = Math.pow(1/(1 + rate), offset);
            npv += fcf * denom;
        })
        return npv;
    }

    storeIRRs = (prices) => {
        this.input["AVP"]["Cost & Revenue Synergies"] = this.getIRR(prices,1)
        this.input["AVP"]["Cost Only Synergies"] = this.getIRR(prices,2)
    }

    /// ALL EPS STUFF

    getTargetNOPAT = (year) => {
        return this.rawdata["SEG"]["CONS"][22][year] + this.rawdata["COST"]["CONS"][7][year] +
            this.rawdata["REV"]["CONS"][12][year] + this.rawdata["DIS"]["CONS"][7][year] - this.rawdata["NCORE"]["CONS"][15][year]
    };

    calcAmort = (price) => {
        const trans_years = this.input["GEN"]["Transaction Years"];
        const amort_perc = this.input["GEN"]["Amortization %"];
        const thing = this.input["GEN"]["Target BV Equity"];
        const debt_fees = this.input["CALC"]["Debt Issurance Fees"];
        const target_equity = price * this.input["GEN"]["FDSO at Offer"];
        return (((target_equity-thing)*amort_perc)/trans_years) + (debt_fees/7);
    }

    calcInterest = (price, amort, year) => {

        const purchase_equity_value = (price*this.input["GEN"]["FDSO at Offer"]);
        const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
        const trans_fees = implied_ev * this.input["GEN"]["Transaction Fees %"];
        const uses = purchase_equity_value + this.input["CALC"]["Total Target Debt"] + this.input["CALC"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
        const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - this.input["CALC"]["Total Target Debt"] - this.input["GEN"]["Non-Core Divestiture"]
        const shares_issued = equity_issued/this.input["GEN"]["MDLZ Share Price"];

        const pf_shares = shares_issued + this.input["GEN"]["MDLZ 2025 FDSO"]

        const total_div = pf_shares * this.input["GEN"]["Dividends / Share"];
        return [this.getCashFlowOperations(year, amort)+this.input["GEN"]["Beginning Cash"] + this.input["GEN"]["Minimum Cash Balance"] - total_div, pf_shares];
    }

    getCashFlowOperations = (year, amort) => {
        
        const data = this.rawdata["MDLZ"];
        const tdata = this.rawdata["SEG"]["CONS"];
        const ncdata = this.rawdata["NCORE"]["CONS"];
        const rdata = this.rawdata["REV"]["CONS"];

        const mdlz_da = data[3][year] - data[4][year];
        const target_da = tdata[14][year+1];
        const nc_da = ncdata[7][year+1]*-1;
        const rev_da = rdata[6][year+1];

        const mdlz_nwc = data[6][year]*-1;
        const target_nwc = tdata[26][year+1]*-1;
        const nc_nwc = ncdata[17][year+1]*-1;
        const rev_nwc = rdata[16][year+1]*-1;

        const mdlz_capex = data[7][year];
        const target_capex = tdata[24][year+1]*-1;
        const nc_capex = ncdata[15][year+1];
        const rev_capex = rdata[14][year+1]*-1;

        let otc = year===0||year===1 ? this.input["GEN"]["OTC"]/2*-1 : 0;

        const oll = data[10][year];
        const taxes = data[11][year]*-1;
        const tax_impact = data[12][year];
        const mdlz_jvs = data[15][year]*-1;
        const mdlz_jvs_impact = data[16][year];
        const mdlz_other = data[17][year]*-1;
        const mdlz_other_impact = data[18][year];
        const restruct = data[19][year];

        const sbc = 85
        const pension = -61

        return mdlz_da+target_da+nc_da+rev_da+mdlz_capex+target_capex+nc_capex+rev_capex+mdlz_nwc+target_nwc
        +nc_nwc+rev_nwc+otc+oll+taxes+tax_impact+mdlz_jvs+mdlz_jvs_impact+mdlz_other+mdlz_other_impact+restruct+sbc+pension+amort;
    }

    epsStuff = (prices, year, tnopat=null) => {
        let l1 = [];
        let l2 = [];

        const c2 = this.input["GEN"]["MDLZ Debt"] * this.input["GEN"]["MDLZ Debt Rate"]
        + this.input["GEN"]["Acquisition Debt"] * this.input["GEN"]["Acquisition Rate"]

        const currYear = year-this.input["GEN"]["Trade Year"]-1;
        const mdlz_tax = this.input["GEN"]["MDLZ Tax Rate"];

        const mdlz_stat_quo_eps = this.rawdata["MDLZ"][0][currYear]

        const mdlz_nopat = this.rawdata["MDLZ"][5][currYear];
        //const target_nopat = this.rawdata["TARGET"][2][currYear];
        const target_nopat = tnopat ? tnopat : this.getTargetNOPAT(currYear+1)

        const pensions = this.rawdata["MDLZ"][13][currYear];
        const mdlz_pensions_shield = mdlz_tax * pensions * -1;
        const mdlz_pension_impact = pensions + mdlz_pensions_shield;

        const tpensions = this.rawdata["TARGET"][0][currYear];
        const target_pensions_shield = mdlz_tax * tpensions * -1;
        const target_pension_impact = tpensions + target_pensions_shield;

        const tos = this.rawdata["TARGET"][1][currYear]
        const target_other_shield = mdlz_tax * tos * -1;
        const target_other_impact = tos + target_other_shield;

        const mdlz_non_controlling_interest = this.rawdata["MDLZ"][14][currYear];
        const mdlz_jvs = this.rawdata["MDLZ"][15][currYear];
        const mdlz_other = this.rawdata["MDLZ"][17][currYear];

        const cash_interest = ((this.input["GEN"]["Beginning Cash"] + this.input["GEN"]["Ending Cash"])/2) * this.input["GEN"]["Interest Rate"];
        const cash_shield = -1 * cash_interest * mdlz_tax;
        const cash_total = cash_interest+cash_shield;

        const trd = this.input["GEN"]["Target Rollover Debt"];
        const r1 = this.input["GEN"]["Target Rollover Debt Rate"];

        const r2 = this.input["GEN"]["% Interest Deductible"] * mdlz_tax * -1;

        for(let i = 0; i < prices.length; i++) {
            const amort = this.calcAmort(prices[i]);
            const amort_shield = mdlz_tax * amort * -1;
            const mdlz_amort = amort + amort_shield;

            const c3 = mdlz_nopat+target_nopat+mdlz_pension_impact+target_pension_impact+target_other_impact
            +mdlz_non_controlling_interest+mdlz_jvs+mdlz_other+cash_total-mdlz_amort;

            const things = this.calcInterest(prices[i], amort, currYear);

            const c1 = things[0];

            const pf_shares = things[1];
            const prni = (c3-(1+r2)*r1*trd + ((1+r2)*r1*c1)/2 - (1+r2)*c2)/(1-((1+r2)*r1)/2)
            const pro_forma_eps = prni/pf_shares;

            const dif = pro_forma_eps - mdlz_stat_quo_eps;
            l1.push(dif);
            l2.push(dif/mdlz_stat_quo_eps);
            
        }
        // this.input["AVP"][`${year}E ACC`] = l1
        // this.input["AVP"][`${year}E DIL`] = l2
        return [l1, l2]
    }

    // Sensitivity

    growthSensitivity = (growthRates, prices) => {
        let irrs = []

        growthRates.forEach((rate) => {
            const data = this.rawdata["SEG"]["CONS"].map(row => [...row]);
            for(let year = 1; year < data[0].length; year++) {
                data[0][year] = data[0][year-1] * (1+rate);
            }
            this.growthNetCashCalc(data);
            const irr = this.getIRR(prices, 1, data);
            irrs.push(irr)
        })

        return irrs;
    }

    growthNetCashCalc = (data) => {
        for(let year = 0; year < data[0].length; year++) {
            const nopat = data[0][year] * data[13][year] * (1-data[21][year]);
            const depr = data[0][year] * data[15][year] + data[0][year] * data[17][year];
            const capex = data[0][year] * data[25][year];
            const nwc = year===0 ? 0 : (data[0][year] - data[0][year-1]) * data[27][year];
            const fcf = nopat + depr - capex - nwc;
            data[28][year] = fcf;
        }
    }

    growthNPVSensitivity = (growthRates, prices) => {
        let npvs = []

        growthRates.forEach((rate) => {
            const data = this.rawdata["SEG"]["CONS"].map(row => [...row]);
            for(let year = 1; year < data[0].length; year++) {
                data[0][year] = data[0][year-1] * (1+rate);
            }
            this.growthNetCashCalc(data);
            const fcf = this.getFCFList(1, data)
            const npv = this.calculateNPV(fcf, this.input["GEN"]["WACC"], .5)
            npvs.push(npv)
        })

        return npvs;
    }

    getTNOPAT = (nopat, year) => {
        return nopat + this.rawdata["COST"]["CONS"][7][year] +
            this.rawdata["REV"]["CONS"][12][year] + this.rawdata["DIS"]["CONS"][7][year] - this.rawdata["NCORE"]["CONS"][15][year]
    }

    //Gross Margin and COGS sensitivity
    growthEPSSensitivity = (growthRates, price, years) => {
        let eps = [];
        // years.forEach((year, index) => {
        //     const realYear = year-this.input["GEN"]["Trade Year"]-1;
        //     console.log(realYear)
        //     let curr = [];
        //     growthRates.forEach((rate) => {
        //         const data = this.rawdata["SEG"]["CONS"].map(row => [...row]);
        //         for(let year = 1; year < data[0].length; year++) {
        //             data[0][year] = data[0][year-1] * (1+rate);
        //         }
        //     })
        //     eps.push(curr)
        // })

        years.forEach(() => {
            eps.push([[], []])
        })

        growthRates.forEach((rate) => {
            const data = this.rawdata["SEG"]["CONS"].map(row => [...row]);
            for(let year = 1; year < data[0].length; year++) {
                data[0][year] = data[0][year-1] * (1+rate);
            }
            years.forEach((year, index) => {
                const realYear = year-this.input["GEN"]["Trade Year"];
                const nopat = data[0][realYear] * data[13][realYear] * (1-data[21][realYear]);
                const tnopat = this.getTNOPAT(nopat, realYear);
                const group = this.epsStuff([price], year, tnopat)
                eps[index][0].push(group[0])
                eps[index][1].push(group[1])
            })
        })

        return eps;
    }

    /// INPUT CALCS

    segInputChange = (key) => {
        const input = this.input["SA"][key];
        const rev_cagr = input["NRCAGR"];
        const oi_marg = input["Proj"];
        const data = this.rawdata["SEG"][key];

        for(let year = 0; year < data[0].length; year++) {
            data[0][year] = year===0 ? data[0][year] : data[0][year-1] * (1+rev_cagr);
            if(year<3) {
                data[8][year] = data[0][year] * oi_marg[year];
            } else {
                data[8][year] = data[8][year-1] * (1+oi_marg[3]);
            }
            data[2][year] = data[0][year] * data[3][year];
            data[4][year] = data[0][year] * data[5][year];
            data[6][year] = data[0][year] * data[7][year];
        }

        this.rawdata["SEG"][key] = data;
        this.calcConsolidatedSegment();
    }

    costInputChange = () => {
        this.calcConsolidatedCost();
    }

    revInputChange = () => {
        const input = this.input["REV"];
        const data = this.rawdata["REV"]["CONS"];
        const yr5rev = input["Single Syn"]
        const rphasing = input["Runrate Phasing"]
        const oimargin = input["OI Phasing"]


        data[0][1] = rphasing[0] * yr5rev;
        data[0][2] = rphasing[1] * yr5rev;
        data[0][3] = rphasing[2] * yr5rev;
        data[0][4] = rphasing[3] * yr5rev;
        data[0][5] = yr5rev;
        input["Runrate Phasing"][4] = this.getRevCAGR(0, 5, this.numYears-1, "CONS")

        data[5][1] = oimargin[0] * data[0][1];
        data[5][2] = oimargin[1] * data[0][2];
        data[5][3] = oimargin[2] * data[0][3];
        data[5][4] = oimargin[3] * data[0][4];
        data[5][5] = oimargin[4] * data[0][5];
        const oi_cagr = oimargin[5];
        for(let year = 6; year < this.numYears; year++) {
            data[5][year] = data[5][year-1] * (1+oi_cagr);
        }
    }


    // SAVING ABILITY

    saveDataToFile = () => {
        const data = JSON.stringify(dataManagerInstance); // Convert to JSON string
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json'; // Set file name
        link.click(); // Trigger download
        URL.revokeObjectURL(url); // Clean up URL
      };
  
      handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
      
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if(fileExtension==='json') {
            reader.onload = (e) => {
          const content = e.target.result;
          const newData = JSON.parse(content); // Parse JSON
          dataManagerInstance.updateData(newData); // Update dataManagerInstance with new data
          // Trigger any necessary rerenders here if needed
        };
        reader.readAsText(file); // Read file content as text
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            reader.onload = (e) => {
              const binaryStr = e.target.result;
              this.handleExcelUpload(binaryStr);
            };
            reader.readAsBinaryString(file); // Read file content as binary string for Excel files
          } else {
            console.warn('Unsupported file type. Please upload a JSON or Excel file.');
          }
      };

      updateData = (saveFileData) => {
        Object.keys(saveFileData).forEach(key => {
            if (this.hasOwnProperty(key)) {
                // Deep copy the save file data to avoid references
                this[key] = JSON.parse(JSON.stringify(saveFileData[key]));
              } else {
                console.warn(`Key "${key}" does not exist in DataManager.`);
              }
        })
      };

      handleExcelUpload = (binaryStr) => {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
      
        this.reset();

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
          // Check for specific keywords in the sheet name to categorize data
          if (sheetName.includes('Segment')) {
            this.addSegmentExcel(sheetData);
          } else if (sheetName.includes('Cost')) {
            this.addCostExcel(sheetData)
          } else if (sheetName.includes('Revenue')) {
            this.addRevExcel(sheetData)
          } else if (sheetName.includes('Dis')) {
            this.addDisExcel(sheetData);
        } else if (sheetName.includes('Non-Core')) {
            this.addNcoreExcel(sheetData);
        } else {
            console.warn(`Unrecognized sheet name "${sheetName}".`);
          }
        });
      };

      addSegmentExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numSegments++;
        this.input["SA"][this.numSegments]  = {"NRCAGR": 0, "Proj": [0,0,0,0], "startingyear": startingYear};
        const raw = this.createEmptyArray(constants.seg_labels.length, years.length, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index*2] = rowData;
            }
        });

        this.rawdata["SEG"][this.numSegments] = raw
      }

      addCostExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numCosts++;
        this.input["COST"][this.numCosts] = {"startingyear": startingYear}
        const raw = this.createEmptyArray(constants.cost_labels.length, years.length, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index] = rowData;
            }
        });

        this.rawdata["COST"][this.numCosts] = raw;
      }

      addRevExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numRevs++;
        this.input["REV"][this.numRevs] = {"startingyear": startingYear}
        const raw = this.createEmptyArray(constants.rev_labels.length, this.numYears, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                if(row[0]==="Segment Mapping") {
                    let segs = [];
                    const segments = row.slice(1)
                    segments.forEach((val) => {
                        segs.push(val);
                    })
                    this.mapRev(segs, this.numRevs);
                }
                else {
                    const rowData = row.slice(1);
                    raw[index*2] = rowData;
                }
            }
        });

        this.rawdata["REV"][this.numRevs] = raw;
      };

      addDisExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numDis++;
        this.input["DIS"][this.numDis] = {"startingyear": startingYear}
        const raw = this.createEmptyArray(constants.dis_labels.length, this.numYears, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index] = rowData;
            }
        });

        this.rawdata["DIS"][this.numDis] = raw;
      }

      addNcoreExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numCore++;
        this.input["NCORE"][this.numCore] = {"startingyear": startingYear}
        const raw = this.createEmptyArray(constants.ncore_labels.length, this.numYears, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index*2] = rowData;
            }
        });

        this.rawdata["NCORE"][this.numCore] = raw;
      };
}

const dataManagerInstance = new DataManager();
export default dataManagerInstance;