import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getAvatarUrl, fileToBase64 } from '../utils/helpers';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const [userRes, postsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/posts', { params: { username: user.username, limit: 20 } }),
      ]);
      setProfileUser(userRes.data.user);
      setPosts(postsRes.data.posts);
    } catch {
      showSnackbar('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.username, navigate, showSnackbar]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please select an image file', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showSnackbar('Profile photo must be under 2MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const { data } = await api.put('/auth/profile', { profilePic: base64 });
      updateUser(data.user);
      setProfileUser(data.user);
      showSnackbar('Profile photo updated', 'success');
    } catch {
      showSnackbar('Failed to update profile photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    showSnackbar('Post deleted', 'success');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Container maxWidth="sm" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Profile
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={profileUser?.profilePic || getAvatarUrl(profileUser?.username, 128)}
                alt={profileUser?.username}
                sx={{ width: 96, height: 96, mx: 'auto', border: '3px solid', borderColor: 'success.main' }}
              />
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: -8,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                {uploading ? <CircularProgress size={18} color="inherit" /> : <PhotoCameraIcon fontSize="small" />}
              </IconButton>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Box>

            <Typography variant="h6" fontWeight={700}>
              {profileUser?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              @{profileUser?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {profileUser?.email}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {posts.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posts
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Likes received
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          My Posts
        </Typography>

        {posts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={4}>
            You haven&apos;t posted anything yet.
          </Typography>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))
        )}
      </Container>
    </Box>
  );
}
