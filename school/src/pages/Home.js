import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, CircularProgress, Grid, Card, CardContent, Avatar, Chip
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "../assets/SDHJC_Logo.png";

function Home() {
  const { language } = useLanguage();
  const t = translations[language]?.home || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
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

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Data for different sections
  const achievements = [
    { number: "1980", label: language === 'mr' ? "स्थापना वर्ष" : "YEAR FOUNDED", icon: "🏛️" },
    { number: "50+", label: language === 'mr' ? "प्रमाणित शिक्षक" : "CERTIFIED TEACHERS", icon: "👨‍🏫" },
    { number: "1000+", label: language === 'mr' ? "शाळेतील विद्यार्थी" : "STUDENTS IN SCHOOL", icon: "👨‍🎓" },
    { number: "40+", label: language === 'mr' ? "अनुभवाचे वर्षे" : "YEARS OF EXPERIENCE", icon: "⭐" }
  ];

  const latestNews = [
    {
      title: language === 'mr' ? "योग सत्रे" : "Yoga Sessions",
      description: language === 'mr' ? "२०१५ मध्ये सुरुवात झाल्यापासून, जून २१ रोजी जगभरात 'आंतरराष्ट्रीय योग दिन' म्हणून साजरा केला जातो. ही कल्पना आमच्या पंतप्रधान श्री नरेंद्र मोदी यांनी मांडली होती." : "Since its inception in the year 2015, June 21st is celebrated as 'The International Day of Yoga' all over the world. This idea was proposed by our Prime Minister Mr. Narendra Modi.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
      date: language === 'mr' ? "जून २१, २०२४" : "June 21, 2024"
    },
    {
      title: language === 'mr' ? "स्वातंत्र्य दिन" : "Independence Day",
      description: language === 'mr' ? "भारताच्या इतिहासात एक लाल अक्षरांचा दिन होता जेव्हा देशाला १५ ऑगस्ट १९४७ रोजी स्वातंत्र्य मिळाले. गुलामगिरीचे बंधन तोडण्यासाठी आम्हाला शेकडो वर्षे लागली." : "It was a red letter day in the history of India when the country got her freedom on 15 August 1947. It took hundreds of years for us to break shackles of slavery.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      date: language === 'mr' ? "ऑगस्ट १५, २०२४" : "August 15, 2024"
    },
    {
      title: language === 'mr' ? "बाल दिन साजरा" : "Children's Day Celebration",
      description: language === 'mr' ? "आपण सर्व एकदा मुले होतो. आपण सर्व आपल्या मुलांच्या कल्याणासाठी इच्छा सामायिक करतो, जी नेहमीच राहिली आहे आणि सर्वात सार्वत्रिक मानलेली आकांक्षा राहील." : "We were all children once. We all share the desire for the well being of our children, which has always been and will continue to be the most universally cherished aspiration.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop",
      date: language === 'mr' ? "नोव्हेंबर १४, २०२४" : "November 14, 2024"
    },
    {
      title: language === 'mr' ? "फॅन्सी ड्रेस स्पर्धा" : "Fancy Dress Competition",
      description: language === 'mr' ? "विविध व्यायाम आणि खेळांच्या उपकरणांसारखे पोशाख घातलेली मुले स्टेजवर परेड करत होती आणि मनोरंजक तथ्ये सादर करत होती, जीवनहीन यंत्रांना जीवंत करत." : "Children dressed up as various exercise and sports equipment paraded on the stage and presented interesting facts, bringing to life, the lifeless machines.",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=250&fit=crop",
      date: language === 'mr' ? "डिसेंबर १०, २०२४" : "December 10, 2024"
    }
  ];

  const clubs = [
    {
      name: language === 'mr' ? "सचोटी क्लब" : "INTEGRITY CLUB",
      description: language === 'mr' ? "सचोटी क्लब हे विद्यार्थ्यांमध्ये मानवी मूल्ये विकसित करण्यासाठी शाळांमध्ये खेळ, क्रियाकलाप आणि कार्यशाळा आयोजित करून समुदाय गट म्हणून डिझाइन केले आहेत." : "The integrity clubs are designed as community groups for cultivating human values among students by organizing games, activities and workshops in schools.",
      icon: "🤝",
      color: "#4CAF50"
    },
    {
      name: language === 'mr' ? "वाचक क्लब" : "READERS CLUB",
      description: language === 'mr' ? "विद्यार्थ्यांना त्यांच्या पुस्तकांबद्दलच्या प्रेम आणि वाचन सामायिक करण्याची संधी देणे आमच्या शाळेत मजबूत वाचन संस्कृती तयार करण्यास मदत करते." : "Giving students the opportunity to share their love of books and reading helps to create a strong reading culture at our school.",
      icon: "📚",
      color: "#2196F3"
    },
    {
      name: language === 'mr' ? "पर्यावरण क्लब" : "ECO-CLUB",
      description: language === 'mr' ? "तरुण लोकांना मालकीची भावना, शाळेचा अभिमान विकसित करण्यासाठी आणि समुदाय भावना जोडण्यासाठी हा एक अद्भुत मार्ग आहे." : "It is a wonderful way for the young people to develop a sense of ownership, school pride, adding to the community spirit.",
      icon: "🌱",
      color: "#8BC34A"
    },
    {
      name: language === 'mr' ? "आरोग्य आणि कल्याण क्लब" : "HEALTH & WELFARE CLUB",
      description: language === 'mr' ? "शाळांमधील आरोग्य आणि कल्याण क्लब व्यक्ती आणि समुदायाशी संबंधित सवयी, दृष्टिकोन आणि ज्ञानावर अनुकूल प्रभाव टाकू शकतात." : "Health & Wellness Clubs in schools can favorably influence the habits, attitude and knowledge relating to an individual and community.",
      icon: "🏥",
      color: "#FF5722"
    },
    {
      name: language === 'mr' ? "वारसा क्लब" : "HERITAGE CLUB",
      description: language === 'mr' ? "वारसा क्लब हे पारंपारिक क्रियाकलाप आयोजित करून विद्यार्थ्यांमध्ये सांस्कृतिक मूल्ये विकसित करण्यासाठी समुदाय गट म्हणून डिझाइन केले आहेत." : "The heritage clubs are designed as community groups for cultivating cultural values among students by organizing traditional activities.",
      icon: "🏛️",
      color: "#9C27B0"
    }
  ];

  return (
    <Box sx={{ fontFamily: 'Montserrat, Arial, sans-serif', background: '#fff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 500, sm: 600, md: 700 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
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
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        
        <motion.div
          animate={{
            y: [0, -20, 0],
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
            width: 80,
            height: 80,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2, color: '#fff', width: '100%', px: { xs: 2, sm: 4 } }}>
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
                width: { xs: 120, sm: 150, md: 180 },
                height: { xs: 120, sm: 150, md: 180 },
                mb: 3,
                maxWidth: '100%',
                objectFit: 'contain',
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
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, 
                fontWeight: 300, 
                color: '#fff', 
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {language === 'mr' ? 'शाहू दयानंद हायस्कूलमध्ये आपले स्वागत आहे' : 'Welcome to'}
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
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                fontWeight: 700, 
                color: '#fff', 
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.2
              }}
            >
              {language === 'mr' ? 'शाहू दयानंद हायस्कूल आणि ज्युनियर कॉलेज' : 'Shahu Dayanand High School & Junior College'}
            </Typography>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Typography 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }, 
                fontWeight: 400, 
                color: '#ffd700', 
                mb: 4,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {language === 'mr' ? 'कोल्हापूर आर्य समाज शैक्षणिक संस्था' : 'Kolhapur Arya Samaj Educational Institution'}
            </Typography>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained" 
                onClick={() => navigate('/teachers-portal')}
            sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
              borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {language === 'mr' ? 'शिक्षक पोर्टल' : 'Teachers Portal'}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/events')}
                sx={{
                  background: 'rgba(255, 215, 0, 0.8)',
                  color: '#333',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
                  borderRadius: 3,
                  '&:hover': {
                    background: 'rgba(255, 215, 0, 1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {language === 'mr' ? 'कार्यक्रम पहा' : 'View Events'}
          </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Chairman's Message Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, background: '#f8f9fa' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                {t.chairman?.title || 'Chairman\'s Message'}
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
                    {language === 'mr' ? '"जर भारताचे चेहरे बदलायचे असतील तर ते योग्य आणि गुणवत्तापूर्ण शिक्षण सर्वांना भेदभाव न करता दिल्याशिवाय साध्य होणार नाही". या विचाराने मी तुमच्या सर्वांचे शाहू दयानंद हायस्कूलच्या कुटुंबात स्वागत करतो आणि तुमच्या मुलाला मानक गुणवत्तापूर्ण शिक्षणाचा लाभ मिळवून देतो. आम्ही आमच्या विद्यार्थ्यांना मानक शिक्षण देण्यासाठी कठोर प्रयत्न करतो, विशेषतः कारण ते कोल्हापूर जिल्ह्यासारख्या ग्रामीण भागातील आहेत.' : '"If the face of India has to change ever then it cannot be attained without proper and quality education being imparted to everyone without any discrimination". With this thought I would like to welcome you all in the family of Shahu Dayanand High School and get your child benefitted by the standard quality education. We strive hard to deliver standard education to our students specifically, as they belong to a rural area like Kolhapur District.'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: '#001a4d' }}>
                      {language === 'mr' ? 'श्री उमेश एस. गळवणकर' : 'Mr. Umesh S. Galwankar'}
                    </Typography>
                    <Chip 
                      label={language === 'mr' ? 'अध्यक्ष' : 'Chairman'} 
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
          </Box>
        </motion.div>
      </Box>

      {/* Achievements Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                {language === 'mr' ? 'आमच्या शिक्षक आणि विद्यार्थ्यांची यशे' : 'OUR TEACHERS AND STUDENTS ACHIEVEMENTS'}
        </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {achievements.map((achievement, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                        textAlign: 'center',
                        p: 3,
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          background: 'rgba(255, 255, 255, 0.15)'
                        }
                      }}
                    >
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
                        <Typography sx={{ fontSize: '3rem', mb: 2 }}>
                          {achievement.icon}
                        </Typography>
                      </motion.div>
                      
                      <Typography 
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
                          fontWeight: 700, 
                          color: '#fff', 
                          mb: 1 
                        }}
                      >
                        {achievement.number}
                      </Typography>
                      
                      <Typography 
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }, 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500
                        }}
                      >
                        {achievement.label}
                      </Typography>
                    </Card>
                  </motion.div>
            </Grid>
          ))}
        </Grid>
          </Box>
        </motion.div>
      </Box>

      {/* Latest News Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                {language === 'mr' ? 'आमचे नवीनतम बातम्या' : 'OUR LATEST NEWS'}
        </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {latestNews.map((news, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
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
                          background: `url(${news.image}) center/cover no-repeat`,
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
                            fontSize: '0.8rem'
                          }}
                        >
                          {news.date}
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          sx={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                    mb: 2,
                            lineHeight: 1.3
                          }}
                        >
                          {news.title}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            color: '#666', 
                            mb: 3,
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {news.description}
                        </Typography>
                        
                <Button
                          variant="outlined"
                  sx={{
                            borderColor: '#001a4d',
                    color: '#001a4d',
                    textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: '#001a4d',
                              color: '#fff'
                            }
                  }}
                >
                  Read More
                </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Box>

      {/* Clubs Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, background: '#f8f9fa' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                {language === 'mr' ? 'आमचे व्हिडिओ पहा' : 'WATCH OUR VIDEOS'}
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {clubs.map((club, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${club.color}20 0%, ${club.color}40 100%)`,
                        border: `2px solid ${club.color}30`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: `0 8px 30px ${club.color}30`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          <Typography sx={{ fontSize: '3rem', mb: 2 }}>
                            {club.icon}
                          </Typography>
                        </motion.div>
                        
                        <Typography 
                          sx={{ 
                            fontSize: '1.3rem', 
                            fontWeight: 700, 
                            color: '#001a4d', 
                            mb: 3 
                          }}
                        >
                          {club.name}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            color: '#666', 
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
                          }}
                        >
                          {club.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
              </Box>

      {/* Quick Links Section */}
      <Box sx={{ py: 6, px: { xs: 2, sm: 4 }, background: '#001a4d' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
            <motion.div variants={fadeInUp}>
              <Typography 
                sx={{ 
                  fontSize: { xs: '1.8rem', sm: '2.2rem' }, 
                  fontWeight: 700, 
                  color: '#fff', 
                  mb: 4 
                }}
              >
                {t.quickLinks || 'Quick Links'}
              </Typography>
            </motion.div>

            <Grid container spacing={2} justifyContent="center">
              {[
                t.quickLinksItems?.admissionForm || 'Admission Form',
                t.quickLinksItems?.feeStructure || 'Fee Structure', 
                t.quickLinksItems?.academicCalendar || 'Academic Calendar',
                t.quickLinksItems?.contactUs || 'Contact Us'
              ].map((link, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 3,
                        width: '100%',
                        '&:hover': {
                          borderColor: '#ffd700',
                          background: 'rgba(255, 215, 0, 0.1)'
                        }
                      }}
                    >
                      {link}
                    </Button>
                  </motion.div>
            </Grid>
          ))}
        </Grid>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Home;