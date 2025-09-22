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
  DialogContentText,
  DialogActions,
  Tooltip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
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
  Person,
  Delete,
  DeleteSweep
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { useTeacher } from '../context/TeacherContext';
import { translations } from '../translations';

// Import the school logo
import logo from '../assets/SDHJC_Logo.png';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

function BonafideScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getTeacherInfo } = useTeacher();
  const t = translations[language]?.bonafideCertificate || translations?.en?.bonafideCertificate || (language === 'mr' ? {
    title: 'बोनाफाईड प्रमाणपत्र',
    subtitle: 'विद्यार्थ्यांसाठी आवश्यक सर्व तपशीलांसह अधिकृत बोनाफाईड प्रमाणपत्रे तयार करा',
    backToDashboard: 'डॅशबोर्डवर परत जा',
    generateCertificate: 'प्रमाणपत्र तयार करा',
    certificateHistory: 'प्रमाणपत्र इतिहास',
    studentInformation: 'विद्यार्थी माहिती',
    fillStudentDetails: 'बोनाफाईड प्रमाणपत्र तयार करण्यासाठी विद्यार्थ्याचे तपशील भरा',
    studentDetails: 'विद्यार्थी तपशील',
    academicDetails: 'शैक्षणिक तपशील',
    additionalDetails: 'अतिरिक्त तपशील',
    studentName: 'विद्यार्थ्याचे नाव',
    fatherName: 'वडिलांचे नाव',
    motherName: 'आईचे नाव',
    nationality: 'राष्ट्रीयत्व',
    class: 'वर्ग',
    section: 'गट',
    admissionNo: 'प्रवेश क्रमांक',
    attendanceDuringYear: 'वर्षभरातील उपस्थिती',
    dateOfIssue: 'जारी करण्याचा दिनांक',
    dateOfBirth: 'जन्मतारीख',
    registerNumberInWords: 'नोंदणी क्रमांक शब्दात',
    remarks: 'टिप्पण्या',
    remarksPlaceholder: 'कोणत्याही अतिरिक्त टिप्पण्या किंवा विशेष नोंदी प्रविष्ट करा...',
    saveCertificate: 'प्रमाणपत्र जतन करा',
    saveDraft: 'मसुदा जतन करा',
    printCertificate: 'प्रमाणपत्र प्रिंट करा',
    viewAndManage: 'पूर्वी तयार केलेली सर्व बोनाफाईड प्रमाणपत्रे पहा आणि व्यवस्थापित करा',
    noCertificatesFound: 'कोणतीही प्रमाणपत्रे सापडली नाहीत',
    generateFirstCertificate: 'तुमचे पहिले बोनाफाईड प्रमाणपत्र तयार करा ते येथे पाहण्यासाठी',
    actions: 'क्रिया',
    status: 'स्थिती',
    generatedBy: 'द्वारे तयार केले',
    final: 'अंतिम',
    draft: 'मसुदा',
    viewCertificate: 'प्रमाणपत्र पहा',
    close: 'बंद करा',
    print: 'प्रिंट',
    certificateNo: 'प्रमाणपत्र क्रमांक',
    schoolName: 'शाहू दयानंद हायस्कूल आणि ज्युनियर कॉलेज',
    schoolLocation: 'कोल्हापूर, महाराष्ट्र',
    bonafideCertificateTitle: 'बोनाफाईड प्रमाणपत्र',
    principal: 'मुख्याध्यापक',
    sealStamp: 'शिक्का/मुद्रा',
    date: 'दिनांक',
    required: 'आवश्यक',
    fillAllFields: 'कृपया सर्व आवश्यक फील्ड भरा',
    certificateSaved: 'बोनाफाईड प्रमाणपत्र यशस्वीरित्या जतन केले!',
    draftSaved: 'बोनाफाईड प्रमाणपत्र मसुदा म्हणून जतन केले!',
    errorSaving: 'प्रमाणपत्र जतन करताना त्रुटी',
    errorSavingDraft: 'मसुदा जतन करताना त्रुटी',
    errorFetchingHistory: 'प्रमाणपत्र इतिहास आणताना त्रुटी',
    deleteCertificate: 'प्रमाणपत्र हटवा',
    deleteAllCertificates: 'सर्व प्रमाणपत्रे हटवा',
    confirmDelete: 'हटवण्याची पुष्टी करा',
    confirmDeleteMessage: 'तुम्हाला खात्री आहे की तुम्ही हे प्रमाणपत्र हटवू इच्छिता? ही क्रिया पूर्ववत करता येणार नाही.',
    confirmDeleteAllMessage: 'तुम्हाला खात्री आहे की तुम्ही सर्व प्रमाणपत्रे हटवू इच्छिता? ही क्रिया पूर्ववत करता येणार नाही.',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    certificateDeleted: 'प्रमाणपत्र यशस्वीरित्या हटवले!',
    allCertificatesDeleted: 'सर्व प्रमाणपत्रे यशस्वीरित्या हटवली!',
    errorDeleting: 'प्रमाणपत्र हटवताना त्रुटी',
    errorDeletingAll: 'प्रमाणपत्रे हटवताना त्रुटी'
  } : {
    title: 'Bonafide Certificate',
    subtitle: 'Generate official bonafide certificates for students with all required details',
    backToDashboard: 'Back to Dashboard',
    generateCertificate: 'Generate Certificate',
    certificateHistory: 'Certificate History',
    studentInformation: 'Student Information',
    fillStudentDetails: 'Fill in the student details to generate the bonafide certificate',
    studentDetails: 'Student Details',
    academicDetails: 'Academic Details',
    additionalDetails: 'Additional Details',
    studentName: 'Student Name',
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    nationality: 'Nationality',
    class: 'Class',
    section: 'Section',
    admissionNo: 'Admission No.',
    attendanceDuringYear: 'Attendance During Year',
    dateOfIssue: 'Date of Issue',
    dateOfBirth: 'Date of Birth',
    registerNumberInWords: 'Register Number in Words',
    remarks: 'Remarks',
    remarksPlaceholder: 'Enter any additional remarks or special notes...',
    saveCertificate: 'Save Certificate',
    saveDraft: 'Save Draft',
    printCertificate: 'Print Certificate',
    viewAndManage: 'View and manage all previously generated bonafide certificates',
    noCertificatesFound: 'No certificates found',
    generateFirstCertificate: 'Generate your first bonafide certificate to see it here',
    actions: 'Actions',
    status: 'Status',
    generatedBy: 'Generated By',
    final: 'Final',
    draft: 'Draft',
    viewCertificate: 'View Certificate',
    close: 'Close',
    print: 'Print',
    certificateNo: 'Certificate No',
    schoolName: 'Shahu Dayanand High School & Junior College',
    schoolLocation: 'Kolhapur, Maharashtra',
    bonafideCertificateTitle: 'BONAFIDE CERTIFICATE',
    principal: 'Principal',
    sealStamp: 'Seal/Stamp',
    date: 'Date',
    required: 'Required',
    fillAllFields: 'Please fill all required fields',
    certificateSaved: 'Bonafide Certificate saved successfully!',
    draftSaved: 'Bonafide Certificate saved as draft!',
    errorSaving: 'Error saving certificate',
    errorSavingDraft: 'Error saving draft',
    errorFetchingHistory: 'Error fetching certificate history',
    deleteCertificate: 'Delete Certificate',
    deleteAllCertificates: 'Delete All Certificates',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this certificate? This action cannot be undone.',
    confirmDeleteAllMessage: 'Are you sure you want to delete all certificates? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    certificateDeleted: 'Certificate deleted successfully!',
    allCertificatesDeleted: 'All certificates deleted successfully!',
    errorDeleting: 'Error deleting certificate',
    errorDeletingAll: 'Error deleting certificates'
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [certificateHistory, setCertificateHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryCertificate, setSelectedHistoryCertificate] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHistoryPrintModal, setShowHistoryPrintModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [deletingCertificate, setDeletingCertificate] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    class: '',
    section: '',
    admissionNo: '',
    dateOfIssue: new Date().toISOString().split('T')[0],
    dateOfBirth: '',
    nationality: '',
    remarks: '',
    attendanceDuringYear: '',
    registerNumberInWords: '',
  });
  const [loading, setLoading] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch certificate history
  const fetchCertificateHistory = async () => {
    setLoadingHistory(true);
    try {
      const q = query(collection(db, 'bonafideCertificates'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
      }));
      setCertificateHistory(history);
    } catch (error) {
      console.error('Error fetching certificate history:', error);
      setSnackbar({ open: true, message: t.errorFetchingHistory, severity: 'error' });
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
    const requiredFields = ['studentName', 'fatherName', 'class', 'admissionNo', 'dateOfIssue'];
    const errors = requiredFields.some(field => !formData[field]);
    if (errors) {
      setSnackbar({ open: true, message: t.fillAllFields, severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Get teacher information
      const teacherInfo = getTeacherInfo();
      
      await addDoc(collection(db, 'bonafideCertificates'), {
        ...formData,
        status: 'final',
        timestamp: serverTimestamp(),
        submittedBy: teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown',
        submittedById: teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown',
        submittedByDepartment: teacherInfo?.department || 'Unknown',
        submittedByDesignation: teacherInfo?.designation || 'Unknown',
        submittedByEmployeeId: teacherInfo?.employeeId || 'Unknown',
        submittedAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: t.certificateSaved, severity: 'success' });
      fetchCertificateHistory(); // Refresh history
    } catch (error) {
      setSnackbar({ open: true, message: t.errorSaving + ': ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // Get teacher information
      const teacherInfo = getTeacherInfo();
      
      await addDoc(collection(db, 'bonafideCertificates'), {
        ...formData,
        status: 'draft',
        timestamp: serverTimestamp(),
        submittedBy: teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown',
        submittedById: teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown',
        submittedByDepartment: teacherInfo?.department || 'Unknown',
        submittedByDesignation: teacherInfo?.designation || 'Unknown',
        submittedByEmployeeId: teacherInfo?.employeeId || 'Unknown',
        submittedAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: t.draftSaved, severity: 'success' });
      fetchCertificateHistory(); // Refresh history
    } catch (error) {
      setSnackbar({ open: true, message: t.errorSavingDraft + ': ' + error.message, severity: 'error' });
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

  const handleDeleteCertificate = (certificate) => {
    setCertificateToDelete(certificate);
    setShowDeleteDialog(true);
  };

  const handleDeleteAllCertificates = () => {
    setShowDeleteAllDialog(true);
  };

  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return;
    
    setDeletingCertificate(true);
    try {
      await deleteDoc(doc(db, 'bonafideCertificates', certificateToDelete.id));
      setSnackbar({ open: true, message: t.certificateDeleted, severity: 'success' });
      fetchCertificateHistory(); // Refresh history
      setShowDeleteDialog(false);
      setCertificateToDelete(null);
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setSnackbar({ open: true, message: t.errorDeleting + ': ' + error.message, severity: 'error' });
    } finally {
      setDeletingCertificate(false);
    }
  };

  const confirmDeleteAllCertificates = async () => {
    setDeletingCertificate(true);
    try {
      // Delete all certificates in batch
      const deletePromises = certificateHistory.map(certificate => 
        deleteDoc(doc(db, 'bonafideCertificates', certificate.id))
      );
      await Promise.all(deletePromises);
      
      setSnackbar({ open: true, message: t.allCertificatesDeleted, severity: 'success' });
      fetchCertificateHistory(); // Refresh history
      setShowDeleteAllDialog(false);
    } catch (error) {
      console.error('Error deleting all certificates:', error);
      setSnackbar({ open: true, message: t.errorDeletingAll + ': ' + error.message, severity: 'error' });
    } finally {
      setDeletingCertificate(false);
    }
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
      py: { xs: 2, sm: 4 }, 
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e3f2fd 100%)',
      fontFamily: 'Inter, Arial, sans-serif' 
    }}>
      <style>{`
        @media print {
          body { background: #fff !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-certificate { display: block !important; }
          .print-certificate { font-family: 'Times New Roman', serif; }
        }
      `}</style>
      
      {printMode ? (
        <Box className="print-certificate" sx={{ 
          maxWidth: 900, 
          mx: 'auto', 
          p: 4, 
          bgcolor: '#fff', 
          border: '2px solid #000', 
          borderRadius: 0, 
          boxShadow: 0 
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src={logo} alt="School Logo" style={{ width: 100, marginBottom: 8 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t.schoolName}
            </Typography>
            <Typography variant="subtitle1">{t.schoolLocation}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
              {t.bonafideCertificateTitle}
            </Typography>
          </Box>
          <Box sx={{ border: '1px solid #000', p: 2, mb: 4 }}>
            <Typography sx={{ mb: 1 }}><b>{t.certificateNo}:</b> {formData.admissionNo || '__________'}</Typography>
            <Typography sx={{ mb: 1 }}><b>{t.dateOfIssue}:</b> {formData.dateOfIssue}</Typography>
          </Box>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            {language === 'mr' ? 
              `हे प्रमाणित करण्यात येते की ${formData.studentName || '____________________________'}, श्री. ${formData.fatherName || '____________________________'} आणि श्रीमती ${formData.motherName || '____________________________'} यांचा मुलगा/मुलगी, या संस्थेचा बोनाफाईड विद्यार्थी आहे. हा विद्यार्थी ${formData.class} ${formData.section ? `गट ${formData.section}` : ''} मध्ये शिकत आहे आणि प्रवेश क्रमांक ${formData.admissionNo || '__________'} सह प्रवेश घेतला आहे.` :
              `This is to certify that ${formData.studentName || '____________________________'}, son/daughter of Mr. ${formData.fatherName || '____________________________'} and Mrs. ${formData.motherName || '____________________________'}, is a bonafide student of this institution. The student is studying in ${formData.class} ${formData.section ? `Section ${formData.section}` : ''} and was admitted with Admission No. ${formData.admissionNo || '__________'}.`
            }
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>{t.dateOfBirth}:</b> {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-GB') : '____________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>{t.nationality}:</b> {formData.nationality || '____________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>{t.attendanceDuringYear}:</b> {formData.attendanceDuringYear || '____________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>{t.registerNumberInWords}:</b> {formData.registerNumberInWords || '____________________'}
          </Typography>
          <Typography sx={{ textAlign: 'justify', mb: 2 }}>
            <b>{t.remarks}:</b> {formData.remarks || 'N/A'}
          </Typography>
          <Box sx={{ borderTop: '1px solid #000', mt: 4, pt: 2 }}>
            <Typography sx={{ textAlign: 'left', mb: 1 }}>{t.date}: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>{t.principal}</Typography>
              <Typography>{t.sealStamp}</Typography>
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
              {t.backToDashboard}
            </Button>
            <Typography variant="h4" component="h1" sx={{ 
              flex: 1, 
              color: '#1a237e', 
              fontWeight: 600,
              textAlign: 'center'
            }}>
              📋 {t.title}
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
                      {t.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {t.subtitle}
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
                      {t.generateCertificate}
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge badgeContent={certificateHistory.length} color="error">
                        <History />
                      </Badge>
                      {t.certificateHistory}
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
                        {t.studentInformation}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {t.fillStudentDetails}
                      </Typography>
                    </Box>

                    {/* Form Content */}
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                      <Grid container spacing={3}>
                        {/* Student Details Section */}
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
                            {t.studentDetails}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label={`${t.studentName} *`}
                            name="studentName"
                            value={formData.studentName}
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
                            label={`${t.fatherName} *`}
                            name="fatherName"
                            value={formData.fatherName}
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
                            label={t.motherName}
                            name="motherName"
                            value={formData.motherName}
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
                            label={t.nationality}
                            name="nationality"
                            value={formData.nationality}
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
                            <Chip label="2" size="small" sx={{ bgcolor: '#1a237e', color: 'white' }} />
                            {t.academicDetails}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label={`${t.class} *`}
                            name="class"
                            value={formData.class}
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
                            label={t.section}
                            name="section"
                            value={formData.section}
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
                            label={`${t.admissionNo} *`}
                            name="admissionNo"
                            value={formData.admissionNo}
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
                            label={t.attendanceDuringYear}
                            name="attendanceDuringYear"
                            value={formData.attendanceDuringYear}
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

                        {/* Additional Details Section */}
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
                            {t.additionalDetails}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label={`${t.dateOfIssue} *`}
                            name="dateOfIssue"
                            type="date"
                            value={formData.dateOfIssue}
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
                            label={t.dateOfBirth}
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
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
                            label={t.registerNumberInWords}
                            name="registerNumberInWords"
                            value={formData.registerNumberInWords}
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
                        
                        <Grid item xs={12}>
                          <TextField
                            label={t.remarks}
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            placeholder={t.remarksPlaceholder}
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
                            {t.saveCertificate}
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
                            {t.saveDraft}
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
                            {t.printCertificate}
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
                        {t.certificateHistory}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {t.viewAndManage}
                      </Typography>
                    </Box>

                    {/* History Content */}
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                      {/* Delete All Button */}
                      {certificateHistory.length > 0 && (
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteSweep />}
                              onClick={handleDeleteAllCertificates}
                              disabled={deletingCertificate}
                              sx={{ 
                                borderRadius: 2,
                                fontWeight: 600,
                                px: 3,
                                py: 1
                              }}
                            >
                              {t.deleteAllCertificates}
                            </Button>
                          </motion.div>
                        </Box>
                      )}
                      
                      {loadingHistory ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress sx={{ color: '#1a237e' }} />
                        </Box>
                      ) : certificateHistory.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <History sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary">
                            {t.noCertificatesFound}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {t.generateFirstCertificate}
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 600 }}>{t.studentName}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.class}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.admissionNo}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.dateOfIssue}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.generatedBy}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t.actions}</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {certificateHistory.map((certificate) => (
                                <TableRow key={certificate.id} hover>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Person sx={{ color: '#1a237e', fontSize: 20 }} />
                                      {certificate.studentName}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{certificate.class} {certificate.section}</TableCell>
                                  <TableCell>{certificate.admissionNo}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <CalendarToday sx={{ color: '#666', fontSize: 16 }} />
                                      {certificate.dateOfIssue}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={certificate.status === 'final' ? t.final : t.draft} 
                                      color={certificate.status === 'final' ? 'success' : 'warning'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{certificate.submittedByName || certificate.submittedBy}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <Tooltip title={t.viewCertificate}>
                                        <IconButton 
                                          onClick={() => handleViewHistory(certificate)}
                                          size="small"
                                          sx={{ color: '#1a237e' }}
                                        >
                                          <Visibility />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title={t.printCertificate}>
                                        <IconButton 
                                          onClick={() => handlePrintHistory(certificate)}
                                          size="small"
                                          sx={{ color: '#ff9800' }}
                                        >
                                          <Print />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title={t.deleteCertificate}>
                                        <IconButton 
                                          onClick={() => handleDeleteCertificate(certificate)}
                                          size="small"
                                          disabled={deletingCertificate}
                                          sx={{ color: '#f44336' }}
                                        >
                                          <Delete />
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
                {t.title} - {selectedHistoryCertificate?.studentName}
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedHistoryCertificate && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.studentName}:</Typography>
                      <Typography>{selectedHistoryCertificate.studentName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.fatherName}:</Typography>
                      <Typography>{selectedHistoryCertificate.fatherName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.motherName}:</Typography>
                      <Typography>{selectedHistoryCertificate.motherName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.class}:</Typography>
                      <Typography>{selectedHistoryCertificate.class} {selectedHistoryCertificate.section}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.admissionNo}:</Typography>
                      <Typography>{selectedHistoryCertificate.admissionNo}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.dateOfIssue}:</Typography>
                      <Typography>{selectedHistoryCertificate.dateOfIssue}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.nationality}:</Typography>
                      <Typography>{selectedHistoryCertificate.nationality}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.status}:</Typography>
                      <Chip 
                        label={selectedHistoryCertificate.status === 'final' ? t.final : t.draft} 
                        color={selectedHistoryCertificate.status === 'final' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.remarks}:</Typography>
                      <Typography>{selectedHistoryCertificate.remarks || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{t.generatedBy}:</Typography>
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
              <Button onClick={() => setShowHistoryModal(false)}>{t.close}</Button>
              <Button 
                onClick={() => selectedHistoryCertificate && handlePrintHistory(selectedHistoryCertificate)}
                variant="contained"
                startIcon={<Print />}
                sx={{ bgcolor: '#1a237e' }}
              >
                {t.print}
              </Button>
            </DialogActions>
          </Dialog>

          {/* History Print Modal */}
          {showHistoryPrintModal && selectedHistoryCertificate && (
            <Box className="print-certificate" sx={{ 
              maxWidth: 900, 
              mx: 'auto', 
              p: 4, 
              bgcolor: '#fff', 
              border: '2px solid #000', 
              borderRadius: 0, 
              boxShadow: 0 
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img src={logo} alt="School Logo" style={{ width: 100, marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {t.schoolName}
                </Typography>
                <Typography variant="subtitle1">{t.schoolLocation}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                  {t.bonafideCertificateTitle}
                </Typography>
              </Box>
              <Box sx={{ border: '1px solid #000', p: 2, mb: 4 }}>
                <Typography sx={{ mb: 1 }}><b>{t.certificateNo}:</b> {selectedHistoryCertificate.admissionNo || '__________'}</Typography>
                <Typography sx={{ mb: 1 }}><b>{t.dateOfIssue}:</b> {selectedHistoryCertificate.dateOfIssue}</Typography>
              </Box>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                {language === 'mr' ? 
                  `हे प्रमाणित करण्यात येते की ${selectedHistoryCertificate.studentName || '____________________________'}, श्री. ${selectedHistoryCertificate.fatherName || '____________________________'} आणि श्रीमती ${selectedHistoryCertificate.motherName || '____________________________'} यांचा मुलगा/मुलगी, या संस्थेचा बोनाफाईड विद्यार्थी आहे. हा विद्यार्थी ${selectedHistoryCertificate.class} ${selectedHistoryCertificate.section ? `गट ${selectedHistoryCertificate.section}` : ''} मध्ये शिकत आहे आणि प्रवेश क्रमांक ${selectedHistoryCertificate.admissionNo || '__________'} सह प्रवेश घेतला आहे.` :
                  `This is to certify that ${selectedHistoryCertificate.studentName || '____________________________'}, son/daughter of Mr. ${selectedHistoryCertificate.fatherName || '____________________________'} and Mrs. ${selectedHistoryCertificate.motherName || '____________________________'}, is a bonafide student of this institution. The student is studying in ${selectedHistoryCertificate.class} ${selectedHistoryCertificate.section ? `Section ${selectedHistoryCertificate.section}` : ''} and was admitted with Admission No. ${selectedHistoryCertificate.admissionNo || '__________'}.`
                }
              </Typography>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                <b>{t.dateOfBirth}:</b> {selectedHistoryCertificate.dateOfBirth ? new Date(selectedHistoryCertificate.dateOfBirth).toLocaleDateString('en-GB') : '____________________'}
              </Typography>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                <b>{t.nationality}:</b> {selectedHistoryCertificate.nationality || '____________________'}
              </Typography>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                <b>{t.attendanceDuringYear}:</b> {selectedHistoryCertificate.attendanceDuringYear || '____________________'}
              </Typography>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                <b>{t.registerNumberInWords}:</b> {selectedHistoryCertificate.registerNumberInWords || '____________________'}
              </Typography>
              <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                <b>{t.remarks}:</b> {selectedHistoryCertificate.remarks || 'N/A'}
              </Typography>
              <Box sx={{ borderTop: '1px solid #000', mt: 4, pt: 2 }}>
                <Typography sx={{ textAlign: 'left', mb: 1 }}>{t.date}: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography>{t.principal}</Typography>
                  <Typography>{t.sealStamp}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Delete Certificate Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Delete sx={{ color: '#f44336' }} />
              {t.confirmDelete}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t.confirmDeleteMessage}
              </DialogContentText>
              {certificateToDelete && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t.studentName}: {certificateToDelete.studentName}
                  </Typography>
                  <Typography variant="body2">
                    {t.class}: {certificateToDelete.class} | {t.dateOfIssue}: {certificateToDelete.dateOfIssue}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)} disabled={deletingCertificate}>
                {t.cancel}
              </Button>
              <Button 
                onClick={confirmDeleteCertificate} 
                color="error" 
                variant="contained"
                disabled={deletingCertificate}
                startIcon={deletingCertificate ? <CircularProgress size={20} /> : <Delete />}
              >
                {deletingCertificate ? t.delete + '...' : t.delete}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete All Certificates Confirmation Dialog */}
          <Dialog open={showDeleteAllDialog} onClose={() => setShowDeleteAllDialog(false)}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteSweep sx={{ color: '#f44336' }} />
              {t.confirmDelete}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t.confirmDeleteAllMessage}
              </DialogContentText>
              <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                  {certificateHistory.length} {certificateHistory.length === 1 ? 'certificate' : 'certificates'} will be deleted permanently.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteAllDialog(false)} disabled={deletingCertificate}>
                {t.cancel}
              </Button>
              <Button 
                onClick={confirmDeleteAllCertificates} 
                color="error" 
                variant="contained"
                disabled={deletingCertificate}
                startIcon={deletingCertificate ? <CircularProgress size={20} /> : <DeleteSweep />}
              >
                {deletingCertificate ? t.delete + '...' : t.deleteAllCertificates}
              </Button>
            </DialogActions>
          </Dialog>

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
        </motion.div>
      )}
    </Box>
  );
}

export default BonafideScreen;