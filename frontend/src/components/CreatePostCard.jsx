import { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { fileToBase64 } from '../utils/helpers';
import { layout } from '../theme';

export default function CreatePostCard({ onPostCreated }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const canPost = (text.trim() || imageData) && !loading;

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setError('');
    const base64 = await fileToBase64(file);
    setImageData(base64);
    setImagePreview(base64);
  };

  const clearImage = () => {
    setImagePreview('');
    setImageData('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!canPost) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/posts', {
        text: text.trim(),
        imageUrl: imageData,
      });
      setText('');
      clearImage();
      onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          New post
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
            },
          }}
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 1.5 }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'cover',
                borderRadius: `${layout.radius.sm}px`,
                border: 1,
                borderColor: 'divider',
              }}
            />
            <IconButton
              size="small"
              onClick={clearImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(15,23,42,0.7)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(15,23,42,0.85)' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {error && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mb: 1 }}>
            {error}
          </Typography>
        )}

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageSelect} />
            <IconButton size="small" onClick={() => fileInputRef.current?.click()} title="Add image">
              <ImageOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              Text or image required
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            disabled={!canPost}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendOutlinedIcon />}
            sx={{ px: 2.5, py: 0.75 }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
