import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Container, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon,
  ListItemText, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import Logo from '../assets/SDHJC_Logo.png';

function Academics() {
  const { language } = useLanguage();
  const t = translations[language]?.academics || {};

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

  // Fee Structure Data
  const feeStructure = [
    {
      class: "Class I - V",
      tuitionFee: "₹2,500",
      developmentFee: "₹1,000",
      total: "₹3,500",
      color: "#4CAF50"
    },
    {
      class: "Class VI - VIII",
      tuitionFee: "₹3,000",
      developmentFee: "₹1,200",
      total: "₹4,200",
      color: "#2196F3"
    },
    {
      class: "Class IX - X",
      tuitionFee: "₹3,500",
      developmentFee: "₹1,500",
      total: "₹5,000",
      color: "#FF9800"
    },
    {
      class: "Class XI - XII",
      tuitionFee: "₹4,000",
      developmentFee: "₹2,000",
      total: "₹6,000",
      color: "#9C27B0"
    }
  ];

  // Academic Calendar Data
  const academicCalendar = [
    {
      month: "April 2024",
      events: [
        "School Reopens - April 1, 2024",
        "Orientation Program - April 3, 2024",
        "First Unit Test - April 15-20, 2024",
        "Annual Sports Meet - April 25, 2024"
      ]
    },
    {
      month: "May 2024",
      events: [
        "Summer Vacation - May 1-15, 2024",
        "School Reopens - May 16, 2024",
        "Parent-Teacher Meeting - May 25, 2024"
      ]
    },
    {
      month: "June 2024",
      events: [
        "Mid-Term Examinations - June 10-20, 2024",
        "International Yoga Day - June 21, 2024",
        "Annual Function Preparation - June 25-30, 2024"
      ]
    },
    {
      month: "July 2024",
      events: [
        "Annual Function - July 5, 2024",
        "Science Exhibition - July 15, 2024",
        "Second Unit Test - July 25-30, 2024"
      ]
    }
  ];

  // Results Data
  const results = [
    {
      year: "2023-24",
      class: "Class X",
      passPercentage: "98.5%",
      distinction: "45%",
      firstClass: "35%",
      secondClass: "18.5%"
    },
    {
      year: "2023-24",
      class: "Class XII",
      passPercentage: "97.2%",
      distinction: "42%",
      firstClass: "38%",
      secondClass: "17.2%"
    },
    {
      year: "2022-23",
      class: "Class X",
      passPercentage: "97.8%",
      distinction: "43%",
      firstClass: "36%",
      secondClass: "18.8%"
    },
    {
      year: "2022-23",
      class: "Class XII",
      passPercentage: "96.5%",
      distinction: "40%",
      firstClass: "39%",
      secondClass: "17.5%"
    }
  ];

  // Mandatory Public Disclosure
  const publicDisclosure = [
    {
      category: "General Information",
      items: [
        "Name of the School: Shahu Dayanand High School & Junior College",
        "Affiliation Number: 1130001",
        "School Code: 27201",
        "Complete Address: 123 School Street, Kolhapur, Maharashtra",
        "Phone Number: +91 123 456 7890",
        "Email: info@shahudayanand.edu.in",
        "Website: www.shahudayanand.edu.in"
      ]
    },
    {
      category: "Documents & Information",
      items: [
        "Recognition Certificate under RTE Act-2009",
        "Affiliation Certificate from CBSE",
        "Building Safety Certificate",
        "Fire Safety Certificate",
        "DEO Certificate",
        "MCD Certificate",
        "Water, Health and Sanitation Certificate"
      ]
    },
    {
      category: "Results and Performance",
      items: [
        "Academic Results of last three years",
        "Class X Results: 98.5% (2023-24), 97.8% (2022-23), 96.2% (2021-22)",
        "Class XII Results: 97.2% (2023-24), 96.5% (2022-23), 95.8% (2021-22)",
        "Details of transfer certificates",
        "Number of students appeared in the last three years",
        "Number of students passed in the last three years"
      ]
    },
    {
      category: "Staff Information",
      items: [
        "Total number of teachers: 50+",
        "Qualified teachers: 100%",
        "Teacher-student ratio: 1:25",
        "Details of teaching and non-teaching staff",
        "Professional qualifications of teachers",
        "Experience of teachers"
      ]
    }
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
              {language === 'mr' ? 'शैक्षणिक उत्कृष्टता' : 'Academic Excellence'}
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
              {language === 'mr' ? 'आमचे व्यापक शैक्षणिक कार्यक्रम, फी संरचना आणि शैक्षणिक यश शोधा.' : 'Discover our comprehensive academic programs, fee structure, and educational achievements.'}
          </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Fee Structure Section */}
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
                {language === 'mr' ? 'फी संरचना' : 'Fee Structure'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {feeStructure.map((fee, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${fee.color}20 0%, ${fee.color}40 100%)`,
                        border: `2px solid ${fee.color}30`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: `0 8px 30px ${fee.color}30`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography 
                          sx={{ 
                            fontSize: '1.3rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 3 
                          }}
                        >
                          {fee.class}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography sx={{ color: '#666', mb: 1 }}>
                            {language === 'mr' ? 'शिक्षण शुल्क' : 'Tuition Fee'}
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '1.5rem', 
                              fontWeight: 700, 
                              color: fee.color 
                            }}
                          >
                            {fee.tuitionFee}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography sx={{ color: '#666', mb: 1 }}>
                            {language === 'mr' ? 'विकास शुल्क' : 'Development Fee'}
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '1.5rem', 
                              fontWeight: 700, 
                              color: fee.color 
                            }}
                          >
                            {fee.developmentFee}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box>
                          <Typography sx={{ color: '#001a4d', mb: 1, fontWeight: 600 }}>
                            {language === 'mr' ? 'एकूण' : 'Total'} (Monthly)
        </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '2rem', 
                              fontWeight: 700, 
                              color: '#001a4d' 
                            }}
                          >
                            {fee.total}
                </Typography>
                        </Box>
              </CardContent>
            </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Academic Calendar Section */}
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
                {language === 'mr' ? 'शैक्षणिक दिनदर्शिका २०२४-२५' : 'Academic Calendar 2024-25'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {academicCalendar.map((month, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                        border: '2px solid #667eea30',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarTodayIcon sx={{ color: '#667eea', mr: 1 }} />
                          <Typography 
                            sx={{ 
                              fontSize: '1.2rem', 
                              fontWeight: 700, 
                              color: '#001a4d' 
                            }}
                          >
                            {month.month}
                </Typography>
                        </Box>
                        
                        <List dense>
                          {month.events.map((event, eventIndex) => (
                            <ListItem key={eventIndex} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText
                                primary={event}
                                sx={{
                                  '& .MuiListItemText-primary': {
                                    fontSize: '0.9rem',
                                    color: '#666',
                                    lineHeight: 1.4
                                  }
                                }}
                    />
                  </ListItem>
                          ))}
                </List>
              </CardContent>
            </Card>
                  </motion.div>
          </Grid>
              ))}
        </Grid>
      </Container>
        </motion.div>
      </Box>

      {/* Results Section */}
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
                Academic Results
          </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Year</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Class</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Pass %</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Distinction</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>First Class</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Second Class</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'rgba(102, 126, 234, 0.05)' },
                          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>{result.year}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{result.class}</TableCell>
                        <TableCell>
                          <Chip 
                            label={result.passPercentage} 
                            sx={{ 
                              background: '#4CAF50', 
                              color: '#fff',
                              fontWeight: 600
                            }} 
                          />
                        </TableCell>
                        <TableCell>{result.distinction}</TableCell>
                        <TableCell>{result.firstClass}</TableCell>
                        <TableCell>{result.secondClass}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
        </Container>
        </motion.div>
      </Box>

      {/* Mandatory Public Disclosure Section */}
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
                Mandatory Public Disclosure
        </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {publicDisclosure.map((disclosure, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div variants={scaleIn}>
                    <Accordion
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': {
                          margin: '16px 0'
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #667eea30 0%, #764ba230 100%)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ color: '#667eea', mr: 2 }} />
                          <Typography 
                            sx={{ 
                              fontSize: '1.1rem', 
                              fontWeight: 600, 
                              color: '#001a4d' 
                            }}
                          >
                            {disclosure.category}
                </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ background: '#fff' }}>
                        <List dense>
                          {disclosure.items.map((item, itemIndex) => (
                            <ListItem key={itemIndex} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <StarIcon sx={{ color: '#ffd700', fontSize: '1rem' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={item}
                                sx={{
                                  '& .MuiListItemText-primary': {
                                    fontSize: '0.9rem',
                                    color: '#666',
                                    lineHeight: 1.4
                                  }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
          </Grid>
              ))}
        </Grid>
      </Container>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Academics; 