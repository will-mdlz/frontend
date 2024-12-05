import { useState, useEffect } from 'react';
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { prettify_dollars, prettify_percent, prettify_multiple, prettify_dollars_acc } from '../../TableFunctions';
import dataManagerInstance from '../../DataManagement/Data';


const ReturnAVP = ({maxHeight, prices, numyears}) => {
  const [input, setInput] = useState(dataManagerInstance.input["AVP"])

  useEffect(() => {
    dataManagerInstance.updateAll();
    dataManagerInstance.calcAVP(prices, numyears);
    const data = dataManagerInstance.input["AVP"];
    setInput(data)
  }, [prices, numyears])

  dataManagerInstance.updateAll();
  dataManagerInstance.calcAVP(prices, numyears);
  const borderColor = '#4F2170';
  const fadedColor = 'gainsboro'

  const createDivider = (num) => {
    return (
      <TableRow>
        <TableCell colSpan={num} style={{ padding: 0 }}>
          <Divider sx={{ borderBottomWidth: 2, backgroundColor: 'black' }} />
        </TableCell>
      </TableRow>
    );
  }

  const labelStyle = {
    fontSize: 12,
    width: 250,
    padding: 8
  }

  const labelStyleGray = {
    fontSize: 12,
    width: 250,
    padding: 8,
    backgroundColor: fadedColor
  }

  return (
  <div>
     <Paper sx={{ width: '99.8%', border: `2px solid ${borderColor}`}}>
      <TableContainer sx={{ maxHeight: maxHeight, overflowX: 'auto' }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              <TableCell key={1} size='small' colSpan={3}></TableCell>
              <TableCell key={0} size='small' colSpan={6} align='center' style={{color: 'white', backgroundColor:borderColor}}>$ Offer Price to Target</TableCell>
            </TableRow>
            <TableRow>
            <TableCell size="small" colSpan={3} style={{ fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>(USD Bn, except per share data)</span>
                <span style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' }}>
                  Current Metrics
                </span>
              </div>
            </TableCell>
              {prices.map((price) => (
                <TableCell key={price} size='small' align='center' style={{color: 'white', backgroundColor:borderColor}}>{`$ ${price}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {createDivider(9)}
              <TableRow>
                <TableCell size='small' rowSpan={6} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>Transaction Overview</TableCell>
                <TableCell size='small' style={labelStyleGray}>Premium to Current Price</TableCell>
                <TableCell size='small' align='right' style={{backgroundColor: fadedColor}}>{prettify_dollars(input["Premium to Current Price"][0])}</TableCell>
                {input["Premium to Current Price"].slice(1).map((num, index) => (
                  <TableCell key={"0" + index} size="small" align='center' style={{backgroundColor: fadedColor}}>{prettify_percent(num)}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell size='small' style={labelStyle}>% Premium to 52-Week High</TableCell>
                <TableCell size='small' align='right'>{prettify_dollars(input["% Premium to 52-Week High"][0])}</TableCell>
                {input["% Premium to 52-Week High"].slice(1).map((num, index) => (
                  <TableCell key={"1" + index} size="small" align='center'>{prettify_percent(num)}</TableCell>
                ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyleGray}>Equity Value</TableCell>
              <TableCell style={{backgroundColor: fadedColor}}></TableCell>
              {input["Equity Value"].map((num, index) => (
                <TableCell key={"2" + index} size='small' align='center' style={{backgroundColor: fadedColor}}>{prettify_multiple(num)}</TableCell>
              ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>Enterprise Value</TableCell>
              <TableCell align="right" size='small'>{prettify_dollars(input["Enterprise Value"][0])}</TableCell>
              {input["Enterprise Value"].slice(1).map((num, index) => (
                <TableCell key={"3" + index} size='small' align='center'>{prettify_dollars(num)}</TableCell>
              ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyleGray}>EV / 2025E EBITDA</TableCell>
              <TableCell size='small' align='right' style={{backgroundColor: fadedColor}}>{prettify_dollars(input["EV / Year 0 EBITDA"][0])}</TableCell>
              {input["EV / Year 0 EBITDA"].slice(1).map((num, index) => (
                <TableCell key={"4" + index} size='small' align='center' style={{backgroundColor: fadedColor}}>{prettify_multiple(num)}</TableCell>
              ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>EV / 2026E EBITDA</TableCell>
              <TableCell size='small' align='right'>{prettify_dollars(input["EV / Year 1 EBITDA"][0])}</TableCell>
              {input["EV / Year 1 EBITDA"].slice(1).map((num, index) => (
                <TableCell key={"5" + index} size='small' align='center'>{prettify_multiple(num)}</TableCell>
              ))}
              </TableRow>

              {createDivider(9)}

              <TableRow>
                <TableCell size='small' rowSpan={2} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>Consideration Mix</TableCell>
                <TableCell size='small' style={labelStyleGray}>% Cash / $ Equity</TableCell>
                <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["% Cash"].map((cashValue, index) => (
                    <TableCell key={index} size="small" align='center' style={{backgroundColor: fadedColor, fontSize: 12}}>
                      {prettify_percent(cashValue)} / {prettify_percent(input["% Equity"][index])}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>% of MDLZ Shares Issued</TableCell>
              <TableCell>
              </TableCell>
              { input["% of MDLZ Shares Issued"].map((val, index) => (
                <TableCell key={"7" + index} size='small' align='center'>{prettify_percent(val)}</TableCell>
              ))}
              </TableRow>

              {createDivider(9)}

              <TableRow>
                <TableCell size='small' rowSpan={2} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>Pro Forma Ownership</TableCell>
                <TableCell size='small' style={labelStyleGray}>% of MDLZ Ownership / % Target Ownership</TableCell>
                <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["% of MDLZ Ownership"].map((cashValue, index) => (
                    <TableCell key={"8" + index} size="small" align='center' style={{backgroundColor: fadedColor, fontSize: 12}}>
                      {prettify_percent(cashValue)} / {prettify_percent(input["% Target Ownership"][index])}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>Implied Trust Ownership</TableCell>
              <TableCell size='small'></TableCell>
              { input["Implied Trust Ownership"].map((val, index) => (
                <TableCell key={"9" + index} size='small' align='center'>{prettify_percent(val)}</TableCell>
              ))}
              </TableRow>

              {createDivider(9)}

              <TableRow>
                <TableCell size='small' rowSpan={2} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>IRR</TableCell>
                <TableCell size='small' style={labelStyleGray}>Cost Only Synergies</TableCell>
                <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["Cost Only Synergies"].map((val, index) => (
                <TableCell key={"10" + index} size='small' align='center' style={{backgroundColor: fadedColor}}>{val==="DNC" ? "DNC" : prettify_percent(val)}</TableCell>
              ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>Cost & Revenue Synergies</TableCell>
              <TableCell size='small'></TableCell>
              { input["Cost & Revenue Synergies"].map((val, index) => (
                <TableCell key={"11" + index} size='small' align='center'>{val==="DNC" ? "DNC" : prettify_percent(val)}</TableCell>
              ))}
              </TableRow>

              {createDivider(9)}

              <TableRow>
                <TableCell size='small' rowSpan={3} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>Accretion / (Dilution)</TableCell>
                <TableCell size='small' style={labelStyleGray}>2026E</TableCell>
                <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["Year 1 ACC"].map((cashValue, index) => (
                    <TableCell key={index} size="small" align='center' style={{backgroundColor: fadedColor, fontSize: 12}}>
                      {prettify_dollars_acc(cashValue)} / {prettify_percent(input["Year 1 DIL"][index])}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyle}>2027E</TableCell>
              <TableCell size='small'></TableCell>
                { input["Year 2 ACC"].map((cashValue, index) => (
                    <TableCell key={index} size="small" align='center' style={{fontSize: 12}}>
                      {prettify_dollars_acc(cashValue)} / {prettify_percent(input["Year 2 DIL"][index])}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyleGray}>2028E</TableCell>
              <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["Year 3 ACC"].map((cashValue, index) => (
                    <TableCell key={index} size="small" align='center' style={{backgroundColor: fadedColor, fontSize: 12}}>
                      {prettify_dollars_acc(cashValue)} / {prettify_percent(input["Year 3 DIL"][index])}
                    </TableCell>
                  ))}
              </TableRow>

              {createDivider(9)}

              <TableRow>
                <TableCell size='small' rowSpan={2} align='center' width={100} style={{color: 'white', backgroundColor:borderColor}}>Synergies</TableCell>
                <TableCell size='small' style={labelStyle}>Target Shares of Synergies</TableCell>
                <TableCell size='small'></TableCell>
                { input["Target Shares of Synergies"].map((val, index) => (
                <TableCell key={"12" + index} size='small' align='center'>{prettify_dollars(val)}</TableCell>
              ))}
              </TableRow>
              <TableRow>
              <TableCell size='small' style={labelStyleGray}>MDLZ Shares of Synergies</TableCell>
              <TableCell size='small' style={{backgroundColor: fadedColor}}></TableCell>
                { input["MDLZ Shares of Synergies"].map((val, index) => (
                <TableCell key={"13" + index} size='small' align='center' style={{backgroundColor: fadedColor}}>{prettify_dollars(val)}</TableCell>
              ))}
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
     </Paper>
  </div>
);
};

export default ReturnAVP;