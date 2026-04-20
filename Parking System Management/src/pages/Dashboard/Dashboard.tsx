import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FlexAlignBottom } from '@untitledui/icons';


function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Quick overview of your parking garage</p>
      <div style = {{
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left'
      }}>
        <Card sx={{ minWidth: 275, maxWidth: 275, backgroundColor: 'ghostwhite' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
              Total Vehicle Count:
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 24 }}>
              Like 5 idk
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, maxWidth: 275, backgroundColor: 'ghostwhite' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
              Total Value of Customers:
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 24 }}>
              6 maybe 7 dollars
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
