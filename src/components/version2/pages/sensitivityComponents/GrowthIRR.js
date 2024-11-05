import React, { useState, useEffect } from 'react';
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import dataManagerInstance from '../../DataManagement/Data';

const GrowthIRR = () => {
    // Set up state for the three inputs with default values
    const [startGrowth, setstartGrowth] = useState(-.02);
    const [endGrowth, setendGrowth] = useState(.08);
    const [interval, setInterval] = useState(.01);
    const [growths, setGrowths] = useState([])
    const [price, setPrice] = useState(230);

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
    const irrs = dataManagerInstance.growthSensitivity(growths, [price]);

    const convertPercent = (input) => {
        if(input<0) {
            return "%(" + (input*-100).toFixed(1)+")";
        }
        return "%" + (input*100).toFixed(1);
    }

    return (
        <Box sx={{ border: `2px solid ${borderColor}`}}>
            {/* Input fields for start price, end price, and interval */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <p style={{ textAlign: 'center' }}>Standalone Revenue Growth (%) vs IRR (%)</p>
            </div>
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
                            <TableCell>% Growth</TableCell>
                            {growths.map((price, index) => (
                                <TableCell key={index} align="center">
                                    {convertPercent(price)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow hover>
                            <TableCell component="th" scope="row">
                                IRR
                            </TableCell>
                            {growths.map((price, index) => (
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

export default GrowthIRR;
