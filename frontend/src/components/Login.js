import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, makeStyles, Snackbar } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 100,
    padding: 20,
  },
  formControl: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/sitedisplay', { replace: true }); // Navigate to '/sitedisplay' and replace the current entry in the history
      } else {
        setLoginError(data.message || 'Login failed.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login.');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          className={classes.formControl}
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          className={classes.formControl}
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </CardContent>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Username and password are required."
      />
      <Snackbar
        open={!!loginError}
        autoHideDuration={6000}
        onClose={() => setLoginError('')}
        message={loginError}
      />
    </Card>
  );
};

export default Login;
