import * as React from 'react';
import { Link } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import {getPlates} from '../../api.tsx';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Navbar() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    const target = document.getElementsByClassName("form-control me-2")[0] as HTMLInputElement;
    const t = filterPlate();
    console.log(t); 
  }
  const handleClose = () => setOpen(false);

  const [plates, setPlates] = useState<any>(null);

  var filteredPlate = null;

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

  function filterPlate() {
    const newobj = {
      "licensePlate": "Plate not found",
      "enterTime": "Null",
      "exitTime": "Null"
    }
    const target = document.getElementsByClassName("form-control me-2")[0] as HTMLInputElement;
    if(target === undefined) {
      return newobj;
    }
    const lplate = target.value;
    var pl = null
      plates?.map((p: any) => {
        if(p.licensePlate === lplate) {
          pl = p;
        }
      })
      if(pl === null) {
        const newobj = {
          "licensePlate": "Plate not found",
          "enterTime": "Null",
          "exitTime": "Null"
        }
        pl = newobj;
      }
      filteredPlate = pl;
      return pl;
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Parking Management System
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/current">
                Current Vehicles
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/activity">
                Recent Activity
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/permits">
                Discounts
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Plate Lookup"
              aria-label="Search"
            />
            <Button onClick={handleOpen} sx={{backgroundColor: 'white', color: 'green'}}>Search</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    {filterPlate()?.licensePlate}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Entry time: {filterPlate()?.enterTime}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Exit time: {filterPlate()?.exitTime !== null ? filterPlate()?.exitTime : "No exit time"}
                  </Typography>
                </Box>
              </Modal>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
