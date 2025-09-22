import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, IconButton, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, MenuItem } from '@mui/material';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ArrowBack, Print, Save, Visibility, Clear, Add, Edit } from '@mui/icons-material';
import { fetchFeeStructure, getFeeBreakdown } from '../utils/feeUtils';
import useSessionTimeout from '../hooks/useSessionTimeout';
import TeacherHeader from '../components/TeacherHeader';
import SessionTimeoutWarning from '../components/SessionTimeoutWarning';
import { useLanguage } from '../context/LanguageContext';
import { useTeacher } from '../context/TeacherContext';
import { translations } from '../translations';

// Import the logo
import logo from "../assets/SDHJC_Logo.png"; // Adjust the path based on your project structure

const getParticulars = (language) => {
  const t = translations[language]?.feeCollection?.particulars;
  if (t) {
    return [
      t.admissionFee,
      t.academicFee,
      t.examFee,
      t.tutorialFee,
      t.libraryFee,
      t.laboratoryFee,
      t.gymFee,
      t.developmentFee,
      t.idCardFee,
      t.bonafideCertificateFee,
      t.leavingCertificateFee,
      t.duplicateLeavingCertificateFee,
      t.transportation,
      t.penalty,
      t.trainingProgramFee,
      t.sportsCulturalFee,
    ];
  }
  
  // Fallback based on language
  if (language === 'mr') {
    return [
      "प्रवेश फी",
      "शैक्षणिक फी",
      "परीक्षा फी",
      "ट्यूटोरियल फी",
      "ग्रंथालय फी",
      "प्रयोगशाळा फी",
      "व्यायामशाळा फी",
      "विकास फी",
      "ओळखपत्र फी",
      "बोनाफाईड प्रमाणपत्र फी",
      "सोडपत्र फी",
      "डुप्लिकेट सोडपत्र फी",
      'वाहतूक',
      'दंड',
      "प्रशिक्षण कार्यक्रम फी",
      "खेळ दिवस आणि सांस्कृतिक दिवस फी",
    ];
  } else {
    return [
      "Admission Fee's",
      "Academic Fee's",
      "Exam. Fee's",
      "Tutorial Fee's",
      "Library Fee's",
      "Laboratory Fee's",
      "Gym Fee's",
      "Development Fee's",
      "ID card Fee's",
      "Bonafide Certificate Fee's",
      "Leaving Certificate Fee's",
      "Duplicate Leaving Certificate Fee's",
      'Transportation',
      'Penalty',
      "Training Program Fee's",
      "Sports Day & Cultural Day Fee's",
    ];
  }
};

// Department configurations
const getDepartments = (language) => {
  const t = translations[language]?.feeCollection?.departments;
  if (t) {
    return {
      highSchool: {
        name: t.highSchool,
        classes: ['5th', '6th', '7th', '8th', '9th', '10th']
      },
      college: {
        name: t.college,
        classes: ['11th', '12th', 'FYJC', 'SYJC']
      },
      marathiSchool: {
        name: t.marathiSchool,
        classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      },
      kindergarten: {
        name: t.kindergarten,
        classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG']
      }
    };
  }
  
  // Fallback based on language
  if (language === 'mr') {
    return {
      highSchool: {
        name: 'हायस्कूल',
        classes: ['5th', '6th', '7th', '8th', '9th', '10th']
      },
      college: {
        name: 'कॉलेज',
        classes: ['11th', '12th', 'FYJC', 'SYJC']
      },
      marathiSchool: {
        name: 'मराठी शाळा',
        classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      },
      kindergarten: {
        name: 'बालवाडी',
        classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG']
      }
    };
  } else {
    return {
      highSchool: {
        name: 'High School',
        classes: ['5th', '6th', '7th', '8th', '9th', '10th']
      },
      college: {
        name: 'College',
        classes: ['11th', '12th', 'FYJC', 'SYJC']
      },
      marathiSchool: {
        name: 'Marathi School',
        classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      },
      kindergarten: {
        name: 'Kindergarten',
        classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG']
      }
    };
  }
};

const SECTION_OPTIONS = ['A', 'B', 'C'];

