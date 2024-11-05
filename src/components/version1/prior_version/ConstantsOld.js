// src/constants/constants.js

export const ROW_LABELS = ["Revenue", "vs PY%", "Gross Profit", "-%", "A&C", "-%", "Distribution", "-%", "Ovh", "-%",
  "OIE", "-%", "EBIT", "-%", "D&A", "-%", "EBITDA", "-%", "Non-Service Pension", "Taxes",
  "-ETR%", "Net Income Unlevered", "D&A Addback", "Primary Working Capital", 
  "Operating Cash Flow", "Capex", "-%NR", "Free Cash Flow", "-% Net Income", "Days Sales",
  "Days Inventory", "Days Payable", "Cash Conversion Cycle", "Accounts Receivable", "Inventory",
  "Accounts Payable", "Other", "Total Working Capital", "Cash Benefit"];
export const YEARS = 12
export const STARTING_YEAR = 2021
export const REAL_YEARS = 2

export const HIGHLIGHT_ROWS = [1,3,5,7,9,11,15,20,26];
export const EDITABLE_ROWS = [0,2,4,6,8,10,14,18,20,26,29,30,31];
export const PERM_EDITABLE = [20,29,30,31];
export const CASH_ROWS = [];
export const PERCENT_ROWS = [1,3,5,7,9,11,13,15,17,20,26,28];
export const DOLLAR_ROWS = [0,12,16,21,24,27,37];

export const REGIONS = ["NA", "EU", "LA", "AMEA", "GLOBAL"]; // DO NOT CHANGE THESE IT WILL BE BROKEN

export const RATES = {
  "United States": 0.08,
  "Algeria": 0.11777694496800464,
  "Angola": 0.26368656009127656,
  "Argentina": 0.9894619920829708,
  "Australia": 0.080896,
  "Austria": 0.084024,
  "Azerbaijan": 0.12681936305867644,
  "Bahrain": 0.08,
  "Bangladesh": 0.1387709577242402,
  "Belarus": 0.14171936305867644,
  "Belgium": 0.08,
  "Bolivia": 0.08976136501475995,
  "Botswana": 0.11616749157053781,
  "Brazil": 0.10712536501475996,
  "Bulgaria": 0.09499014394567014,
  "Cameroon": 0.15371373855806675,
  "Canada": 0.08,
  "Chile": 0.09500509458118733,
  "China": 0.08,
  "Colombia": 0.11482157302177405,
  "Costa Rica": 0.08651585577785394,
  "Croatia": 0.08865029095231054,
  "Cyprus": 0.08,
  "Czech Republic": 0.094649,
  "Denmark": 0.08,
  "Dominican Republic": 0.10858585577785394,
  "Ecuador": 0.277348184828619,
  "Egypt": 0.25701653606997743,
  "El Salvador": 0.14117386932949827,
  "Estonia": 0.09989118891943546,
  "Ethiopia": 0.5819788065062754,
  "Finland": 0.08,
  "France": 0.08,
  "Gabon": 0.154155256137705,
  "Georgia": 0.12173836305867644,
  "Germany": 0.08,
  "Ghana": 1.1341779577521516,
  "Greece": 0.08,
  "Guatemala": 0.10651615291500595,
  "Honduras": 0.11083515291500595,
  "Hong Kong": 0.08,
  "Hungary": 0.11657799888751792,
  "Iceland": 0.09279899999999999,
  "India": 0.09918495772424021,
  "Indonesia": 0.08,
  "Iraq": 0.12235004640075212,
  "Ireland": 0.08,
  "Israel": 0.08058946639455536,
  "Italy": 0.08,
  "Ivory Coast": 0.08291975681381174,
  "Jamaica": 0.12102215291500595,
  "Japan": 0.08,
  "Kazakhstan": 0.13688857645357166,
  "Kenya": 0.14976904021591064,
  "Kuwait": 0.08,
  "Latvia": 0.09549742980203338,
  "Lebanon": 0.978619046400752,
  "Lithuania": 0.09699280373606527,
  "Luxembourg": 0.08,
  "Malaysia": 0.08,
  "Mauritius": 0.09382195772424021,
  "Mexico": 0.09843834597146885,
  "Mongolia": 0.15777168632757527,
  "Morocco": 0.08035996093171205,
  "Namibia": 0.10506564979506604,
  "Netherlands": 0.082026,
  "New Zealand": 0.081175,
  "Nicaragua": 0.15166027455070236,
  "Nigeria": 0.28019049217724373,
  "Norway": 0.08,
  "Oman": 0.08,
  "Pakistan": 0.32942228064648643,
  "Panama": 0.08,
  "Paraguay": 0.10530536501475996,
  "Peru": 0.08519656775076291,
  "Philippines": 0.08842252189670394,
  "Poland": 0.107490130739981,
  "Portugal": 0.08,
  "Puerto Rico": 0.2925859920829707,
  "Qatar": 0.08,
  "Romania": 0.11438436430166754,
  "Russia": 1.092338273844821,
  "Rwanda": 0.1571224292883946,
  "Saudi Arabia": 0.08,
  "Senegal": 0.12136791335718078,
  "Serbia": 0.11055062769866728,
  "Singapore": 0.08,
  "Slovakia": 0.093616,
  "Slovenia": 0.08,
  "South Africa": 0.11313049157053781,
  "South Korea": 0.08,
  "Spain": 0.08,
  "Sri Lanka": 0.783931318186852,
  "Swaziland": 0.10140249157053781,
  "Sweden": 0.08,
  "Switzerland": 0.08,
  "Taiwan": 0.08,
  "Thailand": 0.08,
  "Trinidad and Tobago": 0.08490215291500594,
  "Tunisia": 0.21631114256329043,
  "Turkey": 0.40371689882960715,
  "Ukraine": 1.3120532207574613,
  "United Kingdom": 0.081082,
  "Uruguay": 0.11739810047880207,
  "Vietnam": 0.08824487382580029,
  "UAE": 0.08,
  "Zimbabwe": 4.3899376497950655,
};

export const COUNTRIES = {
  "United States": ["NA", ["USD"]],
  "Brazil": ["LA", ["BRL"]],
  "Germany": ["EU", ["EUR"]],
  "Spain": ["EU", ["EUR"]],
  "Mexico": ["LA", ["MXN"]],
  "Canada": ["NA", ["CAD"]],
  "France": ["EU", ["EUR"]],
  "Italy": ["EU", ["EUR"]],
  "Japan": ["AMEA", ["JPY"]],
  "India": ["AMEA", ["INR"]],
  "China": ["AMEA", ["CNY"]]
};

const regions_dict = {
  "GLOBAL": ["NA", "EU", "LA", "AMEA"],
  "NA": [],
  "EU": [],
  "LA": [],
  "AMEA": []
};

// Populate the regions_dict based on countries
for (const [country, info] of Object.entries(COUNTRIES)) {
  const region = info[0];
  if (regions_dict[region]) {
      regions_dict[region].push(country);
  }
}

// Export the regions_dict for use in other parts of your application
export const regionsDict = regions_dict;

export const SHEETS = ['Stand Alone Value', 'Revenue Synergies', 'Cost Synergies', 'P&L Synergies'];