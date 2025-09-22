import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, 
  Button, Tabs, Tab, Dialog, DialogContent, DialogActions, IconButton,
  Avatar, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SportsIcon from '@mui/icons-material/Sports';
import SchoolIcon from '@mui/icons-material/School';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ScienceIcon from '@mui/icons-material/Science';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArtIcon from '@mui/icons-material/Palette';
import Logo from '../assets/SDHJC_Logo.png';

function Events() {
  const { language } = useLanguage();
  const t = translations[language]?.events || {};
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
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

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Event data with comprehensive details
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Sports Meet 2024",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "School Ground",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop",
      description: "Join us for our annual sports day celebration featuring various athletic events, track and field competitions, and cultural performances. Students from all classes will participate in different sports activities.",
      organizer: "Physical Education Department",
      participants: "All Students (Class 8-12)",
      highlights: [
        "Track and Field Events",
        "Team Sports Competitions",
        "Cultural Performances",
        "Award Ceremony",
        "Parent Participation"
      ],
      requirements: "Sports uniform, water bottle, and enthusiasm",
      registration: "Open until March 10, 2024",
      icon: <SportsIcon />
    },
    {
      id: 2,
      title: "Science Exhibition 2024",
      date: "February 20, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "School Auditorium",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
      description: "Students showcase their innovative projects and scientific discoveries at our annual science exhibition. This year's theme focuses on sustainable development and environmental conservation.",
      organizer: "Science Department",
      participants: "Students (Class 9-12)",
      highlights: [
        "Innovative Project Displays",
        "Interactive Demonstrations",
        "Expert Judging Panel",
        "Prizes for Best Projects",
        "Public Viewing"
      ],
      requirements: "Project submission by February 15, 2024",
      registration: "Registration closed",
      icon: <ScienceIcon />
    },
    {
      id: 3,
      title: "Cultural Festival 2024",
      date: "January 25, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "School Auditorium",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=400&h=300&fit=crop",
      description: "Experience the rich cultural heritage through dance, music, drama, and art performances by our talented students. A celebration of diversity and artistic expression.",
      organizer: "Cultural Department",
      participants: "All Students",
      highlights: [
        "Classical Dance Performances",
        "Musical Concerts",
        "Drama and Skits",
        "Art Exhibition",
        "Fashion Show"
      ],
      requirements: "Audition required for performances",
      registration: "Auditions ongoing",
      icon: <MusicNoteIcon />
    },
    {
      id: 4,
      title: "Parent-Teacher Meeting",
      date: "March 15, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Classrooms",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      description: "Schedule your appointment to discuss your child's academic progress, behavior, and future goals with our dedicated teachers and staff members.",
      organizer: "Administration",
      participants: "Parents and Teachers",
      highlights: [
        "Individual Consultations",
        "Progress Reports",
        "Academic Guidance",
        "Future Planning",
        "Feedback Session"
      ],
      requirements: "Appointment booking required",
      registration: "Book your slot online",
      icon: <SchoolIcon />
    }
  ];

  const previousEvents = [
    {
      id: 5,
      title: "Independence Day Celebration 2023",
      date: "August 15, 2023",
      time: "8:00 AM - 12:00 PM",
      location: "School Ground",
      category: "Celebration",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      description: "A patriotic celebration featuring flag hoisting, cultural performances, and speeches highlighting the importance of freedom and national unity.",
      organizer: "Student Council",
      participants: "All Students and Staff",
      highlights: [
        "Flag Hoisting Ceremony",
        "Patriotic Songs",
        "Cultural Performances",
        "Speech Competition",
        "Distribution of Sweets"
      ],
      achievements: "Successfully organized with 100% student participation",
      feedback: "Excellent organization and patriotic spirit",
      icon: <CelebrationIcon />
    },
    {
      id: 6,
      title: "International Yoga Day 2023",
      date: "June 21, 2023",
      time: "6:00 AM - 8:00 AM",
      location: "School Ground",
      category: "Health & Wellness",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      description: "Students and teachers participated in various yoga asanas and meditation sessions to promote physical and mental well-being.",
      organizer: "Physical Education Department",
      participants: "All Students and Staff",
      highlights: [
        "Yoga Asanas",
        "Meditation Session",
        "Breathing Exercises",
        "Health Awareness",
        "Certificate Distribution"
      ],
      achievements: "Featured in local newspaper for community participation",
      feedback: "Highly beneficial for stress relief and fitness",
      icon: <SportsIcon />
    },
    {
      id: 7,
      title: "Children's Day Celebration 2023",
      date: "November 14, 2023",
      time: "9:00 AM - 3:00 PM",
      location: "School Campus",
      category: "Celebration",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
      description: "A fun-filled day with games, activities, and special treats organized by teachers to celebrate the spirit of childhood and learning.",
      organizer: "Teachers Association",
      participants: "All Students",
      highlights: [
        "Fun Games and Activities",
        "Talent Show",
        "Special Lunch",
        "Gift Distribution",
        "Dance Competition"
      ],
      achievements: "Created memorable experiences for all students",
      feedback: "Students thoroughly enjoyed the celebration",
      icon: <CelebrationIcon />
    },
    {
      id: 8,
      title: "Art Exhibition 2023",
      date: "December 10, 2023",
      time: "10:00 AM - 5:00 PM",
      location: "Art Gallery",
      category: "Arts",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      description: "Students displayed their artistic talents through paintings, sculptures, and digital art, showcasing creativity and artistic expression.",
      organizer: "Art Department",
      participants: "Art Students",
      highlights: [
        "Paintings Exhibition",
        "Sculpture Display",
        "Digital Art Show",
        "Live Art Demonstrations",
        "Award Ceremony"
      ],
      achievements: "Several artworks selected for district exhibition",
      feedback: "Outstanding creativity and artistic skills displayed",
      icon: <ArtIcon />
    }
  ];

  const getCategoryColor = (category) => {
    const colorMap = {
      'Sports': '#4CAF50',
      'Academic': '#2196F3',
      'Cultural': '#9C27B0',
      'Celebration': '#FF9800',
      'Health & Wellness': '#00BCD4',
      'Arts': '#E91E63'
    };
    return colorMap[category] || '#667eea';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Sports': <SportsIcon />,
      'Academic': <SchoolIcon />,
      'Cultural': <MusicNoteIcon />,
      'Celebration': <CelebrationIcon />,
      'Health & Wellness': <SportsIcon />,
      'Arts': <ArtIcon />
    };
    return iconMap[category] || <EventIcon />;
  };

  const currentEvents = activeTab === 0 ? upcomingEvents : previousEvents;

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
              School Events
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
              Discover our exciting calendar of events, from academic competitions to cultural celebrations and sports activities.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Events Content */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          {/* Event Type Tabs */}
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
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    justifyContent: 'center',
                  },
                  '& .MuiTab-root': {
                    minWidth: 'auto',
                    px: 4,
                    py: 2,
                    mx: 1,
                    borderRadius: 3,
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#001a4d',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
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
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon />
                      <span>Upcoming Events</span>
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon />
                      <span>Previous Events</span>
                    </Box>
                  } 
                />
              </Tabs>
            </Box>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
              {currentEvents.map((event, index) => (
                <Grid item xs={12} sm={6} md={6} key={event.id}>
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
                      onClick={() => handleEventClick(event)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={event.image}
                          alt={event.title}
                          sx={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
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
                          {event.category}
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              background: getCategoryColor(event.category),
                              mr: 2,
                              width: 40,
                              height: 40
                            }}
                          >
                            {getCategoryIcon(event.category)}
                          </Avatar>
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
                              {event.title}
                            </Typography>
                            <Chip 
                              label={event.date} 
                              size="small"
                              sx={{ 
                                background: getCategoryColor(event.category), 
                                color: '#fff',
                                fontWeight: 600
                              }} 
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTimeIcon sx={{ fontSize: '1rem', color: '#666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666', mr: 2 }}>
                            {event.time}
                          </Typography>
                          <LocationOnIcon sx={{ fontSize: '1rem', color: '#666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            mb: 2,
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {event.description}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: getCategoryColor(event.category),
                            color: getCategoryColor(event.category),
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: getCategoryColor(event.category),
                              color: '#fff'
                            }
                          }}
                        >
                          View Details
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

      {/* Event Detail Dialog */}
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
        {selectedEvent && (
          <DialogContent sx={{ p: 0 }}>
            <Box>
              {/* Header */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${getCategoryColor(selectedEvent.category)} 0%, ${getCategoryColor(selectedEvent.category)}80 100%)`,
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
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      mr: 3,
                      width: 80,
                      height: 80
                    }}
                  >
                    {getCategoryIcon(selectedEvent.category)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {selectedEvent.title}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      {selectedEvent.category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">{selectedEvent.date}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">{selectedEvent.time}</Typography>
                      </Box>
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
                      Event Details
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6, mb: 3 }}>
                      {selectedEvent.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                        Event Highlights
                      </Typography>
                      <List>
                        {selectedEvent.highlights.map((highlight, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: getCategoryColor(selectedEvent.category)
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={highlight} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                        Event Information
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <PeopleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Organizer" 
                            secondary={selectedEvent.organizer}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PeopleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Participants" 
                            secondary={selectedEvent.participants}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocationOnIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Location" 
                            secondary={selectedEvent.location}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                        Requirements
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                        {selectedEvent.requirements}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                        Registration
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                        {selectedEvent.registration}
                      </Typography>
                    </Box>

                    {selectedEvent.achievements && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                          Achievements
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                          {selectedEvent.achievements}
                        </Typography>
                      </Box>
                    )}

                    {selectedEvent.feedback && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                          Feedback
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                          {selectedEvent.feedback}
                        </Typography>
                      </Box>
                    )}
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

export default Events;