// Helper to get today's date in yyyy-mm-dd
const getToday = () => {
  const d = new Date();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

function FeeCollectionReceipt() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getTeacherInfo } = useTeacher();
  const t = translations[language]?.feeCollection || (language === 'mr' ? {
    title: 'फी संकलन',
    receiptNo: 'पावती क्रमांक',
    department: 'विभाग',
    class: 'वर्ग',
    section: 'गट',
    academicYear: 'शैक्षणिक वर्ष',
    date: 'दिनांक',
    lastName: 'आडनाव',
    firstName: 'नाव',
    middleName: 'वडिलांचे नाव',
    guardianName: 'पालकाचे नाव',
    caste: 'जात',
    studentName: 'विद्यार्थ्याचे नाव',
    feesName: 'फी नाव',
    amount: 'रक्कम',
    total: 'एकूण',
    totalFee: 'एकूण फी',
    dueFee: 'थकित फी',
    signature: 'स्वाक्षरी',
    feeReceipt: 'फी पावती',
    back: 'परत',
    add: 'जोडा',
    modify: 'सुधारा',
    print: 'प्रिंट',
    selectDepartment: 'विभाग निवडा',
    selectClass: 'वर्ग निवडा'
  } : {
    title: 'Fee Collection',
    receiptNo: 'Receipt No.',
    department: 'Department',
    class: 'Class',
    section: 'Section',
    academicYear: 'Academic Year',
    date: 'Date',
    lastName: 'Last Name',
    firstName: 'First Name',
    middleName: 'Middle Name',
    guardianName: 'Guardian Name',
    caste: 'Caste',
    studentName: 'Student Name',
    feesName: 'Fees Name',
    amount: 'Amount',
    total: 'Total',
    totalFee: 'Total Fee',
    dueFee: 'Due Fee',
    signature: 'Signature',
    feeReceipt: 'Fee Receipt',
    back: 'Back',
    add: 'Add',
    modify: 'Modify',
    print: 'Print',
    selectDepartment: 'Select Department',
    selectClass: 'Select Class'
  });
  const particulars = getParticulars(language);
  const departments = getDepartments(language);
  
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
  
  const [fields, setFields] = useState(() => ({
    no: '',
    department: '',
    class: '',
    section: '',
    year: '',
    date: getToday(),
    lastName: '',
    firstName: '',
    middleName: '',
    guardianName: '',
    caste: '',
    feeRows: getParticulars(language).map((name, idx) => ({ no: idx + 1, name, amount: '', recNo: '' })),
    total: '',
    paidFee: '',
    dueFee: '',
  }));
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const printTimeout = useRef(null);

  // Auto-increment receipt number
  useEffect(() => {
    const fetchLastReceiptNo = async () => {
      const q = query(collection(db, 'feeCollections'), orderBy('no', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastReceipt = querySnapshot.docs[0].data().no;
        const newNo = (parseInt(lastReceipt) + 1).toString();
        setFields((prev) => ({ ...prev, no: newNo }));
      } else {
        setFields((prev) => ({ ...prev, no: '1' }));
      }
    };
    fetchLastReceiptNo();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
    setErrors({ ...errors, [name]: '' });

    // Auto-fetch fee structure when department, class, or year changes
    if (name === 'department' || name === 'class' || name === 'year') {
      const newFields = { ...fields, [name]: value };
      
      if (newFields.department && newFields.class && newFields.year) {
        try {
          const result = await fetchFeeStructure(newFields.department, newFields.class, newFields.year);
          if (result.success) {
            const feeBreakdown = getFeeBreakdown(result.data);
            const newFeeRows = getParticulars(language).map((name, idx) => {
              const matchingFee = feeBreakdown.find(fee => 
                fee.label.toLowerCase().includes(name.toLowerCase().replace("'s", "").replace(".", ""))
              );
              return {
                no: idx + 1,
                name,
                amount: matchingFee ? matchingFee.amount.toString() : '',
                recNo: ''
              };
            });
            
            const total = feeBreakdown.reduce((sum, fee) => sum + fee.amount, 0);
            
            setFields(prev => ({
              ...prev,
              [name]: value,
              feeRows: newFeeRows,
              total: total.toString()
            }));
          }
        } catch (error) {
          console.error('Error fetching fee structure:', error);
        }
      }
    }
  };

  const handleFeeRowChange = (idx, field, value) => {
    const newFeeRows = fields.feeRows.map((row, i) =>
      i === idx ? { ...row, [field]: value.replace(/[^0-9.]/g, '') } : row
    );
    setFields(f => ({ ...f, feeRows: newFeeRows }));
  };

  // Calculate total fee from feeRows (auto-calc unless manually overridden)
  const autoTotal = fields.feeRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  const total = fields.total === '' ? autoTotal : parseFloat(fields.total) || 0;

  const validateForm = () => {
    const newErrors = {};
    if (!fields.no) newErrors.no = 'Receipt No. is required';
    if (!fields.lastName || !fields.firstName || !fields.middleName) newErrors.studentName = 'Student Name is required';
    if (fields.totalPaid && isNaN(parseFloat(fields.totalPaid))) newErrors.totalPaid = 'Must be a valid number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const handlePreview = () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors before previewing', severity: 'error' });
      return;
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors before saving', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Get teacher information
      const teacherInfo = getTeacherInfo();
      
      await addDoc(collection(db, 'feeCollections'), {
        ...fields,
        amounts: fields.amounts.map(a => a || '0'),
        total: total.toFixed(2),
        timestamp: new Date(),
        // Teacher information
        submittedBy: teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown',
        submittedById: teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown',
        submittedByDepartment: teacherInfo?.department || 'Unknown',
        submittedByDesignation: teacherInfo?.designation || 'Unknown',
        submittedByEmployeeId: teacherInfo?.employeeId || 'Unknown',
        submittedAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: 'Fee collection saved successfully!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Error saving data: ' + e.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFields({
      no: fields.no, // Keep the receipt number
      department: '',
      class: '',
      section: '',
      year: '',
      date: getToday(),
      lastName: '',
      firstName: '',
      middleName: '',
      guardianName: '',
      caste: '',
      feeRows: getParticulars(language).map((name, idx) => ({ no: idx + 1, name, amount: '', recNo: '' })),
      total: '',
      paidFee: '',
      dueFee: '',
    });
    setErrors({});
    setOpenClearDialog(false);
    setSnackbar({ open: true, message: 'Form cleared!', severity: 'info' });
  };

  const handleBack = () => {
    navigate('/TeacherDashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ bgcolor: '#f7f5fa', minHeight: '100vh', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Header with session timeout */}
      <TeacherHeader 
        title={t.title}
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
        showBackButton={true}
        onBackClick={() => navigate('/TeacherDashboard')}
      />
      
      <Box sx={{ py: 4 }}>
      <style>{`
        @media print {
          body { background: #fff !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-receipt { display: block !important; }
        }
      `}</style>
      {isPrintMode ? (
        <Box className="print-receipt" sx={{ maxWidth: 700, mx: 'auto', p: 4, bgcolor: '#fff', border: '1px solid #bfa14a', borderRadius: 2, boxShadow: 0 }}>
          {/* School Logo and Name */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={logo} alt="School Logo" style={{ width: 100, marginBottom: 8 }} />
            <Typography variant="subtitle1">
              Kolhapur Arya Samaj Educational Institution's Kolhapur
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Shahu Dayanand High School & Junior College, Kolhapur
            </Typography>
          </Box>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{t.feeReceipt}</h2>
          {fields.no && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <div><b>{t.receiptNo}:</b> {fields.no}</div>
            </Box>
          )}
          {fields.date && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <div><b>{t.date}:</b> {fields.date}</div>
            </Box>
          )}
          {(fields.lastName || fields.firstName || fields.middleName) && (
            <Box sx={{ mb: 1 }}>
              <b>{t.studentName}:</b> {fields.lastName} {fields.firstName} {fields.middleName}
            </Box>
          )}
          {(fields.class || fields.section || fields.year) && (
            <Box sx={{ mb: 1 }}>
              {fields.class && <span><b>{t.class}:</b> {fields.class}  </span>}
              {fields.section && <span><b>{t.section}:</b> {fields.section}  </span>}
              {fields.year && <span><b>{t.academicYear}:</b> {fields.year}</span>}
            </Box>
          )}
          <TableContainer component={Paper} sx={{ boxShadow: 0, border: '1px solid #bfa14a', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>{t.feesName}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.feeRows
                  .filter(row => row.amount)
                  .map((row) => (
                    <TableRow key={row.no}>
                      <TableCell>{row.no}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                    </TableRow>
                  ))}
                {total > 0 && (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 700 }}>{t.total}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{total}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ textAlign: 'right', mt: 4 }}>
            <b>{t.signature}</b>
          </Box>
        </Box>
      ) : (
        <>
          <Box className="no-print" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button onClick={handleBack} startIcon={<ArrowBack />} variant="outlined" sx={{ mr: 2 }}>
              {t.back}
            </Button>
            <h1 style={{ flex: 1, textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#3d246c', margin: 0 }}>{t.title}</h1>
          </Box>
          {/* Top Bar */}
          <Paper elevation={0} sx={{ borderRadius: 3, bgcolor: '#3d246c', mb: 4, mx: 'auto', maxWidth: 1100, p: 0, height: 70, display: 'flex', alignItems: 'center', px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 14, height: 14, bgcolor: '#fff', borderRadius: '50%' }} />
              <Box sx={{ width: 14, height: 14, bgcolor: '#f7c873', borderRadius: '50%' }} />
              <Box sx={{ width: 14, height: 14, bgcolor: '#7ed957', borderRadius: '50%' }} />
            </Box>
          </Paper>
          <Paper elevation={2} sx={{ borderRadius: 3, maxWidth: 1100, mx: 'auto', p: 4, bgcolor: '#fff' }}>
            {/* Form Row 1 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={2}>
                <TextField label={t.receiptNo} name="no" value={fields.no} fullWidth size="small" disabled />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField select label={t.department} name="department" value={fields.department} onChange={handleChange} fullWidth size="small">
                  <MenuItem value="">{t.selectDepartment}</MenuItem>
                  {Object.entries(departments).map(([key, dept]) => (
                    <MenuItem key={key} value={key}>{dept.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField select label={t.class} name="class" value={fields.class} onChange={handleChange} fullWidth size="small" disabled={!fields.department}>
                  <MenuItem value="">{t.selectClass}</MenuItem>
                  {fields.department && departments[fields.department]?.classes.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField select label={t.section} name="section" value={fields.section} onChange={handleChange} fullWidth size="small">
                  {SECTION_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label={t.academicYear} name="year" value={fields.year} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label={t.date} name="date" value={fields.date} onChange={handleChange} fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            {/* Form Row 2 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField label={t.lastName} name="lastName" value={fields.lastName} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label={t.firstName} name="firstName" value={fields.firstName} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label={t.middleName} name="middleName" value={fields.middleName} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label={t.caste} name="caste" value={fields.caste} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label={t.guardianName} name="guardianName" value={fields.guardianName} onChange={handleChange} fullWidth size="small" />
              </Grid>
            </Grid>
            {/* Table and Summary */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 0, border: '1px solid #eee' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>{t.feesName}</TableCell>
                        <TableCell>{t.amount}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.feeRows.map((row, idx) => (
                        <TableRow key={row.no}>
                          <TableCell>{row.no}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            <TextField
                              value={row.amount}
                              onChange={e => handleFeeRowChange(idx, 'amount', e.target.value)}
                              size="small"
                              inputProps={{ inputMode: 'numeric', pattern: '[0-9.]*', style: { width: 70 } }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} sx={{ fontWeight: 700 }}>{t.total}</TableCell>
                        <TableCell colSpan={2}>
                          <TextField
                            value={total}
                            onChange={e => setFields(f => ({ ...f, total: e.target.value.replace(/[^0-9.]/g, '') }))}
                            size="small"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9.]*', style: { width: 90, fontWeight: 700 } }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 1, border: '1px solid #eee' }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{t.totalFee}</Typography>
                      <TextField fullWidth size="small" sx={{ mt: 1 }} disabled />
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #eee' }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{t.dueFee}</Typography>
                      <TextField fullWidth size="small" sx={{ mt: 1 }} value={fields.dueFee} name="dueFee" onChange={handleChange} />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }} className="no-print">
              <Button variant="contained" color="success" startIcon={<Add />} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16, borderRadius: 2 }}>{t.add}</Button>
              <Button variant="contained" color="warning" startIcon={<Edit />} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16, borderRadius: 2 }}>{t.modify}</Button>
              <Button variant="contained" color="inherit" startIcon={<Print />} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16, borderRadius: 2, bgcolor: '#e6e6e6' }} onClick={handlePrint}>{t.print}</Button>
            </Box>
          </Paper>
          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
          <Dialog open={openClearDialog} onClose={() => setOpenClearDialog(false)}>
            <DialogTitle>{language === 'mr' ? 'फॉर्म साफ करा' : 'Clear Form'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {language === 'mr' ? 'तुम्हाला खात्री आहे की तुम्ही सर्व फील्ड साफ करू इच्छिता? ही क्रिया पूर्ववत करता येणार नाही.' : 'Are you sure you want to clear all fields? This action cannot be undone.'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenClearDialog(false)} color="primary">
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </Button>
              <Button onClick={handleClear} color="error" autoFocus>
                {language === 'mr' ? 'साफ करा' : 'Clear'}
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Session Timeout Warning */}
          <SessionTimeoutWarning
            open={showWarning}
            onExtend={handleExtendSession}
            onLogout={handleLogout}
            remainingMinutes={remainingMinutes}
            totalMinutes={30}
          />
        </>
      )}
      </Box>
    </Box>
  );
}

export default FeeCollectionReceipt;