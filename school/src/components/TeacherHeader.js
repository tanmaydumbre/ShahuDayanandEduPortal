import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Logout,
  AccountCircle,
  Timer,
  Settings,
  Dashboard,
  School
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TeacherHeader = ({ 
  title, 
  onLogout, 
  remainingMinutes, 
  showBackButton = false, 
  onBackClick 
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const teacherName = localStorage.getItem('teacherName') || 'Teacher';
  const teacherEmail = localStorage.getItem('teacherEmail') || '';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/TeacherDashboard');
  };

  const getSessionColor = () => {
    if (remainingMinutes <= 5) return '#d32f2f';
    if (remainingMinutes <= 10) return '#f57c00';
    return '#2e7d32';
  };

  const getSessionText = () => {
    if (remainingMinutes <= 5) return 'Critical';
    if (remainingMinutes <= 10) return 'Warning';
    return 'Active';
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {showBackButton && (
            <Button
              onClick={onBackClick}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
              size="small"
            >
              ← Back
            </Button>
          )}
          
          <School sx={{ fontSize: 32, color: '#ffd54f' }} />
          
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Teacher Portal
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Session Timeout Indicator */}
          <Tooltip title={`Session expires in ${remainingMinutes} minutes`}>
            <Chip
              icon={<Timer sx={{ fontSize: 16 }} />}
              label={`${remainingMinutes}m`}
              size="small"
              sx={{
                bgcolor: getSessionColor(),
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Tooltip>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: '#ffd54f',
                color: '#1a237e',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              {teacherName.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {teacherName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {teacherEmail}
              </Typography>
            </Box>

            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: 'white' }}
            >
              <AccountCircle />
            </IconButton>
          </Box>

          {/* Quick Logout Button */}
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={handleDashboard} sx={{ py: 1.5 }}>
          <Dashboard sx={{ mr: 2, color: '#1a237e' }} />
          Dashboard
        </MenuItem>
        
        <Divider />
        
        <MenuItem sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Timer sx={{ color: getSessionColor() }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Session Status: {getSessionText()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {remainingMinutes} minutes remaining
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#d32f2f' }}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default TeacherHeader;
