import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TicketList from './components/tickets/TicketList';
import TicketDetail from './components/tickets/TicketDetail';
import TicketEditor from './components/tickets/TicketEditor';
import UserManagement from './components/users/UserManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TicketList filterType="all" />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <TicketList filterType="my" />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/assigned-tickets"
              element={
                <PrivateRoute requiredRole={['SUPPORT', 'ADMIN']}>
                  <TicketList filterType="assigned" />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tickets/new"
              element={
                <PrivateRoute>
                  <TicketEditor />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tickets/edit/:id"
              element={
                <PrivateRoute>
                  <TicketEditor />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tickets/:id"
              element={
                <PrivateRoute>
                  <TicketDetail />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/users"
              element={
                <PrivateRoute requiredRole={['ADMIN']}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
