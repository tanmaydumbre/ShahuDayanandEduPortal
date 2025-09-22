import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TeachersProfile() {
  const teachers = [
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
    { name: 'Subhash Mhalungekar', qualification: 'M.A, B.A B.Ed' },
  ];

  // Animation variants for hero section
  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Animation variants for teacher cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
    hover: { scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: { duration: 0.3 } },
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <Box
          sx={{
            bgcolor: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            py: { xs: 6, md: 10 },
            textAlign: 'center',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' } }}
            >
              About Our School
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 300 }}
            >
              A Legacy of Excellence in Education
            </Typography>
          </Container>
        </Box>
      </motion.div>

      {/* Teachers Profile Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, color: '#001a4d', mb: 4 }}
          >
            Teachers Profile
          </Typography>
        </motion.div>
        <Grid container spacing={3} justifyContent="center">
          {teachers.map((teacher, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="../src/assets/Subhash.M.jpeg"
                    alt="Teacher"
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      borderRadius: '50%',
                      border: '3px solid #1976d2',
                      mb: 2,
                      objectFit: 'cover',
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#1976d2' }}
                  >
                    {teacher.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#555', fontStyle: 'italic' }}
                  >
                    {teacher.qualification}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* History Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, color: '#001a4d' }}
              >
                Our History
              </Typography>
              <Typography
                paragraph
                sx={{ color: '#333', lineHeight: 1.6 }}
              >
                Founded in 1960, Shahu Dayanand High School and Junior College has been
                a beacon of educational excellence in Kolhapur for over six decades.
                Named after the great social reformer Mahatma Jyotiba Phule, our school
                has consistently maintained high academic standards while promoting
                social values and community service.
              </Typography>
              <Typography
                paragraph
                sx={{ color: '#333', lineHeight: 1.6 }}
              >
                Over the years, we have grown from a small institution to a premier
                educational establishment, serving thousands of students and producing
                leaders in various fields.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#001a4d' }}
                >
                  Our Achievements
                </Typography>
                <List>
                  {[
                    'Consistently high board exam results',
                    'State-level recognition for academic excellence',
                    'Outstanding performance in sports and cultural events',
                    'Strong alumni network with successful professionals',
                  ].map((text, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2, duration: 0.5 }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          primaryTypographyProps={{ sx: { color: '#333' } }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Mission & Vision Section */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                title: 'Our Mission',
                text: 'To provide quality education that nurtures intellectual growth, moral values, and social responsibility. We strive to create an environment where students can develop their full potential and become responsible citizens of tomorrow.',
              },
              {
                title: 'Our Vision',
                text: 'To be a leading educational institution that shapes future leaders through innovative teaching methods, comprehensive development programs, and a strong emphasis on character building. We aim to create a community of lifelong learners who contribute positively to society.',
              },
            ].map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{ fontWeight: 700, color: '#001a4d' }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      paragraph
                      sx={{ color: '#333', lineHeight: 1.6 }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default TeachersProfile;