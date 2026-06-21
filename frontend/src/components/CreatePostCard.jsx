import { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { fileToBase64 } from '../utils/helpers';

export default function CreatePostCard({ onPostCreated }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageData, setImageData] = useState('');
  const [postType, setPostType] = useState('all');
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
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Create Post
          </Typography>
          <ToggleButtonGroup
            value={postType}
            exclusive
            size="small"
            onChange={(_, val) => val && setPostType(val)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '999px !important',
                px: 2,
                py: 0.25,
                fontSize: 12,
                border: 'none',
                mx: 0.25,
              },
              '& .Mui-selected': {
                bgcolor: 'primary.main !important',
                color: '#fff !important',
              },
            }}
          >
            <ToggleButton value="all">All Posts</ToggleButton>
            <ToggleButton value="promotions">Promotions</ToggleButton>
          </ToggleButtonGroup>
        </Box>

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
            '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9fafb' },
          }}
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 1.5 }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 3 }}
            />
            <IconButton
              size="small"
              onClick={clearImage}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />
            <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
              <CameraAltOutlinedIcon />
            </IconButton>
            <IconButton color="primary">
              <EmojiEmotionsOutlinedIcon />
            </IconButton>
            <Button
              startIcon={<CampaignOutlinedIcon />}
              size="small"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Promote
            </Button>
          </Box>

          <Button
            variant="contained"
            disabled={!canPost}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              px: 3,
              bgcolor: canPost ? 'primary.main' : '#e5e7eb',
              color: canPost ? '#fff' : '#9ca3af',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none', bgcolor: canPost ? 'primary.dark' : '#e5e7eb' },
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
