import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { fileToBase64 } from '../utils/helpers';

export default function EditPostDialog({ post, open, onClose, onUpdated }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageData, setImageData] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (post && open) {
      setText(post.text || '');
      setImagePreview(post.imageUrl || '');
      setImageData(null);
      setRemoveImage(false);
      setError('');
    }
  }, [post, open]);

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
    setRemoveImage(false);
    const base64 = await fileToBase64(file);
    setImageData(base64);
    setImagePreview(base64);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageData(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    const trimmed = text.trim();
    const hasImage = imageData || (post.imageUrl && !removeImage);
    if (!trimmed && !hasImage) {
      setError('Post must contain text or an image');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = { text: trimmed };
      if (removeImage) payload.removeImage = true;
      else if (imageData) payload.imageUrl = imageData;

      const { data } = await api.put(`/posts/${post._id}`, payload);
      onUpdated(data.post);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Edit Post
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 2 }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageSelect} />
        <Button variant="outlined" size="small" onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? 'Change Image' : 'Add Image'}
        </Button>

        {error && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
