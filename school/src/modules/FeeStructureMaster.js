import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Pagination,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const translations = {
  en: {
    title: '💰 Fee Structure Master',
    backToDashboard: 'Back',
    addFeeStructure: '➕ Add Fee Structure',
    searchPlaceholder: 'Search by Department, Class, or Year...',
    filterDepartment: 'Filter by Department',
    filterYear: 'Filter by Year',
    editFeeStructure: 'Edit Fee Structure',
    enterFeeStructure: 'Enter Fee Structure Details',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    totalRecords: 'Total Records',
    noRecords: 'No fee structures found.',
    noDepartmentSelected: 'Please select a department to view fee structures.',
    formLabels: {
      department: 'Department',
      class: 'Class',
      academicYear: 'Academic Year',
      admissionFee: 'Admission Fee',
      academicFee: 'Academic Fee',
      examFee: 'Exam Fee',
      tutorialFee: 'Tutorial Fee',
      libraryFee: 'Library Fee',
      laboratoryFee: 'Laboratory Fee',
      gymFee: 'Gym Fee',
      developmentFee: 'Development Fee',
      idCardFee: 'ID Card Fee',
      bonafideFee: 'Bonafide Certificate Fee',
      leavingCertFee: 'Leaving Certificate Fee',
      duplicateLeavingFee: 'Duplicate Leaving Certificate Fee',
      transportationFee: 'Transportation Fee',
      penaltyFee: 'Penalty Fee',
      trainingFee: 'Training Program Fee',
      sportsFee: 'Sports Day & Cultural Day Fee',
      totalFee: 'Total Fee'
    }
  },
  mr: {
    title: '💰 फी स्ट्रक्चर मास्टर',
    backToDashboard: 'मागे',
    addFeeStructure: '➕ फी स्ट्रक्चर जोडा',
    searchPlaceholder: 'विभाग, वर्ग किंवा वर्षाने शोधा...',
    filterDepartment: 'विभागाने फिल्टर करा',
    filterYear: 'वर्षाने फिल्टर करा',
    editFeeStructure: 'फी स्ट्रक्चर संपादित करा',
    enterFeeStructure: 'फी स्ट्रक्चर तपशील प्रविष्ट करा',
    save: 'जतन करा',
    update: 'अपडेट करा',
    cancel: 'रद्द करा',
    previous: 'मागील',
    next: 'पुढील',
    page: 'पृष्ठ',
    of: 'पैकी',
    totalRecords: 'एकूण नोंदी',
    noRecords: 'कोणतीही फी स्ट्रक्चर सापडली नाही.',
    noDepartmentSelected: 'फी स्ट्रक्चर पाहण्यासाठी कृपया विभाग निवडा.',
    formLabels: {
      department: 'विभाग',
      class: 'वर्ग',
      academicYear: 'शैक्षणिक वर्ष',
      admissionFee: 'प्रवेश फी',
      academicFee: 'शैक्षणिक फी',
      examFee: 'परीक्षा फी',
      tutorialFee: 'ट्यूटोरियल फी',
      libraryFee: 'ग्रंथालय फी',
      laboratoryFee: 'प्रयोगशाळा फी',
      gymFee: 'जिम फी',
      developmentFee: 'विकास फी',
      idCardFee: 'आयडी कार्ड फी',
      bonafideFee: 'बोनाफाईड प्रमाणपत्र फी',
      leavingCertFee: 'सोडण्याचे प्रमाणपत्र फी',
      duplicateLeavingFee: 'डुप्लिकेट सोडण्याचे प्रमाणपत्र फी',
      transportationFee: 'वाहतूक फी',
      penaltyFee: 'दंड फी',
      trainingFee: 'प्रशिक्षण कार्यक्रम फी',
      sportsFee: 'क्रीडा दिन आणि सांस्कृतिक दिन फी',
      totalFee: 'एकूण फी'
    }
  }
};

// Department configurations
const departments = {
  highSchool: {
    name: { en: 'High School', mr: 'माध्यमिक शाळा' },
    classes: ['5th', '6th', '7th', '8th', '9th', '10th']
  },
  college: {
    name: { en: 'College', mr: 'महाविद्यालय' },
    classes: ['11th', '12th', 'FYJC', 'SYJC']
  },
  marathiSchool: {
    name: { en: 'Marathi School', mr: 'मराठी शाळा' },
    classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
  },
  kindergarten: {
    name: { en: 'Kindergarten', mr: 'बालवाडी' },
    classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG']
  }
};

