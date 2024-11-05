import React, { useState, useEffect } from 'react';
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';

const PriceGrowthIRR = () => {
    // Set up state for the three inputs with default values
    const [startGrowth, setstartGrowth] = useState(-.02);
    const [endGrowth, setendGrowth] = useState(.08);
    const [growthInterval, setgrowthInterval] = useState(.01);
    const [growths, setGrowths] = useState([])
    const [startPrice, setStartPrice] = useState(210);
    const [endPrice, setEndPrice] = useState(260);
    const [priceInterval, setpriceInterval] = useState(10);
    const [prices, setPrices] = useState([])

    const borderColor = '#1976d2'
    //const fadedColor = 'gainsboro'

    useEffect(() => {
        if (growthInterval === 0 || growthInterval === "" || growthInterval < 0) {
            setgrowthInterval(.01); // Reset to default growthInterval if invalid
        } else {
            const newGrowths = [];
            for (let growth = startGrowth; growth <= endGrowth; growth += growthInterval) {
                newGrowths.push(growth);
            }
            if(!newGrowths.includes(endGrowth)) newGrowths.push(endGrowth);
            setGrowths(newGrowths);
        }
        if (priceInterval === 0 || priceInterval === "" || priceInterval < 0) {
            setpriceInterval(10); // Reset to default priceInterval if invalid
        } else {
            const newPrices = [];
            for (let price = startPrice; price <= endPrice; price += priceInterval) {
                newPrices.push(price);
            }
            if(!newPrices.includes(endPrice)) newPrices.push(endPrice);
            setPrices(newPrices);
        }
    }, [startGrowth, endGrowth, growthInterval, startPrice, endPrice, priceInterval]);

    // Calculate the range of growths
    const irrs = dataManagerInstance.growthSensitivity(growths, prices);

    const convertPercent = (input) => {
        if(input<0) {
            return "%(" + (input*-100).toFixed(1)+")";
        }
        return "%" + (input*100).toFixed(1);
    }

    // const fadedStyle = {
    //     backgroundColor: fadedColor
    //   }

    const borderBottom = {
        borderBottom: '2px solid black'
    }

    const borderRight = {
        borderRight: '2px solid black'
    }

    return (
        <Box sx={{ border: `2px solid ${borderColor}`}}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <p style={{ textAlign: 'center' }}>Price ($) / Standalone Revenue Growth (%) Matrix (IRR)</p>
            </div>
            {/* Input fields for start price, end price, and growthInterval */}
            <div>
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
                label="Price Interval"
                type="number"
                inputProps={{step: 5}}
                value={priceInterval}
                onChange={(e) => setpriceInterval(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            </div>
            <div>
            <TextField
                inputProps={{ step: .01 }}
                label="Starting Growth"
                type="number"
                value={startGrowth}
                onChange={(e) => setstartGrowth(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <TextField
                inputProps={{ step: .01 }}
                label="Ending Growth"
                type="number"
                value={endGrowth}
                onChange={(e) => setendGrowth(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <TextField
                label="Growth Interval"
                type="number"
                inputProps={{step: .01}}
                value={growthInterval}
                onChange={(e) => setgrowthInterval(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            </div>
            <Divider sx={{ my: 2 }} />

            {/* Sensitivity Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx = {borderBottom}>Price / Growth</TableCell>
                            {growths.map((growth, index) => (
                                <TableCell sx={borderBottom} key={index} align="center">
                                    {convertPercent(growth)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prices.map((price, rowIndex) => (
                            <TableRow hover key={rowIndex}>
                                <TableCell component="th" scope="row" sx={borderRight} >
                                    {price}
                                </TableCell>
                                {growths.map((_, colIndex) => (
                                    <TableCell key={colIndex} align="center">
                                        {convertPercent(irrs[colIndex][rowIndex])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default PriceGrowthIRR;
