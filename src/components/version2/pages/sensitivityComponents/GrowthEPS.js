import React, { useState, useEffect } from 'react';
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';

const GrowthEPS = () => {
    // Set up state for the three inputs with default values
    const [startGrowth, setstartGrowth] = useState(-.02);
    const [endGrowth, setendGrowth] = useState(.06);
    const [interval, setInterval] = useState(.01);
    const [growths, setGrowths] = useState([])
    const [price, setPrice] = useState(230);



    const epsYears = [2026,2027,2028]
    const borderColor = '#1976d2'

    useEffect(() => {
        if (interval === 0 || interval === "" || interval < 0) {
            setInterval(.01); // Reset to default interval if invalid
        } else {
            const newGrowths = [];
            for (let growth = startGrowth; growth <= endGrowth; growth += interval) {
                newGrowths.push(growth);
            }
            if(!newGrowths.includes(endGrowth)) newGrowths.push(endGrowth);
            setGrowths(newGrowths);
        }
    }, [startGrowth, endGrowth, interval]);

    // Calculate the range of growths
    const eps = dataManagerInstance.growthEPSSensitivity(growths, price, epsYears);
    console.log(eps)

    const convertPercent = (input) => {
        if(input<0) {
            return "%(" + (input*-100).toFixed(1)+")";
        }
        return "%" + (input*100).toFixed(1);
    }

    const convertDollar = (input) => {
        let str = ""
        if(input<0) {
            str = "$(" + (input*-1).toFixed(2)+")";
        }
        else {
            str =  "$" + (input*1).toFixed(2);
        }
        return str
    }

    return (
        <Box sx={{ border: `2px solid ${borderColor}`}}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <p style={{ textAlign: 'center' }}>Standalone Revenue Growth (%) vs ACC/DIL ($ %) by year </p>
            </div>
            {/* Input fields for start price, end price, and interval */}
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
                label="Interval"
                type="number"
                inputProps={{step: .01}}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <TextField
                label="Price"
                type="number"
                inputProps={{step: 10}}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                sx={{ m: 1 }}
            />
            <Divider sx={{ my: 2 }} />

            {/* Sensitivity Table */}
            <TableContainer component={Paper}> 
                <Table>
                    <TableHead>
                        <TableRow hover>
                            <TableCell>Year</TableCell>
                            <TableCell>% Growth</TableCell>
                            {growths.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {convertPercent(price)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {epsYears.map((year, yearIndex) => (
                            <React.Fragment key={yearIndex}>
                            <TableRow hover>
                                <TableCell rowSpan={2} align="center">
                                {year}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                $
                                </TableCell>
                                {growths.map((price, index) => (
                                <TableCell key={`acc-${yearIndex}-${index}`} align="center" fullwidth>
                                    {/* Placeholder for IRR calculation */}
                                    {/* Replace with actual IRR calculation */}
                                    {convertDollar(eps[yearIndex][0][index])}
                                </TableCell>
                                ))}
                            </TableRow>
                            <TableRow hover>
                                <TableCell component="th" scope="row">
                                %
                                </TableCell>
                                {growths.map((price, index) => (
                                <TableCell key={`dil-${yearIndex}-${index}`} align="center">
                                    {/* Placeholder for IRR calculation */}
                                    {/* Replace with actual IRR calculation */}
                                    {convertPercent(eps[yearIndex][1][index])}
                                </TableCell>
                                ))}
                            </TableRow>
                            </React.Fragment>
                        ))}
                        </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default GrowthEPS;
