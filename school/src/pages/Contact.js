import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Button, Container,
  IconButton, Paper, Divider, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Logo from '../assets/SDHJC_Logo.png';

function Contact() {
  const { language } = useLanguage();
  const t = translations[language]?.contact || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0, 
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

  const contactInfo = [
    {
      icon: <LocationOnIcon sx={{ fontSize: '2rem' }} />,
      title: "Address",
      content: "123 School Street, Kolhapur, Maharashtra, India",
      color: "#667eea"
    },
    {
      icon: <PhoneIcon sx={{ fontSize: '2rem' }} />,
      title: "Phone",
      content: "+91 123 456 7890",
      color: "#4CAF50"
    },
    {
      icon: <EmailIcon sx={{ fontSize: '2rem' }} />,
      title: "Email",
      content: "info@shahudayanand.edu.in",
      color: "#FF5722"
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: '2rem' }} />,
      title: "Office Hours",
      content: "Monday - Friday: 8:00 AM - 4:00 PM",
      color: "#9C27B0"
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, name: "Facebook", color: "#1877F2", url: "#" },
    { icon: <TwitterIcon />, name: "Twitter", color: "#1DA1F2", url: "#" },
    { icon: <InstagramIcon />, name: "Instagram", color: "#E4405F", url: "#" },
    { icon: <LinkedInIcon />, name: "LinkedIn", color: "#0077B5", url: "#" }
  ];

  return (
    <Box sx={{ fontFamily: 'Montserrat, Arial, sans-serif', background: '#fff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 400, sm: 500, md: 600 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 120,
            height: 120,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: -360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
          >
            <Box
              component="img"
              src={Logo}
              alt="School Logo"
              sx={{
                width: { xs: 100, sm: 120, md: 150 },
                height: { xs: 100, sm: 120, md: 150 },
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            />
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Typography 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, 
                fontWeight: 700, 
                color: '#fff', 
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {language === 'mr' ? 'संपर्क साधा' : 'Get In Touch'}
            </Typography>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, 
                color: 'rgba(255, 255, 255, 0.9)', 
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              {language === 'mr' ? 'आम्हाला तुमच्याकडून ऐकायला आवडेल. आम्हाला संदेश पाठवा आणि आम्ही लवकरच प्रतिसाद देऊ.' : 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Information */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, background: '#f8f9fa' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Container maxWidth="lg">
            <motion.div variants={fadeInUp}>
                <Typography
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                  fontWeight: 700, 
                  color: '#001a4d', 
                  textAlign: 'center', 
                  mb: 6 
                }}
                >
                  {language === 'mr' ? 'संपर्क माहिती' : 'Contact Information'}
                </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                        border: `2px solid ${info.color}20`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: `0 8px 30px ${info.color}20`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          <Box sx={{ color: info.color, mb: 2 }}>
                            {info.icon}
                  </Box>
                        </motion.div>
                        
                        <Typography 
                          sx={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 2 
                          }}
                        >
                          {info.title}
                    </Typography>
                        
                        <Typography 
                          sx={{ 
                            color: '#666',
                            lineHeight: 1.6
                          }}
                        >
                          {info.content}
                    </Typography>
              </CardContent>
            </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Contact Form and Map */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Container maxWidth="lg">
            <motion.div variants={fadeInUp}>
              <Typography 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                  fontWeight: 700, 
                  color: '#001a4d', 
                  textAlign: 'center', 
                  mb: 6 
                }}
              >
                Send Us a Message
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {/* Contact Form */}
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInLeft}>
                  <Paper
                    elevation={3}
              sx={{
                      p: 4,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                      border: '2px solid #667eea20'
                    }}
                  >
                <Typography
                      sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#001a4d', 
                        mb: 3 
                      }}
                    >
                      Contact Form
                </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                            label="Full Name"
                    name="name"
                    value={formData.name}
                            onChange={handleInputChange}
                    required
                            variant="outlined"
                    sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                            onChange={handleInputChange}
                    required
                            variant="outlined"
                    sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                  <TextField
                    fullWidth
                            label="Phone Number"
                    name="phone"
                    value={formData.phone}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            variant="outlined"
                    sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                            onChange={handleInputChange}
                            required
                    multiline
                    rows={4}
                            variant="outlined"
                    sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                  <Button
                    type="submit"
                              fullWidth
                    variant="contained"
                              endIcon={<SendIcon />}
                    sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#fff',
                                py: 1.5,
                                fontSize: '1.1rem',
                      fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                  >
                    Send Message
                  </Button>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Map and Social Links */}
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInRight}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                      border: '2px solid #667eea20',
                      height: '100%'
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#001a4d', 
                        mb: 3 
                      }}
                    >
                      Location & Social Media
                    </Typography>
                    
                    {/* Map Placeholder */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        border: '2px dashed #667eea40'
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <LocationOnIcon sx={{ fontSize: '3rem', color: '#667eea', mb: 2 }} />
                        <Typography sx={{ color: '#667eea', fontWeight: 600 }}>
                          Interactive Map
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                          School location will be displayed here
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    
                    <Typography 
                      sx={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 600, 
                        color: '#001a4d', 
                        mb: 2 
                      }}
                    >
                      Follow Us
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {socialLinks.map((social, index) => (
                        <motion.div
                          key={social.name}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton
                            sx={{
                              background: social.color,
                              color: '#fff',
                              width: 50,
                              height: 50,
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
                  </Paper>
                </motion.div>
          </Grid>
        </Grid>
      </Container>
        </motion.div>
      </Box>

      {/* School Information */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, background: '#001a4d' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Container maxWidth="lg">
            <motion.div variants={fadeInUp}>
              <Typography 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                  fontWeight: 700, 
                  color: '#fff', 
                  textAlign: 'center', 
                  mb: 6 
                }}
              >
                School Information
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInLeft}>
                  <Box sx={{ color: '#fff' }}>
                    <Typography 
                      sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        mb: 3 
                      }}
                    >
                      Shahu Dayanand High School & Junior College
                    </Typography>
                    
                    <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                      Established in 1980, our school has been providing quality education to students in Kolhapur and surrounding areas. We are committed to academic excellence, character development, and holistic growth of our students.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                      <Chip label="CBSE Affiliated" sx={{ background: '#ffd700', color: '#333', fontWeight: 600 }} />
                      <Chip label="ISO Certified" sx={{ background: '#4CAF50', color: '#fff', fontWeight: 600 }} />
                      <Chip label="40+ Years Experience" sx={{ background: '#FF5722', color: '#fff', fontWeight: 600 }} />
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInRight}>
                  <Box sx={{ color: '#fff' }}>
                    <Typography 
                      sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        mb: 3 
                      }}
                    >
                      Quick Contact
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Emergency Contact:
                      </Typography>
                      <Typography>+91 98765 43210</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Admission Enquiry:
                      </Typography>
                      <Typography>admission@shahudayanand.edu.in</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Office Hours:
                      </Typography>
                      <Typography>Monday - Saturday: 8:00 AM - 4:00 PM</Typography>
                      <Typography>Sunday: Closed</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Contact;