
export const row_labels = [
    "Total Net Revenue", "% Growth", "Gross Profit", "% Margin", "A&C", "% NR", 
    "SG&A / Corporate Expense", "% NR", "OI", "% Margin", "EBITDA", "% Margin"
  ]

export const seg_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit", "% Margin", "A&C", "% NR", 
  "SG&A", "% NR", "EBIT", "% Margin", "D&A", "% NR", "EBITDA", "% Margin",
  "Vol/Mix","Price","Rest", "COGS", "Cocoa", "Other", "Cocoa GBP/Ton", "YoY Cocoa Costs", "YoY Other Costs"
]

export const seg_cons_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit", "% Margin", "A&C", "% NR", 
  "SG&A", "% NR", "EBIT", "% Margin", "Corporate Expense", "% NR", "Total OI", "% NR", "Segment Depreciation", "% NR",
  "Corporate Depreciation", "% NR", "Total EBITDA", "% Margin", "Income Taxes", "Tax Rate",
  "NOPAT", "Plus: Depcreciation", "Less: Capital Expenditures", "% NR",
  "Less: Net Working Capital", "% change NR", "Net Available Cash Flow",
  "Vol/Mix","Price","Rest", "COGS", "Cocoa", "Other"
]

export const cost_labels = [
  "Total Net Revenue", "COGS", "Gross Profit", "A&C", "SG&A / Coporate Expense", "Total OI"
]

export const cost_cons_labels = [
  "Total Net Revenue", "Gross Profit", "A&C", "SG&A / Coporate Expense", "Total OI", "Income Taxes", "Tax Rate", 
  "NOPAT", "Net Available Cash Flow", 
]

export const rev_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit", "% Revenue", "A&C", "% Revenue", "SG&A", "% Revenue", "Total OI", "% Revenue"
]

export const rev_cons_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit", "A&C", "SG&A / Coporate Expense", "Total OI", 
  "Total Depreciation", "% Net Revenue", "Total EBITDA", "% Net Revenue", "Income Taxes", "Tax Rate", 
  "NOPAT", "Plus: Depreciation", "Less: Capital Expenditures",
  "% Net Revenue", "Less: Net Working Capital", "% Change NR", "Net Available Cash Flow", 
]

export const dis_labels = [
  "Total Net Revenue", "Gross Profit", "A&C", "SG&A", "Operating Profit"
]

export const dis_cons_labels = [
  "Total Net Revenue", "Gross Profit", "A&C", "SG&A / Coporate Expense", "Total OI", "Income Taxes", "Tax Rate", 
  "NOPAT", "Net Available Cash Flow", 
]

export const ncore_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit", "% Net Revenue", "A&C", "% Net Revenue", "SG&A", "% Net Revenue", "Operating Profit", 
  "% Net Revenue", "Total Depreciation", "% Net Revenue", "Total EBITDA", "% Net Revenue"
]

export const ncore_cons_labels = [
  "Total Net Revenue", "% Growth", "Gross Profit","A&C","SG&A","Total OI", 
  "% Net Revenue", "Total Depreciation", "% Net Revenue", "Total EBITDA", "% Net Revenue", "Income Taxes", "Tax Rate", 
  "NOPAT", "Plus: Depreciation", "Less: Capital Expenditures",
  "% Net Revenue", "Less: Net Working Capital", "% Change NR", "Net Available Cash Flow", 
]

// export const mdlz_labels = [
//   "MDLZ Status Quo EPS", "MDLZ Status Quo Net Income","MDLZ NR", "MDLZ EBITDA", "MDLZ EBIT", "MDLZ NOPAT", "MDLZ Change in NWC", "MDLZ Capex", "MDLZ Total Debt", "MDLZ Cash",
//   "Operating Lease Liability", "Taxes", "Taxes (cash impact)", "MDLZ Pensions - (tax deductible)",
//   "MDLZ Non Controlling Interest", "MDLZ JVs", "MDLZ JVs (cash impact)", 
//   "MDLZ Other", "MDLZ Other (cash impact)", "MDLZ Restructuring", "MDLZ Financing", "MDLZ NI"
// ]

export const mdlz_labels = [
  "Status Quo EPS", "Status Quo Net Income","Net Revenue", "EBIT", "D&A", "EBITDA", "Benefit from NWC", "CAPEX", "Total Debt",
  "NI to OI Bridge", "Interest", "Pension Income", "Cash Taxes", "Operating Lease", "JVs", "Other", "Restructuring",
  "Financing", "Cash"
]

// export const target_labels = [
//   "Target Pensions - (tax deductible)", "Target Other Income / (Expense) - (tax deductible)", "SBC", "Pension", "AAA initiative cash expense"
// ]

export const target_labels = [
  "Pensions (Tax Deductible)", "Other Income (Tax Deductible)", "SBC", "Pension", "AAA Initiaitve Cash Expense"
]

export const assump_labels = [
  "Corporate Depreciation % of NR", "Corporate Expense % of NR", "Vol/Mix", "Price", "Other"
]

export const gen_data_rows = [
  "Purchase Price", "Standlaone Tax Rate", "MDLZ Tax Rate", "Interest Income Rate", "WACC", "PGR", "Annual Intangible Ammortization", 
  "Annual PP&E Stepup","Debt Issurance Fees", "Transaction Feeds %", "Control Fees", "CAPEX % of NR", "Minimum Cash Balance", 
  "Trade Year", "Divident YoY % (first 3 years)", "Divident YoY %", "Interest Tax Rate", "% Interest Deductible", "Interest Rate", 
  "Max leverage", "Synergy Credit for Leverage", "2025 Dividends / Share", "% ∆ in NWC as % ∆ in Revenue", 
]