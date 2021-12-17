import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import NoteIcon from '@mui/icons-material/Note';
import VideocamIcon from '@mui/icons-material/Videocam';
import ListItemText from '@mui/material/ListItemText';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

export const NavBar = () => {
  const navigate = useNavigate();
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}
          onClick={() => setDrawerOpened(!drawerOpened)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor='left'
          open={drawerOpened}
          onClose={() => setDrawerOpened(!drawerOpened)}
        >
          <Box
            sx={{ width: 250 }}
            role='presentation'
            onClick={() => setDrawerOpened(!drawerOpened)}
          >
            <List>
              <ListItem button onClick={() => navigate('/')}>
                <ListItemIcon>
                  <VideocamIcon />
                </ListItemIcon>
                <ListItemText primary='New session' />
              </ListItem>
              <ListItem button onClick={() => navigate('/note/test_session')}>
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText primary='Notes' />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Focuser
        </Typography>
        <Button color='inherit'>Hello Hieu</Button>
      </Toolbar>
    </AppBar>
  );
};
