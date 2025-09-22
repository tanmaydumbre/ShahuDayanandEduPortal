import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { db, storage } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function SlideManager() {
  const [slides, setSlides] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [editingSlide, setEditingSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const slidesCollection = await getDocs(collection(db, 'slides'));
      const slidesData = await Promise.all(
        slidesCollection.docs.map(async (doc) => {
          const data = doc.data();
          const imageUrl = await getDownloadURL(ref(storage, data.imagePath));
          return { id: doc.id, ...data, src: imageUrl };
        })
      );
      setSlides(slidesData);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setSelectedFile(null);
    setAltText('');
    setEditingSlide(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setAltText('');
    setEditingSlide(null);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setAltText(slide.alt);
    setOpen(true);
  };

  const handleDelete = async (slide) => {
    try {
      setSaving(true);
      // Delete from Storage
      await deleteObject(ref(storage, slide.imagePath));
      // Delete from Firestore
      await deleteDoc(doc(db, 'slides', slide.id));
      // Update local state
      setSlides(slides.filter(s => s.id !== slide.id));
    } catch (error) {
      console.error('Error deleting slide:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !editingSlide) return;

    try {
      setSaving(true);
      let imagePath;

      if (selectedFile) {
        // Upload new image
        imagePath = `slides/${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, imagePath);
        await uploadBytes(storageRef, selectedFile);
      }

      if (editingSlide) {
        // Update existing slide
        const slideRef = doc(db, 'slides', editingSlide.id);
        await updateDoc(slideRef, {
          alt: altText,
          ...(imagePath && { imagePath }),
        });
      } else {
        // Add new slide
        await addDoc(collection(db, 'slides'), {
          imagePath,
          alt: altText,
        });
      }

      handleClose();
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f0f4f8'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Manage Home Screen Slides
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            bgcolor: '#1a237e',
            '&:hover': { bgcolor: '#0d47a1' },
          }}
        >
          Add New Slide
        </Button>
      </Box>

      <Grid container spacing={3}>
        {slides.map((slide) => (
          <Grid item xs={12} sm={6} md={4} key={slide.id}>
            <Card sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={slide.src}
                alt={slide.alt}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {slide.alt}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton
                    onClick={() => handleEdit(slide)}
                    size="small"
                    sx={{ color: '#1a237e' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(slide)}
                    size="small"
                    sx={{ color: '#d32f2f' }}
                    disabled={saving}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlide ? 'Edit Slide' : 'Add New Slide'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="slide-image-upload"
            />
            <label htmlFor="slide-image-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 2 }}
              >
                {selectedFile ? 'Change Image' : 'Select Image'}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Alt Text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={(!selectedFile && !editingSlide) || saving}
            sx={{
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SlideManager; 