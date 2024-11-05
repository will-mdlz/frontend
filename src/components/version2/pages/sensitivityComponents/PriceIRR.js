import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';

const PriceIRR = () => {
    // Set up state for the three inputs with default values
    const [startPrice, setStartPrice] = useState(210);
    const [endPrice, setEndPrice] = useState(260);
    const [interval, setInterval] = useState(10);
    const [prices, setPrices] = useState([])

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
    const irrs = dataManagerInstance.getIRR(prices, 1, dataManagerInstance.getSegment["CONS"]);

    const convertPercent = (input) => {
        if(input<0) {
            return "%(" + (input*-100).toFixed(1)+")";
        }
        return "%" + (input*100).toFixed(1);
    }

    return (
        <Box sx={{ border: `2px solid ${borderColor}`}}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <p style={{ textAlign: 'center' }}>Price ($) vs IRR (%)</p>
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
                                IRR
                            </TableCell>
                            {prices.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {/* Placeholder for IRR calculation */}
                                    {/* Replace with actual IRR calculation */}
                                    {convertPercent(irrs[index])}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default PriceIRR;
