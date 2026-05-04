import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { insertPlate, deletePlate, insertDiscount, getDiscounts} from "../../api.tsx"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select'


function Actions() {

  const [discounts, setDiscounts] = useState<any>(null);

  useEffect(() => {
    async function fetchPlates() {
      try {
        const data = await getDiscounts();
        setDiscounts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlates();
  }, []);

    const [discountSelectID, setDiscountSelectID] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setDiscountSelectID(event.target.value as string);
    };

    const submitPlate = () => {
        const licensePlate = (document.getElementById("licenseplate") as HTMLInputElement).value;
        const discountName = (document.getElementById("discountID") as HTMLSelectElement).outerText;
        const discountStart = (document.getElementById("discountstart") as HTMLInputElement).value;
        const discountEnd = (document.getElementById("discountend") as HTMLInputElement).value;
        const enterTime = (document.getElementById("entertime") as HTMLInputElement).value;
        const exitTime = (document.getElementById("exittime") as HTMLInputElement).value;
        var Plate:any = {};
        Plate.licensePlate = licensePlate;
        Plate.discountID = discountName;
        Plate.discountStart = discountStart;
        Plate.discountEnd = discountEnd;
        Plate.enterTime = enterTime;
        Plate.exitTime = exitTime;


        insertPlate(Plate);
    }

    const submitDiscount = () => {
        const discountName = (document.getElementById("discountName") as HTMLInputElement).value;
        const discountPercent = Number((document.getElementById("discountPercent") as HTMLInputElement).value);
        var Discount:any = {};
        Discount.profileName = discountName;
        Discount.discountPercent = discountPercent;

        insertDiscount(Discount);
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
      <div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '130px'}} id="modal-modal-title" variant="h6" component="h2">Plate Entry</Typography>
        <TextField
          required
          id="licenseplate"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <FormControl style={{minWidth: "150px", marginInline: "8px"}}>
        <InputLabel style={{marginTop: "8px"}} id="demo-simple-select-label">Discount</InputLabel>
        <Select style={{marginTop: "8px"}}
          labelId="demo-simple-select-label"
          id="discountID"
          value={discountSelectID}
          label="Age"
          onChange={handleChange}
        >
        {discounts?.map((discount:any, index:number) => (
          <MenuItem value={(index+1)*10}>{discount.profileName}</MenuItem>
        ))}
        </Select>
        </FormControl>
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
        <Button variant="contained" onClick={submitPlate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Insert</Button>
      </div>  

      <div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '130px'}} id="modal-modal-title" variant="h6" component="h2">Plate Removal</Typography>
        <TextField
          required
          id="licenseplate"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <Button variant="contained" onClick={removePlate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Remove</Button>
      </div>    
      <div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '130px'}} id="modal-modal-title" variant="h6" component="h2">Discount Entry</Typography>
        <TextField
          required
          id="discountName"
          name="discountName"
          label="Discount Name"
          defaultValue=""
        />
        <TextField
          required
          id="discountPercent"
          name="discountPercent"
          label="Discount Amount"
          defaultValue=""
        />
        <Button variant="contained" onClick={submitDiscount} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Insert</Button>
      </div>    
    </Box>
    </div>
  );
}

export default Actions;