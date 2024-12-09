import React, { useEffect, useState } from 'react';
import { Box, Select, MenuItem, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';

const PriceEPS = () => {
    // Set up state for the three inputs with default values
    const [startPrice, setStartPrice] = useState(190);
    const [endPrice, setEndPrice] = useState(240);
    const [interval, setInterval] = useState(10);
    const [prices, setPrices] = useState([])
    const [year, setYear] = useState(2026)

    const borderColor = '#1976d2'

    useEffect(() => {
        if (interval === 0 || interval === "" || interval < 0) {
            setInterval(10); // Reset to default interval if invalid
        } else {
            const newPrices = [];
            for (let price = startPrice; price <= endPrice; price += interval) {
                newPrices.push(price);
            }
            if(!newPrices.includes(endPrice)) newPrices.push(endPrice);
            setPrices(newPrices);
        }
    }, [startPrice, endPrice, interval]);

    // Calculate the range of prices
    const eps = dataManagerInstance.getEps(prices, 2026, year-2026+1);
    const eps1 = eps[year-2026][0]
    const eps2 = eps[year-2026][1]

    const onYearChange = (event) => {
        const newYear = event.target.value;
        setYear(newYear);
    }

    const convertEps = (input) => {
        console.log(input)
        if(input<0) {
            return "$(" + (input*-1).toFixed(3)+")";
        }
        return "$" + (input).toFixed(1);
    }

    const convertPercent = (input) => {
        if(input<0) {
            return "%(" + (input*-100).toFixed(1)+")";
        }
        return "%" + (input*100).toFixed(1);
    }

    return (
        <Box sx={{ border: `2px solid ${borderColor}`}}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <p style={{ textAlign: 'center' }}>Price ($) vs ACC ($) / DIL (%)</p>
            </div>
            {/* Input fields for start price, end price, and interval */}
            <TextField
                inputProps={{ step: 5 }}
                label="Starting Price"
                type="number"
                value={startPrice}
                onChange={(e) => setStartPrice(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <TextField
                inputProps={{ step: 5 }}
                label="Ending Price"
                type="number"
                value={endPrice}
                onChange={(e) => setEndPrice(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <TextField
                inputProps={{ step: 5 }}
                label="Interval"
                type="number"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <Select 
            value={year}
            onChange={onYearChange}
            variant="standard"
            inputProps={{
              style: { 
                border: 'none',  
                outline: 'none', 
                height: '30px',  
                padding: '5px',
                fontSize: '14px'
              }
            }}
            sx={{
              width: '200px',
              margin: 0,
            }}>
                <MenuItem value={2026}>2026</MenuItem>
                <MenuItem value={2027}>2027</MenuItem>
                <MenuItem value={2028}>2028</MenuItem>
                <MenuItem value={2029}>2029</MenuItem>
                <MenuItem value={2030}>2030</MenuItem>
                <MenuItem value={2031}>2031</MenuItem>
                <MenuItem value={2032}>2032</MenuItem>
                <MenuItem value={2033}>2033</MenuItem>
                <MenuItem value={2034}>2034</MenuItem>
                <MenuItem value={2035}>2035</MenuItem>
            </Select>

            <Divider sx={{ my: 2 }} />

            {/* Sensitivity Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow hover>
                            <TableCell>Price</TableCell>
                            {prices.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {price}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow hover>
                            <TableCell component="th" scope="row">
                                ACC
                            </TableCell>
                            {prices.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {/* Placeholder for IRR calculation */}
                                    {/* Replace with actual IRR calculation */}
                                    {convertEps(eps1[index])}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow hover>
                            <TableCell component="th" scope="row">
                                DIL
                            </TableCell>
                            {prices.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {/* Placeholder for IRR calculation */}
                                    {/* Replace with actual IRR calculation */}
                                    {convertPercent(eps2[index])}
                                </TableCell>
                            ))}
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default PriceEPS;
