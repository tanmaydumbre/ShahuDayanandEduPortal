import React, { useState } from 'react';
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Styled components for enhanced visuals
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
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
  background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1b5e20 30%, #388e3c 90%)',
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

const steps = ['Personal Information', 'Professional Details', 'Account Setup'];

function TeacherSignUp() {
  const { language } = useLanguage();
  const t = translations[language]?.teacherSignUp || {};
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Details
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    subject: '',
    joiningDate: '',
    salary: '',
    
    // Account Setup
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Personal Information
        return formData.firstName && formData.lastName && formData.email && 
               formData.phone && formData.dateOfBirth && formData.gender;
      case 1: // Professional Details
        return formData.employeeId && formData.department && formData.designation && 
               formData.qualification && formData.subject;
      case 2: // Account Setup
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Prepare teacher data for Firestore
      const teacherData = {
        // Personal Information
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        
        // Professional Details
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        qualification: formData.qualification,
        experience: formData.experience,
        subject: formData.subject,
        joiningDate: formData.joiningDate,
        salary: formData.salary,
        
        // Account Information
        uid: user.uid,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        role: 'teacher',
        
        // Additional metadata
        lastLoginAt: serverTimestamp(),
        loginCount: 0,
        createdBy: 'self',
        createdByName: `${formData.firstName} ${formData.lastName}`,
      };

      // Save teacher data to Firestore
      await setDoc(doc(db, 'teachers', user.uid), teacherData);

      // Store teacher data in localStorage for immediate use
      localStorage.setItem('teacherData', JSON.stringify(teacherData));
      localStorage.setItem('teacherEmail', formData.email);
      localStorage.setItem('teacherName', `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem('teacherId', user.uid);

      setSuccess(true);
      setTimeout(() => {
        navigate('/TeacherDashboard');
      }, 2000);

    } catch (error) {
      console.error('Error creating teacher account:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'नाव' : 'First Name'}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'आडनाव' : 'Last Name'}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'ईमेल' : 'Email'}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'फोन नंबर' : 'Phone Number'}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="+91XXXXXXXXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'जन्मतारीख' : 'Date of Birth'}
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{language === 'mr' ? 'लिंग' : 'Gender'}</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label={language === 'mr' ? 'लिंग' : 'Gender'}
                >
                  <MenuItem value="male">{language === 'mr' ? 'पुरुष' : 'Male'}</MenuItem>
                  <MenuItem value="female">{language === 'mr' ? 'महिला' : 'Female'}</MenuItem>
                  <MenuItem value="other">{language === 'mr' ? 'इतर' : 'Other'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पत्ता' : 'Address'}
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'शहर' : 'City'}
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'राज्य' : 'State'}
                name="state"
                value={formData.state}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पिन कोड' : 'Pincode'}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );

      case 1: // Professional Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'कर्मचारी आयडी' : 'Employee ID'}
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{language === 'mr' ? 'विभाग' : 'Department'}</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label={language === 'mr' ? 'विभाग' : 'Department'}
                >
                  <MenuItem value="highSchool">{language === 'mr' ? 'हायस्कूल' : 'High School'}</MenuItem>
                  <MenuItem value="college">{language === 'mr' ? 'कॉलेज' : 'College'}</MenuItem>
                  <MenuItem value="marathiSchool">{language === 'mr' ? 'मराठी शाळा' : 'Marathi School'}</MenuItem>
                  <MenuItem value="kindergarten">{language === 'mr' ? 'बालवाडी' : 'Kindergarten'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पदनाम' : 'Designation'}
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'शैक्षणिक पात्रता' : 'Qualification'}
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'अनुभव (वर्षे)' : 'Experience (Years)'}
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'विषय' : 'Subject'}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'सामील होण्याची तारीख' : 'Joining Date'}
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पगार' : 'Salary'}
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );

      case 2: // Account Setup
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पासवर्ड' : 'Password'}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                helperText={language === 'mr' ? 'किमान 6 वर्ण' : 'Minimum 6 characters'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={language === 'mr' ? 'पासवर्ड पुष्टी करा' : 'Confirm Password'}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                variant="outlined"
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={
                  formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                    ? (language === 'mr' ? 'पासवर्ड जुळत नाही' : 'Passwords do not match')
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-picture-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {language === 'mr' ? 'प्रोफाइल चित्र अपलोड करा' : 'Upload Profile Picture'}
                </Button>
              </label>
              {formData.profilePicture && (
                <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                  {formData.profilePicture.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <StyledContainer maxWidth="sm">
        <Fade in timeout={600}>
          <StyledPaper elevation={3}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
                {language === 'mr' ? 'खाते यशस्वीरित्या तयार केले!' : 'Account Created Successfully!'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {language === 'mr' ? 'तुम्हाला शिक्षक डॅशबोर्डवर पुनर्निर्देशित केले जाईल...' : 'Redirecting to Teacher Dashboard...'}
              </Typography>
              <CircularProgress />
            </Box>
          </StyledPaper>
        </Fade>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <Fade in timeout={600}>
        <StyledPaper elevation={3}>
          <LogoBox>
            <SchoolIcon />
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 700, color: 'primary.main' }}>
              {language === 'mr' ? 'शिक्षक नोंदणी' : 'Teacher Registration'}
            </Typography>
          </LogoBox>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 4 }}
          >
            {language === 'mr' ? 'शिक्षक साइन अप' : 'Teacher Sign Up'}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {language === 'mr' ? 'मागे' : 'Back'}
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading || !validateStep(activeStep)}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading 
                    ? (language === 'mr' ? 'तयार करत आहे...' : 'Creating Account...') 
                    : (language === 'mr' ? 'खाते तयार करा' : 'Create Account')
                  }
                </StyledButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateStep(activeStep)}
                >
                  {language === 'mr' ? 'पुढे' : 'Next'}
                </Button>
              )}
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                {language === 'mr' ? 'आधीपासून खाते आहे?' : 'Already have an account?'}{' '}
                <Link component={RouterLink} to="/teacher-login" color="primary">
                  {language === 'mr' ? 'येथे लॉगिन करा' : 'Login here'}
                </Link>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </Fade>
    </StyledContainer>
  );
}

export default TeacherSignUp;