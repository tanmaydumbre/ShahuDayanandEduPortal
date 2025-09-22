import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert
} from '@mui/material';
import { Warning, Timer, Logout } from '@mui/icons-material';

const SessionTimeoutWarning = ({ 
  open, 
  onExtend, 
  onLogout, 
  remainingMinutes, 
  totalMinutes = 10 
}) => {
  const [countdown, setCountdown] = useState(remainingMinutes * 60); // Convert to seconds

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, countdown, onLogout]);

  useEffect(() => {
    if (open) {
      setCountdown(remainingMinutes * 60);
    }
  }, [open, remainingMinutes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((countdown / (totalMinutes * 60)) * 100);

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        color: countdown <= 60 ? '#d32f2f' : '#f57c00'
      }}>
        <Warning sx={{ fontSize: 28 }} />
        Session Timeout Warning
      </DialogTitle>
      
      <DialogContent>
        <Alert 
          severity={countdown <= 60 ? "error" : "warning"} 
          sx={{ mb: 2 }}
        >
          Your session will expire soon due to inactivity.
        </Alert>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Timer sx={{ color: countdown <= 60 ? '#d32f2f' : '#f57c00' }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              color: countdown <= 60 ? '#d32f2f' : '#f57c00'
            }}>
              {formatTime(countdown)}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            Time remaining before automatic logout
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: countdown <= 60 ? '#d32f2f' : '#f57c00',
                borderRadius: 4
              }
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          Click "Extend Session" to continue working, or you will be automatically logged out.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onLogout} 
          variant="outlined" 
          color="error"
          startIcon={<Logout />}
          sx={{ minWidth: 120 }}
        >
          Logout Now
        </Button>
        <Button 
          onClick={onExtend} 
          variant="contained" 
          sx={{ 
            minWidth: 140,
            bgcolor: countdown <= 60 ? '#d32f2f' : '#f57c00',
            '&:hover': {
              bgcolor: countdown <= 60 ? '#b71c1c' : '#e65100'
            }
          }}
        >
          Extend Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutWarning;
