import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { insertPlate, deletePlate, insertDiscount, getDiscounts, updatePlate, updateDiscount} from "../../api.tsx"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';


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
    const [discountSelectID2, setDiscountSelectID2] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setDiscountSelectID(event.target.value as string);
    };
    const handleChange2 = (event: SelectChangeEvent) => {
      setDiscountSelectID2(event.target.value as string);
    };

    const handleInvalid = (date: string) => {
        var s = moment(date, "MM-DD-YYYY hh:mm:ss A").format("YYYY-MM-DD HH:mm:ss")
        if (s === "Invalid date") {
            s = ""
        }
        return s
    }

    const submitPlate = () => {
        const licensePlate = (document.getElementById("licenseplate") as HTMLInputElement).value;
        const discountName = (document.getElementById("discountID") as HTMLSelectElement).outerText;
        const discountStart = (document.getElementsByName("discountstart")[0] as HTMLInputElement).value;
        const discountEnd = (document.getElementsByName("discountend")[0] as HTMLInputElement).value;
        const enterTime = (document.getElementsByName("entertime")[0] as HTMLInputElement).value;
        const exitTime = (document.getElementsByName("exittime")[0] as HTMLInputElement).value;
        var Plate:any = {};
        Plate.licensePlate = licensePlate;
        Plate.discountID = discountName;
        Plate.discountStart = handleInvalid(discountStart);
        Plate.discountEnd = handleInvalid(discountEnd);
        Plate.enterTime = handleInvalid(enterTime);
        Plate.exitTime = handleInvalid(exitTime);

        console.log(Plate);


        insertPlate(Plate);
    }

    const submitPlateUpdate = () => {
        const licensePlate = (document.getElementById("licenseplate2") as HTMLInputElement).value;
        const discountName = (document.getElementById("discountID2") as HTMLSelectElement).outerText;
        const discountStart = (document.getElementsByName("discountstart2")[0] as HTMLInputElement).value;
        const discountEnd = (document.getElementsByName("discountend2")[0] as HTMLInputElement).value;
        const exitTime = (document.getElementsByName("exittime2")[0] as HTMLInputElement).value;
        var Plate:any = {};
        Plate.licensePlate = licensePlate;
        Plate.discountID = discountName;
        Plate.discountStart = handleInvalid(discountStart);
        Plate.discountEnd = handleInvalid(discountEnd);
        Plate.exitTime = handleInvalid(exitTime);

        console.log(Plate);


        updatePlate(Plate);       
    }

    const submitDiscount = () => {
        const discountName = (document.getElementById("discountName") as HTMLInputElement).value;
        const discountPercent = Number((document.getElementById("discountPercent") as HTMLInputElement).value);
        var Discount:any = {};
        Discount.profileName = discountName;
        Discount.discountPercent = discountPercent;

        insertDiscount(Discount);
    }

    const submitDiscountUpdate = () => {
        const discountName = (document.getElementById("discountName2") as HTMLInputElement).value;
        const discountPercent = Number((document.getElementById("discountPercent2") as HTMLInputElement).value);
        var Discount:any = {};
        Discount.profileName = discountName;
        Discount.discountPercent = discountPercent;

        updateDiscount(Discount);
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
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '150px'}} id="modal-modal-title" variant="h6" component="h2">Plate Entry</Typography>
        <TextField
          required
          id="licenseplate"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <FormControl style={{minWidth: "150px", marginInline: "8px"}}>
        <InputLabel style={{marginTop: "8px"}} id="discount-select">Discount</InputLabel>
        <Select style={{marginTop: "8px"}}
          labelId="discount-select"
          id="discountID"
          value={discountSelectID}
          label="discount"
          onChange={handleChange}
        >
        {discounts?.map((discount:any, index:number) => (
          <MenuItem value={(index+1)*10}>{discount.profileName}</MenuItem>
        ))}
        </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='discountstart' label="Discount Start" />
        </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='discountend' label="Discount End" />
        </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='entertime' label="Entry Time" />
        </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='exittime' label="Exit Time" />
        </DemoContainer>
        </LocalizationProvider>
        <Button variant="contained" onClick={submitPlate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Insert</Button>
      </div>  

<div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '150px'}} id="modal-modal-title" variant="h6" component="h2">Plate Update</Typography>
        <TextField
          required
          id="licenseplate2"
          name="licensePlate"
          label="License Plate"
          defaultValue=""
        />
        <FormControl style={{minWidth: "150px", marginInline: "8px"}}>
        <InputLabel style={{marginTop: "8px"}} id="discount-select-2">Discount</InputLabel>
        <Select style={{marginTop: "8px"}}
          required
          labelId="discount-select-2"
          id="discountID2"
          value={discountSelectID2}
          label="discount2"
          onChange={handleChange2}
        >
        {discounts?.map((discount:any, index:number) => (
          <MenuItem value={(index+1)*10+100}>{discount.profileName}</MenuItem>
        ))}
        </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='discountstart2' label="Discount Start" />
        </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='discountend2' label="Discount End" />
        </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer sx={{marginInline: '8px'}} components={['DateTimePicker']}>
            <DateTimePicker name='exittime2' label="Exit Time" />
        </DemoContainer>
        </LocalizationProvider>
        <Button variant="contained" onClick={submitPlateUpdate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Update</Button>
      </div>

      <div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '150px'}} id="modal-modal-title" variant="h6" component="h2">Plate Removal</Typography>
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
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '150px'}} id="modal-modal-title" variant="h6" component="h2">Discount Entry</Typography>
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

      <div style={{display: 'flex'}}>
        <Typography sx={{marginTop: '16px', marginInline: '8px', minWidth: '130px'}} id="modal-modal-title2" variant="h6" component="h2">Discount Update</Typography>
        <TextField
          required
          id="discountName2"
          name="discountName"
          label="Discount Name"
          defaultValue=""
        />
        <TextField
          required
          id="discountPercent2"
          name="discountPercent"
          label="Discount Amount"
          defaultValue=""
        />
        <Button variant="contained" onClick={submitDiscountUpdate} sx={{backgroundColor: 'black', color: 'white', marginTop: "8px", marginInline: "8px", fontSize: "12pt", height: "55px"}}>Update</Button>
      </div>    
    </Box>
    </div>
  );
}

export default Actions;