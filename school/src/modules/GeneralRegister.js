import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTeacher } from '../context/TeacherContext';
import { db } from '../firebase/config';
import useSessionTimeout from '../hooks/useSessionTimeout';
import TeacherHeader from '../components/TeacherHeader';
import SessionTimeoutWarning from '../components/SessionTimeoutWarning';
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
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  GetApp as ExportIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Description as CertificateIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';

// Import the school logo
import logo from '../assets/SDHJC_Logo.png';

const translations = {
  en: {
    title: '📘 General Register',
    backToDashboard: 'Back',
    addEntry: '➕ Add Entry',
    searchPlaceholder: 'Search by Name, Reg No, UID, or Class...',
    filterYear: 'Academic Year',
    filterNationality: 'Nationality',
    filterReligion: 'Religion',
    filterClass: 'Class',
    department: 'Department',
    selectDepartment: 'Select Department',
    highSchool: 'High School',
    college: 'College',
    marathiSchool: 'Marathi School',
    kindergarten: 'Kindergarten',
    editStudentDetails: 'Edit Student Details',
    enterStudentDetails: 'Enter Student Details',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    totalRecords: 'Total Records',
    noRecords: 'No records found for the selected department and year.',
    noDepartmentSelected: 'Please select a department to view records.',
    lockRecord: 'Lock Record',
    unlockRecord: 'Unlock Record',
    recordLocked: 'Record is locked',
    recordUnlocked: 'Record is unlocked',
    printRecord: 'Print Record',
    exportRecord: 'Export Record',
    generateBonafide: 'Generate Bonafide Certificate',
    generateLeaving: 'Generate Leaving Certificate',
    archiveRecord: 'Archive Record',
    unarchiveRecord: 'Unarchive Record',
    archived: 'Archived',
    active: 'Active',
    markInactive: 'Mark as Inactive',
    markActive: 'Mark as Active',
    actions: 'Actions',
    status: 'Status',
    class: 'Class',
    formLabels: {
      academicYear: 'Academic Year',
      regNo: 'Reg No.',
      uid: 'UID / Student ID',
      name: 'Student Name',
      motherName: 'Mother Name',
      nationality: 'Nationality',
      motherTongue: 'Mother Tongue',
      religion: 'Religion',
      caste: 'Caste',
      subCaste: 'Sub Caste',
      birthPlace: 'Place of Birth',
      dob: 'Date of Birth (In Figure)',
      dobWords: 'Date of Birth (In Words)',
      lastSchool: 'Last School attended & Std.',
      admittedStd: 'Admitted Std. & Date of Admission',
      studiedIn: 'In which Std. studied & Since when',
      progress: 'Progress of Study',
      conduct: 'Conduct',
      reasonLeaving: 'Reason of Leaving School',
      dateOfLeavingLC: 'Date of Receiving L.C. & Sign. of Guardian',
      guardianSign: 'Sign. of Guardian for Confirmation',
      department: 'Department',
      class: 'Class'
    }
  },
  mr: {
    title: '📘 सामान्य रजिस्टर',
    backToDashboard: 'मागे',
    addEntry: '➕ नवीन नोंद',
    searchPlaceholder: 'नाव, रजिस्टर क्रमांक, यूआयडी किंवा वर्गाने शोधा...',
    filterYear: 'शैक्षणिक वर्षानुसार फिल्टर करा',
    filterNationality: 'राष्ट्रीयत्वाने फिल्टर करा',
    filterReligion: 'धर्माने फिल्टर करा',
    filterClass: 'वर्गाने फिल्टर करा',
    department: 'विभाग',
    selectDepartment: 'विभाग निवडा',
    highSchool: 'माध्यमिक शाळा',
    college: 'महाविद्यालय',
    marathiSchool: 'मराठी शाळा',
    kindergarten: 'बालवाडी',
    editStudentDetails: 'विद्यार्थी तपशील संपादित करा',
    enterStudentDetails: 'विद्यार्थी तपशील प्रविष्ट करा',
    save: 'जतन करा',
    update: 'अपडेट करा',
    cancel: 'रद्द करा',
    previous: 'मागील',
    next: 'पुढील',
    page: 'पृष्ठ',
    of: 'पैकी',
    totalRecords: 'एकूण नोंदी',
    noRecords: 'निवडलेल्या विभाग आणि वर्षासाठी कोणतीही नोंद सापडली नाही.',
    noDepartmentSelected: 'नोंदी पाहण्यासाठी कृपया विभाग निवडा.',
    lockRecord: 'नोंद लॉक करा',
    unlockRecord: 'नोंद अनलॉक करा',
    recordLocked: 'नोंद लॉक केली आहे',
    recordUnlocked: 'नोंद अनलॉक केली आहे',
    printRecord: 'नोंद प्रिंट करा',
    exportRecord: 'नोंद एक्सपोर्ट करा',
    generateBonafide: 'बोनाफाईड प्रमाणपत्र तयार करा',
    generateLeaving: 'सोडण्याचे प्रमाणपत्र तयार करा',
    archiveRecord: 'नोंद आर्काइव्ह करा',
    unarchiveRecord: 'नोंद अनआर्काइव्ह करा',
    archived: 'आर्काइव्ह केले',
    active: 'सक्रिय',
    markInactive: 'निष्क्रिय म्हणून चिन्हांकित करा',
    markActive: 'सक्रिय म्हणून चिन्हांकित करा',
    actions: 'कृती',
    status: 'स्थिती',
    class: 'वर्ग',
    formLabels: {
      academicYear: 'शैक्षणिक वर्ष',
      regNo: 'रजिस्टर क्रमांक',
      uid: 'यूआयडी / विद्यार्थी आयडी',
      name: 'विद्यार्थी नाव',
      motherName: 'आईचे नाव',
      nationality: 'राष्ट्रीयत्व',
      motherTongue: 'मातृभाषा',
      religion: 'धर्म',
      caste: 'जात',
      subCaste: 'उपजात',
      birthPlace: 'जन्मस्थान',
      dob: 'जन्मतारीख (आकड्यात)',
      dobWords: 'जन्मतारीख (शब्दात)',
      lastSchool: 'शेवटचे शाळा व मानक',
      admittedStd: 'प्रवेशित मानक आणि तारीख',
      studiedIn: 'शिकलेले मानक आणि तारीख',
      progress: 'अभ्यास प्रगती',
      conduct: 'वर्तन',
      reasonLeaving: 'शाळा सोडण्याचे कारण',
      dateOfLeavingLC: 'एल.सी. मिळाल्याची तारीख व पालक सही',
      guardianSign: 'पालक सही (रेकॉर्ड पुष्टी)',
      department: 'विभाग',
      class: 'वर्ग'
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

function GeneralRegister() {
  const { language } = useLanguage();
  const { getTeacherInfo } = useTeacher();
  const t = translations[language];
  const fontFamily = language === 'mr' ? 'Shivaji01, Arial, sans-serif' : 'Arial, sans-serif';
  
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
  
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [savedAcademicYears, setSavedAcademicYears] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecordForMenu, setSelectedRecordForMenu] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateType, setCertificateType] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [printMode, setPrintMode] = useState(false);
  const recordsPerPage = 50;

  const generateAcademicYears = () => {
    const years = [];
    for (let y = 1970; y <= new Date().getFullYear() + 1; y++) {
      years.push(`${y}-${y + 1}`);
    }
    return years.reverse(); // Most recent years first
  };

  const fetchRecords = useCallback(async () => {
    if (!selectedDepartment) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let q = query(
        collection(db, `general-register-${selectedDepartment}`), 
        orderBy('academicYear', 'desc'),
        orderBy('regNo')
      );
      
      if (filterYear) {
        q = query(
          collection(db, `general-register-${selectedDepartment}`), 
          where('academicYear', '==', filterYear),
          orderBy('regNo')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const recordsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          regNo: doc.data().regNo || '',
          academicYear: doc.data().academicYear || '',
          department: selectedDepartment,
          class: doc.data().class || ''
        }))
        .filter(record => record.regNo && record.academicYear);
      
      setRecords(recordsData);
      if (recordsData.length === 0 && filterYear) {
        setMessage({ text: t.noRecords, type: 'info' });
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setMessage({ text: 'Error fetching records', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment, filterYear, t.noRecords]);

  // Function to fetch saved academic years from database
  const fetchSavedAcademicYears = useCallback(async () => {
    try {
      if (!selectedDepartment) return;
      
      const q = query(
        collection(db, `general-register-${selectedDepartment}`), 
        orderBy('academicYear', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const years = [...new Set(querySnapshot.docs.map(doc => doc.data().academicYear).filter(Boolean))];
      setSavedAcademicYears(years);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    setAcademicYears(generateAcademicYears());
    if (selectedDepartment) {
      fetchRecords();
      fetchSavedAcademicYears();
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [filterYear, selectedDepartment, filterClass, fetchRecords, fetchSavedAcademicYears]);

  // Fetch saved academic years when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchSavedAcademicYears();
    }
  }, [selectedDepartment, fetchSavedAcademicYears]);

  const uniqueClasses = [...new Set(records.map(record => record.class).filter(Boolean))];

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.regNo?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.uid?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.class?.toLowerCase().includes(searchText.toLowerCase());
    const matchesClass = !filterClass || record.class === filterClass;
    const matchesArchived = showArchived || !record.isArchived;
    return matchesSearch && matchesClass && matchesArchived;
  });

  const showForm = () => {
    setShowModal(true);
    setEditId(null);
    setSelectedRecord(null);
  };

  const hideForm = () => {
    setShowModal(false);
    setEditId(null);
    setSelectedRecord(null);
    setMessage({ text: '', type: '' });
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const validateAcademicYear = (year) => {
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(year)) {
      return 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)';
    }
    
    const [startYear, endYear] = year.split('-').map(Number);
    if (endYear !== startYear + 1) {
      return 'End year must be start year + 1 (e.g., 2024-2025)';
    }
    
    const currentYear = new Date().getFullYear();
    if (startYear < 1970 || startYear > currentYear + 10) {
      return `Start year must be between 1970 and ${currentYear + 10}`;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Validate academic year
      const academicYearError = validateAcademicYear(data.academicYear);
      if (academicYearError) {
        setMessage({ text: academicYearError, type: 'error' });
        return;
      }
      
      // Get teacher information
      const teacherInfo = getTeacherInfo();
      
      // Add metadata with teacher information
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
      data.department = selectedDepartment;
      
      // Teacher information
      data.submittedBy = teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown';
      data.submittedByName = teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown';
      data.submittedById = teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown';
      data.submittedByDepartment = teacherInfo?.department || 'Unknown';
      data.submittedByDesignation = teacherInfo?.designation || 'Unknown';
      data.submittedByEmployeeId = teacherInfo?.employeeId || 'Unknown';
      data.submittedAt = new Date().toISOString();

      if (editId) {
        // For updates, preserve original submission info and add update info
        data.updatedBy = teacherInfo?.email || localStorage.getItem('teacherEmail') || 'Unknown';
        data.updatedByName = teacherInfo?.name || localStorage.getItem('teacherName') || 'Unknown';
        data.updatedById = teacherInfo?.id || localStorage.getItem('teacherId') || 'Unknown';
        data.updatedByDepartment = teacherInfo?.department || 'Unknown';
        data.updatedByDesignation = teacherInfo?.designation || 'Unknown';
        data.updatedByEmployeeId = teacherInfo?.employeeId || 'Unknown';
        data.updatedAt = new Date().toISOString();
        
        await updateDoc(doc(db, `general-register-${selectedDepartment}`, editId), data);
        setMessage({ text: 'Record updated successfully', type: 'success' });
      } else {
        // For new records, add submission info
        await addDoc(collection(db, `general-register-${selectedDepartment}`), data);
        setMessage({ text: 'Record added successfully', type: 'success' });
      }

      await fetchRecords();
      await fetchSavedAcademicYears(); // Refresh academic years after saving
      setShowModal(false);
      setEditId(null);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({ text: 'Error saving record', type: 'error' });
    }
  };

  const handleEdit = async (record) => {
    try {
      setSelectedRecord(record);
      setEditId(record.id);
      setShowModal(true);
    } catch (error) {
      console.error('Error editing record:', error);
      setMessage({ text: 'Error editing record', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await deleteDoc(doc(db, `general-register-${selectedDepartment}`, id));
      setMessage({ text: 'Record deleted successfully!', type: 'success' });
      await fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setMessage({ text: 'Error deleting record', type: 'error' });
    }
  };

  const handleLockRecord = async (record) => {
    try {
      await updateDoc(doc(db, `general-register-${selectedDepartment}`, record.id), {
        isLocked: !record.isLocked,
        updatedAt: new Date().toISOString()
      });
      setMessage({ 
        text: record.isLocked ? t.recordUnlocked : t.recordLocked, 
        type: 'success' 
      });
      await fetchRecords();
    } catch (error) {
      console.error('Error updating record lock status:', error);
      setMessage({ text: 'Error updating record status', type: 'error' });
    }
  };

  const handleArchiveRecord = async (record) => {
    try {
      await updateDoc(doc(db, `general-register-${selectedDepartment}`, record.id), {
        isArchived: !record.isArchived,
        updatedAt: new Date().toISOString()
      });
      setMessage({ 
        text: record.isArchived ? 'Record unarchived successfully' : 'Record archived successfully', 
        type: 'success' 
      });
      await fetchRecords();
    } catch (error) {
      console.error('Error updating record archive status:', error);
      setMessage({ text: 'Error updating record status', type: 'error' });
    }
  };

  const handleMenuOpen = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecordForMenu(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecordForMenu(null);
  };

  const handleExportRecord = (record) => {
    const data = [
      ['Field', 'Value'],
      ['Academic Year', record.academicYear],
      ['Reg No', record.regNo],
      ['UID', record.uid],
      ['Name', record.name],
      ['Class', record.class],
      ['Mother Name', record.motherName],
      ['Nationality', record.nationality],
      ['Religion', record.religion],
      ['Mother Tongue', record.motherTongue],
      ['Caste', record.caste],
      ['Sub Caste', record.subCaste],
      ['Birth Place', record.birthPlace],
      ['Date of Birth', record.dob],
      ['Date of Birth (Words)', record.dobWords],
      ['Last School', record.lastSchool],
      ['Admitted Std', record.admittedStd],
      ['Studied In', record.studiedIn],
      ['Progress', record.progress],
      ['Conduct', record.conduct],
      ['Reason of Leaving', record.reasonLeaving],
      ['Date of Leaving LC', record.dateOfLeavingLC],
      ['Guardian Sign', record.guardianSign],
      ['Department', departments[record.department]?.name.en || record.department],
      ['Status', record.isLocked ? 'Locked' : record.isArchived ? 'Archived' : 'Active']
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GR_${record.regNo}_${record.name}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateCertificate = (type, record) => {
    setCertificateType(type);
    setCertificateData(record);
    setShowCertificateModal(true);
    setPrintMode(false);
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setCertificateType('');
    setCertificateData(null);
    setPrintMode(false);
  };

  const handlePrintCertificate = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const handlePrintRecord = (record) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>General Register - ${record.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .record-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .record-table th, .record-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .record-table th { background-color: #f2f2f2; }
            .metadata { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .metadata h3 { margin-top: 0; color: #1a237e; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>General Register</h1>
            <h2>${departments[record.department]?.name.en || record.department} - ${record.academicYear}</h2>
          </div>
          <table class="record-table">
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Reg No</td><td>${record.regNo}</td></tr>
            <tr><td>Name</td><td>${record.name}</td></tr>
            <tr><td>Class</td><td>${record.class}</td></tr>
            <tr><td>Mother Name</td><td>${record.motherName}</td></tr>
            <tr><td>Date of Birth</td><td>${record.dob}</td></tr>
            <tr><td>Nationality</td><td>${record.nationality}</td></tr>
            <tr><td>Religion</td><td>${record.religion}</td></tr>
            <tr><td>UID</td><td>${record.uid}</td></tr>
            <tr><td>Mother Tongue</td><td>${record.motherTongue}</td></tr>
            <tr><td>Caste</td><td>${record.caste}</td></tr>
            <tr><td>Sub Caste</td><td>${record.subCaste}</td></tr>
            <tr><td>Birth Place</td><td>${record.birthPlace}</td></tr>
            <tr><td>Date of Birth (Words)</td><td>${record.dobWords}</td></tr>
            <tr><td>Last School</td><td>${record.lastSchool}</td></tr>
            <tr><td>Admitted Std</td><td>${record.admittedStd}</td></tr>
            <tr><td>Studied In</td><td>${record.studiedIn}</td></tr>
            <tr><td>Progress</td><td>${record.progress}</td></tr>
            <tr><td>Conduct</td><td>${record.conduct}</td></tr>
            <tr><td>Reason of Leaving</td><td>${record.reasonLeaving}</td></tr>
            <tr><td>Date of Leaving LC</td><td>${record.dateOfLeavingLC}</td></tr>
            <tr><td>Guardian Sign</td><td>${record.guardianSign}</td></tr>
          </table>
          
          <div class="metadata">
            <h3>Record Information</h3>
            <p><strong>Department:</strong> ${departments[record.department]?.name.en || record.department}</p>
            <p><strong>Submitted By:</strong> ${record.submittedByName || record.submittedBy || 'Unknown'}</p>
            <p><strong>Submitted At:</strong> ${record.submittedAt ? new Date(record.submittedAt).toLocaleString() : 'Unknown'}</p>
            ${record.updatedBy ? `<p><strong>Last Updated By:</strong> ${record.updatedByName || record.updatedBy}</p>` : ''}
            ${record.updatedAt ? `<p><strong>Last Updated At:</strong> ${new Date(record.updatedAt).toLocaleString()}</p>` : ''}
            <p><strong>Record Status:</strong> ${record.isLocked ? 'Locked' : record.isArchived ? 'Archived' : 'Active'}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };





  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  return (
    <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      {/* Header with session timeout */}
      <TeacherHeader 
        title="General Register"
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
        showBackButton={true}
        onBackClick={() => window.history.back()}
      />
      
      <Box sx={{ p: 3 }}>
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

      {/* Department Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>{t.department}</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            label={t.department}
          >
            <MenuItem value="">{t.selectDepartment}</MenuItem>
            {Object.entries(departments).map(([key, dept]) => (
              <MenuItem key={key} value={key}>
                {dept.name[language]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!selectedDepartment ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {t.noDepartmentSelected}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              variant="outlined"
              placeholder={t.searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t.filterYear}</InputLabel>
              <Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                label={t.filterYear}
              >
                <MenuItem value="">All Years</MenuItem>
                {savedAcademicYears.length > 0 && (
                  <>
                    <MenuItem disabled>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Saved Years
                      </Typography>
                    </MenuItem>
                    {savedAcademicYears.map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                    <MenuItem disabled>
                      <Divider />
                    </MenuItem>
                  </>
                )}
                <MenuItem disabled>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    All Available Years
                  </Typography>
                </MenuItem>
                {academicYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t.filterClass}</InputLabel>
              <Select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                label={t.filterClass}
              >
                <MenuItem value="">All Classes</MenuItem>
                {uniqueClasses.length > 0 ? (
                  uniqueClasses.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))
                ) : (
                  departments[selectedDepartment]?.classes.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Show Records</InputLabel>
              <Select
                value={showArchived ? 'archived' : 'active'}
                onChange={(e) => setShowArchived(e.target.value === 'archived')}
                label="Show Records"
              >
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="archived">Include Archived</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={showForm}
              sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
            >
              {t.addEntry}
            </Button>
          </Box>
          <Divider sx={{ mb: 3, borderColor: '#1a237e', borderWidth: 1 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {filteredRecords.length === 0 && (
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
                    fontSize: '0.875rem',
                    borderRight: '1px solid #ddd'
                  },
                  '& .MuiTableCell-root:last-child': {
                    borderRight: 'none'
                  }
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.academicYear}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.regNo}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.uid}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.name}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.class}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.motherName}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.nationality}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.formLabels.religion}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{t.status}</TableCell>
                      <TableCell>{t.actions}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.academicYear}</TableCell>
                        <TableCell>{record.regNo}</TableCell>
                        <TableCell>{record.uid}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.motherName}</TableCell>
                        <TableCell>{record.nationality}</TableCell>
                        <TableCell>{record.religion}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {record.isLocked && (
                              <Chip 
                                icon={<LockIcon />} 
                                label={t.recordLocked} 
                                size="small" 
                                color="warning" 
                              />
                            )}
                            {record.isArchived && (
                              <Chip 
                                icon={<ArchiveIcon />} 
                                label={t.archived} 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                              />
                            )}
                            {!record.isLocked && !record.isArchived && (
                              <Chip 
                                label={t.active} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton onClick={() => handleView(record)} color="primary">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {!record.isLocked && (
                              <Tooltip title="Edit">
                                <IconButton onClick={() => handleEdit(record)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="More Actions">
                              <IconButton onClick={(e) => handleMenuOpen(e, record)}>
                                <FilterIcon />
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
                <Typography>{t.totalRecords}: {filteredRecords.length}</Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showModal} onClose={hideForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editId ? t.editStudentDetails : t.enterStudentDetails}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  required
                  name="academicYear"
                  label={t.formLabels.academicYear}
                  defaultValue={editId ? selectedRecord?.academicYear : ''}
                  placeholder="e.g., 2024-2025"
                  helperText={
                    <Box>
                      <Typography variant="caption" display="block">
                        Enter academic year in format YYYY-YYYY (e.g., 2024-2025)
                      </Typography>
                      {savedAcademicYears.length > 0 && (
                        <Typography variant="caption" color="primary" display="block">
                          Recently used: {savedAcademicYears.slice(0, 3).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  }
                  inputProps={{
                    pattern: "\\d{4}-\\d{4}",
                    title: "Academic year should be in format YYYY-YYYY"
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
                {!editId && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="textSecondary">
                      Quick fill:
                    </Typography>
                    {academicYears.slice(0, 3).map(year => (
                      <Button
                        key={year}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const input = document.querySelector('input[name="academicYear"]');
                          if (input) {
                            input.value = year;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                          }
                        }}
                        sx={{ 
                          minWidth: 'auto', 
                          fontSize: '0.75rem',
                          py: 0.5,
                          px: 1
                        }}
                      >
                        {year}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
              <FormControl fullWidth required>
                <InputLabel>{t.formLabels.class}</InputLabel>
                <Select
                  name="class"
                  label={t.formLabels.class}
                  defaultValue={editId ? selectedRecord?.class : ''}
                >
                  {departments[selectedDepartment]?.classes.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                name="regNo"
                label={t.formLabels.regNo}
                fullWidth
                defaultValue={editId ? selectedRecord?.regNo : ''}
              />
              <TextField
                required
                name="uid"
                label={t.formLabels.uid}
                fullWidth
                defaultValue={editId ? selectedRecord?.uid : ''}
              />
              <TextField
                required
                name="name"
                label={t.formLabels.name}
                fullWidth
                defaultValue={editId ? selectedRecord?.name : ''}
              />
              <TextField
                name="motherName"
                label={t.formLabels.motherName}
                fullWidth
                defaultValue={editId ? selectedRecord?.motherName : ''}
              />
              <TextField
                name="nationality"
                label={t.formLabels.nationality}
                fullWidth
                defaultValue={editId ? selectedRecord?.nationality : ''}
              />
              <TextField
                name="motherTongue"
                label={t.formLabels.motherTongue}
                fullWidth
                defaultValue={editId ? selectedRecord?.motherTongue : ''}
              />
              <TextField
                name="religion"
                label={t.formLabels.religion}
                fullWidth
                defaultValue={editId ? selectedRecord?.religion : ''}
              />
              <TextField
                name="caste"
                label={t.formLabels.caste}
                fullWidth
                defaultValue={editId ? selectedRecord?.caste : ''}
              />
              <TextField
                name="subCaste"
                label={t.formLabels.subCaste}
                fullWidth
                defaultValue={editId ? selectedRecord?.subCaste : ''}
              />
              <TextField
                name="birthPlace"
                label={t.formLabels.birthPlace}
                fullWidth
                defaultValue={editId ? selectedRecord?.birthPlace : ''}
              />
              <TextField
                name="dob"
                label={t.formLabels.dob}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                defaultValue={editId ? selectedRecord?.dob : ''}
              />
              <TextField
                name="dobWords"
                label={t.formLabels.dobWords}
                fullWidth
                defaultValue={editId ? selectedRecord?.dobWords : ''}
              />
              <TextField
                name="lastSchool"
                label={t.formLabels.lastSchool}
                fullWidth
                defaultValue={editId ? selectedRecord?.lastSchool : ''}
              />
              <TextField
                name="admittedStd"
                label={t.formLabels.admittedStd}
                fullWidth
                defaultValue={editId ? selectedRecord?.admittedStd : ''}
              />
              <TextField
                name="studiedIn"
                label={t.formLabels.studiedIn}
                fullWidth
                defaultValue={editId ? selectedRecord?.studiedIn : ''}
              />
              <TextField
                name="progress"
                label={t.formLabels.progress}
                fullWidth
                defaultValue={editId ? selectedRecord?.progress : ''}
              />
              <TextField
                name="conduct"
                label={t.formLabels.conduct}
                fullWidth
                defaultValue={editId ? selectedRecord?.conduct : ''}
              />
              <TextField
                name="reasonLeaving"
                label={t.formLabels.reasonLeaving}
                fullWidth
                defaultValue={editId ? selectedRecord?.reasonLeaving : ''}
              />
              <TextField
                name="dateOfLeavingLC"
                label={t.formLabels.dateOfLeavingLC}
                fullWidth
                defaultValue={editId ? selectedRecord?.dateOfLeavingLC : ''}
              />
              <TextField
                name="guardianSign"
                label={t.formLabels.guardianSign}
                fullWidth
                defaultValue={editId ? selectedRecord?.guardianSign : ''}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={hideForm}>{t.cancel}</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}>
              {editId ? t.update : t.save}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Record Dialog */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.academicYear}:</Typography>
                <Typography>{selectedRecord.academicYear}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.regNo}:</Typography>
                <Typography>{selectedRecord.regNo}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.uid}:</Typography>
                <Typography>{selectedRecord.uid}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.name}:</Typography>
                <Typography>{selectedRecord.name}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.class}:</Typography>
                <Typography>{selectedRecord.class}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.motherName}:</Typography>
                <Typography>{selectedRecord.motherName}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.nationality}:</Typography>
                <Typography>{selectedRecord.nationality}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.motherTongue}:</Typography>
                <Typography>{selectedRecord.motherTongue}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.religion}:</Typography>
                <Typography>{selectedRecord.religion}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.caste}:</Typography>
                <Typography>{selectedRecord.caste}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.subCaste}:</Typography>
                <Typography>{selectedRecord.subCaste}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.birthPlace}:</Typography>
                <Typography>{selectedRecord.birthPlace}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.dob}:</Typography>
                <Typography>{selectedRecord.dob}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.dobWords}:</Typography>
                <Typography>{selectedRecord.dobWords}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.lastSchool}:</Typography>
                <Typography>{selectedRecord.lastSchool}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.admittedStd}:</Typography>
                <Typography>{selectedRecord.admittedStd}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.studiedIn}:</Typography>
                <Typography>{selectedRecord.studiedIn}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.progress}:</Typography>
                <Typography>{selectedRecord.progress}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.conduct}:</Typography>
                <Typography>{selectedRecord.conduct}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.reasonLeaving}:</Typography>
                <Typography>{selectedRecord.reasonLeaving}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.dateOfLeavingLC}:</Typography>
                <Typography>{selectedRecord.dateOfLeavingLC}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t.formLabels.guardianSign}:</Typography>
                <Typography>{selectedRecord.guardianSign}</Typography>
              </Box>
              
              {/* Submission Information */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Record Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Department:</Typography>
                <Typography>{departments[selectedRecord.department]?.name[language] || selectedRecord.department}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Submitted By:</Typography>
                <Typography>{selectedRecord.submittedByName || selectedRecord.submittedBy || 'Unknown'}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Submitted At:</Typography>
                <Typography>{selectedRecord.submittedAt ? new Date(selectedRecord.submittedAt).toLocaleString() : 'Unknown'}</Typography>
                {selectedRecord.updatedBy && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Last Updated By:</Typography>
                    <Typography>{selectedRecord.updatedByName || selectedRecord.updatedBy}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Last Updated At:</Typography>
                    <Typography>{selectedRecord.updatedAt ? new Date(selectedRecord.updatedAt).toLocaleString() : 'Unknown'}</Typography>
                  </>
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Record Status:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedRecord.isLocked && (
                    <Chip 
                      icon={<LockIcon />} 
                      label={t.recordLocked} 
                      size="small" 
                      color="warning" 
                    />
                  )}
                  {selectedRecord.isArchived && (
                    <Chip 
                      icon={<ArchiveIcon />} 
                      label={t.archived} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  )}
                  {!selectedRecord.isLocked && !selectedRecord.isArchived && (
                    <Chip 
                      label={t.active} 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedRecordForMenu && (
          <>
            <MenuItem onClick={() => {
              handlePrintRecord(selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t.printRecord}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleExportRecord(selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <ExportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t.exportRecord}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleLockRecord(selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                {selectedRecordForMenu.isLocked ? <UnlockIcon fontSize="small" /> : <LockIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>
                {selectedRecordForMenu.isLocked ? t.unlockRecord : t.lockRecord}
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleArchiveRecord(selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <ArchiveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {selectedRecordForMenu.isArchived ? t.unarchiveRecord : t.archiveRecord}
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleGenerateCertificate('bonafide', selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <CertificateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t.generateBonafide}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleGenerateCertificate('leaving', selectedRecordForMenu);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <CertificateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t.generateLeaving}</ListItemText>
            </MenuItem>
            {!selectedRecordForMenu.isLocked && (
              <MenuItem onClick={() => {
                handleDelete(selectedRecordForMenu.id);
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Certificate Modal */}
      <Dialog 
        open={showCertificateModal} 
        onClose={handleCloseCertificateModal} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogContent>
          {printMode ? (
            <Box className="print-certificate" sx={{ 
              maxWidth: 900, 
              mx: 'auto', 
              p: 4, 
              bgcolor: '#fff', 
              border: '2px solid #000', 
              borderRadius: 0, 
              boxShadow: 0,
              fontFamily: 'Times New Roman, serif',
              position: 'relative'
            }}>
              {certificateType === 'bonafide' ? (
                // Bonafide Certificate Layout - Exact same as original
                <>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <img src={logo} alt="School Logo" style={{ width: 100, marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Shahu Dayanand High School & Junior College
                    </Typography>
                    <Typography variant="subtitle1">Kolhapur, Maharashtra</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                      BONAFIDE CERTIFICATE
                    </Typography>
                  </Box>
                  <Box sx={{ border: '1px solid #000', p: 2, mb: 4 }}>
                    <Typography sx={{ mb: 1 }}><b>Certificate No:</b> {certificateData?.regNo || '__________'}</Typography>
                    <Typography sx={{ mb: 1 }}><b>Date of Issue:</b> {new Date().toLocaleDateString('en-GB')}</Typography>
                  </Box>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    This is to certify that <b>{certificateData?.name || '____________________________'}</b>, son/daughter of Mr. <b>{certificateData?.fatherName || '____________________________'}</b> and Mrs. <b>{certificateData?.motherName || '____________________________'}</b>, is a bonafide student of this institution. The student is studying in <b>{certificateData?.class || '__________'}</b> and was admitted with Admission No. <b>{certificateData?.regNo || '__________'}</b>.
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>Date of Birth:</b> {certificateData?.dob ? new Date(certificateData.dob).toLocaleDateString('en-GB') : '____________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>Nationality:</b> {certificateData?.nationality || '____________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>UID:</b> {certificateData?.uid || '____________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>Department:</b> {departments[certificateData?.department]?.name.en || certificateData?.department || '____________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>Remarks:</b> N/A
                  </Typography>
                  <Box sx={{ borderTop: '1px solid #000', mt: 4, pt: 2 }}>
                    <Typography sx={{ textAlign: 'left', mb: 1 }}>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography>Principal</Typography>
                      <Typography>Seal/Stamp</Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                // Leaving Certificate Layout - Exact same as original with watermark
                <Box className="leaving-certificate">
                  <>
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
                    <Typography sx={{ mb: 1 }}><b>Register Number:</b> {certificateData?.regNo || '__________'}</Typography>
                    <Typography sx={{ mb: 1 }}><b>Student ID:</b> {certificateData?.uid || '__________'}</Typography>
                  </Box>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>1. Name of Pupil:</b> {certificateData?.name || '____________________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>2. Name of Mother:</b> {certificateData?.motherName || '____________________________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>3. Race and Caste (with Sub-Caste):</b> {certificateData?.caste || '__________'} ({certificateData?.subCaste || '__________'})
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>4. Nationality:</b> {certificateData?.nationality || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>5. Place of Birth:</b> {certificateData?.birthPlace || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>6. Date of Birth:</b> {certificateData?.dobWords || '____________________'} ({certificateData?.dob || '__________'})
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>7. Last School Attended:</b> {certificateData?.lastSchool || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>8. Date of Admission:</b> {certificateData?.admittedStd || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>9. Progress:</b> {certificateData?.progress || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>10. Conduct:</b> {certificateData?.conduct || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>11. Date of Leaving School:</b> {new Date().toLocaleDateString('en-GB')}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>12. Standard in which studying and since when:</b> {certificateData?.studiedIn || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>13. Reason of Leaving School:</b> {certificateData?.reasonLeaving || '__________'}
                  </Typography>
                  <Typography sx={{ textAlign: 'justify', mb: 2 }}>
                    <b>14. Remarks:</b> N/A
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
                  </>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {certificateType === 'bonafide' ? 'Bonafide Certificate' : 'Leaving Certificate'} Preview
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Click "Print Certificate" to generate and print the {certificateType === 'bonafide' ? 'Bonafide' : 'Leaving'} Certificate for {certificateData?.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handlePrintCertificate}
                  startIcon={<PrintIcon />}
                  sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
                >
                  Print Certificate
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseCertificateModal}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
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
      
      {/* Session Timeout Warning */}
      <SessionTimeoutWarning
        open={showWarning}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
        totalMinutes={30}
      />
      </Box>
    </Box>
  );
}

export default GeneralRegister;