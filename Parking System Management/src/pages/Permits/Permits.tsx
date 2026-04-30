import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from 'react';
import {getDiscountPlates} from '../../api.tsx';
import moment from 'moment';

function Permits() {
  const [plates, setPlates] = useState<any>(null);

  const noExit = "No exit time"

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getDiscountPlates();
        setPlates(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);

  return (
    <div>
      <div style={{display: "grid", alignContent: "center", justifyContent: "space-around"}}>
      <h1>Discounted Vehicles</h1>
      <p>Quick overview of the current vehicles in the parking garage with discounts</p>
      </div>
      <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>Entry ID</TableCell>
            <TableCell align="right">License Plate</TableCell>
            <TableCell align="right">Enter Time</TableCell>
            <TableCell align="right">Exit Time</TableCell>
            <TableCell align="right">Discount Type</TableCell>
            <TableCell align="right">Discount Percent</TableCell>
            <TableCell align="right">Discount Start</TableCell>
            <TableCell align="right">Discount End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plates?.map((plate:any) => (
            
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.id}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.enterTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.exitTime !== null ? moment(plate.exitTime).format("MMMM Do YYYY, h:mm:ss a") : noExit}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.DiscountProfiles.profileName}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.DiscountProfiles.discountPercent}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.discountStart).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.discountEnd !== null ? moment(plate.discountEnd).format("MMMM Do YYYY, h:mm:ss a") : "No End Specified"}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
  );
}

export default Permits;
