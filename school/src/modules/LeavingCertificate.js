import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  IconButton, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Divider,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import useSessionTimeout from '../hooks/useSessionTimeout';
import TeacherHeader from '../components/TeacherHeader';
import SessionTimeoutWarning from '../components/SessionTimeoutWarning';
import { 
  ArrowBack, 
  Print, 
  Save, 
  SaveAlt, 
  Description, 
  School, 
  History,
  Visibility,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import logo from '../assets/SDHJC_Logo.png';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

function LeavingCertificate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  // Session timeout functionality
  const { logout, getRemainingTime } = useSessionTimeout(30); // 30 minutes timeout
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(30);

  // Check session status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingTime();
      setRemainingMinutes(remaining);
      
      // Show warning when 5 minutes remaining
      if (remaining <= 5 && remaining > 0) {
        setShowWarning(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  const handleExtendSession = () => {
    setShowWarning(false);
    // The session timeout hook will automatically reset the timer on any activity
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };
  const [certificateHistory, setCertificateHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryCertificate, setSelectedHistoryCertificate] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHistoryPrintModal, setShowHistoryPrintModal] = useState(false);
  
  const [formData, setFormData] = useState({
    registerNumber: '',
    studentFullName: '',
    motherName: '',
    studentId: '',
    raceAndCaste: '',
    subCaste: '',
    nationality: '',
    placeOfBirth: '',
    dateOfBirthWords: '',
    dateOfBirthFigures: '',
    lastSchoolAttended: '',
    dateOfAdmission: '',
    progress: '',
    conduct: '',
    dateOfLeaving: '',
    standardWords: '',
    standardSinceWhen: '',
    reasonOfLeaving: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch certificate history
  const fetchCertificateHistory = async () => {
    setLoadingHistory(true);
    try {
      const q = query(collection(db, 'leavingCertificates'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
      }));
      setCertificateHistory(history);
    } catch (error) {
      console.error('Error fetching certificate history:', error);
      setSnackbar({ open: true, message: 'Error fetching certificate history', severity: 'error' });
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCertificateHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['registerNumber', 'studentFullName', 'motherName', 'studentId', 'nationality', 'dateOfBirthFigures', 'dateOfAdmission', 'dateOfLeaving', 'standardWords', 'standardSinceWhen'];
    const errors = requiredFields.some(field => !formData[field]);
    if (errors) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'leavingCertificates'), {
        ...formData,
        status: 'final',
        timestamp: serverTimestamp(),
        submittedBy: localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: localStorage.getItem('teacherName') || 'Unknown',
      });
      setSnackbar({ open: true, message: 'Leaving Certificate saved successfully!', severity: 'success' });
      fetchCertificateHistory(); // Refresh history
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving certificate: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'leavingCertificates'), {
        ...formData,
        status: 'draft',
        timestamp: serverTimestamp(),
        submittedBy: localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: localStorage.getItem('teacherName') || 'Unknown',
      });
      setSnackbar({ open: true, message: 'Leaving Certificate saved as draft!', severity: 'success' });
      fetchCertificateHistory(); // Refresh history
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving draft: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const handleViewHistory = (certificate) => {
    setSelectedHistoryCertificate(certificate);
    setShowHistoryModal(true);
  };

  const handlePrintHistory = (certificate) => {
    setSelectedHistoryCertificate(certificate);
    setShowHistoryPrintModal(true);
    setTimeout(() => {
      window.print();
      setShowHistoryPrintModal(false);
    }, 100);
  };

  const handleBack = () => {
    navigate('/TeacherDashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{  
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e3f2fd 100%)',
      fontFamily: 'Inter, Arial, sans-serif' 
    }}>
      {/* Header with session timeout */}
      <TeacherHeader 
        title="Leaving Certificate"
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
        showBackButton={true}
        onBackClick={() => navigate('/TeacherDashboard')}
      />
      
      <Box sx={{ py: { xs: 2, sm: 4 } }}>
      <style>{`
        @media print {
          body { background: #fff !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-certificate { display: block !important; }
          .print-certificate { font-family: 'Times New Roman', serif; }
          .leaving-certificate::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            background: url(${logo}) no-repeat center;
            background-size: contain;
            filter: blur(5px);
            opacity: 0.2;
            z-index: -1;
          }
        }
      `}</style>
      
      {printMode ? (
        <Box className="print-certificate leaving-certificate" sx={{ 
          maxWidth: 900, 
          mx: 'auto', 
          p: 4, 
          bgcolor: '#fff', 
          border: '2px solid #000', 
          borderRadius: 0, 
          boxShadow: 0,
          position: 'relative'
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" textAlign="center" sx={{ fontWeight: 'bold', mb: 2 }}>
              Shahu Dayanand High School & Junior College
            </Typography>
            <Typography variant="h8" textAlign="center">Kolhapur, Maharashtra</Typography>
            <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold', mt: 2 }}>
              LEAVING CERTIFICATE
            </Typography>
          </Box>
          <Box sx={{ border: '1px solid #000', p: 2, mb: 4 }}>
            <Typography sx={{ mb: 1 }}><b>Register Number:</b> {formData.registerNumber || '__________'}</Typography>
            <Typography sx={{ mb: 1 }}><b>Student ID:</b> {formData.studentId || '__________'}</Typography>
          </Box>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>1. Name of Pupil:</b> {formData.studentFullName || '____________________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>2. Name of Mother:</b> {formData.motherName || '____________________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>3. Race and Caste (with Sub-Caste):</b> {formData.raceAndCaste || '__________'} ({formData.subCaste || '__________'})
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>4. Nationality:</b> {formData.nationality || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>5. Place of Birth:</b> {formData.placeOfBirth || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>6. Date of Birth:</b> {formData.dateOfBirthWords || '____________________'} ({formData.dateOfBirthFigures || '__________'})
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>7. Last School Attended:</b> {formData.lastSchoolAttended || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>8. Date of Admission:</b> {formData.dateOfAdmission || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>9. Progress:</b> {formData.progress || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>10. Conduct:</b> {formData.conduct || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>11. Date of Leaving School:</b> {formData.dateOfLeaving || new Date().toLocaleDateString('en-GB')}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>12. Standard in which studying and since when:</b> {formData.standardWords || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>13. Reason of Leaving School:</b> {formData.reasonOfLeaving || '__________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>14. Remarks:</b> {formData.remarks || 'N/A'}
          </Typography>
          <Typography sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: '#d32f2f' }}>
            *Warning: No one except the Principal of the school should make any changes in this certificate. Otherwise, legal action will be taken against him.*
          </Typography>
          <Box sx={{ borderTop: '1px solid #000', mt: 4, pt: 2 }}>
            <Typography sx={{ textAlign: 'left', mb: 1 }}>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>Clerk</Typography>
              <Typography>Class Teacher</Typography>
              <Typography>Principal</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {/* Header */}
          <Box className="no-print" sx={{ 
            maxWidth: 1200, 
            mx: 'auto', 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            px: { xs: 2, sm: 3 }, 
            pt: 2 
          }}>
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ 
                color: '#1a237e', 
                borderColor: '#1a237e',
                mr: 2,
                borderRadius: 2,
                '&:hover': { 
                  borderColor: '#0d47a1',
                  backgroundColor: 'rgba(26, 35, 126, 0.04)'
                }
              }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" sx={{ 
              flex: 1, 
              color: '#1a237e', 
              fontWeight: 600,
              textAlign: 'center'
            }}>
              🎓 Leaving Certificate
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
            {/* Summary Card */}
            <Card sx={{ 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Description sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      Leaving Certificate Generator
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Generate official leaving certificates for students with comprehensive details
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ 
                  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                  '& .MuiTab-root': {
                    color: 'white',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: '#ffd54f'
                    }
                  }
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School />
                      Generate Certificate
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge badgeContent={certificateHistory.length} color="error">
                        <History />
                      </Badge>
                      Certificate History
                    </Box>
                  } 
                />
              </Tabs>

                             {/* Tab Content */}
               {activeTab === 0 && (
                 <>
                   {/* Form Card */}
                   <Paper elevation={3} sx={{ 
                     borderRadius: 3, 
                     overflow: 'hidden',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                   }}>
              {/* Form Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                color: 'white',
                p: 3,
                textAlign: 'center'
              }}>
                <School sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Student Information
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Fill in the student details to generate the leaving certificate
                </Typography>
              </Box>

              {/* Form Content */}
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Grid container spacing={3}>
                  {/* Basic Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ 
                      color: '#1a237e', 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Chip label="1" size="small" sx={{ bgcolor: '#1a237e', color: 'white' }} />
                      Basic Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Register Number *"
                      name="registerNumber"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Student ID *"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Student Full Name *"
                      name="studentFullName"
                      value={formData.studentFullName}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mother's Name *"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Personal Details Section */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ 
                      color: '#1a237e', 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Chip label="2" size="small" sx={{ bgcolor: '#1a237e', color: 'white' }} />
                      Personal Details
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Race and Caste"
                      name="raceAndCaste"
                      value={formData.raceAndCaste}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Sub Caste"
                      name="subCaste"
                      value={formData.subCaste}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nationality *"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Place of Birth"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth (Words)"
                      name="dateOfBirthWords"
                      value={formData.dateOfBirthWords}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g., First January Two Thousand Five"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth (Figures) *"
                      name="dateOfBirthFigures"
                      type="date"
                      value={formData.dateOfBirthFigures}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Academic Details Section */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ 
                      color: '#1a237e', 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Chip label="3" size="small" sx={{ bgcolor: '#1a237e', color: 'white' }} />
                      Academic Details
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last School Attended"
                      name="lastSchoolAttended"
                      value={formData.lastSchoolAttended}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Admission *"
                      name="dateOfAdmission"
                      type="date"
                      value={formData.dateOfAdmission}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Progress"
                      name="progress"
                      value={formData.progress}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Conduct"
                      name="conduct"
                      value={formData.conduct}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Leaving *"
                      name="dateOfLeaving"
                      type="date"
                      value={formData.dateOfLeaving}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Standard Studying *"
                      name="standardWords"
                      value={formData.standardWords}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      placeholder="e.g., 10th Standard"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Since When *"
                      name="standardSinceWhen"
                      value={formData.standardSinceWhen}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      required
                      placeholder="e.g., June 2023"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Reason of Leaving School"
                      name="reasonOfLeaving"
                      value={formData.reasonOfLeaving}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      placeholder="Enter the reason for leaving the school..."
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="Enter any additional remarks or special notes..."
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  mt: 4, 
                  flexWrap: 'wrap' 
                }} className="no-print">
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ 
                        borderRadius: 2, 
                        minWidth: 140, 
                        fontWeight: 600, 
                        bgcolor: '#1a237e', 
                        '&:hover': { bgcolor: '#0d47a1' },
                        px: 3,
                        py: 1.5
                      }}
                    >
                      Save Certificate
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button
                      variant="contained"
                      startIcon={<SaveAlt />}
                      onClick={handleSaveDraft}
                      disabled={loading}
                      sx={{ 
                        borderRadius: 2, 
                        minWidth: 140, 
                        fontWeight: 600, 
                        bgcolor: '#4a90e2', 
                        '&:hover': { bgcolor: '#357ab7' },
                        px: 3,
                        py: 1.5
                      }}
                    >
                      Save Draft
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button
                      variant="contained"
                      startIcon={<Print />}
                      onClick={handlePrint}
                      disabled={loading}
                      sx={{ 
                        borderRadius: 2, 
                        minWidth: 140, 
                        fontWeight: 600, 
                        bgcolor: '#ff9800', 
                        '&:hover': { bgcolor: '#f57c00' },
                        px: 3,
                        py: 1.5
                      }}
                    >
                      Print Certificate
                    </Button>
                  </motion.div>
                </Box>

                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress sx={{ color: '#1a237e' }} />
                  </Box>
                                 )}
               </Box>
             </Paper>
                 </>
               )}

               {activeTab === 1 && (
                 <>
                   {/* History Card */}
                   <Paper elevation={3} sx={{ 
                     borderRadius: 3, 
                     overflow: 'hidden',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                   }}>
                     {/* History Header */}
                     <Box sx={{ 
                       background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                       color: 'white',
                       p: 3,
                       textAlign: 'center'
                     }}>
                       <History sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                       <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                         Certificate History
                       </Typography>
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         View and manage all previously generated leaving certificates
                       </Typography>
                     </Box>

                     {/* History Content */}
                     <Box sx={{ p: { xs: 2, sm: 4 } }}>
                       {loadingHistory ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                           <CircularProgress sx={{ color: '#1a237e' }} />
                         </Box>
                       ) : certificateHistory.length === 0 ? (
                         <Box sx={{ textAlign: 'center', py: 4 }}>
                           <History sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                           <Typography variant="h6" color="textSecondary">
                             No certificates found
                           </Typography>
                           <Typography variant="body2" color="textSecondary">
                             Generate your first leaving certificate to see it here
                           </Typography>
                         </Box>
                       ) : (
                         <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                           <Table>
                             <TableHead>
                               <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                 <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Register No.</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Student ID</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Date of Leaving</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Generated By</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {certificateHistory.map((certificate) => (
                                 <TableRow key={certificate.id} hover>
                                   <TableCell>
                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                       <Person sx={{ color: '#1a237e', fontSize: 20 }} />
                                       {certificate.studentFullName}
                                     </Box>
                                   </TableCell>
                                   <TableCell>{certificate.registerNumber}</TableCell>
                                   <TableCell>{certificate.studentId}</TableCell>
                                   <TableCell>
                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                       <CalendarToday sx={{ color: '#666', fontSize: 16 }} />
                                       {certificate.dateOfLeaving}
                                     </Box>
                                   </TableCell>
                                   <TableCell>
                                     <Chip 
                                       label={certificate.status === 'final' ? 'Final' : 'Draft'} 
                                       color={certificate.status === 'final' ? 'success' : 'warning'}
                                       size="small"
                                     />
                                   </TableCell>
                                   <TableCell>{certificate.submittedByName || certificate.submittedBy}</TableCell>
                                   <TableCell>
                                     <Box sx={{ display: 'flex', gap: 1 }}>
                                       <Tooltip title="View Certificate">
                                         <IconButton 
                                           onClick={() => handleViewHistory(certificate)}
                                           size="small"
                                           sx={{ color: '#1a237e' }}
                                         >
                                           <Visibility />
                                         </IconButton>
                                       </Tooltip>
                                       <Tooltip title="Print Certificate">
                                         <IconButton 
                                           onClick={() => handlePrintHistory(certificate)}
                                           size="small"
                                           sx={{ color: '#ff9800' }}
                                         >
                                           <Print />
                                         </IconButton>
                                       </Tooltip>
                                     </Box>
                                   </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
                         </TableContainer>
                       )}
                     </Box>
                   </Paper>
                 </>
               )}
             </Paper>
           </Box>

           {/* History View Modal */}
           <Dialog 
             open={showHistoryModal} 
             onClose={() => setShowHistoryModal(false)} 
             maxWidth="md" 
             fullWidth
           >
             <DialogTitle>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Description sx={{ color: '#1a237e' }} />
                 Leaving Certificate - {selectedHistoryCertificate?.studentFullName}
               </Box>
             </DialogTitle>
             <DialogContent>
               {selectedHistoryCertificate && (
                 <Box sx={{ mt: 2 }}>
                   <Grid container spacing={2}>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Student Name:</Typography>
                       <Typography>{selectedHistoryCertificate.studentFullName}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Register Number:</Typography>
                       <Typography>{selectedHistoryCertificate.registerNumber}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Student ID:</Typography>
                       <Typography>{selectedHistoryCertificate.studentId}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Mother's Name:</Typography>
                       <Typography>{selectedHistoryCertificate.motherName}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Nationality:</Typography>
                       <Typography>{selectedHistoryCertificate.nationality}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Date of Leaving:</Typography>
                       <Typography>{selectedHistoryCertificate.dateOfLeaving}</Typography>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Status:</Typography>
                       <Chip 
                         label={selectedHistoryCertificate.status === 'final' ? 'Final' : 'Draft'} 
                         color={selectedHistoryCertificate.status === 'final' ? 'success' : 'warning'}
                         size="small"
                       />
                     </Grid>
                     <Grid item xs={12}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Remarks:</Typography>
                       <Typography>{selectedHistoryCertificate.remarks || 'N/A'}</Typography>
                     </Grid>
                     <Grid item xs={12}>
                       <Divider sx={{ my: 2 }} />
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Generated By:</Typography>
                       <Typography>{selectedHistoryCertificate.submittedByName || selectedHistoryCertificate.submittedBy}</Typography>
                       <Typography variant="body2" color="textSecondary">
                         {selectedHistoryCertificate.timestamp?.toLocaleString()}
                       </Typography>
                     </Grid>
                   </Grid>
                 </Box>
               )}
             </DialogContent>
             <DialogActions>
               <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
               <Button 
                 onClick={() => selectedHistoryCertificate && handlePrintHistory(selectedHistoryCertificate)}
                 variant="contained"
                 startIcon={<Print />}
                 sx={{ bgcolor: '#1a237e' }}
               >
                 Print
               </Button>
             </DialogActions>
           </Dialog>

           {/* History Print Modal */}
           {showHistoryPrintModal && selectedHistoryCertificate && (
             <Box className="print-certificate leaving-certificate" sx={{ 
               maxWidth: 900, 
               mx: 'auto', 
               p: 4, 
               bgcolor: '#fff', 
               border: '2px solid #000', 
               borderRadius: 0, 
               boxShadow: 0,
               position: 'relative'
             }}>
               <Box sx={{ mb: 4 }}>
                 <Typography variant="h4" textAlign="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                   Shahu Dayanand High School & Junior College
                 </Typography>
                 <Typography variant="h8" textAlign="center">Kolhapur, Maharashtra</Typography>
                 <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold', mt: 2 }}>
                   LEAVING CERTIFICATE
                 </Typography>
               </Box>
               <Box sx={{ border: '1px solid #000', p: 2, mb: 4 }}>
                 <Typography sx={{ mb: 1 }}><b>Register Number:</b> {selectedHistoryCertificate.registerNumber || '__________'}</Typography>
                 <Typography sx={{ mb: 1 }}><b>Student ID:</b> {selectedHistoryCertificate.studentId || '__________'}</Typography>
               </Box>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>1. Name of Pupil:</b> {selectedHistoryCertificate.studentFullName || '____________________________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>2. Name of Mother:</b> {selectedHistoryCertificate.motherName || '____________________________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>3. Race and Caste (with Sub-Caste):</b> {selectedHistoryCertificate.raceAndCaste || '__________'} ({selectedHistoryCertificate.subCaste || '__________'})
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>4. Nationality:</b> {selectedHistoryCertificate.nationality || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>5. Place of Birth:</b> {selectedHistoryCertificate.placeOfBirth || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>6. Date of Birth:</b> {selectedHistoryCertificate.dateOfBirthWords || '____________________'} ({selectedHistoryCertificate.dateOfBirthFigures || '__________'})
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>7. Last School Attended:</b> {selectedHistoryCertificate.lastSchoolAttended || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>8. Date of Admission:</b> {selectedHistoryCertificate.dateOfAdmission || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>9. Progress:</b> {selectedHistoryCertificate.progress || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>10. Conduct:</b> {selectedHistoryCertificate.conduct || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>11. Date of Leaving School:</b> {selectedHistoryCertificate.dateOfLeaving || new Date().toLocaleDateString('en-GB')}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>12. Standard in which studying and since when:</b> {selectedHistoryCertificate.standardWords || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>13. Reason of Leaving School:</b> {selectedHistoryCertificate.reasonOfLeaving || '__________'}
               </Typography>
               <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                 <b>14. Remarks:</b> {selectedHistoryCertificate.remarks || 'N/A'}
               </Typography>
               <Typography sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: '#d32f2f' }}>
                 *Warning: No one except the Principal of the school should make any changes in this certificate. Otherwise, legal action will be taken against him.*
               </Typography>
               <Box sx={{ borderTop: '1px solid #000', mt: 4, pt: 2 }}>
                 <Typography sx={{ textAlign: 'left', mb: 1 }}>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                   <Typography>Clerk</Typography>
                   <Typography>Class Teacher</Typography>
                   <Typography>Principal</Typography>
                 </Box>
               </Box>
             </Box>
           )}

           <Snackbar 
             open={snackbar.open} 
             autoHideDuration={6000} 
             onClose={handleCloseSnackbar}
             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
           >
             <Alert 
               onClose={handleCloseSnackbar} 
               severity={snackbar.severity} 
               sx={{ width: '100%', borderRadius: 2 }}
             >
               {snackbar.message}
             </Alert>
           </Snackbar>
           
           {/* Session Timeout Warning */}
           <SessionTimeoutWarning
             open={showWarning}
             onExtend={handleExtendSession}
             onLogout={handleLogout}
             remainingMinutes={remainingMinutes}
             totalMinutes={30}
           />
         </motion.div>
       )}
       </Box>
     </Box>
   );
 };

export default LeavingCertificate;