// Fee categories
const feeCategories = [
  'admissionFee', 'academicFee', 'examFee', 'tutorialFee', 'libraryFee', 
  'laboratoryFee', 'gymFee', 'developmentFee', 'idCardFee', 'bonafideFee', 
  'leavingCertFee', 'duplicateLeavingFee', 'transportationFee', 'penaltyFee', 
  'trainingFee', 'sportsFee'
];

function FeeStructureMaster() {
  const { language } = useLanguage();
  const t = translations[language];
  const fontFamily = language === 'mr' ? 'Shivaji01, Arial, sans-serif' : 'Arial, sans-serif';
  
  const [feeStructures, setFeeStructures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const recordsPerPage = 10;

  const generateAcademicYears = () => {
    const years = [];
    for (let y = 1970; y <= new Date().getFullYear() + 1; y++) {
      years.push(`${y}-${y + 1}`);
    }
    return years.reverse();
  };

  useEffect(() => {
    setAcademicYears(generateAcademicYears());
    fetchFeeStructures();
  }, [filterDepartment, filterYear]);

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'fee-structures'), orderBy('academicYear', 'desc'));
      
      if (filterDepartment) {
        q = query(q, where('department', '==', filterDepartment));
      }
      
      if (filterYear) {
        q = query(
          collection(db, 'fee-structures'), 
          where('department', '==', filterDepartment || ''),
          where('academicYear', '==', filterYear),
          orderBy('class')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const structuresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFeeStructures(structuresData);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      setMessage({ text: 'Error fetching fee structures', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredStructures = feeStructures.filter(structure => {
    const matchesSearch = 
      structure.department?.toLowerCase().includes(searchText.toLowerCase()) ||
      structure.class?.toLowerCase().includes(searchText.toLowerCase()) ||
      structure.academicYear?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const showForm = () => {
    setShowModal(true);
    setEditId(null);
    setSelectedStructure(null);
  };

  const hideForm = () => {
    setShowModal(false);
    setEditId(null);
    setSelectedStructure(null);
    setMessage({ text: '', type: '' });
  };

  const handleView = (structure) => {
    setSelectedStructure(structure);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Convert string values to numbers for fee amounts
      feeCategories.forEach(category => {
        if (data[category]) {
          data[category] = parseFloat(data[category]) || 0;
        }
      });
      
      // Calculate total fee
      const totalFee = feeCategories.reduce((sum, category) => {
        return sum + (parseFloat(data[category]) || 0);
      }, 0);
      
      data.totalFee = totalFee;
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
      data.submittedBy = localStorage.getItem('teacherEmail') || 'Unknown';
      data.submittedByName = localStorage.getItem('teacherName') || 'Unknown';

      if (editId) {
        data.updatedBy = localStorage.getItem('teacherEmail') || 'Unknown';
        data.updatedByName = localStorage.getItem('teacherName') || 'Unknown';
        data.updatedAt = new Date().toISOString();
        
        await updateDoc(doc(db, 'fee-structures', editId), data);
        setMessage({ text: 'Fee structure updated successfully', type: 'success' });
      } else {
        await addDoc(collection(db, 'fee-structures'), data);
        setMessage({ text: 'Fee structure added successfully', type: 'success' });
      }

      await fetchFeeStructures();
      setShowModal(false);
      setEditId(null);
      setSelectedStructure(null);
    } catch (error) {
      console.error('Error saving fee structure:', error);
      setMessage({ text: 'Error saving fee structure', type: 'error' });
    }
  };

  const handleEdit = async (structure) => {
    try {
      setSelectedStructure(structure);
      setEditId(structure.id);
      setShowModal(true);
    } catch (error) {
      console.error('Error editing fee structure:', error);
      setMessage({ text: 'Error editing fee structure', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
    
    try {
      await deleteDoc(doc(db, 'fee-structures', id));
      setMessage({ text: 'Fee structure deleted successfully!', type: 'success' });
      await fetchFeeStructures();
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      setMessage({ text: 'Error deleting fee structure', type: 'error' });
    }
  };

  const totalPages = Math.ceil(filteredStructures.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentStructures = filteredStructures.slice(startIndex, endIndex);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1a237e', fontWeight: 600, fontFamily }}>
          {t.title}
        </Typography>
        <Link to="/TeacherDashboard" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: '#1a237e', borderColor: '#1a237e' }}>
            {t.backToDashboard}
          </Button>
        </Link>
      </Box>
      <Divider sx={{ mb: 3, borderColor: '#1a237e', borderWidth: 1 }} />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {feeStructures.length}
                  </Typography>
                  <Typography variant="body2">Total Structures</Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Object.keys(departments).length}
                  </Typography>
                  <Typography variant="body2">Departments</Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {academicYears.length}
                  </Typography>
                  <Typography variant="body2">Academic Years</Typography>
                </Box>
                <CalendarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {feeCategories.length}
                  </Typography>
                  <Typography variant="body2">Fee Categories</Typography>
                </Box>
                <ClassIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder={t.searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t.filterDepartment}</InputLabel>
          <Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            label={t.filterDepartment}
          >
            <MenuItem value="">All Departments</MenuItem>
            {Object.entries(departments).map(([key, dept]) => (
              <MenuItem key={key} value={key}>{dept.name[language]}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t.filterYear}</InputLabel>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            label={t.filterYear}
          >
            <MenuItem value="">All Years</MenuItem>
            {academicYears.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={showForm}
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
        >
          {t.addFeeStructure}
        </Button>
      </Box>
      <Divider sx={{ mb: 3, borderColor: '#1a237e', borderWidth: 1 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredStructures.length === 0 && (
            <Typography sx={{ textAlign: 'center', mt: 4, color: '#1a237e' }}>
              {t.noRecords}
            </Typography>
          )}
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: '70vh',
              overflowX: 'auto',
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
                padding: '8px 16px',
                fontSize: '0.875rem'
              }
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t.formLabels.department}</TableCell>
                  <TableCell>{t.formLabels.class}</TableCell>
                  <TableCell>{t.formLabels.academicYear}</TableCell>
                  <TableCell>{t.formLabels.admissionFee}</TableCell>
                  <TableCell>{t.formLabels.academicFee}</TableCell>
                  <TableCell>{t.formLabels.examFee}</TableCell>
                  <TableCell>{t.formLabels.totalFee}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentStructures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell>
                      <Chip 
                        label={departments[structure.department]?.name[language] || structure.department}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{structure.class}</TableCell>
                    <TableCell>{structure.academicYear}</TableCell>
                    <TableCell>₹{structure.admissionFee || 0}</TableCell>
                    <TableCell>₹{structure.academicFee || 0}</TableCell>
                    <TableCell>₹{structure.examFee || 0}</TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                        ₹{structure.totalFee || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleView(structure)} color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(structure)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(structure.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ mt: 3, mb: 2, borderColor: '#1a237e', borderWidth: 1 }} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{t.totalRecords}: {filteredStructures.length}</Typography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showModal} onClose={hideForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editId ? t.editFeeStructure : t.enterFeeStructure}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t.formLabels.department}</InputLabel>
                  <Select
                    name="department"
                    label={t.formLabels.department}
                    defaultValue={editId ? selectedStructure?.department : ''}
                  >
                    {Object.entries(departments).map(([key, dept]) => (
                      <MenuItem key={key} value={key}>{dept.name[language]}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t.formLabels.class}</InputLabel>
                  <Select
                    name="class"
                    label={t.formLabels.class}
                    defaultValue={editId ? selectedStructure?.class : ''}
                  >
                    {Object.values(departments).flatMap(dept => dept.classes).map(cls => (
                      <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t.formLabels.academicYear}</InputLabel>
                  <Select
                    name="academicYear"
                    label={t.formLabels.academicYear}
                    defaultValue={editId ? selectedStructure?.academicYear : academicYears[0]}
                  >
                    {academicYears.map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Fee Fields */}
              {feeCategories.map((category, index) => (
                <Grid item xs={12} md={6} key={category}>
                  <TextField
                    name={category}
                    label={t.formLabels[category]}
                    type="number"
                    fullWidth
                    defaultValue={editId ? selectedStructure?.[category] || 0 : 0}
                    InputProps={{
                      startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={hideForm}>{t.cancel}</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}>
              {editId ? t.update : t.save}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Structure Dialog */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Fee Structure Details</DialogTitle>
        <DialogContent>
          {selectedStructure && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.department}:</Typography>
                  <Typography>{departments[selectedStructure.department]?.name[language] || selectedStructure.department}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.class}:</Typography>
                  <Typography>{selectedStructure.class}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.academicYear}:</Typography>
                  <Typography>{selectedStructure.academicYear}</Typography>
                </Grid>
                
                {feeCategories.map((category) => (
                  <Grid item xs={12} md={6} key={category}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels[category]}:</Typography>
                    <Typography>₹{selectedStructure[category] || 0}</Typography>
                  </Grid>
                ))}
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {t.formLabels.totalFee}: ₹{selectedStructure.totalFee || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={() => setMessage({ text: '', type: '' })}
      >
        <Alert severity={message.type} onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FeeStructureMaster;
