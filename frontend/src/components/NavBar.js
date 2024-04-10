import React from 'react';
import { 
    Container, 
    AppBar, 
    Toolbar, 
    Typography,
    Button
  } from '@mui/material';

import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <Container component="main" maxWidth="lg">
      <AppBar style={{ height: '64px' }}>
        <Toolbar style={{ justifyContent: 'space-between', backgroundColor: 'black' }}>
          <Typography style={{ marginLeft: '50px', color: 'white' }}>JALFLOW</Typography>
          <Button style={{ color: 'white' }} component={Link} to={'/'}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default NavBar;
