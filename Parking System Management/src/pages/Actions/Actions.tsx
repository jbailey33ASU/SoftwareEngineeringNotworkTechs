import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { insertPlate, deletePlate } from "../../api.tsx"

function Actions() {

    const submitPlate = () => {
        const licensePlate = (document.getElementById("licenseplate") as HTMLInputElement).value;
        const discountID = Number((document.getElementById("discountid") as HTMLInputElement).value);
        const discountStart = (document.getElementById("discountstart") as HTMLInputElement).value;
        const discountEnd = (document.getElementById("discountend") as HTMLInputElement).value;
        const enterTime = (document.getElementById("entertime") as HTMLInputElement).value;
        const exitTime = (document.getElementById("exittime") as HTMLInputElement).value;
        var Plate:any = {};
        Plate.licensePlate = licensePlate;
        Plate.discountID = discountID;
        Plate.discountStart = discountStart;
        Plate.discountEnd = discountEnd;
        Plate.enterTime = enterTime;
        Plate.exitTime = exitTime;

        insertPlate(Plate);
    }

    const removePlate = () => {
        const licensePlate = (document.getElementById("licenseplate") as HTMLInputElement).value;

        deletePlate(licensePlate);
    }

  return (
    <div>
      <div style={{display: "grid", alignContent: "center", justifyContent: "space-around"}}>
        <h1>Actions</h1>
        <p>Manual entry/removal of a license plate</p>
        </div>

<Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="licenseplate"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <TextField
          id="discountid"
          label="Discount ID"
          name="discountID"
          defaultValue=""
        />
        <TextField
          id="discountstart"
          label="Discount Start"
          name="discountStart"
          defaultValue=""
        />
        <TextField
          id="discountend"
          label="Discount End"
          name="discountEnd"
          defaultValue=""
        />
        <TextField
          required
          id="entertime"
          name="enterTime"
          label="Entrance Time"
          defaultValue=""
        />
        <TextField
          id="exittime"
          label="Exit Time"
          name="exitTime"
          defaultValue=""
        />
        <Button variant="contained" onClick={submitPlate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", fontSize: "12pt", height: "55px"}}>Insert</Button>
      </div>  

      <div>
        <TextField
          required
          id="licenseplate"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <Button variant="contained" onClick={removePlate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", fontSize: "12pt", height: "55px"}}>Remove</Button>
      </div>    
    </Box>
    </div>
  );
}

export default Actions;