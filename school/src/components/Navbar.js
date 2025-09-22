import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import Logo from '../assets/SDHJC_Logo.png';

const pages = [
  { title: 'home', path: '/' },
  { title: 'about', path: '/about' },
  { title: 'academics', path: '/academics' },
  { title: 'gallery', path: '/gallery' },
  { title: 'contact', path: '/contact' },
];

function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].nav;
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: scrolled ? 'rgba(0, 26, 77, 0.95)' : 'rgba(0, 26, 77, 0.9)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
        }} 
        className="no-print"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo and School Name */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar
                  src={Logo}
                  alt="School Logo"
                  sx={{
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                    mr: 2,
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { sm: '1rem', md: '1.1rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Shahu Dayanand
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { sm: '0.7rem', md: '0.8rem' },
                      opacity: 0.8
                    }}
                  >
                    High School & Junior College
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Mobile menu icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flex: 1, justifyContent: 'flex-end' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    background: 'rgba(0, 26, 77, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    mt: 1
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={handleCloseNavMenu}
                    component={RouterLink}
                    to={page.path}
                    sx={{
                      color: isActive(page.path) ? '#ffd700' : '#fff',
                      fontWeight: isActive(page.path) ? 600 : 400,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffd700'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography textAlign="center">
                      {page.title === 'home' ? (language === 'mr' ? 'मुख्यपृष्ठ' : 'Home') :
                       page.title === 'about' ? (language === 'mr' ? 'आमच्याबद्दल' : 'About') :
                       page.title === 'academics' ? (language === 'mr' ? 'शैक्षणिक' : 'Academics') :
                       page.title === 'gallery' ? (language === 'mr' ? 'गॅलरी' : 'Gallery') :
                       page.title === 'contact' ? (language === 'mr' ? 'संपर्क' : 'Contact') :
                       page.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Desktop menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flex: 2 }}>
              <Stack direction="row" spacing={1}>
                {pages.map((page) => (
                  <motion.div
                    key={page.title}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      component={RouterLink}
                      to={page.path}
                      sx={{
                        color: isActive(page.path) ? '#ffd700' : '#fff',
                        fontWeight: isActive(page.path) ? 600 : 500,
                        textTransform: 'none',
                        px: 2,
                        py: 1,
                        fontSize: '0.95rem',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffd700'
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: isActive(page.path) ? '80%' : '0%',
                          height: '2px',
                          background: '#ffd700',
                          transform: 'translateX(-50%)',
                          transition: 'width 0.3s ease'
                        },
                        '&:hover::after': {
                          width: '80%'
                        }
                      }}
                    >
                      {page.title === 'home' ? (language === 'mr' ? 'मुख्यपृष्ठ' : 'Home') :
                       page.title === 'about' ? (language === 'mr' ? 'आमच्याबद्दल' : 'About') :
                       page.title === 'academics' ? (language === 'mr' ? 'शैक्षणिक' : 'Academics') :
                       page.title === 'gallery' ? (language === 'mr' ? 'गॅलरी' : 'Gallery') :
                       page.title === 'contact' ? (language === 'mr' ? 'संपर्क' : 'Contact') :
                       page.title}
                    </Button>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* Language switcher and Teacher Login */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="inherit"
                  startIcon={<LanguageIcon />}
                  onClick={toggleLanguage}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: '#ffd700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {language === 'en' ? 'English' : 'मराठी'}
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={RouterLink}
                  to="/teacher-login"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    color: '#333',
                    boxShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t.teacherLogin}
                </Button>
              </motion.div>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <Box sx={{ height: { xs: 70, sm: 80, md: 90 } }} />
    </motion.div>
  );
}

export default Navbar;