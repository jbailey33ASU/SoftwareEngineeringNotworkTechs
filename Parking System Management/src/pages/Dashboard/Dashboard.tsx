import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import {getActivePlates, getActiveTotal, getHourlyValue, getInactivePlates} from '../../api.tsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';

function Dashboard() {

const [total, setTotal] = useState<number | null>(null);

  const [entries, setEntries] = useState<any>(null);
  const [exits, setExits] = useState<any>(null);

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getActivePlates();
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
        const data = await getInactivePlates();
        setExits(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);

useEffect(() => {
  async function fetchTotal() {
    try {
      const value = await getActiveTotal();
      setTotal(value);
    } catch (error) {
      console.error(error);
    }
  }

  fetchTotal();
}, []);

const [value, setValue] = useState<number | null>(null);

useEffect(() => {
  async function fetchValue() {
    try {
      const value = await getHourlyValue();
      setValue(value);
    } catch (error) {
      console.error(error);
    }
  }

  fetchValue();
}, []);

  return (
    <div>
      <div style={{display: "grid", alignContent: "center", justifyContent: "space-around"}}>
        <h1>Dashboard</h1>
        <p>Quick overview of your parking garage</p>
      </div>
      <div style = {{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: "space-around"
      }}>
        <Card sx={{ minWidth: 275, maxWidth: 275, backgroundColor: 'ghostwhite' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
              Total Active Vehicle Count:
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 24 }}>
              {total !== null ? total : 'Loading...'}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, maxWidth: 275, backgroundColor: 'ghostwhite' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
              Total Hourly Value of Active Vehicles:
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 24 }}>
              ${value !== null ? value : 'Loading...'}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <div style={{display: "flex", justifyContent: "space-around"}}>
        <p style={{width: "15%", textAlign: "left", marginTop: "40px"}}>Active Vehicles</p>
        <p style={{width: "15%", textAlign: "right", marginTop: "40px"}}>Exited Vehicles</p>
      </div>


      <div style={{display: "flex", justifyContent: "space-between"}}>

      <TableContainer sx={{width: "45%", alignContent: "left", backgroundColor: 'ghostwhite'}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>Entry ID</TableCell>
            <TableCell align="right">License Plate</TableCell>
            <TableCell align="right">Enter Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries?.map((plate:any) => (
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.id}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.enterTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
      </TableContainer>

      
      <TableContainer sx={{width: "45%", alignContent: "right", backgroundColor: 'ghostwhite'}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table 2">
        <TableHead>
          <TableRow sx={{backgroundColor: '#bfbfbf'}}>
            <TableCell>Entry ID</TableCell>
            <TableCell align="right">License Plate</TableCell>
            <TableCell align="right">Entry Time</TableCell>
            <TableCell align="right">Exit Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exits?.map((plate:any) => (
              <TableRow key={plate.id}>
                <TableCell sx={{backgroundColor: 'ghostwhite'}}>{plate.id}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{plate.licensePlate}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.enterTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                <TableCell sx={{backgroundColor: 'ghostwhite'}} align="right">{moment(plate.exitTime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
              </TableRow>
          ))}

        </TableBody>
      </Table>
      </TableContainer>

      </div>
    </div>
  );
}

export default Dashboard;
