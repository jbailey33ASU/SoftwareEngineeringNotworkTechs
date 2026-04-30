import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from 'react';
import {getRecentEntries, getRecentExits} from '../../api.tsx';
import moment from 'moment';

function RecentActivity() {

  const [entries, setEntries] = useState<any>(null);
  const [exits, setExits] = useState<any>(null);

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getRecentEntries();
        setEntries(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getRecentExits();
        setExits(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);


  return (
    <div>
      <div style={{display: "grid", alignContent: "center", justifyContent: "space-around"}}>
      <h1>RecentActivity</h1>
      <p>Recent entries/exits to the parking garage</p>
      </div>
      <div>
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <p style={{width: "15%", textAlign: "left"}}>Recent Entries</p>
          <p style={{width: "15%", textAlign: "right"}}>Recent Exits</p>
        </div>
      <div style={{display: "flex", justifyContent: "space-between"}}>

      <TableContainer sx={{width: "45%", alignContent: "left"}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>License Plate</TableCell>
            <TableCell align="right">Enter Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries?.map((plate:any) => (
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.enterTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
      </TableContainer>

      
      <TableContainer sx={{width: "45%", alignContent: "right"}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table 2">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>License Plate</TableCell>
            <TableCell align="right">Exit Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exits?.map((plate:any) => (
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.exitTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
      </TableContainer>

      </div>

      </div>
    </div>
  );
}

export default RecentActivity;
