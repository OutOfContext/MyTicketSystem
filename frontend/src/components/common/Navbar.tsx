import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin, isSupport } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ConfirmationNumberIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IT Support Ticket System
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              Tickets
            </Button>
            <Button color="inherit" onClick={() => navigate('/my-tickets')}>
              My Tickets
            </Button>
            {isSupport && (
              <Button color="inherit" onClick={() => navigate('/assigned-tickets')}>
                Assigned to Me
              </Button>
            )}
            {isAdmin && (
              <Button color="inherit" onClick={() => navigate('/users')}>
                Users
              </Button>
            )}
            <Typography variant="body2" sx={{ ml: 2 }}>
              {user.fullName} ({user.role})
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
