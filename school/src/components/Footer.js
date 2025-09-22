import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import Logo from '../assets/SDHJC_Logo.png';

function Footer() {
  const { language } = useLanguage();
  const t = translations[language]?.footer || {};
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const socialLinks = [
    { icon: <FacebookIcon />, name: "Facebook", color: "#1877F2", url: "#" },
    { icon: <TwitterIcon />, name: "Twitter", color: "#1DA1F2", url: "#" },
    { icon: <InstagramIcon />, name: "Instagram", color: "#E4405F", url: "#" },
    { icon: <LinkedInIcon />, name: "LinkedIn", color: "#0077B5", url: "#" },
    { icon: <YouTubeIcon />, name: "YouTube", color: "#FF0000", url: "#" }
  ];

  const quickLinks = [
    { name: t.aboutUs || "About Us", path: "/about" },
    { name: t.academics || "Academics", path: "/academics" },
    { name: t.gallery || "Gallery", path: "/gallery" },
    { name: t.contactUs || "Contact Us", path: "/contact" },
    { name: t.admissionForm || "Admission Form", path: "/admission" },
    { name: t.feeStructure || "Fee Structure", path: "/fees" }
  ];

  const academicLinks = [
    { name: t.academicCalendar || "Academic Calendar", path: "/calendar" },
    { name: t.examination || "Examination", path: "/examination" },
    { name: t.results || "Results", path: "/results" },
    { name: t.mandatoryPublicDisclosure || "Mandatory Public Disclosure", path: "/disclosure" }
  ];

  return (
    <Box
      component="footer"
      className="no-print"
      sx={{
        backgroundColor: '#001a4d',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
            <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
              {/* School Information */}
              <Grid item xs={12} md={4}>
                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Box
                        component="img"
                        src={Logo}
                        alt="School Logo"
                        sx={{
                          width: { xs: 60, sm: 80 },
                          height: { xs: 60, sm: 80 },
                          mr: 2,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}
                      />
                    </motion.div>
                    <Box>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '1.1rem', sm: '1.3rem' },
                          lineHeight: 1.2
                        }}
                      >
                        Shahu Dayanand
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          opacity: 0.8
                        }}
                      >
                        High School & Junior College
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.6,
                      opacity: 0.9
                    }}
                  >
                    Empowering minds, building futures since 1980. We are committed to providing quality education and fostering academic excellence in Kolhapur.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip 
                      label="CBSE Affiliated" 
                      size="small"
                      sx={{ 
                        background: '#ffd700', 
                        color: '#333',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }} 
                    />
                    <Chip 
                      label="ISO Certified" 
                      size="small"
                      sx={{ 
                        background: '#4CAF50', 
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>

                  {/* Social Media Links */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      mb: 2 
                    }}
                  >
                    {language === 'mr' ? 'आम्हाला फॉलो करा' : 'Follow Us'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={social.name}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          href={social.url}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            width: 40,
                            height: 40,
                            '&:hover': {
                              background: social.color,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 15px ${social.color}60`
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      mb: 3
                    }}
                  >
                    {language === 'mr' ? 'त्वरित दुवे' : 'Quick Links'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {quickLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={link.path} 
                          color="inherit" 
                          sx={{ 
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            opacity: 0.8,
                            '&:hover': { 
                              opacity: 1,
                              color: '#ffd700'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Academic Links */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      mb: 3
                    }}
                  >
                    {language === 'mr' ? 'शैक्षणिक दुवे' : 'Academic Links'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {academicLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={link.path} 
                          color="inherit" 
                          sx={{ 
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            opacity: 0.8,
                            '&:hover': { 
                              opacity: 1,
                              color: '#ffd700'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={4}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      mb: 3
                    }}
                  >
                    {language === 'mr' ? 'संपर्क माहिती' : 'Contact Information'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#ffd700' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
                          123 School Street, Kolhapur, Maharashtra, India
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#ffd700' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
                          +91 123 456 7890
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#ffd700' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
                          info@shahudayanand.edu.in
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#ffd700' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
                          Mon - Fri: 8:00 AM - 4:00 PM
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Divider */}
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />

          {/* Bottom Section */}
          <Box sx={{ pb: 3, textAlign: 'center' }}>
            <motion.div variants={scaleIn}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  opacity: 0.7,
                  mb: 1
                }}
              >
                © {new Date().getFullYear()} Shahu Dayanand High School and Junior College. {language === 'mr' ? 'सर्व हक्क राखीव.' : 'All rights reserved.'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  opacity: 0.6
                }}
              >
                Designed with ❤️ for educational excellence
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </motion.div>
    </Box>
  );
}

export default Footer;