import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  Fade,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';

// Styled components for enhanced visuals
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
  },
  transition: 'all 0.3s ease',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: '3rem',
    color: theme.palette.primary.main,
  },
}));

function TeacherLogin() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [loginMethod, setLoginMethod] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
    setRecaptchaVerifier(verifier);

    return () => {
      if (verifier) {
        verifier.clear();
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginMethodChange = (event, newValue) => {
    setLoginMethod(newValue);
    setError('');
  };

  const saveTeacherData = async (user) => {
    try {
      // Check if teacher data exists in Firestore
      const q = query(collection(db, 'teachers'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Teacher data exists, update last login info
        const teacherDoc = querySnapshot.docs[0];
        const teacherData = teacherDoc.data();
        
        await updateDoc(doc(db, 'teachers', teacherDoc.id), {
          lastLoginAt: serverTimestamp(),
          loginCount: (teacherData.loginCount || 0) + 1,
          updatedAt: serverTimestamp(),
        });

        // Store teacher data in localStorage
        localStorage.setItem('teacherData', JSON.stringify(teacherData));
        localStorage.setItem('teacherEmail', teacherData.email);
        localStorage.setItem('teacherName', teacherData.fullName || `${teacherData.firstName} ${teacherData.lastName}`);
        localStorage.setItem('teacherId', user.uid);
      } else {
        // Teacher data doesn't exist, create basic entry
        const basicTeacherData = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Unknown Teacher',
          firstName: user.displayName?.split(' ')[0] || 'Unknown',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || 'Teacher',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          loginCount: 1,
          isActive: true,
          role: 'teacher',
          department: 'general',
          designation: 'Teacher',
        };

        await updateDoc(doc(db, 'teachers', user.uid), basicTeacherData);

        // Store basic teacher data in localStorage
        localStorage.setItem('teacherData', JSON.stringify(basicTeacherData));
        localStorage.setItem('teacherEmail', user.email);
        localStorage.setItem('teacherName', basicTeacherData.fullName);
        localStorage.setItem('teacherId', user.uid);
      }
    } catch (error) {
      console.error('Error saving teacher data:', error);
      // Continue with login even if saving fails
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Save teacher data
      await saveTeacherData(user);
      
      navigate('/TeacherDashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!verificationId) {
        const result = await signInWithPhoneNumber(auth, formData.phone, recaptchaVerifier);
        setConfirmationResult(result);
        setVerificationId(result.verificationId);
        setError('OTP sent successfully!');
      } else {
        const credential = await confirmationResult.confirm(formData.otp);
        if (credential.user) {
          // Save teacher data
          await saveTeacherData(credential.user);
          navigate('/TeacherDashboard');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Fade in timeout={600}>
        <StyledPaper elevation={3}>
          <LogoBox>
            <SchoolIcon />
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 700, color: 'primary.main' }}>
              Teacher Portal
            </Typography>
          </LogoBox>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 4 }}
          >
            {language === 'mr' ? 'शिक्षक लॉगिन' : 'Teacher Login'}
          </Typography>

          <Tabs
            value={loginMethod}
            onChange={handleLoginMethodChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Email Login" />
            <Tab label="Phone Login" />
          </Tabs>

          {error && (
            <Alert severity={error.includes('successfully') ? 'success' : 'error'} sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={loginMethod === 0 ? handleEmailLogin : handlePhoneLogin}>
            {loginMethod === 0 ? (
              <>
                <TextField
                  fullWidth
                  label={language === 'mr' ? 'ईमेल' : 'Email'}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label={language === 'mr' ? 'पासवर्ड' : 'Password'}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  placeholder="+91XXXXXXXXXX"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                {verificationId && (
                  <TextField
                    fullWidth
                    label="OTP"
                    name="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                )}
              </>
            )}

            <div id="recaptcha-container"></div>

            <StyledButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : verificationId ? (
                'Verify OTP'
              ) : (
                loginMethod === 0 ? 'Login' : 'Send OTP'
              )}
            </StyledButton>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/forgot-password" color="primary" sx={{ display: 'block', mb: 1 }}>
                {language === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot Password?'}
              </Link>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/teacher-signup" color="primary">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </Fade>
    </StyledContainer>
  );
}

export default TeacherLogin;