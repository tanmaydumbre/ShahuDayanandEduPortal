import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { useLanguage } from './context/LanguageContext';
import { motion } from 'framer-motion'; // For animations
import SchoolIcon from '@mui/icons-material/School';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import useSessionTimeout from './hooks/useSessionTimeout';
import TeacherHeader from './components/TeacherHeader';
import SessionTimeoutWarning from './components/SessionTimeoutWarning';

// Translations remain the same
const translations = {
  en: {
    welcome: 'Welcome, Teacher',
    modules: {
      generalRegister: {
        title: 'General Register',
        description: 'Manage student records and information'
      },
      feeCollection: {
        title: 'Fee Collection',
        description: 'Track and collect student fees'
      },
      attendance: {
        title: 'Attendance',
        description: 'Monitor student attendance'
      },
      admission: {
        title: 'Admission Form',
        description: 'Handle new student admissions'
      },
      bonafide: {
        title: 'Bonafide',
        description: 'Generate bonafide certificates'
      },
      leavingCertificate: {
        title: 'Leaving Certificate',
        description: 'Generate leaving certificates'
      },
      slideManager: {
        title: 'Home Screen Slides',
        description: 'Manage slides shown on the home screen'
      },
      feeStructure: {
        title: 'Fee Structure Master',
        description: 'Manage fee structure per department, class and year'
      }
      
    }
  },
  mr: {
    welcome: 'शिक्षकांना स्वागत आहे',
    modules: {
      generalRegister: {
        title: 'सामान्य रजिस्टर',
        description: 'विद्यार्थी रेकॉर्ड आणि माहिती व्यवस्थापित करा'
      },
      feeCollection: {
        title: 'फी संकलन',
        description: 'विद्यार्थी फी ट्रॅक आणि संकलित करा'
      },
      attendance: {
        title: 'उपस्थिती',
        description: 'विद्यार्थी उपस्थिती निरीक्षण करा'
      },
      admission: {
        title: 'प्रवेश',
        description: 'नवीन विद्यार्थी प्रवेश हाताळा'
      },
      bonafide: {
        title: 'बोनाफाइड',
        description: 'बोनाफाइड प्रमाणपत्र तयार करा'
      },
      leavingCertificate: {
        title: 'सोडण्याचे प्रमाणपत्र',
        description: 'सोडण्याचे प्रमाणपत्र तयार करा'
      },
      slideManager: {
        title: 'होम स्क्रीन स्लाइड्स',
        description: 'होम स्क्रीनवर दाखवल्या जाणाऱ्या स्लाइड्स व्यवस्थापित करा'
      },
      feeStructure: {
        title: 'फी स्ट्रक्चर मास्टर',
        description: 'विभाग, वर्ग आणि वर्षानुसार फी स्ट्रक्चर व्यवस्थापित करा'
      }
    }
  }
};

const modules = [
  { key: 'generalRegister', path: '/general-register', icon: <SchoolIcon /> },
  { key: 'feeCollection', path: '/fee-collection', icon: <ReceiptIcon /> },
  { key: 'attendance', path: '/attendance', icon: <PeopleIcon /> },
  { key: 'admission', path: '/admission-form', icon: <AssignmentIcon /> },
  { key: 'bonafide', path: '/bonafide-certificate-form', icon: <DescriptionIcon /> },
  { key: 'leavingCertificate', path: '/leaving-certificate', icon: <DescriptionIcon /> },
  { key: 'slideManager', path: '/slide-manager', icon: <SlideshowIcon /> },
  { key: 'feeStructure', path: '/fee-structure-master', icon: <AccountBalanceIcon /> },
];

function TeacherDashboard() {
  const { language } = useLanguage();
  const t = translations[language];
  
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', minHeight: '100vh' }}>
      {/* Header with session timeout */}
      <TeacherHeader 
        title="Teacher Dashboard"
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
      />
      
      <Box sx={{ padding: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            color: '#1a237e', 
            fontWeight: 700,
            textAlign: 'center',
            fontFamily: language === 'mr' ? 'Shivaji01, Arial, sans-serif' : 'Arial, sans-serif',
            background: 'linear-gradient(90deg, #1a237e, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t.welcome}
        </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {modules.map((module, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              component={Link}
              to={module.path}
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transform: 'scale(1.05)',
                },
                height: '100%',
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: { xs: 2, sm: 3 }, height: '100%' }}>
                <IconButton
                  sx={{
                    background: '#42a5f5',
                    color: '#fff',
                    '&:hover': { background: '#1976d2' },
                    borderRadius: '50%',
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                  }}
                >
                  {module.icon}
                </IconButton>
                <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#1a237e',
                      fontFamily: language === 'mr' ? 'Shivaji01, Arial, sans-serif' : 'Arial, sans-serif',
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                    }}
                  >
                    {t.modules[module.key].title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontFamily: language === 'mr' ? 'Shivaji01, Arial, sans-serif' : 'Arial, sans-serif',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
                    {t.modules[module.key].description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
      </Box>
      
      {/* Session Timeout Warning */}
      <SessionTimeoutWarning
        open={showWarning}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
        remainingMinutes={remainingMinutes}
        totalMinutes={30}
      />
    </Box>
  );
}

export default TeacherDashboard;