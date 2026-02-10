import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Settings,
  ExitToApp,
  Warehouse,
  LocationOn,
  Layers,
  Storage,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const WarehouseConfigDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordError('');
        setTimeout(() => {
          setOpenPasswordDialog(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      setPasswordError('Failed to change password');
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                Warehouse Configuration System
              </Typography>
              <Typography variant="h6" sx={{ color: '#666' }}>
                Welcome, {user?.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Username: {user?.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setOpenPasswordDialog(true)}
                sx={{ borderRadius: '12px' }}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
            Configuration Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Warehouse configuration system content will be displayed here...
          </Typography>
        </Paper>

        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WarehouseConfigDashboard;
