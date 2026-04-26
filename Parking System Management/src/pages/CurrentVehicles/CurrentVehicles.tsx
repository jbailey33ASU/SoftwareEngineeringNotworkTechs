import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from 'react';
import {getPlates} from '../../api.tsx';


function CurrentVehicles() {
  const [plates, setPlates] = useState<any>(null);

  const noExit = "No exit time"

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getPlates();
        setPlates(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);

  return (
    <div>
      <h1>CurrentVehicles</h1>
      <p>Quick overview of the current vehicles in the parking garage</p>
      <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>Entry ID</TableCell>
            <TableCell align="right">License Plate</TableCell>
            <TableCell align="right">Enter Time</TableCell>
            <TableCell align="right">Exit Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plates?.map((plate:any) => (
            
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.id}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.enterTime}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.exitTime !== null ? plate.exitTime : noExit}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
  );
}



export default CurrentVehicles;
