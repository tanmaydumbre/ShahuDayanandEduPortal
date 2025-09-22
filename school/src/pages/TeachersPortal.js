import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip, 
  Button, Dialog, DialogContent, DialogActions, IconButton, Divider,
  Tabs, Tab, Paper, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import LanguageIcon from '@mui/icons-material/Language';
import HistoryIcon from '@mui/icons-material/History';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsIcon from '@mui/icons-material/Sports';
import ComputerIcon from '@mui/icons-material/Computer';
import Logo from '../assets/SDHJC_Logo.png';

function TeachersPortal() {
  const { language } = useLanguage();
  const t = translations[language]?.teachersPortal || {};
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeacher(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Teacher data with comprehensive details
  const teachers = [
    {
      id: 1,
      name: "Mr. Rajesh Kumar",
      position: "Principal",
      subject: "Mathematics",
      experience: "15+ Years",
      qualification: "M.Sc. Mathematics, B.Ed.",
      email: "rajesh.kumar@shahudayanand.edu.in",
      phone: "+91 98765 43210",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      department: "Administration",
      achievements: [
        "Best Principal Award 2023",
        "Published 5 research papers",
        "Led school to 95% board results"
      ],
      expertise: ["Advanced Mathematics", "Educational Leadership", "Curriculum Development"],
      education: [
        { degree: "M.Sc. Mathematics", institution: "University of Mumbai", year: "2008" },
        { degree: "B.Ed.", institution: "Mumbai University", year: "2009" },
        { degree: "B.Sc. Mathematics", institution: "University of Mumbai", year: "2006" }
      ],
      experienceDetails: [
        { position: "Principal", school: "Shahu Dayanand High School", duration: "2018-Present" },
        { position: "Vice Principal", school: "Shahu Dayanand High School", duration: "2015-2018" },
        { position: "Senior Mathematics Teacher", school: "St. Mary's School", duration: "2010-2015" },
        { position: "Mathematics Teacher", school: "Delhi Public School", duration: "2008-2010" }
      ],
      specializations: ["Algebra", "Calculus", "Statistics", "Educational Management"],
      languages: ["English", "Hindi", "Marathi"],
      hobbies: ["Reading", "Chess", "Gardening"],
      bio: "Mr. Rajesh Kumar is a dedicated educational leader with over 15 years of experience in teaching and administration. He has transformed our school into a center of academic excellence and innovation."
    },
    {
      id: 2,
      name: "Mrs. Priya Sharma",
      position: "Vice Principal",
      subject: "English",
      experience: "12+ Years",
      qualification: "M.A. English Literature, B.Ed.",
      email: "priya.sharma@shahudayanand.edu.in",
      phone: "+91 98765 43211",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      department: "Languages",
      achievements: [
        "Best Teacher Award 2022",
        "State Level English Competition Winner",
        "Published 3 books for children"
      ],
      expertise: ["English Literature", "Creative Writing", "Communication Skills"],
      education: [
        { degree: "M.A. English Literature", institution: "Delhi University", year: "2010" },
        { degree: "B.Ed.", institution: "Delhi University", year: "2011" },
        { degree: "B.A. English", institution: "Delhi University", year: "2008" }
      ],
      experienceDetails: [
        { position: "Vice Principal", school: "Shahu Dayanand High School", duration: "2020-Present" },
        { position: "Senior English Teacher", school: "Shahu Dayanand High School", duration: "2015-2020" },
        { position: "English Teacher", school: "Kendriya Vidyalaya", duration: "2011-2015" }
      ],
      specializations: ["Literature", "Grammar", "Creative Writing", "Public Speaking"],
      languages: ["English", "Hindi", "Sanskrit"],
      hobbies: ["Writing", "Poetry", "Traveling"],
      bio: "Mrs. Priya Sharma is passionate about English literature and has inspired countless students to develop their language skills and creative expression."
    },
    {
      id: 3,
      name: "Mr. Amit Patel",
      position: "Senior Teacher",
      subject: "Physics",
      experience: "10+ Years",
      qualification: "M.Sc. Physics, B.Ed.",
      email: "amit.patel@shahudayanand.edu.in",
      phone: "+91 98765 43212",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      department: "Science",
      achievements: [
        "Science Teacher Excellence Award 2023",
        "National Science Olympiad Mentor",
        "Innovation in Teaching Award"
      ],
      expertise: ["Physics", "Laboratory Management", "Science Projects"],
      education: [
        { degree: "M.Sc. Physics", institution: "IIT Mumbai", year: "2012" },
        { degree: "B.Ed.", institution: "Mumbai University", year: "2013" },
        { degree: "B.Sc. Physics", institution: "Mumbai University", year: "2010" }
      ],
      experienceDetails: [
        { position: "Senior Physics Teacher", school: "Shahu Dayanand High School", duration: "2018-Present" },
        { position: "Physics Teacher", school: "St. Xavier's College", duration: "2013-2018" }
      ],
      specializations: ["Mechanics", "Electromagnetism", "Modern Physics", "Experimental Physics"],
      languages: ["English", "Hindi", "Gujarati"],
      hobbies: ["Astronomy", "Photography", "Robotics"],
      bio: "Mr. Amit Patel brings the wonders of physics to life through innovative teaching methods and hands-on experiments."
    },
    {
      id: 4,
      name: "Mrs. Sunita Desai",
      position: "Senior Teacher",
      subject: "History",
      experience: "8+ Years",
      qualification: "M.A. History, B.Ed.",
      email: "sunita.desai@shahudayanand.edu.in",
      phone: "+91 98765 43213",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      department: "Social Studies",
      achievements: [
        "Best Social Studies Teacher 2021",
        "Heritage Conservation Award",
        "Cultural Exchange Program Leader"
      ],
      expertise: ["Indian History", "World History", "Cultural Studies"],
      education: [
        { degree: "M.A. History", institution: "Pune University", year: "2014" },
        { degree: "B.Ed.", institution: "Pune University", year: "2015" },
        { degree: "B.A. History", institution: "Pune University", year: "2012" }
      ],
      experienceDetails: [
        { position: "Senior History Teacher", school: "Shahu Dayanand High School", duration: "2019-Present" },
        { position: "History Teacher", school: "Modern School", duration: "2015-2019" }
      ],
      specializations: ["Ancient History", "Medieval History", "Modern History", "Archaeology"],
      languages: ["English", "Hindi", "Marathi"],
      hobbies: ["Archaeology", "Museum Visits", "Documentary Making"],
      bio: "Mrs. Sunita Desai makes history come alive through storytelling and interactive learning experiences."
    },
    {
      id: 5,
      name: "Mr. Deepak Singh",
      position: "Physical Education Teacher",
      subject: "Sports",
      experience: "6+ Years",
      qualification: "B.P.Ed., M.P.Ed.",
      email: "deepak.singh@shahudayanand.edu.in",
      phone: "+91 98765 43214",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      department: "Physical Education",
      achievements: [
        "State Level Sports Coach Award",
        "District Cricket Team Coach",
        "Fitness Excellence Award"
      ],
      expertise: ["Cricket", "Athletics", "Fitness Training"],
      education: [
        { degree: "M.P.Ed.", institution: "Lakshmibai National Institute", year: "2017" },
        { degree: "B.P.Ed.", institution: "Lakshmibai National Institute", year: "2016" }
      ],
      experienceDetails: [
        { position: "Physical Education Teacher", school: "Shahu Dayanand High School", duration: "2020-Present" },
        { position: "Sports Coach", school: "Sports Authority of India", duration: "2017-2020" }
      ],
      specializations: ["Cricket", "Athletics", "Swimming", "Yoga"],
      languages: ["English", "Hindi", "Punjabi"],
      hobbies: ["Cricket", "Fitness", "Adventure Sports"],
      bio: "Mr. Deepak Singh is dedicated to promoting physical fitness and sports excellence among students."
    },
    {
      id: 6,
      name: "Mrs. Kavita Joshi",
      position: "Art Teacher",
      subject: "Fine Arts",
      experience: "5+ Years",
      qualification: "B.F.A., B.Ed.",
      email: "kavita.joshi@shahudayanand.edu.in",
      phone: "+91 98765 43215",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      department: "Arts",
      achievements: [
        "Best Art Teacher Award 2023",
        "National Art Exhibition Winner",
        "Creative Excellence Award"
      ],
      expertise: ["Painting", "Sculpture", "Digital Art"],
      education: [
        { degree: "B.F.A.", institution: "JJ School of Arts", year: "2018" },
        { degree: "B.Ed.", institution: "Mumbai University", year: "2019" }
      ],
      experienceDetails: [
        { position: "Art Teacher", school: "Shahu Dayanand High School", duration: "2021-Present" },
        { position: "Freelance Artist", duration: "2018-2021" }
      ],
      specializations: ["Oil Painting", "Water Colors", "Sculpture", "Digital Art"],
      languages: ["English", "Hindi", "Marathi"],
      hobbies: ["Painting", "Photography", "Art Exhibitions"],
      bio: "Mrs. Kavita Joshi nurtures creativity and artistic expression in students through various art forms."
    }
  ];

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Mathematics': <CalculateIcon />,
      'English': <LanguageIcon />,
      'Physics': <ScienceIcon />,
      'History': <HistoryIcon />,
      'Sports': <SportsIcon />,
      'Fine Arts': <BrushIcon />,
      'Chemistry': <ScienceIcon />,
      'Biology': <ScienceIcon />,
      'Computer Science': <ComputerIcon />,
      'Music': <MusicNoteIcon />
    };
    return iconMap[subject] || <SchoolIcon />;
  };

  const departments = [...new Set(teachers.map(teacher => teacher.department))];

  const filteredTeachers = activeTab === 0 ? teachers : teachers.filter(teacher => teacher.department === departments[activeTab - 1]);

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
              Teachers Portal
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
              Meet our dedicated team of experienced educators who are committed to nurturing excellence and building character.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Teachers Content */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          {/* Department Tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Box sx={{ mb: 6 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  },
                  '& .MuiTab-root': {
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5,
                    mx: 1,
                    mb: 2,
                    borderRadius: 3,
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#001a4d',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&.Mui-selected': {
                      background: '#667eea',
                      color: '#fff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    },
                    '&:hover': {
                      background: '#667eea',
                      color: '#fff',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <Tab label="All Teachers" />
                {departments.map((dept) => (
                  <Tab key={dept} label={dept} />
                ))}
              </Tabs>
            </Box>
          </motion.div>

          {/* Teachers Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
              {filteredTeachers.map((teacher, index) => (
                <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => handleTeacherClick(teacher)}
                    >
                      <Box
                        sx={{
                          height: 200,
                          background: `url(${teacher.image}) center/cover no-repeat`,
                          position: 'relative'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          {teacher.experience}
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={teacher.image}
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              border: '3px solid #667eea'
                            }}
                          />
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#001a4d', 
                                mb: 0.5,
                                fontSize: '1.1rem'
                              }}
                            >
                              {teacher.name}
                            </Typography>
                            <Chip 
                              label={teacher.position} 
                              size="small"
                              sx={{ 
                                background: '#667eea', 
                                color: '#fff',
                                fontWeight: 600
                              }} 
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getSubjectIcon(teacher.subject)}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666',
                              ml: 1,
                              fontWeight: 500
                            }}
                          >
                            {teacher.subject}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            mb: 2,
                            lineHeight: 1.5
                          }}
                        >
                          {teacher.qualification}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: '#667eea',
                              color: '#fff'
                            }
                          }}
                        >
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Teacher Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedTeacher && (
          <DialogContent sx={{ p: 0 }}>
            <Box>
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  p: 3,
                  position: 'relative'
                }}
              >
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: '#fff'
                  }}
                >
                  <CloseIcon />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={selectedTeacher.image}
                    sx={{
                      width: 100,
                      height: 100,
                      mr: 3,
                      border: '4px solid rgba(255,255,255,0.3)'
                    }}
                  />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {selectedTeacher.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      {selectedTeacher.position}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getSubjectIcon(selectedTeacher.subject)}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {selectedTeacher.subject}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Contact Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email" 
                          secondary={selectedTeacher.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Phone" 
                          secondary={selectedTeacher.phone}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <WorkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Department" 
                          secondary={selectedTeacher.department}
                        />
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Specializations
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedTeacher.specializations.map((spec, index) => (
                        <Chip 
                          key={index}
                          label={spec} 
                          size="small"
                          sx={{ 
                            background: 'rgba(102, 126, 234, 0.1)', 
                            color: '#667eea',
                            fontWeight: 500
                          }} 
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Languages
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedTeacher.languages.map((lang, index) => (
                        <Chip 
                          key={index}
                          label={lang} 
                          size="small"
                          sx={{ 
                            background: 'rgba(76, 175, 80, 0.1)', 
                            color: '#4CAF50',
                            fontWeight: 500
                          }} 
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Achievements
                    </Typography>
                    <List>
                      {selectedTeacher.achievements.map((achievement, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <StarIcon sx={{ color: '#ffd700' }} />
                          </ListItemIcon>
                          <ListItemText primary={achievement} />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Education
                    </Typography>
                    <List>
                      {selectedTeacher.education.map((edu, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <SchoolIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={edu.degree}
                            secondary={`${edu.institution} (${edu.year})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Full Width Sections */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Experience
                    </Typography>
                    <List>
                      {selectedTeacher.experienceDetails.map((exp, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WorkIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={exp.position}
                            secondary={`${exp.school || exp.duration}`}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Bio
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                      {selectedTeacher.bio}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                      Hobbies & Interests
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedTeacher.hobbies.map((hobby, index) => (
                        <Chip 
                          key={index}
                          label={hobby} 
                          size="small"
                          sx={{ 
                            background: 'rgba(255, 152, 0, 0.1)', 
                            color: '#FF9800',
                            fontWeight: 500
                          }} 
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeachersPortal;
