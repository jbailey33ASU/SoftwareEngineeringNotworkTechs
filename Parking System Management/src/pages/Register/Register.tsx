import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux-hooks";
import { register } from "../../slices/authSlice";

const Register = () => {
  const dispatch = useAppDispatch();
  const [user_id, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (user_id && password) {
      try {
        await dispatch(
          register({
            user_id,
            password,
          })
        ).unwrap();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Show an error message.
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>

                <TextField
                margin="normal"
                required
                fullWidth
                id="user_id"
                label="User ID"
                name="user_id"
                autoFocus
                value={user_id}
                onChange={(e) => setUserID(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;