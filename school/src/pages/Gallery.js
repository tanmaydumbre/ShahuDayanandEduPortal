import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Tabs, Tab, Card, CardContent,
  CardMedia, Chip, IconButton, Dialog, DialogContent, DialogActions, Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsIcon from '@mui/icons-material/Sports';
import SchoolIcon from '@mui/icons-material/School';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ScienceIcon from '@mui/icons-material/Science';
import Logo from '../assets/SDHJC_Logo.png';

function Gallery() {
  const { language } = useLanguage();
  const t = translations[language]?.gallery || {};
  const [value, setValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
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

  const events = [
    { 
      category: language === 'mr' ? 'सर्व कार्यक्रम' : 'All Events', 
      icon: <PhotoLibraryIcon />,
      color: '#667eea',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'वार्षिक क्रीडा सभा २०२४' : 'Annual Sports Meet 2024',
          date: language === 'mr' ? 'मार्च १५, २०२४' : 'March 15, 2024',
          description: language === 'mr' ? 'विविध क्रीडा क्रियाकलापांमध्ये सहभागी होणारे विद्यार्थी' : 'Students participating in various sports activities'
        },
        {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'विज्ञान प्रदर्शन' : 'Science Exhibition',
          date: language === 'mr' ? 'फेब्रुवारी २०, २०२४' : 'February 20, 2024',
          description: language === 'mr' ? 'त्यांचे नावीन्यपूर्ण प्रकल्प दाखवणारे विद्यार्थी' : 'Students showcasing their innovative projects'
        },
        {
          url: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'सांस्कृतिक महोत्सव' : 'Cultural Festival',
          date: language === 'mr' ? 'जानेवारी २५, २०२४' : 'January 25, 2024',
          description: language === 'mr' ? 'पारंपारिक नृत्य आणि संगीत कार्यक्रम' : 'Traditional dance and music performances'
        },
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'स्वातंत्र्य दिन साजरा' : 'Independence Day Celebration',
          date: language === 'mr' ? 'ऑगस्ट १५, २०२३' : 'August 15, 2023',
          description: language === 'mr' ? 'ध्वजारोहण आणि देशभक्ती कार्यक्रम' : 'Flag hoisting and patriotic performances'
        },
        {
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'आंतरराष्ट्रीय योग दिन' : 'International Yoga Day',
          date: language === 'mr' ? 'जून २१, २०२३' : 'June 21, 2023',
          description: language === 'mr' ? 'योगासने करणारे विद्यार्थी' : 'Students performing yoga asanas'
        },
        {
          url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'बाल दिन साजरा' : "Children's Day Celebration",
          date: language === 'mr' ? 'नोव्हेंबर १४, २०२३' : 'November 14, 2023',
          description: language === 'mr' ? 'विद्यार्थ्यांसाठी मजेदार क्रियाकलाप आणि खेळ' : 'Fun activities and games for students'
        }
      ]
    },
    { 
      category: language === 'mr' ? 'क्रीडा कार्यक्रम' : 'Sports Events', 
      icon: <SportsIcon />,
      color: '#4CAF50',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'वार्षिक क्रीडा सभा २०२४' : 'Annual Sports Meet 2024',
          date: language === 'mr' ? 'मार्च १५, २०२४' : 'March 15, 2024',
          description: language === 'mr' ? 'विविध क्रीडा क्रियाकलापांमध्ये सहभागी होणारे विद्यार्थी' : 'Students participating in various sports activities'
        },
        {
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'क्रिकेट स्पर्धा' : 'Cricket Tournament',
          date: language === 'mr' ? 'फेब्रुवारी १०, २०२४' : 'February 10, 2024',
          description: language === 'mr' ? 'इंटर-हाऊस क्रिकेट स्पर्धा' : 'Inter-house cricket competition'
        },
        {
          url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'अॅथलेटिक्स सभा' : 'Athletics Meet',
          date: language === 'mr' ? 'जानेवारी ३०, २०२४' : 'January 30, 2024',
          description: language === 'mr' ? 'ट्रॅक आणि फील्ड कार्यक्रम' : 'Track and field events'
        }
      ]
    },
    { 
      category: language === 'mr' ? 'शैक्षणिक कार्यक्रम' : 'Academic Events', 
      icon: <SchoolIcon />,
      color: '#2196F3',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'विज्ञान प्रदर्शन' : 'Science Exhibition',
          date: language === 'mr' ? 'फेब्रुवारी २०, २०२४' : 'February 20, 2024',
          description: language === 'mr' ? 'त्यांचे नावीन्यपूर्ण प्रकल्प दाखवणारे विद्यार्थी' : 'Students showcasing their innovative projects'
        },
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'गणित ऑलिम्पियाड' : 'Mathematics Olympiad',
          date: language === 'mr' ? 'डिसेंबर १५, २०२३' : 'December 15, 2023',
          description: language === 'mr' ? 'जटिल गणिती समस्या सोडवणारे विद्यार्थी' : 'Students solving complex mathematical problems'
        },
        {
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'इंग्रजी वादविवाद स्पर्धा' : 'English Debate Competition',
          date: language === 'mr' ? 'नोव्हेंबर २५, २०२३' : 'November 25, 2023',
          description: language === 'mr' ? 'वादविवाद स्पर्धेत सहभागी होणारे विद्यार्थी' : 'Students participating in debate competition'
        }
      ]
    },
    { 
      category: language === 'mr' ? 'सांस्कृतिक कार्यक्रम' : 'Cultural Events', 
      icon: <MusicNoteIcon />,
      color: '#9C27B0',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'सांस्कृतिक महोत्सव' : 'Cultural Festival',
          date: language === 'mr' ? 'जानेवारी २५, २०२४' : 'January 25, 2024',
          description: language === 'mr' ? 'पारंपारिक नृत्य आणि संगीत कार्यक्रम' : 'Traditional dance and music performances'
        },
        {
          url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'बाल दिन साजरा' : "Children's Day Celebration",
          date: language === 'mr' ? 'नोव्हेंबर १४, २०२३' : 'November 14, 2023',
          description: language === 'mr' ? 'विद्यार्थ्यांसाठी मजेदार क्रियाकलाप आणि खेळ' : 'Fun activities and games for students'
        },
        {
          url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'वार्षिक कार्यक्रम' : 'Annual Function',
          date: language === 'mr' ? 'डिसेंबर २०, २०२३' : 'December 20, 2023',
          description: language === 'mr' ? 'स्टेजवर कार्यक्रम सादर करणारे विद्यार्थी' : 'Students performing on stage'
        }
      ]
    },
    { 
      category: language === 'mr' ? 'साजरे' : 'Celebrations', 
      icon: <CelebrationIcon />,
      color: '#FF9800',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'स्वातंत्र्य दिन साजरा' : 'Independence Day Celebration',
          date: language === 'mr' ? 'ऑगस्ट १५, २०२३' : 'August 15, 2023',
          description: language === 'mr' ? 'ध्वजारोहण आणि देशभक्ती कार्यक्रम' : 'Flag hoisting and patriotic performances'
        },
        {
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'आंतरराष्ट्रीय योग दिन' : 'International Yoga Day',
          date: language === 'mr' ? 'जून २१, २०२३' : 'June 21, 2023',
          description: language === 'mr' ? 'योगासने करणारे विद्यार्थी' : 'Students performing yoga asanas'
        },
        {
          url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'प्रजासत्ताक दिन साजरा' : 'Republic Day Celebration',
          date: language === 'mr' ? 'जानेवारी २६, २०२४' : 'January 26, 2024',
          description: language === 'mr' ? 'सांस्कृतिक परेड आणि कार्यक्रम' : 'Cultural parade and performances'
        }
      ]
    },
    { 
      category: language === 'mr' ? 'विज्ञान आणि तंत्रज्ञान' : 'Science & Technology', 
      icon: <ScienceIcon />,
      color: '#FF5722',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'विज्ञान प्रदर्शन' : 'Science Exhibition',
          date: language === 'mr' ? 'फेब्रुवारी २०, २०२४' : 'February 20, 2024',
          description: language === 'mr' ? 'त्यांचे नावीन्यपूर्ण प्रकल्प दाखवणारे विद्यार्थी' : 'Students showcasing their innovative projects'
        },
        {
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'संगणक विज्ञान कार्यशाळा' : 'Computer Science Workshop',
          date: language === 'mr' ? 'मार्च ५, २०२४' : 'March 5, 2024',
          description: language === 'mr' ? 'प्रोग्रामिंग आणि रोबोटिक्स शिकणारे विद्यार्थी' : 'Students learning programming and robotics'
        },
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
          title: language === 'mr' ? 'गणित ऑलिम्पियाड' : 'Mathematics Olympiad',
          date: language === 'mr' ? 'डिसेंबर १५, २०२३' : 'December 15, 2023',
          description: language === 'mr' ? 'जटिल गणिती समस्या सोडवणारे विद्यार्थी' : 'Students solving complex mathematical problems'
        }
      ]
    }
  ];

  const currentImages = events[value].images;

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
              {language === 'mr' ? 'फोटो गॅलरी' : 'Photo Gallery'}
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
              {language === 'mr' ? 'शाहू दयानंद हायस्कूलमध्ये उत्कृष्टता, सर्जनशीलता आणि यशाचे क्षण कॅप्चर करणे.' : 'Capturing moments of excellence, creativity, and achievement at Shahu Dayanand High School.'}
          </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Gallery Content */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          {/* Category Tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Box sx={{ mb: 6 }}>
        <Tabs
          value={value}
          onChange={handleChange}
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
                      background: events[value]?.color || '#667eea',
                      color: '#fff',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${events[value]?.color || '#667eea'}40`
                    },
                    '&:hover': {
                      background: events[value]?.color || '#667eea',
                      color: '#fff',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }
          }}
        >
          {events.map((event, index) => (
                  <Tab 
                    key={index} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {event.icon}
                        <span>{event.category}</span>
                      </Box>
                    } 
                  />
          ))}
        </Tabs>
            </Box>
          </motion.div>

        {/* Images Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
          {currentImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                      onClick={() => handleImageClick(image)}
                    >
                      <CardMedia
                  component="img"
                        height="250"
                        image={image.url}
                        alt={image.title}
                  sx={{
                    objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 1,
                            fontSize: '1.1rem'
                          }}
                        >
                          {image.title}
                        </Typography>
                        <Chip 
                          label={image.date} 
                          size="small"
                          sx={{ 
                            background: events[value]?.color || '#667eea', 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 2
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            lineHeight: 1.5
                          }}
                        >
                          {image.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
            </Grid>
          ))}
        </Grid>
          </motion.div>

          {/* No Images Message */}
          {currentImages.length === 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PhotoLibraryIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  No images available for this category
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Check back later for new photos from upcoming events
                </Typography>
              </Box>
            </motion.div>
          )}
      </Container>
      </Box>

      {/* Image Dialog */}
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
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <Box>
              <Box
                component="img"
                src={selectedImage.url}
                alt={selectedImage.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#001a4d', mb: 2 }}>
                  {selectedImage.title}
                </Typography>
                <Chip 
                  label={selectedImage.date} 
                  sx={{ 
                    background: events[value]?.color || '#667eea', 
                    color: '#fff',
                    fontWeight: 600,
                    mb: 2
                  }} 
                />
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  {selectedImage.description}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Gallery;