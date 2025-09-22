import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Stepper, Step, StepLabel, Typography, TextField, Grid, MenuItem, Checkbox, FormControlLabel, InputLabel, Select, FormControl, FormGroup, Avatar, Paper, Card, Alert, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Save, School, Payment, ArrowBack } from '@mui/icons-material';
import logo from '../assets/SDHJC_Logo.png';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fetchFeeStructure, calculateTotalFee } from '../utils/feeUtils';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const getSteps = (language) => {
  const t = translations[language]?.admissionForm?.steps || translations?.en?.admissionForm?.steps;
  if (!t) {
    // Fallback based on language
    if (language === 'mr') {
      return [
        'विभाग निवड',
        'वैयक्तिक माहिती',
        'शैक्षणिक माहिती',
        'पालक/पालक तपशील',
        'फी माहिती',
        'दस्तऐवज अपलोड',
        'पुनरावलोकन आणि सबमिट',
      ];
    } else {
      return [
        'Department Selection',
        'Personal Information',
        'Academic Information',
        'Parent/Guardian Details',
        'Fee Information',
        'Document Upload',
        'Review & Submit',
      ];
    }
  }
  return [
    t.departmentSelection,
    t.personalInformation,
    t.academicInformation,
    t.parentGuardianDetails,
    t.feeInformation,
    t.documentUpload,
    t.reviewSubmit,
  ];
};

// Department configurations
const getDepartments = (language) => {
  const t = translations[language]?.admissionForm?.departments || translations?.en?.admissionForm?.departments;
  if (!t) {
    // Fallback based on language
    if (language === 'mr') {
      return {
        highSchool: {
          name: 'हायस्कूल',
          prefix: 'HS',
          classes: ['5th', '6th', '7th', '8th', '9th', '10th'],
          sections: ['A', 'B', 'C', 'D'],
          feeStructure: {
            '5th': 15000, '6th': 16000, '7th': 17000, '8th': 18000, '9th': 19000, '10th': 20000
          }
        },
        college: {
          name: 'कॉलेज',
          prefix: 'CL',
          classes: ['11th', '12th', 'FYJC', 'SYJC'],
          sections: ['A', 'B', 'C'],
          feeStructure: {
            '11th': 25000, '12th': 26000, 'FYJC': 27000, 'SYJC': 28000
          }
        },
        marathiSchool: {
          name: 'मराठी शाळा',
          prefix: 'MS',
          classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
          sections: ['A', 'B', 'C'],
          feeStructure: {
            '1st': 12000, '2nd': 13000, '3rd': 14000, '4th': 14500, '5th': 15000, '6th': 15500, '7th': 16000, '8th': 16500
          }
        },
        kindergarten: {
          name: 'बालवाडी',
          prefix: 'KG',
          classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG'],
          sections: ['A', 'B'],
          feeStructure: {
            'Nursery': 10000, 'LKG': 11000, 'UKG': 12000, 'Jr.KG': 12500, 'Sr.KG': 13000
          }
        }
      };
    } else {
      return {
        highSchool: {
          name: 'High School',
          prefix: 'HS',
          classes: ['5th', '6th', '7th', '8th', '9th', '10th'],
          sections: ['A', 'B', 'C', 'D'],
          feeStructure: {
            '5th': 15000, '6th': 16000, '7th': 17000, '8th': 18000, '9th': 19000, '10th': 20000
          }
        },
        college: {
          name: 'College',
          prefix: 'CL',
          classes: ['11th', '12th', 'FYJC', 'SYJC'],
          sections: ['A', 'B', 'C'],
          feeStructure: {
            '11th': 25000, '12th': 26000, 'FYJC': 27000, 'SYJC': 28000
          }
        },
        marathiSchool: {
          name: 'Marathi School',
          prefix: 'MS',
          classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
          sections: ['A', 'B', 'C'],
          feeStructure: {
            '1st': 12000, '2nd': 13000, '3rd': 14000, '4th': 14500, '5th': 15000, '6th': 15500, '7th': 16000, '8th': 16500
          }
        },
        kindergarten: {
          name: 'Kindergarten',
          prefix: 'KG',
          classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG'],
          sections: ['A', 'B'],
          feeStructure: {
            'Nursery': 10000, 'LKG': 11000, 'UKG': 12000, 'Jr.KG': 12500, 'Sr.KG': 13000
          }
        }
      };
    }
  }
  return {
    highSchool: {
      name: t.highSchool,
      prefix: 'HS',
      classes: ['5th', '6th', '7th', '8th', '9th', '10th'],
      sections: ['A', 'B', 'C', 'D'],
      feeStructure: {
        '5th': 15000, '6th': 16000, '7th': 17000, '8th': 18000, '9th': 19000, '10th': 20000
      }
    },
    college: {
      name: t.college,
      prefix: 'CL',
      classes: ['11th', '12th', 'FYJC', 'SYJC'],
      sections: ['A', 'B', 'C'],
      feeStructure: {
        '11th': 25000, '12th': 26000, 'FYJC': 27000, 'SYJC': 28000
      }
    },
    marathiSchool: {
      name: t.marathiSchool,
      prefix: 'MS',
      classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
      sections: ['A', 'B', 'C'],
      feeStructure: {
        '1st': 12000, '2nd': 13000, '3rd': 14000, '4th': 14500, '5th': 15000, '6th': 15500, '7th': 16000, '8th': 16500
      }
    },
    kindergarten: {
      name: t.kindergarten,
      prefix: 'KG',
      classes: ['Nursery', 'LKG', 'UKG', 'Jr.KG', 'Sr.KG'],
      sections: ['A', 'B'],
      feeStructure: {
        'Nursery': 10000, 'LKG': 11000, 'UKG': 12000, 'Jr.KG': 12500, 'Sr.KG': 13000
      }
    }
  };
};

