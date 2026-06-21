import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Fab,
  InputAdornment,
  Chip,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import Header from '../components/Header';
import CreatePostCard from '../components/CreatePostCard';
import FilterBar from '../components/FilterBar';
import PostCard from '../components/PostCard';
import { layout } from '../theme';

const PAGE_SIZE = 5;

export default function SocialFeed() {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const { showSnackbar } = useSnackbar();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError('');

      try {
        const { data } = await api.get('/posts', {
          params: { page: pageNum, limit: PAGE_SIZE, sort, search: search || undefined },
        });

        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
        setHasMore(data.pagination.hasMore);
        setTotal(data.pagination.total);
        setPage(pageNum);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load posts. Is the backend running?';
        setError(msg);
        showSnackbar(msg, 'error');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, search, showSnackbar]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setTotal((t) => t + 1);
    showSnackbar('Post created successfully', 'success');
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setTotal((t) => Math.max(0, t - 1));
    showSnackbar('Post deleted', 'success');
  };

  const scrollToCreate = () => {
    document.getElementById('create-post')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Container maxWidth="sm" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        <Header />

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            gap: 1,
            mb: 2,
            alignItems: 'center',
            p: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: `${layout.radius.md}px`,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search posts or users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: 14, px: 0.5 },
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            type="submit"
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: `${layout.radius.sm}px`,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleTheme}
            sx={{ border: 1, borderColor: 'divider' }}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
          </IconButton>
          {isAuthenticated && (
            <IconButton
              size="small"
              onClick={() => {
                logout();
                showSnackbar('Logged out', 'info');
              }}
              sx={{ border: 1, borderColor: 'divider' }}
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {search && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Results for:
            </Typography>
            <Chip label={`"${search}"`} size="small" onDelete={clearSearch} />
            <Typography variant="caption" color="text.secondary">
              ({total} found)
            </Typography>
          </Box>
        )}

        {isAuthenticated ? (
          <Box id="create-post">
            <CreatePostCard onPostCreated={handlePostCreated} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              mb: 2,
              py: 1.5,
              px: 2,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderLeft: 3,
              borderLeftColor: 'primary.main',
              borderRadius: `${layout.radius.sm}px`,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Join the conversation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sign in to create posts, like, and comment
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button component={RouterLink} to="/login" variant="contained" size="small">
                Sign In
              </Button>
              <Button component={RouterLink} to="/signup" variant="outlined" size="small">
                Sign Up
              </Button>
            </Box>
          </Box>
        )}

        <FilterBar activeFilter={sort} onFilterChange={setSort} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={4}>
            {search ? `No posts found for "${search}"` : 'No posts yet. Be the first to share something!'}
          </Typography>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))}

            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts(page + 1, true)}
                  disabled={loadingMore}
                  sx={{ px: 3 }}
                >
                  {loadingMore ? <CircularProgress size={22} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      {isAuthenticated && (
        <Fab color="primary" onClick={scrollToCreate} sx={{ position: 'fixed', bottom: 24, right: 24 }}>
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}
