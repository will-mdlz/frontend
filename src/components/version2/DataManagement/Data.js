import * as XLSX from 'xlsx';
import * as constants from "../constants";

class DataManager {
    constructor() {
        this.input = {};
        this.debt = {};
        this.rawdata = {};

        this.freshstart = false;

        this.numSegments = 0;
        this.numCosts = 0;
        this.numRevs = 0;
        this.numDis = 0;
        this.numCore = 0;
        this.numYears = 11;

        this.initializeData();
        this.initializeSheetData();
        this.initializeDebt();
    }

    initializeData = () => {
        this.input["SA"] = this.initInputSeg();
        this.input["COST"] = this.initInputCost();
        this.input["REV"] = this.initInputRev();
        this.input["DIS"] = this.initInputDis();
        this.input["NCORE"] = this.initInputNcore();
        this.input["GEN"] = this.initGen();
        this.input["AVP"] = this.initAVP();
        this.input["Assumptions"] = this.initAssupmtions();
    };

    initializeSheetData = () => {
        this.rawdata["Standalone Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        this.rawdata["Synergized Forecast"] = this.createEmptyArray(constants.row_labels.length, this.numYears);
        this.rawdata["SEG"] = this.initRawSeg();
        this.rawdata["REV"] = this.initRawRev();
        this.rawdata["COST"] = this.initRawCost();
        this.rawdata["DIS"] = this.initRawDis();
        this.rawdata["NCORE"] = this.initRawNcore();
        this.rawdata["MAP"] = {"REV": {}}
        this.rawdata["MDLZ"] = this.initMDLZ();
        this.rawdata["TARGET"] = this.initTarget();
        this.rawdata["SYN"] = this.initSyn();
    }

    initAVP = () => {
        return {
            "Premium to Current Price": [],
            "% Premium to 52-Week High": [],
            "Equity Value": [],
            "Enterprise Value": [],
            "EV / Year 0 EBITDA": [],
            "EV / Year 1 EBITDA": [],
            "% Cash": [],
            "% Equity": [],
            "% of MDLZ Shares Issued": [],
            "% of MDLZ Ownership": [],
            "% Target Ownership": [],
            "Implied Trust Ownership": [],
            "Target Shares of Synergies": [],
            "MDLZ Shares of Synergies": [],
            "Cost & Revenue Synergies": [],
            "Cost Only Synergies": [],
            "Year 1 ACC": [],
            "Year 1 DIL": [],
            "Year 2 ACC": [],
            "Year 2 DIL": [],
            "Year 3 ACC": [],
            "Year 3 DIL": []
        }
    }

    initRawSeg = () => {
        const storedSeg = localStorage.getItem('rawseg');
        if(!storedSeg || this.freshstart) {
            return {"CONS": this.createEmptyArray(constants.seg_cons_labels.length, this.numYears), "Syn": {"Syn": Array(this.numYears).fill(0), "startingyear": 0}};
        } else {
            const parsedSeg = JSON.parse(storedSeg);
            parsedSeg["CONS"] = this.createEmptyArray(constants.seg_cons_labels.length, this.numYears);
            return parsedSeg;
        }
    }

    initInputSeg = () => {
        const storedSeg = localStorage.getItem('inputseg');
        if(!storedSeg || this.freshstart) {
            return {};
        } else {
            const parsedSeg = JSON.parse(storedSeg);
            return parsedSeg;
        }
    }

    initRawCost = () => {
        const stored = localStorage.getItem('rawcost');

        if(!stored || this.freshstart) {
            return {"CONS": this.createEmptyArray(constants.cost_cons_labels.length, this.numYears)};
        } else {
            const parsed = JSON.parse(stored);
            parsed["CONS"] = this.createEmptyArray(constants.cost_cons_labels.length, this.numYears);
            return parsed;
        }
    }

    initInputCost = () => {
        const stored = localStorage.getItem('inputcost');
        if(!stored || this.freshstart) {
            return {"Runrate": 56.44, "Phasing": [.333,.666, 1]};
        } else {
            const parsed = JSON.parse(stored);
            parsed["Runrate"] = 56.44;
            parsed["Phasing"] = [.333,.666, 1];
            return parsed;
        }
    }

    initRawRev = () => {
        const stored = localStorage.getItem('rawrev');

        if(!stored || this.freshstart) {
            return {"CONS": this.createEmptyArray(constants.rev_cons_labels.length, this.numYears), 
                "Syn": Array(this.numYears).fill(0)};
        } else {
            const parsed = JSON.parse(stored);
            parsed["CONS"] = this.createEmptyArray(constants.rev_cons_labels.length, this.numYears);
            return parsed;
        }
    }

    initInputRev = () => {
        const storedRev = localStorage.getItem('inputrev');

        if(!storedRev || this.freshstart) {
            return {"Single Syn": 0, "OI Margin Impact": 0, "Runrate Phasing": [0,.25,.50,.75,0], "OI Phasing": [0,0,0,0,0,0]};
        } else {
            const parsedRev = JSON.parse(storedRev);
            parsedRev["Single Syn"] = 0;
            parsedRev["OI Margin Impact"] = 0
            parsedRev["Runrate Phasing"] = [0,.25,.50,.75,0]
            parsedRev["OI Phasing"] = [0,0,0,0,0,0];
            return parsedRev;
        }
    }

    initRawDis = () => {
        const stored = localStorage.getItem('rawdis');

        if(!stored || this.freshstart) {
            return {"CONS": this.createEmptyArray(constants.dis_cons_labels.length, this.numYears)};
        } else {
            const parsed = JSON.parse(stored);
            parsed["CONS"] = this.createEmptyArray(constants.dis_cons_labels.length, this.numYears);
            return parsed;
        }
    }

    initInputDis = () => {
        const stored = localStorage.getItem('inputdis');
        if(!stored || this.freshstart) {
            return {};
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initRawNcore = () => {
        const stored = localStorage.getItem('rawncore');

        if(!stored || this.freshstart) {
            return {"CONS": this.createEmptyArray(constants.ncore_cons_labels.length, this.numYears)};
        } else {
            const parsed = JSON.parse(stored);
            parsed["CONS"] = this.createEmptyArray(constants.ncore_cons_labels.length, this.numYears);
            return parsed;
        }
    }
    
    initInputNcore = () => {
        const stored = localStorage.getItem('inputncore');
        if(!stored || this.freshstart) {
            return {};
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initMDLZ = () => {
        const stored = localStorage.getItem('mdlz');
        if(!stored || this.freshstart) {
            return this.createEmptyArray(constants.mdlz_labels.length, this.numYears);
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initTarget = () => {
        const stored = localStorage.getItem('target');
        if(!stored || this.freshstart) {
            return this.createEmptyArray(constants.target_labels.length, this.numYears);
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initAssupmtions = () => {
        const stored = localStorage.getItem('assumptions');
        if(!stored || this.freshstart) {
            return [];
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initSyn = () => {
        const stored = localStorage.getItem('syn');
        if(!stored || this.freshstart) {
            return {"Syn": [], "startingyear": 0}
        } else {
            const parsed = JSON.parse(stored);
            return parsed;
        }
    }

    initializeDebt = () => {
        let temp = {}
        for(let i = 0; i < 6; i++) {
            temp[i] = {"Rate": 0, "Amount": 0}
        }

        temp = {
            0: {"Rate": .023, "Amount": 500},
            1: {"Rate": .072, "Amount": 194},
            2: {"Rate": .0425, "Amount": 350},
            3: {"Rate": .0245, "Amount": 300},
            4: {"Rate": .017, "Amount": 350},
            5: {"Rate": .0344, "Amount": 1450},
        }

        this.debt = temp;
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

    }

    removeNcore = (key) => {
        delete this.input["NCORE"][key];
        delete this.rawdata["NCORE"][key];
        this.calcConsolidatedNcore();
    };

    initGen = () => {
        const storedGen = localStorage.getItem('gen');
        if(!storedGen) {
            return {
                "Standalone Tax Rate": .24, "MDLZ Tax Rate": .24, "WACC": .08, "PGR": .03, "Annual Intangible Ammortization (years)": 0, "Annual Intangible Ammortization (% of PP)": 0,
                "Current Target Annual Intangible Ammortization": 0, "Annual PP&E Stepup": 0, "Debt Issurance Fees": 0, "Transaction Fees %": 0,
                "Control Fees": 0, "CAPEX % of NR": 0, "Minimum Cash Balance": 0, "Trade Year": 0, "Dividend YoY % (first 3 years)": 0,
                "Dividend YoY %": 0, "Interest Tax Rate": 0, "% Interest Deductible": 0, "Interest Income Rate": 0, "Max leverage": 0,
                "Synergy Credit for Leverage": 0, "Dividends / Share": 0, "% ∆ in NWC as % ∆ in Revenue": 0, "OTC": 0, "Year 1 OTC": 0,
                "Year 2 OTC": 0, "KKR": 0, "Non-Core Divestiture": 0, "Target Share Price": 0, "52-Week High": 0, "SO": 0, "FDSO at Offer": 0,
                "Target Net Debt": 0, "Trust % Ownership": 0, "BV Equity": 0, "Target Current Cash": 0, "Target Short Term Debt": 0, "MDLZ Share Price": 0,
                "MDLZ 2025 FDSO": 0, "Current FDSO": 0, "2025 MDLZ Debt": 0, "Total FDSO": 0, "% Cash": 0, "% Equity": 0, "Beginning Cash": 0, "Ending Cash": 0
            }
        } else {
            const parsedGen = JSON.parse(storedGen);
            return parsedGen;
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

    calcAVP = (prices, numyears) => {
        this.input["GEN"]["Acquisition Debt"] = this.calcAcquDebt();
        this.input["AVP"]["Premium to Current Price"] = this.calcPremium(prices);
        this.input["AVP"]["% Premium to 52-Week High"] = this.calcHigh(prices);
        this.input["AVP"]["Equity Value"] = this.calcEquity(prices);
        this.input["AVP"]["Enterprise Value"] = this.calcEnterpriseValue(prices);
        this.input["AVP"]["EV / Year 0 EBITDA"] = this.calcEVEBITDA(2025, prices);
        this.input["AVP"]["EV / Year 1 EBITDA"] = this.calcEVEBITDA(2026, prices);
        this.calcCashEquity(prices);
        this.calcSharesIssue(prices,2030, 2028, 15);

        this.storeIRRs(prices);

        const eps_new = this.getEps(prices,2026,numyears)

        // this.input["AVP"]["Year 1 ACC"] = eps_new[0][0]
        // this.input["AVP"]["Year 1 DIL"] = eps_new[0][1]
        // this.input["AVP"]["Year 2 ACC"] = eps_new[1][0]
        // this.input["AVP"]["Year 2 DIL"] = eps_new[1][1]
        // this.input["AVP"]["Year 3 ACC"] = eps_new[2][0]
        // this.input["AVP"]["Year 3 DIL"] = eps_new[2][1]

        for(let i = 1; i < numyears+1; i++) {
            this.input["AVP"][`Year ${i} ACC`] = eps_new[i-1][0]
            this.input["AVP"][`Year ${i} DIL`] = eps_new[i-1][1]
        }

    }

    calcAcquDebt = () => {
        const mdlz_ebitda = 6998
        const target_ebitda = this.rawdata["Standalone Forecast"][10][0]
        const cost_syn = this.rawdata["COST"]["CONS"][4][3];
        const syn_mult = this.input["GEN"]["Synergy Credit for Leverage"] * cost_syn;
        const non_core = this.rawdata["NCORE"]["CONS"][9][0];
        const ebitda = mdlz_ebitda+target_ebitda+syn_mult
        const sub_core = ebitda-non_core
        const tnd = this.input["GEN"]["2025 MDLZ Debt"] - this.rawdata["MDLZ"][18][6] + this.input["GEN"]["Target Net Debt"]
        const bull_cash = this.rawdata["MDLZ"][18][6] + this.input["GEN"]["Target Current Cash"] - this.input["GEN"]["Minimum Cash Balance"]
        const bull_tnd = tnd + bull_cash
        const lvg = bull_tnd/sub_core
        const inc_lev = this.input["GEN"]["Max leverage"] - lvg;
        return inc_lev * sub_core
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
            if(year===this.input["GEN"]["Trade Year"]) {
                l.push(this.rawdata["Standalone Forecast"][10][year-this.input["GEN"]["Trade Year"]])
            } else {
                l.push(this.rawdata["Synergized Forecast"][10][year-this.input["GEN"]["Trade Year"]])
            }
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
            const purchase_equity_value = (prices[i]*this.input["GEN"]["FDSO at Offer"]); // @240 off by 10
            const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"]; // @240 off by 10
            const trans_fees = implied_ev * this.input["GEN"]["Transaction Fees %"]; // no change
            const uses = purchase_equity_value + this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"] + this.input["GEN"]["Acquisition Debt"]*this.input["GEN"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"]; //@240 off by 10
            const bull_cash = this.rawdata["MDLZ"][18][6] + this.input["GEN"]["Target Current Cash"] - this.input["GEN"]["Minimum Cash Balance"] //no change
            const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - (this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"]) - this.input["GEN"]["Non-Core Divestiture"] - bull_cash - this.input["GEN"]["Minimum Cash Balance"] // @240 off by 10
            
            const val1 = this.input["GEN"]["Acquisition Debt"] + this.input["GEN"]["Non-Core Divestiture"] + bull_cash + this.input["GEN"]["Minimum Cash Balance"];
            const val2 = this.input["GEN"]["Acquisition Debt"] * this.input["GEN"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
            const cash_issued = val1 - val2;

            const total = equity_issued + cash_issued;
            
//             1 42740.0406417
//             2 47415.390641699996
// Data.js:524 3 189.6615625668
// Data.js:525 4 50739.0643919525
// Data.js:526 5 329.9707131267869

            //fucking end me if I have to redo this again

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
            const uses = purchase_equity_value + this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"] + this.input["GEN"]["Acquisition Debt"]*this.input["GEN"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
            const bull_cash = this.rawdata["MDLZ"][18][6] + this.input["GEN"]["Target Current Cash"] - this.input["GEN"]["Minimum Cash Balance"]
            const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - (this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"]) - this.input["GEN"]["Non-Core Divestiture"] - bull_cash - this.input["GEN"]["Minimum Cash Balance"]            

            const shares_issued = equity_issued/this.input["GEN"]["MDLZ Share Price"];

            l.push(shares_issued/this.input["GEN"]["Current FDSO"])

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
        const revval = this.rawdata["REV"]["CONS"][8][revyear-this.input["GEN"]["Trade Year"]];
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


        const otc1 = (this.input["GEN"]["Year 1 OTC"]) * Math.pow(1/(1+this.input["GEN"]["WACC"]),.5);
        const otc2 = (this.input["GEN"]["Year 2 OTC"]) * Math.pow(1/(1+this.input["GEN"]["WACC"]),1.5);
        const otc = otc1 + otc2;

        const nwc1 = this.rawdata["SYN"]['Syn'][1]* Math.pow(1/(1+this.input["GEN"]["WACC"]),.5)
        const nwc2 = this.rawdata["SYN"]['Syn'][2]* Math.pow(1/(1+this.input["GEN"]["WACC"]),1.5)
        const nwc3 = this.rawdata["SYN"]['Syn'][3]* Math.pow(1/(1+this.input["GEN"]["WACC"]),2.5)

        const tnwc = nwc1+nwc2+nwc3

        return revsyn + costsyn - otc -tnwc;
    }

    // ### GET ARRAYS FOR SHEETS 

    getCombinedStandalone = () => {
        let initialData = [...this.rawdata["Standalone Forecast"]];
        const keys = Object.keys(this.rawdata.SEG).filter((key) => key !== "Syn");
        for(let i = keys.length-2; i >= 0; i--) {
            const currRow = this.rawdata["SEG"][keys[i]][0];
            const segStartYear = dataManagerInstance.input["SA"][keys[i]]["startingyear"];
            const tradeYear = this.input["GEN"]["Trade Year"]
            initialData.unshift(currRow.slice(tradeYear-segStartYear));
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

    calcSegmentCOGS = (key) => {
        const data = this.rawdata["SEG"][key];
        const yeardiff = this.input["GEN"]["Trade Year"] - this.input["SA"][key]["startingyear"]
        if(data) {
            for(let year = 0; year < data[0].length; year++) {
                data[0][year] = year===0 ? data[0][year] : data[0][year-1] * (1+(data[14][year] + data[15][year]+data[16][year]));
                data[1][year] = year===0 ? 0 : (data[0][year] / data[0][year-1]) - 1
                if(key==="2") {
                    if(year<yeardiff-1){
                        data[19][year] = year===0 ? data[19][year] : data[19][year-1]*(1+data[22][year]+data[14][year]) //other
                    } else if(year===yeardiff-1) {
                        data[19][year] = data[19][year-1] * (1 - 0.00569)
                    } else {
                        data[19][year] = year===0 ? data[19][year] : data[19][year-1]*(1+data[22][year]) //other
                    }
                } else {
                    const rate = year === data[0].length-1 ? 1+data[22][year] : 1+data[22][year]
                    data[19][year] = year===0 ? data[19][year] : data[19][year-1]*(rate) //other
                }

                data[18][year] = year===0 ? data[18][year] : data[18][year-1]/data[20][year-1]*data[20][year]*(1+data[14][year]) //coca
                //data[19][year] = year===0 ? data[19][year] : data[19][year-1]*(1+data[22][year]) //other
                data[17][year] = data[18][year] + data[19][year]
                data[21][year] = year===0 ? 0 : data[20][year]/data[20][year-1] -1

                data[2][year] = data[0][year] - data[17][year];
                // data[4][year] = data[5][year] * data[0][year];
                // data[6][year] = data[7][year] * data[0][year];
                data[8][year] = data[2][year] - data[4][year] - data[6][year];
                //data[10][year] = data[11][year] * data[0][year];
                data[12][year] = data[8][year] + parseFloat(data[10][year]);
                // [3,9,13].forEach((num) => {
                //     data[num][year] = data[0][year] === 0 ? 0 : data[num-1][year]/data[0][year];
                // });
                [3,5,7,9,11,13].forEach((num) => {
                    data[num][year] = data[0][year] === 0 ? 0 : data[num-1][year]/data[0][year];
                });
            }
            //this.updateSAInput(key);
        }
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
            if(segKey!=="CONS"&&segKey!=="Syn") {
                this.calcSegmentCOGS(segKey);
            }
        })
        
        this.calcConsolidatedSegment();
    }

    calcConsolidatedSegment = () => {
        const data = this.createEmptyArray(constants.seg_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.SEG);
        const tradeYear = this.input["GEN"]["Trade Year"]
        keys.forEach((segKey) => {
            if(segKey!=="CONS"&&segKey!=="Syn") {
                const seg = dataManagerInstance.rawdata["SEG"][segKey];
                const segStartYear = dataManagerInstance.input["SA"][segKey]["startingyear"];
                const yearDif = tradeYear-segStartYear;
                if(yearDif>=0) {
                    for(let year = 0; year < data[0].length; year++) {
                        [0,2,4,6,8].forEach((num) => {
                            data[num][year] += parseFloat(seg[num][year+yearDif] || 0);
                        });
                        data[14][year] += seg[10][year+yearDif] || 0;
                        [29,30].forEach((num) => {
                            data[num][year] += year===0 ? 0 : parseFloat(seg[num-15][year]*seg[0][year-1])
                        });
                        data[32][year] += seg[17][year+yearDif]
                        data[33][year] += seg[18][year+yearDif]
                        data[34][year] += seg[19][year+yearDif]
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
        const corp_exp = this.input["Assumptions"].length > 0 ? this.input["Assumptions"][1] : []
        const corp_dep = this.input["Assumptions"].length > 0 ? this.input["Assumptions"][0] : []
        for(let year = 0; year < data[0].length; year++) {
            data[1][year] = year===0 ? 0 : (data[0][year]/data[0][year-1]) - 1;
            data[10][year] = corp_exp.length > 0 ? corp_exp[year+5] * data[0][year] : 0;
            data[11][year] = corp_exp.length > 0 ? corp_exp[year+5] : 0; // corp exp
            data[16][year] = corp_dep.length > 0 ? corp_dep[year+5] * data[0][year] : 0;
            data[17][year] = corp_dep.length > 0 ? corp_dep[year+5] : 0; // corp dep
            data[12][year] = data[8][year] - data[10][year];
            data[21][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[20][year] = data[21][year] * data[12][year];
            data[22][year] = data[12][year] - data[20][year]; //nopat oi - income_taxes
            data[23][year] = data[14][year] + data[16][year];

            data[18][year] = data[12][year] + data[14][year] + data[16][year];
            data[25][year] = this.input["GEN"]["CAPEX % of NR"];
            data[24][year] = data[25][year] * data[0][year];
            //data[27][year] = this.input["GEN"]["% ∆ in NWC as % ∆ in Revenue"]*-1;
            data[26][year] = this.rawdata["SEG"]["Syn"]["Syn"][year]
            data[27][year] = year===0 ? 0 : data[0][year]-data[0][year-1]===0 ? 0 : data[26][year] / (data[0][year]-data[0][year-1])
            //data[26][year] = year===0 ? 0 : (data[0][year]-data[0][year-1])*data[27][year];

            data[28][year] = data[22][year] + data[23][year] - data[24][year] - data[26][year] + (this.rawdata["TARGET"][4][year+5] || 0);
            [3,5,7,9,11,13,15,17,19,25].forEach((num) => {
                data[num][year] = data[num-1][year] / data[0][year];
            });
            [29,30].forEach((num) => {
                data[num][year] = year===0 ? 0 : data[num][year] / data[0][year-1]
            });
            data[31][year] = data[1][year] - data[29][year]-data[30][year];

        }
        ///need to adjust for years
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

    calcConsolidatedRev = () => {
        const data = this.createEmptyArray(constants.rev_cons_labels.length, this.numYears);
        const keys = Object.keys(dataManagerInstance.rawdata.REV);
        keys.forEach((segKey) => {
            if(segKey!=="CONS"&&segKey!=="Syn") {
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
            data[6][year] = this.rawdata["REV"]["Syn"][year]
            data[7][year] = data[0][year]===0 ? 0 : data[6][year] / data[0][year];
            data[8][year] = data[6][year] + data[5][year];
            data[9][year] = data[0][year]===0 ? 0 : data[8][year]/data[0][year];
            data[11][year] = this.input["GEN"]["Standalone Tax Rate"];
            data[10][year] = data[11][year] * data[5][year];
            data[12][year] = data[5][year] - data[10][year]; 
            data[13][year] = data[6][year];
            data[15][year] = this.input["GEN"]["CAPEX % of NR"];
            data[14][year] = data[15][year] * data[0][year];
            data[17][year] = this.input["GEN"]["% ∆ in NWC as % ∆ in Revenue"]*-1;
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
            data[18][year] = this.input["GEN"]["% ∆ in NWC as % ∆ in Revenue"]*-1;
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
                syn[8][year] = seg[12][year] + cost[4][year] + rev[5][year] + dis[4][year] - ncore[5][year]; // EBIT
                //syn[8][year] = syn[2][year] - syn[4][year] - syn[6][year];
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
                    amount += seg[28][year] + cost[8][year] + rev[18][year] + dis[8][year] - ncore[19][year] - this.rawdata["SYN"]["Syn"][year]
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
            const fees = this.input["GEN"]["Acquisition Debt"] * this.input["GEN"]["Debt Issurance Fees"] + implied_ev * this.input["GEN"]["Transaction Fees %"] + this.input["GEN"]["Control Fees"];
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
        const mdlz_tax = this.input["GEN"]["MDLZ Tax Rate"];
        return (this.rawdata["SEG"]["CONS"][12][year] + this.rawdata["COST"]["CONS"][4][year] +
            this.rawdata["REV"]["CONS"][5][year] + this.rawdata["DIS"]["CONS"][4][year] - this.rawdata["NCORE"]["CONS"][5][year])*(1-mdlz_tax)
    };

    c1 = (price) => {
        const purchase_equity_value = (price*this.input["GEN"]["FDSO at Offer"]);
        const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
        const trans_fees = implied_ev * this.input["GEN"]["Transaction Fees %"];
        const uses = purchase_equity_value + this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"] + this.input["GEN"]["Acquisition Debt"]*this.input["GEN"]["Debt Issurance Fees"] + trans_fees + this.input["GEN"]["Control Fees"] + this.input["GEN"]["KKR"];
        const bull_cash = this.rawdata["MDLZ"][18][6] + this.input["GEN"]["Target Current Cash"] - this.input["GEN"]["Minimum Cash Balance"]
        const equity_issued = uses - this.input["GEN"]["Acquisition Debt"] - (this.input["GEN"]["Target Net Debt"] + this.input["GEN"]["Target Current Cash"]) - this.input["GEN"]["Non-Core Divestiture"] - bull_cash - this.input["GEN"]["Minimum Cash Balance"]      
        const shares_issued = equity_issued/this.input["GEN"]["MDLZ Share Price"];
        let pf_shares = shares_issued + this.input["GEN"]["MDLZ 2025 FDSO"]
        return pf_shares
    }

    c2 = (price, year, tnopat=null) => {
        
        const mdlz_tax = this.input["GEN"]["MDLZ Tax Rate"];

        const mdlz_ni = this.rawdata["MDLZ"][1][year+6];
        const target_nopat = tnopat ? tnopat[year] : this.getTargetNOPAT(year+1)

        const tpensions = this.rawdata["TARGET"][0][year+6];
        const target_pensions_shield = mdlz_tax * tpensions * -1;
        const target_pension_impact = tpensions + target_pensions_shield; //good

        const tos = this.rawdata["TARGET"][1][year+6]
        const target_other_shield = mdlz_tax * tos * -1;
        const target_other_impact = tos + target_other_shield; //good

        //need input here?

        const purchase_equity_value = (price*this.input["GEN"]["FDSO at Offer"]);
        const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
        const amort_years = this.input['GEN']["Annual Intangible Ammortization (years)"]
        const amort_perc = this.input['GEN']["Annual Intangible Ammortization (% of PP)"]
        const target_intangible = this.input['GEN']["Current Target Annual Intangible Ammortization"]
        const ann_int_ammort = ((implied_ev*amort_perc)/amort_years) - target_intangible;

        //const new_definite = -1 * this.input["GEN"]["Annual Intangible Ammortization"]; 
        const new_definite = -1 * ann_int_ammort; 
        const new_def_shield = mdlz_tax * new_definite * -1;
        const new_def_impact = new_definite + new_def_shield; 

        //need input here?
        const ppe = 1 * this.input["GEN"]["Annual PP&E Stepup"]; 
        const ppe_shield = mdlz_tax * ppe * -1;
        const ppe_impact = ppe + ppe_shield;

        const cash_interest = ((this.input["GEN"]["Beginning Cash"] + this.input["GEN"]["Ending Cash"])/2 - this.rawdata["MDLZ"][18][year+6]) * this.input["GEN"]["Interest Income Rate"];

        const cash_shield = -1 * cash_interest * mdlz_tax;
        const cash_total = cash_interest+cash_shield;   

        return mdlz_ni+target_nopat+target_pension_impact+target_other_impact+new_def_impact-ppe_impact+cash_total;
    }

    c3 = (price, year) => {
        const mdlz_tax = this.input["GEN"]["MDLZ Tax Rate"];

        const data = this.rawdata["MDLZ"];
        const tdata = this.rawdata["SEG"]["CONS"];
        const ncdata = this.rawdata["NCORE"]["CONS"];
        const rdata = this.rawdata["REV"]["CONS"];
        
        const mdlz_da = data[4][year+6]
        const target_da = tdata[14][year+1] + tdata[16][year+1];
        const nc_da = ncdata[7][year+1]*-1;
        const rev_da = rdata[6][year+1];

        //need input here?

        const purchase_equity_value = (price*this.input["GEN"]["FDSO at Offer"]);
        const implied_ev = purchase_equity_value + this.input["GEN"]["Target Net Debt"];
        const amort_years = this.input['GEN']["Annual Intangible Ammortization (years)"]
        const amort_perc = this.input['GEN']["Annual Intangible Ammortization (% of PP)"]
        const target_intangible = this.input['GEN']["Current Target Annual Intangible Ammortization"]
        const ann_int_ammort = ((implied_ev*amort_perc)/amort_years) - target_intangible;

        //const new_definite = -1 * this.input['GEN']["Annual Intangible Ammortization"]; ///////////////////////////////
        const new_definite = -1 * ann_int_ammort; ///////////////////////////////
        const new_def_shield = mdlz_tax * new_definite * -1;
        const new_def_impact = new_definite + new_def_shield;

        //need input here?
        const ppe = -1 * this.input["GEN"]["Annual PP&E Stepup"]; ///////////////////////////////
        const ppe_shield = mdlz_tax * ppe * -1;
        const ppe_impact = ppe + ppe_shield;

        const amort = -1*(new_def_impact + ppe_impact)

        const mdlz_nwc = data[6][year+6]
        const target_nwc = tdata[26][year+1]*-1;
        const nc_nwc = ncdata[17][year+1]*-1;
        const rev_nwc = rdata[16][year+1]*-1;
        const nwc_synergies = year===0 ? 287 : year===1 ? 298 : year===2 ? 310 : 0;/////////////////////

        //nwc synergies

        const mdlz_capex = data[7][year+6]
        const target_capex = tdata[24][year+1]*-1;
        const nc_capex = ncdata[15][year+1];
        const rev_capex = rdata[14][year+1]*-1;
        let otc = year===0||year===1 ? this.input["GEN"]["OTC"]/2*-1 : 0;

        //need ni to ebit bridge
        const ni_bridge = data[9][year+6]
        //need interest
        const interest = data[10][year+6]
        //need pension income
        const pension = data[11][year+6]
        //need cash taxes
        const taxes = data[12][year+6]
        const oll = data[13][year+6]; //
        //need jvs - which one
        const jvs = data[14][year+6]
        //need other - whcih one
        const other = data[15][year+6]
        const restruct = data[16][year+6];//
        const sbc = this.rawdata["TARGET"][2][year+6] || 0
        const target_pension = this.rawdata["TARGET"][3][year+6] || 0
        const aaa = this.rawdata["TARGET"][4][year+6] || 0

        return mdlz_da+target_da+nc_da+rev_da+mdlz_capex+target_capex+nc_capex+rev_capex+mdlz_nwc+target_nwc
        +nc_nwc+rev_nwc+nwc_synergies+otc+ni_bridge+interest+pension+taxes+oll+jvs+other+restruct+sbc+target_pension+aaa+amort;
    }

    c4 = (price, year) => {
        const be = this.input["GEN"]["Beginning Cash"]
        const min = this.input["GEN"]["Minimum Cash Balance"];
        const financing = this.rawdata["MDLZ"][17][year+6]
        let dps = this.input["GEN"]["Dividends / Share"]
        for(let y = 0; y <= year; y++) {
            const yoy = y < 3 ? (1+this.input["GEN"]["Dividend YoY % (first 3 years)"]) : (1+this.input["GEN"]["Dividend YoY %"])
            dps *= (yoy)
        }
        const total_div = this.c1(price) * dps

        // if(price===240&&year===4) {
        //     console.log(total_div)
        // }

        return be-min+financing-total_div;
    }

    paydown = (price, year) => {
        let max_rate = 0;
        let max_rate_year=-1;

        Object.keys(this.debt).forEach((y) => {
            if(this.debt[y]["Rate"]>max_rate) {
                max_rate = this.debt[y]["Rate"];
                max_rate_year = y;
            }
        })
        let interest = 0;
        Object.keys(this.debt).forEach((y) => {
            if(year>=y) {
                interest+=this.debt[y]["Amount"] * this.input["GEN"]['Interest Rate']
            } else {
                interest+=this.debt[y]["Amount"] * this.debt[y]["Rate"]
            }
        })
        if(year >= parseInt(max_rate_year)) {
            interest-=this.debt[max_rate_year]["Amount"] * this.input["GEN"]['Interest Rate']
        }
        if(year===parseInt(max_rate_year)) {
            interest+=this.debt[max_rate_year]["Amount"]/2*this.input["GEN"]['Interest Rate']
        }

        interest+=this.input["GEN"]['Target Short Term Debt'] * this.input["GEN"]['Interest Rate']
        
        return [interest,year===parseInt(max_rate_year)?this.debt[max_rate_year]["Amount"]:0]
    }

    getEps = (prices, year, numyears, tnopat=null) => {    
        let l = [];
        const currYear = year-this.input["GEN"]["Trade Year"]-1;

        for(let i = 0; i < numyears; i ++) {
            l.push([[],[]])
        }

        const ie_rate = this.input["GEN"]["Interest Tax Rate"]
        for(let i = 0; i < prices.length; i++) {    
            let debt = this.input["GEN"]["Acquisition Debt"];
            for(let temp = currYear; temp < numyears; temp++) {
                const currEps = this.rawdata["MDLZ"][0][temp+6]
                const c1 = this.c1(prices[i]);
                const c2 = this.c2(prices[i], temp, tnopat);
                const c3 = this.c3(prices[i], temp)
                const c4 = this.c4(prices[i], temp)
                const paydown = this.paydown(prices[i], temp)

                const c5 = -1*this.input["GEN"]["Interest Rate"]*(debt*2 - c3 - c4 - paydown[1])/2;
                const pd = -1*paydown[0];
                const pds = ie_rate * pd * -1;
                const ie_impact = pd + pds;
                const c6 = ie_impact + c2;
                const c5s = ie_rate * c5 * -1;
                const c5_impact = c5 + c5s
                const crazy_rate = (1 - this.input["GEN"]["Interest Rate"]/2 * (1 - ie_rate))
                const pfni = (c5_impact+c6)/(crazy_rate)
                const pfeps = pfni/c1;
                const diff = pfeps - currEps
                const percent = diff/currEps
                debt = debt - (pfni+c3+c4)
                // l1.push(diff)
                // l2.push(percent)
                l[temp][0].push(diff)
                l[temp][1].push(percent)
            }
            // l.push([l1, l2])
        }
        return l;
    }

////////////    // Sensitivity

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
            let tnopat_years = []
            years.forEach((year) => {
                const realYear = year-this.input["GEN"]["Trade Year"];
                const nopat = data[0][realYear] * data[13][realYear] * (1-data[21][realYear]);
                const tnopat = this.getTNOPAT(nopat, realYear);
                tnopat_years.push(tnopat)
            })
            const group = this.getEps([price], 2026, years.length, tnopat_years)
            years.forEach((year, index) => {
                eps[index][0].push(group[index][0])
                eps[index][1].push(group[index][1])
            })
        })

        return eps;
    }

    /// INPUT CALCS

    // segInputChange = (key) => {
    //     const input = this.input["SA"][key];
    //     const rev_cagr = input["NRCAGR"];
    //     const oi_marg = input["Proj"];
    //     const data = this.rawdata["SEG"][key];

    //     for(let year = 0; year < data[0].length; year++) {
    //         data[0][year] = year===0 ? data[0][year] : data[0][year-1] * (1+rev_cagr);
    //         if(year<3) {
    //             data[8][year] = data[0][year] * oi_marg[year];
    //         } else {
    //             data[8][year] = data[8][year-1] * (1+oi_marg[3]);
    //         }
    //         data[2][year] = data[0][year] * data[3][year];
    //         data[4][year] = data[0][year] * data[5][year];
    //         data[6][year] = data[0][year] * data[7][year];
    //     }

    //     this.rawdata["SEG"][key] = data;
    //     this.calcConsolidatedSegment();
    // }

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
        localStorage.clear()
        this.reset();

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
            // Check for specific keywords in the sheet name to categorize data
            if (sheetName.includes('#Control')) {
                this.addControlExcel(sheetData);
            } else if (sheetName.includes('#MDLZ')) {
                this.addMDLZExcel(sheetData)
            } else if (sheetName.includes('#Target')) {
                this.addTargetExcel(sheetData)
            } else if (sheetName.includes('#Consol')) {
                this.addAssumptionsExcel(sheetData)
            } else if (sheetName.includes('#Seg')) {
                this.addSegmentExcel(sheetData)
            } else if (sheetName.includes('#Cost')) {
                this.addCostExcel(sheetData)
            } else if (sheetName.includes('#Rev')) {
                this.addRevExcel(sheetData)
            } else if (sheetName.includes('#Dis')) {
                this.addDisExcel(sheetData)
            } else if (sheetName.includes('#Ncore')) {
                this.addNcoreExcel(sheetData)
            } else if (sheetName.includes('#NWC')) {
                this.addSynExcel(sheetData);
            } else {
                console.warn(`Unrecognized sheet name "${sheetName}".`);
            }
        });

        localStorage.setItem('rawseg', JSON.stringify(this.rawdata["SEG"]));
        localStorage.setItem('inputseg', JSON.stringify(this.input["SA"]));
        localStorage.setItem('rawcost', JSON.stringify(this.rawdata["COST"]));
        localStorage.setItem('inputcost', JSON.stringify(this.input["COST"]));
        localStorage.setItem('rawrev', JSON.stringify(this.rawdata["REV"]))
        localStorage.setItem('inputrev', JSON.stringify(this.input["REV"]));
        localStorage.setItem('rawdis', JSON.stringify(this.rawdata["DIS"]));
        localStorage.setItem('inputdis', JSON.stringify(this.input["DIS"]));
        localStorage.setItem('rawncore', JSON.stringify(this.rawdata["NCORE"]));
        localStorage.setItem('inputncore', JSON.stringify(this.input["NCORE"]));
        localStorage.setItem('syn', JSON.stringify(this.rawdata["SYN"]))
      };

      addControlExcel = (data) => {
        let genData = {} //this.input["GEN"]
        genData["Purchase Price"] = data[1][1];
        genData["Standalone Tax Rate"] = data[2][1]
        genData["MDLZ Tax Rate"] = data[3][1]
        genData["Interest Income Rate"] = data[4][1]
        genData["WACC"] = data[5][1]
        genData["PGR"] = data[6][1]
        genData["Annual Intangible Ammortization (years)"] = data[7][1]
        genData["Annual Intangible Ammortization (% of PP)"] = data[8][1]
        genData["Current Target Annual Intangible Ammortization"] = data[9][1]
        genData["Annual PP&E Stepup"] = data[10][1]
        genData["Debt Issurance Fees"] = data[11][1]
        genData["Transaction Fees %"] = data[12][1]
        genData["Control Fees"] = data[13][1]
        genData["CAPEX % of NR"] = data[14][1]
        genData["Minimum Cash Balance"] = data[15][1]
        genData["Trade Year"] = this.convertDate(data[16][1])
        genData["Dividend YoY % (first 3 years)"] = data[17][1]
        genData["Dividend YoY %"] = data[18][1]
        genData["Interest Tax Rate"] = data[19][1]
        genData["% Interest Deductible"] = data[20][1]
        genData["Interest Rate"] = data[21][1]
        genData["Max leverage"] = data[22][1]
        genData["Synergy Credit for Leverage"] = data[23][1]
        genData["Dividends / Share"] = data[24][1]
        genData["% ∆ in NWC as % ∆ in Revenue"] = data[25][1]
        genData["OTC"] = data[29][1]
        genData["Year 1 OTC"] = data[30][1]
        genData["Year 2 OTC"] = data[31][1]
        genData["KKR"] = data[32][1]
        genData["Non-Core Divestiture"] = data[33][1]
        genData["Target Share Price"] = data[37][1]
        genData["52-Week High"] = data[38][1]
        genData["SO"] = data[39][1]
        genData["FDSO at Offer"] = data[40][1]
        genData["Target Net Debt"] = data[41][1]
        genData["Trust % Ownership"] = data[42][1]
        genData["BV Equity"] = data[43][1]
        genData["Target Current Cash"] = data[44][1]
        genData["Target Short Term Debt"] = data[45][1]
        genData["MDLZ Share Price"] = data[49][1]
        genData["MDLZ 2025 FDSO"] = data[50][1]
        genData["Current FDSO"] = data[51][1]
        genData["2025 MDLZ Debt"] = data[52][1]
        genData["Total FDSO"] = data[56][1]
        genData["% Cash"] = data[57][1]
        genData["% Equity"] = data[58][1]
        genData["Beginning Cash"] = data[59][1]
        genData["Ending Cash"] = data[60][1]

        this.input["GEN"] = genData
        localStorage.setItem('gen', JSON.stringify(genData));
      }

      addMDLZExcel = (data) => {
        const years = data[0].slice(1);
        //const startingYear = years[0]; // or parse it as needed

        const raw = this.createEmptyArray(constants.mdlz_labels.length, years.length, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index] = rowData;
            }
        });

       this.rawdata["MDLZ"] = raw
       localStorage.setItem('mdlz', JSON.stringify(raw));
      }

      addTargetExcel = (data) => {
        const years = data[0].slice(1);
        //const startingYear = years[0]; // or parse it as needed

        const raw = this.createEmptyArray(constants.target_labels.length, years.length, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index] = rowData;
            }
        });

       this.rawdata["TARGET"] = raw
       localStorage.setItem('target', JSON.stringify(raw));
      }

      addAssumptionsExcel = (data) => {
        const years = data[0].slice(1);
        //const startingYear = years[0]; // or parse it as needed

        const raw = this.createEmptyArray(constants.assump_labels.length, years.length, 0);

        data.slice(1).forEach((row, index) => {
            if(row.length>0) {
                const rowData = row.slice(1);
                raw[index] = rowData;
            }
        });

       this.input["Assumptions"] = raw
       localStorage.setItem('assumptions', JSON.stringify(raw));
      }

      addSegmentExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        let raw = []
        this.numSegments++;
        data.forEach((row, index) => {
            if(index===0) raw = this.createEmptyArray(constants.seg_labels.length, years.length, 0);
            if(index%16===0) return
            if(row.length>0) {
                const true_index = index-16*(this.numSegments-1)-1
                const rowData = row.slice(1);
                if(true_index < 7) {
                    raw[true_index*2] = rowData;
                } else if(true_index < 10) {
                    raw[true_index+7] = rowData;
                } else if(true_index < 13) {
                    raw[true_index+8] = rowData;
                } else {
                    let x = [0];
                    rowData.forEach((num) => {
                        x.push(num)
                    })
                    raw[true_index+9] = x;
                }
            } else {
                this.rawdata["SEG"][this.numSegments] = raw;
                this.input["SA"][this.numSegments]  = {"NRCAGR": 0, "Proj": [0,0,0,0], "startingyear": startingYear};
                raw = []
                raw = this.createEmptyArray(constants.seg_labels.length, years.length, 0)
                this.numSegments++;
            }
        });
        this.rawdata["SEG"][this.numSegments] = raw;
        this.input["SA"][this.numSegments]  = {"NRCAGR": 0, "Proj": [0,0,0,0], "startingyear": startingYear};
      }

      addCostExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numCosts++;
        //this.input["COST"][this.numCosts] = {"startingyear": startingYear}
        let raw = []

        data.forEach((row, index) => {
            if(index===0) raw = this.createEmptyArray(constants.cost_labels.length, years.length, 0);
            if(index%8===0) return
            if(row.length>0) {
                const true_index = index-8*(this.numCosts-1)-1
                const rowData = row.slice(1);
                raw[true_index] = rowData
            } else {
                this.rawdata["COST"][this.numCosts] = raw;
                this.input["COST"][this.numCosts] = {"startingyear": startingYear}
                raw = []
                raw = this.createEmptyArray(constants.cost_labels.length, years.length, 0)
                this.numCosts++;
            }
        });
        this.rawdata["COST"][this.numCosts] = raw;
        this.input["COST"][this.numCosts] = {"startingyear": startingYear}
      }

      addRevExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numRevs++;
        let raw = []

        data.forEach((row, index) => {
            if(typeof(row[0]) === 'string' && row[0].includes("Rev Syn")) {
                this.rawdata["REV"]["Syn"] = row.slice(1)
                return
            }
            if(index===0) raw = this.createEmptyArray(constants.rev_labels.length, years.length, 0);
            if(index%7===0) return
            if(row.length>0) {
                const true_index = index-7*(this.numRevs-1)-1
                const rowData = row.slice(1);
                raw[true_index*2] = rowData
            } else {
                this.rawdata["REV"][this.numRevs] = raw;
                this.input["REV"][this.numRevs] = {"startingyear": startingYear}
                raw = []
                raw = this.createEmptyArray(constants.rev_labels.length, years.length, 0)
                this.numRevs++;
            }
        });
        // this.rawdata["REV"][this.numRevs] = raw;
        // this.input["REV"][this.numRevs] = {"startingyear": startingYear}
      }

      addDisExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numDis++;
        //this.input["COST"][this.numDis] = {"startingyear": startingYear}
        let raw = []

        data.forEach((row, index) => {
            if(index===0) raw = this.createEmptyArray(constants.dis_labels.length, years.length, 0);
            if(index%7===0) return
            if(row.length>0) {
                const true_index = index-7*(this.numDis-1)-1
                const rowData = row.slice(1);
                raw[true_index] = rowData
            } else {
                this.rawdata["DIS"][this.numDis] = raw;
                this.input["DIS"][this.numDis] = {"startingyear": startingYear}
                raw = []
                raw = this.createEmptyArray(constants.dis_labels.length, years.length, 0)
                this.numDis++;
            }
        });
        this.rawdata["DIS"][this.numDis] = raw;
        this.input["DIS"][this.numDis] = {"startingyear": startingYear}
      }

      addNcoreExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed

        this.numCore++;
        //this.input["COST"][this.numCore] = {"startingyear": startingYear}
        let raw = []

        data.forEach((row, index) => {
            if(index===0) raw = this.createEmptyArray(constants.ncore_labels.length, years.length, 0);
            if(index%9===0) return
            if(row.length>0) {
                const true_index = index-9*(this.numCore-1)-1
                const rowData = row.slice(1);
                raw[true_index*2] = rowData
            } else {
                this.rawdata["NCORE"][this.numCore] = raw;
                this.input["NCORE"][this.numCore] = {"startingyear": startingYear}
                raw = []
                raw = this.createEmptyArray(constants.ncore_labels.length, years.length, 0)
                this.numCore++;
            }
        });
        this.rawdata["NCORE"][this.numCore] = raw;
        this.input["NCORE"][this.numCore] = {"startingyear": startingYear}
      }

      addSynExcel = (data) => {
        const years = data[0].slice(1);
        const startingYear = years[0]; // or parse it as needed
        
        this.rawdata["SYN"]["Syn"] = data[2].slice(1);
        this.rawdata["SYN"]["startingyear"] = startingYear;
        this.rawdata["SEG"]["Syn"] = {"Syn": Array(this.numYears).fill(0), "startingyear": 0}
        this.rawdata["SEG"]["Syn"]["Syn"] = data[1].slice(1);
        this.rawdata["SEG"]["Syn"]["startingyear"] = startingYear;
      }

      convertDate = (input) => {
        //const end = parseInt(input)
        const beg_2024 = 45293 // 1/1/2024
        // let year = 2024;
        // let month = 0;
        // const day_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        // let day = 0;

        // let num = beg_2024

        // while(num < end){
        //     year+=1
        //     num += (year-2024)%4===0 ? 366 : 365

        // }
        // while(num < end) {
        //     month+=1;
        //     num += day_month[month] + (year-2024)%4===0 && month===1 ? 1 : 0

        // }
        // while(num < end) {
        //     day += 1
        //     num+=1
  
        // }

        // return month + "-" + day + "-" + year

        return parseInt((input - beg_2024)/365)+2024
      }
}

const dataManagerInstance = new DataManager();
export default dataManagerInstance;