const initialState = {
  // Department Selection
  department: '', class: '', section: '', academicYear: '',
  
  // Personal Information
  firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '', nationality: '', aadhar: '',
  mobile: '', email: '', permAddress: '', currAddress: '', sameAddress: false, city: '', state: '', pin: '',
  
  // Academic Information
  prevSchool: '', prevClass: '', board: '', marks: '', transferCert: null,
  category: '', religion: '', medium: '', firstLang: '', secondLang: '',
  
  // Parent/Guardian Details
  fatherName: '', fatherContact: '', fatherOccupation: '', motherName: '', motherContact: '', motherOccupation: '',
  guardianName: '', guardianContact: '', guardianOccupation: '', guardianRelation: '', guardianAddress: '',
  
  // Fee Information
  feeAmount: 0, scholarshipAmount: 0, paymentMode: '', paymentStatus: 'pending', feeReceipt: null,
  
  // Documents
  photo: null, birthCert: null, addressProof: null, aadharProof: null, marksheet: null, casteCert: null,
  
  // Auto-generated
  grNumber: '', rollNumber: '', classTeacher: '',
  
  // Additional
  hostelRequired: false, hostelBlock: '', hostelRoom: '',
  
  // Declaration
  declareTrue: false, agreeTerms: false,
};

const getGenderOptions = (language) => {
  const t = translations[language]?.admissionForm?.genderOptions || translations?.en?.admissionForm?.genderOptions;
  if (!t) {
    if (language === 'mr') {
      return ['पुरुष', 'स्त्री', 'इतर'];
    } else {
      return ['Male', 'Female', 'Other'];
    }
  }
  return [t.male, t.female, t.other];
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const getCategories = (language) => {
  const t = translations[language]?.admissionForm?.categories || translations?.en?.admissionForm?.categories;
  if (!t) {
    if (language === 'mr') {
      return ['सामान्य', 'अनुसूचित जाती', 'अनुसूचित जमाती', 'इतर मागासवर्गीय', 'इतर'];
    } else {
      return ['General', 'SC', 'ST', 'OBC', 'Other'];
    }
  }
  return [t.general, t.sc, t.st, t.obc, t.other];
};

const getMediums = (language) => {
  const t = translations[language]?.admissionForm?.mediums || translations?.en?.admissionForm?.mediums;
  if (!t) {
    if (language === 'mr') {
      return ['इंग्रजी', 'मराठी', 'हिंदी', 'इतर'];
    } else {
      return ['English', 'Marathi', 'Hindi', 'Other'];
    }
  }
  return [t.english, t.marathi, t.hindi, t.other];
};

const getPaymentModes = (language) => {
  const t = translations[language]?.admissionForm?.paymentModes || translations?.en?.admissionForm?.paymentModes;
  if (!t) {
    if (language === 'mr') {
      return ['रोख', 'बँक ट्रान्सफर', 'ऑनलाइन पेमेंट', 'धनादेश'];
    } else {
      return ['Cash', 'Bank Transfer', 'Online Payment', 'Cheque'];
    }
  }
  return [t.cash, t.bankTransfer, t.onlinePayment, t.cheque];
};

const academicYears = ['2024-2025', '2025-2026', '2026-2027'];
const hostelBlocks = ['A', 'B', 'C', 'D'];
const hostelRooms = Array.from({ length: 50 }, (_, i) => (i + 1).toString().padStart(3, '0'));

function AdmissionForm() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language]?.admissionForm || translations?.en?.admissionForm || (language === 'mr' ? {
    title: 'विद्यार्थी प्रवेश',
    subtitle: 'आमच्यासोबत तुमचा शैक्षणिक प्रवास सुरू करा',
    stepProgress: 'पायरी {current} पैकी {total}',
    chooseAcademicPath: 'तुमचा शैक्षणिक मार्ग निवडा',
    selectDepartmentClass: 'आमच्यासोबत तुमचा शैक्षणिक प्रवास सुरू करण्यासाठी तुमचा विभाग आणि वर्ग निवडा',
    department: 'विभाग',
    class: 'वर्ग',
    section: 'गट',
    academicYear: 'शैक्षणिक वर्ष',
    annualFeeAmount: 'वार्षिक फी रक्कम',
    back: 'परत',
    next: 'पुढे',
    submitAdmission: 'प्रवेश सबमिट करा',
    processing: 'प्रक्रिया करत आहे...',
    admissionSubmitted: 'प्रवेश यशस्वीरित्या सबमिट केला! जी.आर. क्रमांक: {grNumber}',
    errorSubmitting: 'प्रवेश सबमिट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.',
    backToDashboard: 'डॅशबोर्डवर परत जा'
  } : {
    title: 'Student Admission',
    subtitle: 'Begin your academic journey with us',
    stepProgress: 'Step {current} of {total}',
    chooseAcademicPath: 'Choose Your Academic Path',
    selectDepartmentClass: 'Select your department and class to begin your educational journey with us',
    department: 'Department',
    class: 'Class',
    section: 'Section',
    academicYear: 'Academic Year',
    annualFeeAmount: 'Annual Fee Amount',
    back: 'Back',
    next: 'Next',
    submitAdmission: 'Submit Admission',
    processing: 'Processing...',
    admissionSubmitted: 'Admission submitted successfully! GR Number: {grNumber}',
    errorSubmitting: 'Error submitting admission. Please try again.',
    backToDashboard: 'Back to Dashboard'
  });
  const steps = getSteps(language);
  const departments = getDepartments(language);
  const genderOptions = getGenderOptions(language);
  const categories = getCategories(language);
  const mediums = getMediums(language);
  const paymentModes = getPaymentModes(language);
  
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [generatedGR, setGeneratedGR] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'sameAddress' && checked ? { currAddress: prev.permAddress } : {}),
      ...(name === 'department' && value ? { class: '', section: '', feeAmount: 0 } : {}),
    }));

    // Auto-fetch fee structure when department, class, or academic year changes
    if (name === 'department' || name === 'class' || name === 'academicYear') {
      const newForm = {
        ...form,
        [name]: value,
        ...(name === 'department' && value ? { class: '', section: '', feeAmount: 0 } : {}),
      };

      if (newForm.department && newForm.class && newForm.academicYear) {
        try {
          const result = await fetchFeeStructure(newForm.department, newForm.class, newForm.academicYear);
          if (result.success) {
            const totalFee = calculateTotalFee(result.data);
            setForm(prev => ({
              ...prev,
              [name]: value,
              ...(name === 'department' && value ? { class: '', section: '', feeAmount: 0 } : {}),
              feeAmount: totalFee
            }));
          } else {
            // If no fee structure found, set to 0
            setForm(prev => ({
              ...prev,
              [name]: value,
              ...(name === 'department' && value ? { class: '', section: '', feeAmount: 0 } : {}),
              feeAmount: 0
            }));
          }
        } catch (error) {
          console.error('Error fetching fee structure:', error);
          setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'department' && value ? { class: '', section: '', feeAmount: 0 } : {}),
            feeAmount: 0
          }));
        }
      }
    }
  };

  // Generate GR Number
  const generateGRNumber = async () => {
    if (!form.department || !form.class) return '';
    
    try {
      const currentYear = new Date().getFullYear();
      const prefix = departments[form.department].prefix;
      const year = currentYear.toString().slice(-2);
      
      // Get the last GR number for this department and year
      const q = query(
        collection(db, 'general-register'),
        where('department', '==', form.department),
        where('academicYear', '==', form.academicYear),
        orderBy('grNumber', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      let lastNumber = 0;
      
      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[0];
        const lastGR = lastDoc.data().grNumber;
        if (lastGR) {
          const match = lastGR.match(new RegExp(`${prefix}-${year}-(\\d+)`));
          if (match) {
            lastNumber = parseInt(match[1]);
          }
        }
      }
      
      const newNumber = lastNumber + 1;
      const grNumber = `${prefix}-${year}-${newNumber.toString().padStart(3, '0')}`;
      setGeneratedGR(grNumber);
      return grNumber;
    } catch (error) {
      console.error('Error generating GR number:', error);
      return '';
    }
  };

  // Auto-assign class teacher
  const assignClassTeacher = async () => {
    if (!form.department || !form.class) return '';
    
    try {
      const q = query(
        collection(db, 'teachers'),
        where('department', '==', form.department),
        where('assignedClass', '==', form.class)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const teacher = querySnapshot.docs[0].data();
        return teacher.name;
      }
      return 'To be assigned';
    } catch (error) {
      console.error('Error assigning class teacher:', error);
      return 'To be assigned';
    }
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const validateStep = () => {
    let stepErrors = {};
    
    if (activeStep === 0) {
      if (!form.department) stepErrors.department = 'Required';
      if (!form.class) stepErrors.class = 'Required';
      if (!form.section) stepErrors.section = 'Required';
      if (!form.academicYear) stepErrors.academicYear = 'Required';
    }
    
    if (activeStep === 1) {
      if (!form.firstName) stepErrors.firstName = 'Required';
      if (!form.lastName) stepErrors.lastName = 'Required';
      if (!form.dob) stepErrors.dob = 'Required';
      if (!form.gender) stepErrors.gender = 'Required';
      if (!form.nationality) stepErrors.nationality = 'Required';
      if (!form.mobile) stepErrors.mobile = 'Required';
      if (!form.email) stepErrors.email = 'Required';
      if (!form.permAddress) stepErrors.permAddress = 'Required';
      if (!form.city) stepErrors.city = 'Required';
      if (!form.state) stepErrors.state = 'Required';
      if (!form.pin) stepErrors.pin = 'Required';
    }
    
    if (activeStep === 2) {
      if (!form.prevSchool) stepErrors.prevSchool = 'Required';
      if (!form.prevClass) stepErrors.prevClass = 'Required';
    }
    
    if (activeStep === 3) {
      if (!form.fatherName) stepErrors.fatherName = 'Required';
      if (!form.fatherContact) stepErrors.fatherContact = 'Required';
      if (!form.motherName) stepErrors.motherName = 'Required';
      if (!form.motherContact) stepErrors.motherContact = 'Required';
    }
    
    if (activeStep === 4) {
      if (!form.paymentMode) stepErrors.paymentMode = 'Required';
    }
    
    if (activeStep === 5) {
      if (!form.photo) stepErrors.photo = 'Required';
      if (!form.birthCert) stepErrors.birthCert = 'Required';
    }
    
    if (activeStep === 6) {
      if (!form.declareTrue) stepErrors.declareTrue = 'Required';
      if (!form.agreeTerms) stepErrors.agreeTerms = 'Required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleBackToDashboard = () => navigate('/TeacherDashboard');

  // Helper to upload a file to Firebase Storage and return its download URL
  const uploadFile = async (file, path) => {
    if (!file) return '';
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);
    setSuccessMsg('');
    
    try {
      // Generate GR Number and assign class teacher
      const grNumber = await generateGRNumber();
      const classTeacher = await assignClassTeacher();
      
      // Upload files and get URLs
      const photoURL = await uploadFile(form.photo, 'admissions/photo');
      const birthCertURL = await uploadFile(form.birthCert, 'admissions/birthCert');
      const addressProofURL = await uploadFile(form.addressProof, 'admissions/addressProof');
      const aadharProofURL = await uploadFile(form.aadharProof, 'admissions/aadharProof');
      const marksheetURL = await uploadFile(form.marksheet, 'admissions/marksheet');
      const casteCertURL = await uploadFile(form.casteCert, 'admissions/casteCert');
      const transferCertURL = await uploadFile(form.transferCert, 'admissions/transferCert');
      const feeReceiptURL = await uploadFile(form.feeReceipt, 'admissions/feeReceipt');
      
      // Prepare data for Firestore
      const dataToSave = {
        ...form,
        grNumber,
        classTeacher,
        photo: photoURL,
        birthCert: birthCertURL,
        addressProof: addressProofURL,
        aadharProof: aadharProofURL,
        marksheet: marksheetURL,
        casteCert: casteCertURL,
        transferCert: transferCertURL,
        feeReceipt: feeReceiptURL,
        submittedAt: serverTimestamp(),
        submittedBy: localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: localStorage.getItem('teacherName') || 'Unknown',
        status: 'admitted'
      };
      
      // Remove file objects from dataToSave
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] instanceof File) dataToSave[key] = undefined;
      });
      
      // Save to newAdmission collection
      const admissionRef = await addDoc(collection(db, 'newAdmission'), dataToSave);
      
      // Auto-create student profile in General Register
      const generalRegisterData = {
        name: `${form.firstName} ${form.lastName}`,
        regNo: grNumber,
        uid: form.aadhar,
        class: form.class,
        section: form.section,
        department: form.department,
        academicYear: form.academicYear,
        motherName: form.motherName,
        nationality: form.nationality,
        motherTongue: form.firstLang,
        religion: form.religion,
        caste: form.category,
        birthPlace: form.city,
        dob: form.dob,
        dobWords: form.dob,
        lastSchool: form.prevSchool,
        admittedStd: `${form.class} ${form.section}`,
        studiedIn: form.prevClass,
        progress: 'Good',
        conduct: 'Good',
        reasonLeaving: 'Admission to new school',
        dateOfLeavingLC: new Date().toISOString().split('T')[0],
        guardianSign: form.fatherName,
        submittedBy: localStorage.getItem('teacherEmail') || 'Unknown',
        submittedByName: localStorage.getItem('teacherName') || 'Unknown',
        submittedAt: serverTimestamp(),
        admissionId: admissionRef.id
      };
      
      await addDoc(collection(db, 'general-register'), generalRegisterData);
      
      // Auto-create student profile in Hostel if required
      if (form.hostelRequired) {
        const hostelData = {
          name: `${form.firstName} ${form.lastName}`,
          regNo: grNumber,
          class: form.class,
          department: form.department,
          roomNumber: form.hostelRoom,
          block: form.hostelBlock,
          addedToHostelAt: serverTimestamp(),
          addedBy: localStorage.getItem('teacherEmail') || 'Unknown',
          addedByName: localStorage.getItem('teacherName') || 'Unknown',
          hostelStatus: 'active',
          admissionId: admissionRef.id
        };
        
        await addDoc(collection(db, 'hostel-students'), hostelData);
      }
      
      setSuccessMsg(t.admissionSubmitted.replace('{grNumber}', grNumber));
      setShowReceiptDialog(true);
      setForm(initialState);
      setActiveStep(0);
      setErrors({});
      
    } catch (err) {
      setSuccessMsg(t.errorSubmitting);
      console.error(err);
    }
    setSubmitting(false);
  };

  const stepContent = [
    // 0. Department Selection
    <Box key="department" sx={{ 
      p: 4, 
      bgcolor: 'rgba(255,255,255,0.8)', 
      borderRadius: 4, 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <School sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#1f2937',
          mb: 1
        }}>
          {t.chooseAcademicPath}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#6b7280',
          maxWidth: 600,
          mx: 'auto'
        }}>
          {t.selectDepartmentClass}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            }
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1f2937', fontWeight: 600 }}>
              {t.department} *
            </Typography>
            <FormControl fullWidth error={!!errors.department}>
              <Select 
                name="department" 
                value={form.department} 
                onChange={handleChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }}
              >
                {Object.entries(departments).map(([key, dept]) => (
                  <MenuItem key={key} value={key} sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <School sx={{ color: '#667eea' }} />
                      <Typography sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            }
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1f2937', fontWeight: 600 }}>
              {t.class} *
            </Typography>
            <FormControl fullWidth error={!!errors.class}>
              <Select 
                name="class" 
                value={form.class} 
                onChange={handleChange} 
                disabled={!form.department}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }}
              >
                {form.department && departments[form.department]?.classes.map(cls => (
                  <MenuItem key={cls} value={cls} sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>{cls}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            }
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1f2937', fontWeight: 600 }}>
              {t.section} *
            </Typography>
            <FormControl fullWidth error={!!errors.section}>
              <Select 
                name="section" 
                value={form.section} 
                onChange={handleChange} 
                disabled={!form.class}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }}
              >
                {form.department && departments[form.department]?.sections.map(sec => (
                  <MenuItem key={sec} value={sec} sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>{t.section} {sec}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            }
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1f2937', fontWeight: 600 }}>
              {t.academicYear} *
            </Typography>
            <FormControl fullWidth error={!!errors.academicYear}>
              <Select 
                name="academicYear" 
                value={form.academicYear} 
                onChange={handleChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }}
              >
                {academicYears.map(year => (
                  <MenuItem key={year} value={year} sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>{year}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>
        
        {form.feeAmount > 0 && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '2px solid #10b981',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Payment sx={{ fontSize: 32, color: '#10b981', mr: 2 }} />
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    color: '#10b981',
                    textShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                  }}>
                    ₹{form.feeAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#065f46', fontWeight: 600 }}>
                  {t.annualFeeAmount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#047857', mt: 1 }}>
                  {form.department && departments[form.department]?.name} - {form.class}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>,
    // 1. Contact Details
    <Box key="contact" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Contact Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField label="Mobile Number *" name="mobile" value={form.mobile} onChange={handleChange} fullWidth error={!!errors.mobile} helperText={errors.mobile} /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Alternate Contact Number" name="altContact" value={form.altContact} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Email Address *" name="email" value={form.email} onChange={handleChange} fullWidth error={!!errors.email} helperText={errors.email} /></Grid>
        <Grid item xs={12}><TextField label="Permanent Address *" name="permAddress" value={form.permAddress} onChange={handleChange} fullWidth multiline error={!!errors.permAddress} helperText={errors.permAddress} /></Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={form.sameAddress} onChange={handleChange} name="sameAddress" />}
            label="Current Address same as Permanent?"
          />
        </Grid>
        {!form.sameAddress && (
          <Grid item xs={12}><TextField label="Current Address" name="currAddress" value={form.currAddress} onChange={handleChange} fullWidth multiline /></Grid>
        )}
        <Grid item xs={12} sm={4}><TextField label="City *" name="city" value={form.city} onChange={handleChange} fullWidth error={!!errors.city} helperText={errors.city} /></Grid>
        <Grid item xs={12} sm={4}><TextField label="State *" name="state" value={form.state} onChange={handleChange} fullWidth error={!!errors.state} helperText={errors.state} /></Grid>
        <Grid item xs={12} sm={4}><TextField label="PIN/Postal Code *" name="pin" value={form.pin} onChange={handleChange} fullWidth error={!!errors.pin} helperText={errors.pin} /></Grid>
      </Grid>
    </Box>,
    // 2. Parent/Guardian Details
    <Box key="parent" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Parent/Guardian Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField label="Father's Name *" name="fatherName" value={form.fatherName} onChange={handleChange} fullWidth error={!!errors.fatherName} helperText={errors.fatherName} /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Father's Contact Number *" name="fatherContact" value={form.fatherContact} onChange={handleChange} fullWidth error={!!errors.fatherContact} helperText={errors.fatherContact} /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Mother's Contact Number" name="motherContact" value={form.motherContact} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Guardian Name (if applicable)" name="guardianName" value={form.guardianName} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Email of Guardian" name="guardianEmail" value={form.guardianEmail} onChange={handleChange} fullWidth /></Grid>
      </Grid>
    </Box>,
    // 3. Academic Information
    <Box key="academic" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Academic Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField label="Admission For (Class/Standard) *" name="admissionFor" value={form.admissionFor} onChange={handleChange} fullWidth error={!!errors.admissionFor} helperText={errors.admissionFor} /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Previous School Name *" name="prevSchool" value={form.prevSchool} onChange={handleChange} fullWidth error={!!errors.prevSchool} helperText={errors.prevSchool} /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Previous Class/Grade" name="prevClass" value={form.prevClass} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Board/University" name="board" value={form.board} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Marks/Grades %" name="marks" value={form.marks} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ borderRadius: 8 }}
          >
            Transfer Certificate Upload
            <input type="file" name="transferCert" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.transferCert && <Typography variant="caption">{form.transferCert.name}</Typography>}
        </Grid>
      </Grid>
    </Box>,
    // 4. Other Details
    <Box key="other" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Other Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select label="Category" name="category" value={form.category} onChange={handleChange}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}><TextField label="Religion" name="religion" value={form.religion} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Medium of Instruction</InputLabel>
            <Select label="Medium of Instruction" name="medium" value={form.medium} onChange={handleChange}>
              {mediums.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}><TextField label="First Language" name="firstLang" value={form.firstLang} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Second Language" name="secondLang" value={form.secondLang} onChange={handleChange} fullWidth /></Grid>
      </Grid>
    </Box>,
    // 5. Document Upload
    <Box key="upload" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Document Upload</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'primary.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357ab7' } }}
          >
            Passport Size Photo *
            <input type="file" name="photo" accept="image/*" hidden onChange={handleFile} />
          </Button>
          {form.photo && <Typography variant="caption">{form.photo.name}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'secondary.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#f48fb1', '&:hover': { bgcolor: '#ef9a9a' } }}
          >
            Birth Certificate *
            <input type="file" name="birthCert" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.birthCert && <Typography variant="caption">{form.birthCert.name}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'info.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#90caf9', '&:hover': { bgcolor: '#64b5f6' } }}
          >
            Address Proof
            <input type="file" name="addressProof" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.addressProof && <Typography variant="caption">{form.addressProof.name}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'warning.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#ffca28', '&:hover': { bgcolor: '#ffb300' } }}
          >
            Aadhar Card / ID Proof
            <input type="file" name="aadharProof" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.aadharProof && <Typography variant="caption">{form.aadharProof.name}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'success.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}
          >
            Previous Marksheet
            <input type="file" name="marksheet" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.marksheet && <Typography variant="caption">{form.marksheet.name}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<Avatar sx={{ bgcolor: 'error.main' }}><CloudUploadIcon /></Avatar>}
            fullWidth
            sx={{ borderRadius: 8, bgcolor: '#ef5350', '&:hover': { bgcolor: '#e57373' } }}
          >
            Caste Certificate (if applicable)
            <input type="file" name="casteCert" accept=".pdf,image/*" hidden onChange={handleFile} />
          </Button>
          {form.casteCert && <Typography variant="caption">{form.casteCert.name}</Typography>}
        </Grid>
      </Grid>
    </Box>,
    // 6. Declaration & Consent
    <Box key="declaration" sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Declaration & Consent</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={form.declareTrue} onChange={handleChange} name="declareTrue" />}
          label="I hereby declare that the above information is true."
        />
        <FormControlLabel
          control={<Checkbox checked={form.agreeTerms} onChange={handleChange} name="agreeTerms" />}
          label="I agree to the terms and conditions of the institution."
        />
      </FormGroup>
      {errors.declareTrue && <Typography color="error" variant="caption">Required</Typography>}
      {errors.agreeTerms && <Typography color="error" variant="caption">Required</Typography>}
    </Box>,
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }} />
      
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        py: { xs: 2, sm: 4 }, 
        px: { xs: 1, sm: 2 },
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          mb: 4, 
          position: 'relative',
          animation: 'fadeInDown 1s ease-out'
        }}>
          {/* Back to Dashboard Button */}
          <Box sx={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            zIndex: 10 
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleBackToDashboard}
                startIcon={<ArrowBack />}
                variant="contained"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: 14,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {t.backToDashboard}
              </Button>
            </motion.div>
          </Box>

          {/* School Logo - Right Corner */}
          <Box sx={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            zIndex: 10 
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.95)', 
                borderRadius: '50%', 
                p: 1.5, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <img 
                  src={logo} 
                  alt="School Logo" 
                  style={{ 
                    width: 60, 
                    height: 60, 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                  }} 
                />
              </Box>
            </motion.div>
          </Box>

          {/* Title Section - Centered */}
          <Box sx={{ 
            textAlign: 'center',
            pt: { xs: 8, sm: 6 }
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900, 
                color: '#fff', 
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                mb: 1,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                letterSpacing: '0.02em'
              }}
            >
              {t.title}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: 400,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {t.subtitle}
            </Typography>
          </motion.div>
        </Box>
        </Box>

        {/* Main Form Container */}
        <Box sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          animation: 'slideInUp 1s ease-out 0.3s both'
        }}>
          <Paper elevation={24} sx={{ 
            borderRadius: 6, 
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            {/* Progress Header */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 3,
              px: { xs: 2, sm: 4 },
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z"/%3E%3C/g%3E%3C/svg%3E")',
                animation: 'slide 20s linear infinite'
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ 
                  color: '#fff', 
                  fontWeight: 700, 
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 2
                }}>
                  {t.stepProgress.replace('{current}', activeStep + 1).replace('{total}', steps.length)}
                </Typography>
                
                {/* Enhanced Stepper */}
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel 
                  sx={{ 
                    '& .MuiStepLabel-root .Mui-completed': { 
                      color: '#4ade80 !important',
                      '& .MuiStepIcon-root': {
                        color: '#4ade80 !important',
                        filter: 'drop-shadow(0 2px 4px rgba(74, 222, 128, 0.3))'
                      }
                    }, 
                    '& .MuiStepLabel-root .Mui-active': { 
                      color: '#3b82f6 !important',
                      '& .MuiStepIcon-root': {
                        color: '#3b82f6 !important',
                        filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                      }
                    },
                    '& .MuiStepLabel-root .Mui-disabled': {
                      color: 'rgba(255,255,255,0.6) !important'
                    }
                  }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel 
                        sx={{
                          '& .MuiStepLabel-label': {
                            color: index <= activeStep ? '#fff' : 'rgba(255,255,255,0.6)',
                            fontWeight: index === activeStep ? 600 : 400,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: { xs: 3, sm: 5 } }}>
              <form onSubmit={handleSubmit}>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert 
                      severity={successMsg.startsWith('Error') ? 'error' : 'success'}
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      {successMsg}
                    </Alert>
                  </motion.div>
                )}
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ minHeight: '500px' }}
                  >
                    {stepContent[activeStep]}
                  </motion.div>
                </AnimatePresence>

                {/* Enhanced Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 5, 
                  flexWrap: 'wrap', 
                  gap: 2,
                  pt: 3,
                  borderTop: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={activeStep === 0 ? handleBackToDashboard : handleBack} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600, 
                        fontSize: 16, 
                        bgcolor: 'rgba(255,255,255,0.8)',
                        color: '#667eea', 
                        borderColor: '#667eea', 
                        borderWidth: 2,
                        backdropFilter: 'blur(10px)',
                        '&:hover': { 
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                          borderColor: '#5a67d8',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                    >
                      ← {activeStep === 0 ? t.backToDashboard : t.back}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeStep < steps.length - 1 ? (
                      <Button 
                        onClick={handleNext} 
                        variant="contained" 
                        sx={{ 
                          borderRadius: 3, 
                          px: 4, 
                          py: 1.5,
                          fontWeight: 600, 
                          fontSize: 16, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.1)',
                            color: 'rgba(0,0,0,0.3)',
                            boxShadow: 'none'
                          }
                        }} 
                        disabled={submitting}
                      >
                        {t.next} →
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                          borderRadius: 3, 
                          px: 4, 
                          py: 1.5,
                          fontWeight: 600, 
                          fontSize: 16, 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)'
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.1)',
                            color: 'rgba(0,0,0,0.3)',
                            boxShadow: 'none'
                          }
                        }} 
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      >
                        {submitting ? t.processing : t.submitAdmission}
                      </Button>
                    )}
                  </motion.div>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-40px); }
        }
      `}</style>
    </Box>
  );
}

export default AdmissionForm;