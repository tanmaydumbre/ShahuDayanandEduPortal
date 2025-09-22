import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip, Container, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import Logo from '../assets/SDHJC_Logo.png';

function About() {
  const { language } = useLanguage();
  const t = translations[language]?.about || {};

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

  // Data for different sections
  const teachers = [
    {
      name: "Mr. Rajesh Kumar",
      position: "Principal",
      subject: "Mathematics",
      experience: "15+ Years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      qualification: "M.Sc., B.Ed."
    },
    {
      name: "Mrs. Priya Sharma",
      position: "Vice Principal",
      subject: "English",
      experience: "12+ Years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      qualification: "M.A., B.Ed."
    },
    {
      name: "Mr. Amit Patel",
      position: "Senior Teacher",
      subject: "Science",
      experience: "10+ Years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      qualification: "M.Sc., B.Ed."
    },
    {
      name: "Mrs. Sunita Desai",
      position: "Senior Teacher",
      subject: "Social Studies",
      experience: "8+ Years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      qualification: "M.A., B.Ed."
    },
    {
      name: "Mr. Deepak Singh",
      position: "Physical Education",
      subject: "Sports",
      experience: "6+ Years",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      qualification: "B.P.Ed."
    },
    {
      name: "Mrs. Kavita Joshi",
      position: "Art Teacher",
      subject: "Fine Arts",
      experience: "5+ Years",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      qualification: "B.F.A., B.Ed."
    }
  ];

  const managementCommittee = [
    {
      name: "Mr. Umesh S. Galwankar",
      position: "Chairman",
      role: "Overall Management",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mrs. Meera Patil",
      position: "Secretary",
      role: "Administrative Affairs",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mr. Sanjay Deshmukh",
      position: "Treasurer",
      role: "Financial Management",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Dr. Anjali Kulkarni",
      position: "Academic Advisor",
      role: "Academic Excellence",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    }
  ];

  const ptaCommittee = [
    {
      name: "Mr. Ramesh Pawar",
      position: "PTA President",
      role: "Parent Representative",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mrs. Smita Kulkarni",
      position: "PTA Vice President",
      role: "Parent Representative",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mr. Vijay More",
      position: "PTA Secretary",
      role: "Communication Coordinator",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mrs. Rekha Jadhav",
      position: "PTA Treasurer",
      role: "Financial Coordinator",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
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
              {language === 'mr' ? 'आमच्या शाळेबद्दल' : 'About Our School'}
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
              {language === 'mr' ? '१९८० पासून मनाला सक्षम करणे, भविष्य बांधणे. शिक्षणातील उत्कृष्टतेचा आमचा प्रवास शोधा.' : 'Empowering minds, building futures since 1980. Discover our journey of excellence in education.'}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Chairman's Message */}
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
                {language === 'mr' ? 'अध्यक्षांचे संदेश' : 'Chairman\'s Message'}
              </Typography>
            </motion.div>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <motion.div variants={fadeInLeft}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 200,
                          height: 200,
                          fontSize: '4rem',
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: '4px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        👨‍🏫
                      </Avatar>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={8}>
                <motion.div variants={fadeInRight}>
                  <Typography 
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, 
                      fontWeight: 700, 
                      color: '#001a4d', 
                      mb: 3 
                    }}
                  >
                                         {language === 'mr' ? 'सर्वोत्तम व्हा किंवा इतरांपेक्षा वेगळे व्हा' : 'BE THE BEST OR DIFFERENT FROM THE REST'}
                  </Typography>
                  
                  <Typography 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' }, 
                      color: '#666', 
                      lineHeight: 1.8,
                      mb: 3
                    }}
                  >
                    "If the face of India has to change ever then it cannot be attained without proper and quality education being imparted to everyone without any discrimination". With this thought I would like to welcome you all in the family of Shahu Dayanand High School and get your child benefitted by the standard quality education. We strive hard to deliver standard education to our students specifically, as they belong to a rural area like Kolhapur District.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: '#001a4d' }}>
                      Mr. Umesh S. Galwankar
                    </Typography>
                    <Chip 
                      label="Chairman" 
                      sx={{ 
                        background: '#ffd700', 
                        color: '#333',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Principal's Message */}
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
                                 {language === 'mr' ? 'प्राचार्यांचे संदेश' : 'Principal\'s Message'}
              </Typography>
            </motion.div>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <motion.div variants={fadeInLeft}>
                  <Typography 
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, 
                      fontWeight: 700, 
                      color: '#001a4d', 
                      mb: 3 
                    }}
                  >
                                         {language === 'mr' ? 'आमच्या विद्यार्थ्यांच्या भविष्यावर आमचा विश्वास आहे' : 'WE HAVE FAITH IN OUR STUDENT FUTURE'}
                  </Typography>
                  
                  <Typography 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' }, 
                      color: '#666', 
                      lineHeight: 1.8,
                      mb: 3
                    }}
                  >
                    Our students are talented, hard-working and full of good ideas. We encourage and empower them to bring their ideas to life. Hands-on opportunities are what we're all about. At Shahu Dayanand High School, we believe in nurturing not just academic excellence but also character development and leadership skills.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: '#001a4d' }}>
                      Mr. Rajesh Kumar
                    </Typography>
                    <Chip 
                      label="Principal" 
                      sx={{ 
                        background: '#4CAF50', 
                        color: '#fff',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div variants={fadeInRight}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 200,
                          height: 200,
                          fontSize: '4rem',
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: '4px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        👨‍🏫
                      </Avatar>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Teacher's Profile */}
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
                                 {language === 'mr' ? 'शिक्षकांचे प्रोफाइल' : 'Teacher\'s Profile'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {teachers.map((teacher, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: 200,
                          background: `url(${teacher.image}) center/cover no-repeat`,
                          position: 'relative'
                        }}
                      />
                      
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Typography 
                          sx={{ 
                            fontSize: '1.3rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 1 
                          }}
                        >
                          {teacher.name}
                        </Typography>
                        
                        <Chip 
                          label={teacher.position} 
                          sx={{ 
                            background: '#667eea', 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 2
                          }} 
                        />
                        
                        <Typography 
                          sx={{ 
                            color: '#666', 
                            mb: 1,
                            fontWeight: 500
                          }}
                        >
                                                     {language === 'mr' ? 'विषय:' : 'Subject:'} {teacher.subject}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            color: '#666', 
                            mb: 1,
                            fontSize: '0.9rem'
                          }}
                        >
                                                     {language === 'mr' ? 'अनुभव:' : 'Experience:'} {teacher.experience}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            color: '#666',
                            fontSize: '0.9rem'
                          }}
                        >
                          {teacher.qualification}
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

      {/* School Management Committee */}
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
                                 {language === 'mr' ? 'शाळा व्यवस्थापन समिती' : 'School Management Committee'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {managementCommittee.map((member, index) => (
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
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                          src={member.image}
                          sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid #667eea'
                          }}
                        />
                        
                        <Typography 
                          sx={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 1 
                          }}
                        >
                          {member.name}
                        </Typography>
                        
                        <Chip 
                          label={member.position} 
                          sx={{ 
                            background: '#667eea', 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 2
                          }} 
                        />
                        
                        <Typography 
                          sx={{ 
                            color: '#666',
                            fontSize: '0.9rem'
                          }}
                        >
                          {member.role}
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

      {/* School PTA Committee */}
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
                                 {language === 'mr' ? 'शाळा पीटीए समिती' : 'School PTA Committee'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {ptaCommittee.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #4CAF5020 0%, #45a04920 100%)',
                        border: '2px solid #4CAF5030',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: '0 8px 30px rgba(76, 175, 80, 0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                          src={member.image}
                          sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid #4CAF50'
                          }}
                        />
                        
                        <Typography 
                          sx={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 1 
                          }}
                        >
                          {member.name}
                        </Typography>
                        
                        <Chip 
                          label={member.position} 
                          sx={{ 
                            background: '#4CAF50', 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 2
                          }} 
                        />
                        
                        <Typography 
                          sx={{ 
                            color: '#666',
                            fontSize: '0.9rem'
                          }}
                        >
                          {member.role}
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
    </Box>
  );
}

export default About;
