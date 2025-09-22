import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CloseIcon from '@mui/icons-material/Close';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import SportsIcon from '@mui/icons-material/Sports';

function NewsTicker() {
  const { language } = useLanguage();
  const t = translations[language]?.newsTicker || {};
  const [isVisible, setIsVisible] = useState(true);

  // News data with different types and icons
  const newsItems = [
    {
      id: 1,
      text: "🎉 Annual Sports Meet 2024 registration is now open! Students can register for various events.",
      type: "sports",
      icon: <SportsIcon />,
      priority: "high"
    },
    {
      id: 2,
      text: "📚 Science Exhibition 2024 will be held on February 20th. All students are encouraged to participate.",
      type: "academic",
      icon: <SchoolIcon />,
      priority: "high"
    },
    {
      id: 3,
      text: "🎭 Cultural Festival preparations are in full swing. Auditions for dance and music performances start next week.",
      type: "cultural",
      icon: <EventIcon />,
      priority: "medium"
    },
    {
      id: 4,
      text: "🏆 Congratulations to our students who won first place in the District Mathematics Olympiad!",
      type: "achievement",
      icon: <NewReleasesIcon />,
      priority: "high"
    },
    {
      id: 5,
      text: "📅 Parent-Teacher Meeting scheduled for March 15th, 2024. All parents are requested to attend.",
      type: "announcement",
      icon: <AnnouncementIcon />,
      priority: "medium"
    },
    {
      id: 6,
      text: "🌱 Tree Plantation Drive will be organized on World Environment Day. Students will plant 100 trees.",
      type: "event",
      icon: <EventIcon />,
      priority: "medium"
    },
    {
      id: 7,
      text: "📖 Library Week celebration from March 1st to 7th. Special activities and book fair will be organized.",
      type: "academic",
      icon: <SchoolIcon />,
      priority: "medium"
    },
    {
      id: 8,
      text: "🏃‍♂️ Inter-house Athletics Competition results announced. Red House wins the championship!",
      type: "sports",
      icon: <SportsIcon />,
      priority: "high"
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #001a4d 0%, #1a365d 50%, #001a4d 100%)',
        color: '#fff',
        py: 1,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '2px solid #ffd700',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#fff',
          zIndex: 10,
          '&:hover': {
            background: 'rgba(255,255,255,0.1)'
          }
        }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* News ticker container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          pr: 6 // Space for close button
        }}
      >
        {/* Announcement icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            minWidth: 'fit-content'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AnnouncementIcon 
              sx={{ 
                color: '#ffd700', 
                fontSize: '1.2rem',
                mr: 1
              }} 
            />
          </motion.div>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#ffd700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Latest Updates:
          </Typography>
        </Box>

        {/* Scrolling news items */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            flex: 1
          }}
        >
          <motion.div
            animate={{
              x: [0, -1000], // Adjust based on content length
            }}
            transition={{
              duration: 30, // 30 seconds for one complete cycle
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            {newsItems.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 4,
                  minWidth: 'fit-content'
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '8px'
                  }}
                >
                  {item.icon}
                </motion.div>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: item.priority === 'high' ? 600 : 400,
                    color: item.priority === 'high' ? '#fff' : 'rgba(255,255,255,0.9)',
                    textShadow: item.priority === 'high' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {item.text}
                </Typography>
                {/* Separator */}
                <Box
                  sx={{
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    background: '#ffd700',
                    mx: 2,
                    opacity: 0.7
                  }}
                />
              </Box>
            ))}
          </motion.div>
        </Box>
      </Box>

      {/* Animated border */}
      <motion.div
        animate={{
          scaleX: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
          transformOrigin: 'left'
        }}
      />
    </Box>
  );
}

export default NewsTicker;
