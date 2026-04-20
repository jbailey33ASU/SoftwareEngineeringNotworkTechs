import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  plate: string,
  owner: string,
) {
  return { plate, owner};
}

const rows = [
  createData('plate1', "john pork"),
  createData('plate2', "spongebob"),
  createData('plate4', "kanye west"),
  createData('plate5', "dave blunts"),
];

function CurrentVehicles() {
  return (
    <div>
      <h1>CurrentVehicles</h1>
      <p>Quick overview of the current vehicles in the parking garage</p>
      <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>License Plate</TableCell>
            <TableCell align="right">Owner</TableCell>
            {/*
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.plate}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.plate}
              </TableCell>
              <TableCell align="right">{row.owner}</TableCell>
              {/*
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              */}
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
