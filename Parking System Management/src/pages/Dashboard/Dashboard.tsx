import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import {getActiveTotal, getHourlyValue} from '../../api.tsx';

function Dashboard() {

const [total, setTotal] = useState<number | null>(null);

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
              Total Hourly Value of Customers:
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 24 }}>
              ${value !== null ? value : 'Loading...'}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
