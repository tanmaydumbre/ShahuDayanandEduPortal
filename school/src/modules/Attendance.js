import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Search, 
  FilterList, 
  GetApp, 
  Assessment, 
  Print,
  CheckCircle,
  Cancel,
  Schedule,
  Home,
  School,
  Person,
  MoreVert,
  Download,
  PictureAsPdf,
  TableChart
} from '@mui/icons-material';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { useTeacher } from '../context/TeacherContext';
import { translations } from '../translations';

// Department configurations
const getDepartments = (language) => {
  const t = translations[language]?.attendance?.departments || translations?.en?.attendance?.departments;
  if (!t) {
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
  }
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
};

const years = ['2024-2025', '2025-2026'];

const getMonths = (language) => {
  const t = translations[language]?.attendance?.months || translations?.en?.attendance?.months;
  if (!t) {
    // Fallback based on language
    if (language === 'mr') {
      return [
        'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
        'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
      ];
    } else {
      return [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    }
  }
  return [
    t.january, t.february, t.march, t.april, t.may, t.june,
    t.july, t.august, t.september, t.october, t.november, t.december
  ];
};

function AttendanceScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getTeacherInfo } = useTeacher();
  const t = translations[language]?.attendance || translations?.en?.attendance || (language === 'mr' ? {
    title: 'उपस्थिती व्यवस्थापन',
    back: 'परत',
    studentAttendance: 'विद्यार्थी उपस्थिती',
    teacherAttendance: 'शिक्षक उपस्थिती',
    hostelAttendance: 'वसतिगृह उपस्थिती',
    department: 'विभाग',
    class: 'वर्ग',
    allClasses: 'सर्व वर्ग',
    year: 'वर्ष',
    month: 'महिना',
    searchPlaceholder: 'नाव, आयडी द्वारे शोधा...',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    late: 'उशीर',
    leave: 'रजा',
    markAllPresent: 'सर्वांना उपस्थित करा',
    markAllAbsent: 'सर्वांना अनुपस्थित करा',
    markAllLate: 'सर्वांना उशीर करा',
    markAllLeave: 'सर्वांना रजा करा',
    srNo: 'अ.क्र.',
    studentName: 'विद्यार्थ्याचे नाव',
    teacherName: 'शिक्षकाचे नाव',
    hostelStudent: 'वसतिगृह विद्यार्थी',
    grNumber: 'जी.आर. क्रमांक',
    employeeId: 'कर्मचारी आयडी',
    roomNumber: 'खोली क्रमांक',
    subject: 'विषय',
    block: 'ब्लॉक',
    saveAttendance: 'उपस्थिती जतन करा',
    saving: 'जतन करत आहे...',
    addStudentToHostel: 'विद्यार्थ्याला वसतिगृहात जोडा',
    generateReport: 'अहवाल तयार करा',
    exportExcel: 'एक्सेल निर्यात करा',
    exportPdf: 'पीडीएफ निर्यात करा',
    noDataMessage: 'कृपया विभाग निवडा',
    noStudentsFound: 'निवडलेल्या निकषांसाठी कोणतेही विद्यार्थी सापडले नाहीत',
    noTeachersFound: 'निवडलेल्या निकषांसाठी कोणतेही शिक्षक सापडले नाहीत',
    noHostelStudentsFound: 'निवडलेल्या निकषांसाठी कोणतेही वसतिगृह विद्यार्थी सापडले नाहीत',
    reportDialog: {
      title: 'उपस्थिती अहवाल तयार करा',
      reportType: 'अहवाल प्रकार',
      dailyReport: 'दैनिक अहवाल',
      monthlyReport: 'मासिक अहवाल',
      selectDate: 'दिनांक निवडा',
      summary: 'सारांश',
      totalRecords: 'एकूण रेकॉर्ड',
      attendancePercentage: 'उपस्थिती टक्केवारी',
      cancel: 'रद्द करा',
      generateReport: 'अहवाल तयार करा'
    },
    hostelDialog: {
      title: 'विद्यार्थ्याला वसतिगृहात जोडा',
      selectStudent: 'वसतिगृहात जोडण्यासाठी सध्याच्या विभागातील विद्यार्थी निवडा:',
      noStudents: 'निवडलेल्या विभागात कोणतेही विद्यार्थी सापडले नाहीत',
      addToHostel: 'वसतिगृहात जोडा',
      cancel: 'रद्द करा'
    },
    messages: {
      attendanceSaved: 'उपस्थिती यशस्वीरित्या जतन केली!',
      errorSaving: 'उपस्थिती जतन करताना त्रुटी:',
      studentAddedToHostel: 'विद्यार्थी यशस्वीरित्या वसतिगृहात जोडला!',
      errorAddingToHostel: 'विद्यार्थ्याला वसतिगृहात जोडताना त्रुटी:',
      errorLoading: 'डेटा लोड करताना त्रुटी:'
    }
  } : {
    title: 'Attendance Management',
    back: 'Back',
    studentAttendance: 'Student Attendance',
    teacherAttendance: 'Teacher Attendance',
    hostelAttendance: 'Hostel Attendance',
    department: 'Department',
    class: 'Class',
    allClasses: 'All Classes',
    year: 'Year',
    month: 'Month',
    searchPlaceholder: 'Search by name, ID...',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    leave: 'Leave',
    markAllPresent: 'Mark All Present',
    markAllAbsent: 'Mark All Absent',
    markAllLate: 'Mark All Late',
    markAllLeave: 'Mark All Leave',
    srNo: 'Sr. No.',
    studentName: 'Student Name',
    teacherName: 'Teacher Name',
    hostelStudent: 'Hostel Student',
    grNumber: 'GR Number',
    employeeId: 'Employee ID',
    roomNumber: 'Room Number',
    subject: 'Subject',
    block: 'Block',
    saveAttendance: 'Save Attendance',
    saving: 'Saving...',
    addStudentToHostel: 'Add Student to Hostel',
    generateReport: 'Generate Report',
    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    noDataMessage: 'Please select a department',
    noStudentsFound: 'No students found for the selected criteria',
    noTeachersFound: 'No teachers found for the selected criteria',
    noHostelStudentsFound: 'No hostel students found for the selected criteria',
    reportDialog: {
      title: 'Generate Attendance Report',
      reportType: 'Report Type',
      dailyReport: 'Daily Report',
      monthlyReport: 'Monthly Report',
      selectDate: 'Select Date',
      summary: 'Summary',
      totalRecords: 'Total Records',
      attendancePercentage: 'Attendance Percentage',
      cancel: 'Cancel',
      generateReport: 'Generate Report'
    },
    hostelDialog: {
      title: 'Add Student to Hostel',
      selectStudent: 'Select a student from the current department to add to hostel:',
      noStudents: 'No students found in the selected department',
      addToHostel: 'Add to Hostel',
      cancel: 'Cancel'
    },
    messages: {
      attendanceSaved: 'Attendance saved successfully!',
      errorSaving: 'Error saving attendance:',
      studentAddedToHostel: 'Student added to hostel successfully!',
      errorAddingToHostel: 'Error adding student to hostel:',
      errorLoading: 'Error loading data:'
    }
  });
  const departments = getDepartments(language);
  const months = getMonths(language);
  
  // Attendance Type
  const [attendanceType, setAttendanceType] = useState('student');
  
  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState('highSchool');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Search and Filter
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Data
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [hostelStudents, setHostelStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  // UI States
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAddToHostelDialog, setShowAddToHostelDialog] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Generate days for current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentMonthIndex = months.indexOf(selectedMonth);
  const daysInMonth = getDaysInMonth(parseInt(selectedYear.split('-')[0]), currentMonthIndex);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    loadData();
  }, [attendanceType, selectedDepartment, selectedClass]);

  useEffect(() => {
    initializeAttendance();
  }, [students, teachers, hostelStudents]);

  const loadData = async () => {
    if (!selectedDepartment) return;
    
    setDataLoading(true);
    try {
      if (attendanceType === 'student') {
        await loadStudents();
      } else if (attendanceType === 'teacher') {
        await loadTeachers();
      } else if (attendanceType === 'hostel') {
        await loadHostelStudents();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({ open: true, message: t.messages.errorLoading + ' ' + error.message, severity: 'error' });
    } finally {
      setDataLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      let q = query(collection(db, 'general-register'), where('department', '==', selectedDepartment));
      if (selectedClass) {
        q = query(q, where('class', '==', selectedClass));
      }
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const loadTeachers = async () => {
    try {
      let q = query(collection(db, 'teachers'), where('department', '==', selectedDepartment));
      const querySnapshot = await getDocs(q);
      const teachersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers([]);
    }
  };

  const loadHostelStudents = async () => {
    try {
      let q = query(collection(db, 'hostel-students'), where('department', '==', selectedDepartment));
      if (selectedClass) {
        q = query(q, where('class', '==', selectedClass));
      }
      const querySnapshot = await getDocs(q);
      const hostelData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHostelStudents(hostelData);
    } catch (error) {
      console.error('Error loading hostel students:', error);
      setHostelStudents([]);
    }
  };

  const initializeAttendance = () => {
    const currentData = attendanceType === 'student' ? students : 
                       attendanceType === 'teacher' ? teachers : hostelStudents;
    
    const initialAttendance = {};
    currentData.forEach(item => {
      initialAttendance[item.id] = Array(daysInMonth).fill('A');
    });
    setAttendance(initialAttendance);
  };

  const handleAttendanceTypeChange = (event, newValue) => {
    setAttendanceType(newValue);
    setSelectedClass('');
  };

  const handleAttendanceChange = (itemId, day) => {
    setAttendance(prev => {
      const currentStatus = prev[itemId]?.[day - 1] || 'A';
      const newStatus = currentStatus === 'A' ? 'P' : 
                       currentStatus === 'P' ? 'L' : 
                       currentStatus === 'L' ? 'H' : 'A';
      return {
        ...prev,
        [itemId]: prev[itemId]?.map((status, idx) => (idx === day - 1 ? newStatus : status)) || Array(daysInMonth).fill('A')
      };
    });
  };

  const handleBulkMarking = (status) => {
    const currentData = attendanceType === 'student' ? students : 
                       attendanceType === 'teacher' ? teachers : hostelStudents;
    
    const newAttendance = {};
    currentData.forEach(item => {
      newAttendance[item.id] = Array(daysInMonth).fill(status);
    });
    setAttendance(newAttendance);
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'P':
        return { icon: '✔', color: '#4caf50', background: '#e8f5e9', label: t.present };
      case 'A':
        return { icon: '✖', color: '#f44336', background: '#ffebee', label: t.absent };
      case 'L':
        return { icon: '⏰', color: '#ff9800', background: '#fff3e0', label: t.late };
      case 'H':
        return { icon: '🏠', color: '#9c27b0', background: '#f3e5f5', label: t.leave };
      default:
        return { icon: '', color: '#000', background: '#fff', label: 'Unknown' };
    }
  };

  const getFilteredData = () => {
    let data = attendanceType === 'student' ? students : 
               attendanceType === 'teacher' ? teachers : hostelStudents;
    
    // Filter by department and class
    if (selectedDepartment) {
      data = data.filter(item => item.department === selectedDepartment);
    }
    if (selectedClass) {
      data = data.filter(item => item.class === selectedClass);
    }
    
    // Filter by search text
    if (searchText) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.grNumber && item.grNumber.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.employeeId && item.employeeId.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.roomNumber && item.roomNumber.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    return data;
  };

  const getAttendanceStats = () => {
    const data = getFilteredData();
    let present = 0, absent = 0, late = 0, leave = 0;
    
    data.forEach(item => {
      const itemAttendance = attendance[item.id] || Array(daysInMonth).fill('A');
      itemAttendance.forEach(status => {
        switch (status) {
          case 'P': present++; break;
          case 'A': absent++; break;
          case 'L': late++; break;
          case 'H': leave++; break;
        }
      });
    });
    
    return { present, absent, late, leave, total: present + absent + late + leave };
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Get teacher information
      const teacherInfo = getTeacherInfo();
      
      const attendanceData = {
        type: attendanceType,
        department: selectedDepartment,
        class: selectedClass,
        year: selectedYear,
        month: selectedMonth,
        date: selectedDate,
        attendance: attendance,
        submittedBy: teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown',
        submittedById: teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown',
        submittedByDepartment: teacherInfo?.department || 'Unknown',
        submittedByDesignation: teacherInfo?.designation || 'Unknown',
        submittedByEmployeeId: teacherInfo?.employeeId || 'Unknown',
        submittedAt: serverTimestamp(),
        totalRecords: Object.keys(attendance).length,
        stats: getAttendanceStats()
      };
      
      // Save to department-specific collection
      await addDoc(collection(db, `attendance-${selectedDepartment}`), attendanceData);
      setSnackbar({ open: true, message: t.messages.attendanceSaved, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: t.messages.errorSaving + ' ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addStudentToHostel = async (studentData) => {
    try {
      const hostelData = {
        ...studentData,
        department: selectedDepartment,
        addedToHostelAt: serverTimestamp(),
        addedBy: localStorage.getItem('teacherEmail') || 'Unknown',
        addedByName: localStorage.getItem('teacherName') || 'Unknown',
        hostelStatus: 'active'
      };
      
      await addDoc(collection(db, 'hostel-students'), hostelData);
      setSnackbar({ open: true, message: t.messages.studentAddedToHostel, severity: 'success' });
      await loadHostelStudents(); // Reload hostel data
    } catch (error) {
      setSnackbar({ open: true, message: t.messages.errorAddingToHostel + ' ' + error.message, severity: 'error' });
    }
  };

  const handleExport = (format) => {
    const data = getFilteredData();
    const stats = getAttendanceStats();
    
    if (format === 'excel') {
      // Generate CSV for Excel
      let csvContent = 'Name,ID,Class,';
      days.forEach(day => csvContent += `Day ${day},`);
      csvContent += '\n';
      
      data.forEach(item => {
        const itemAttendance = attendance[item.id] || Array(daysInMonth).fill('A');
        csvContent += `${item.name},${item.grNumber || item.employeeId || item.roomNumber},${item.class},`;
        itemAttendance.forEach(status => {
          csvContent += `${getAttendanceIcon(status).label},`;
        });
        csvContent += '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${attendanceType}_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Generate PDF (simplified - would need a proper PDF library)
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Attendance Report</title></head>
          <body>
            <h1>Attendance Report - ${attendanceType}</h1>
            <h2>${selectedMonth} ${selectedYear}</h2>
            <p>Present: ${stats.present}, Absent: ${stats.absent}, Late: ${stats.late}, Leave: ${stats.leave}</p>
            <table border="1" style="width:100%">
              <tr><th>Name</th><th>ID</th><th>Class</th></tr>
              ${data.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.grNumber || item.employeeId || item.roomNumber}</td>
                  <td>${item.class}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleBack = () => {
    navigate('/TeacherDashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const stats = getAttendanceStats();
  const filteredData = getFilteredData();

  return (
    <Box sx={{ bgcolor: '#f7f5fa', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button onClick={handleBack} startIcon={<ArrowBack />} variant="outlined" sx={{ mr: 2, color: '#3d246c', borderColor: '#3d246c' }}>
          {t.back}
        </Button>
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#3d246c' }}>
          {t.title}
        </Typography>
      </Box>

      {/* Attendance Type Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={attendanceType} onChange={handleAttendanceTypeChange} sx={{ bgcolor: '#3d246c' }}>
          <Tab 
            value="student" 
            label={t.studentAttendance} 
            icon={<School />} 
            iconPosition="start"
            sx={{ color: '#fff' }}
          />
          <Tab 
            value="teacher" 
            label={t.teacherAttendance} 
            icon={<Person />} 
            iconPosition="start"
            sx={{ color: '#fff' }}
          />
          <Tab 
            value="hostel" 
            label={t.hostelAttendance} 
            icon={<Home />} 
            iconPosition="start"
            sx={{ color: '#fff' }}
          />
        </Tabs>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t.department}</InputLabel>
              <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} label={t.department}>
                {Object.entries(departments).map(([key, dept]) => (
                  <MenuItem key={key} value={key}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t.class}</InputLabel>
              <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} label={t.class}>
                <MenuItem value="">{t.allClasses}</MenuItem>
                {departments[selectedDepartment]?.classes.map(cls => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t.year}</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label={t.year}>
                {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t.month}</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label={t.month}>
                {months.map(month => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder={t.searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" color="success.main">{t.present}</Typography>
              <Typography variant="h4">{stats.present}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6" color="error.main">{t.absent}</Typography>
              <Typography variant="h4">{stats.absent}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="h6" color="warning.main">{t.late}</Typography>
              <Typography variant="h4">{stats.late}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent>
              <Typography variant="h6" color="secondary.main">{t.leave}</Typography>
              <Typography variant="h4">{stats.leave}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bulk Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleBulkMarking('P')}
          startIcon={<CheckCircle />}
        >
          {t.markAllPresent}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleBulkMarking('A')}
          startIcon={<Cancel />}
        >
          {t.markAllAbsent}
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleBulkMarking('L')}
          startIcon={<Schedule />}
        >
          {t.markAllLate}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleBulkMarking('H')}
          startIcon={<Home />}
        >
          {t.markAllLeave}
        </Button>
      </Box>

      {/* Attendance Table */}
      <Paper sx={{ mb: 3, overflow: 'auto' }}>
        {dataLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="textSecondary">
              {!selectedDepartment ? t.noDataMessage : 
               attendanceType === 'student' ? t.noStudentsFound :
               attendanceType === 'teacher' ? t.noTeachersFound : t.noHostelStudentsFound}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: '#3d246c' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 80 }}>{t.srNo}</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 200 }}>
                    {attendanceType === 'student' ? t.studentName : 
                     attendanceType === 'teacher' ? t.teacherName : t.hostelStudent}
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }}>
                    {attendanceType === 'student' ? t.grNumber : 
                     attendanceType === 'teacher' ? t.employeeId : t.roomNumber}
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }}>{t.class}</TableCell>
                  {attendanceType === 'teacher' && (
                    <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }}>{t.subject}</TableCell>
                  )}
                  {attendanceType === 'hostel' && (
                    <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }}>{t.block}</TableCell>
                  )}
                  {days.map((day) => (
                    <TableCell key={day} sx={{ color: '#fff', fontWeight: 600, textAlign: 'center', minWidth: 40 }}>
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell>
                      {attendanceType === 'student' ? item.regNo : 
                       attendanceType === 'teacher' ? item.employeeId : item.roomNumber}
                    </TableCell>
                    <TableCell>{item.class}</TableCell>
                    {attendanceType === 'teacher' && (
                      <TableCell>{item.subject}</TableCell>
                    )}
                    {attendanceType === 'hostel' && (
                      <TableCell>{item.block}</TableCell>
                    )}
                    {days.map((day) => {
                      const status = attendance[item.id]?.[day - 1] || 'A';
                      const { icon, color, background } = getAttendanceIcon(status);
                      return (
                        <TableCell
                          key={day}
                          sx={{ textAlign: 'center', cursor: 'pointer', p: 0.5 }}
                          onClick={() => handleAttendanceChange(item.id, day)}
                        >
                          <Tooltip title={getAttendanceIcon(status).label}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: background,
                                color: color,
                                fontSize: '15px',
                                fontWeight: 'bold',
                                boxShadow: `0 0 4px ${color}`,
                                transition: 'all 0.2s',
                              }}
                            >
                              {icon}
                            </span>
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading || dataLoading}
          startIcon={loading ? <CircularProgress size={20} /> : <span>💾</span>}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
          {loading ? t.saving : t.saveAttendance}
        </Button>
        
        {attendanceType === 'hostel' && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowAddToHostelDialog(true)}
            startIcon={<Home />}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {t.addStudentToHostel}
          </Button>
        )}
        
        <Button
          variant="contained"
          color="info"
          onClick={() => setShowReportDialog(true)}
          startIcon={<Assessment />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
                      {t.generateReport}
        </Button>
        
        <Button
          variant="contained"
          color="success"
          onClick={() => handleExport('excel')}
          startIcon={<TableChart />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
                      {t.exportExcel}
        </Button>
        
        <Button
          variant="contained"
          color="error"
          onClick={() => handleExport('pdf')}
          startIcon={<PictureAsPdf />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
                      {t.exportPdf}
        </Button>
      </Box>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t.reportDialog.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t.reportDialog.reportType}</InputLabel>
                <Select value={reportType} onChange={(e) => setReportType(e.target.value)} label={t.reportDialog.reportType}>
                  <MenuItem value="daily">{t.reportDialog.dailyReport}</MenuItem>
                  <MenuItem value="monthly">{t.reportDialog.monthlyReport}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {reportType === 'daily' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label={t.reportDialog.selectDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{t.reportDialog.summary}</Typography>
                  <Typography>{t.reportDialog.totalRecords}: {filteredData.length}</Typography>
                  <Typography>Present: {stats.present}</Typography>
                  <Typography>Absent: {stats.absent}</Typography>
                  <Typography>Late: {stats.late}</Typography>
                  <Typography>Leave: {stats.leave}</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {t.reportDialog.attendancePercentage}: {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>{t.reportDialog.cancel}</Button>
          <Button onClick={() => handleExport('pdf')} variant="contained">{t.reportDialog.generateReport}</Button>
        </DialogActions>
      </Dialog>

      {/* Add to Hostel Dialog */}
      <Dialog open={showAddToHostelDialog} onClose={() => setShowAddToHostelDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t.hostelDialog.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t.hostelDialog.selectStudent}
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {students.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                {t.hostelDialog.noStudents}
              </Typography>
            ) : (
              students.map((student) => (
                <Card key={student.id} sx={{ mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <CardContent sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          GR: {student.regNo} | Class: {student.class} | Department: {departments[student.department]?.name}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          addStudentToHostel(student);
                          setShowAddToHostelDialog(false);
                        }}
                      >
                        {t.hostelDialog.addToHostel}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddToHostelDialog(false)}>{t.hostelDialog.cancel}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AttendanceScreen;