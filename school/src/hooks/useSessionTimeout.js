import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const useSessionTimeout = (timeoutMinutes = 30) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('teacherEmail');
      localStorage.removeItem('teacherName');
      localStorage.removeItem('teacherId');
      navigate('/teacher-login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/teacher-login');
    }
  }, [navigate]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleActivity, resetTimer]);

  // Manual logout function
  const logout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleLogout();
  }, [handleLogout]);

  // Get remaining time in minutes
  const getRemainingTime = useCallback(() => {
    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = (timeoutMinutes * 60 * 1000) - elapsed;
    return Math.max(0, Math.floor(remaining / 1000 / 60));
  }, [timeoutMinutes]);

  return {
    logout,
    getRemainingTime,
    resetTimer
  };
};

export default useSessionTimeout;
