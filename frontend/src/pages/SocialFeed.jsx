import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  CircularProgress,
  Fab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CreatePostCard from '../components/CreatePostCard';
import FilterBar from '../components/FilterBar';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';

const PAGE_SIZE = 5;

export default function SocialFeed() {
  const { isAuthenticated, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await api.get('/posts', {
          params: { page: pageNum, limit: PAGE_SIZE, sort, search: search || undefined },
        });

        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, search]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const scrollToCreate = () => {
    document.getElementById('create-post')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <Container maxWidth="sm" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        <Header />

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search promotions, users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              sx: { borderRadius: 999, bgcolor: '#fff' },
            }}
          />
          <IconButton
            type="submit"
            sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #e5e7eb' }}>
            <DarkModeOutlinedIcon />
          </IconButton>
          {isAuthenticated && (
            <IconButton onClick={logout} sx={{ bgcolor: '#fff', border: '1px solid #e5e7eb' }} title="Logout">
              <LogoutIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {isAuthenticated ? (
          <Box id="create-post">
            <CreatePostCard onPostCreated={handlePostCreated} />
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 2,
              mb: 2,
              textAlign: 'center',
              border: '1px solid #e5e7eb',
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Sign in to create posts, like, and comment
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained" size="small" sx={{ mr: 1 }}>
              Sign In
            </Button>
            <Button component={RouterLink} to="/signup" variant="outlined" size="small">
              Sign Up
            </Button>
          </Box>
        )}

        <FilterBar activeFilter={sort} onFilterChange={setSort} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={4}>
            No posts yet. Be the first to share something!
          </Typography>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
            ))}

            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts(page + 1, true)}
                  disabled={loadingMore}
                  sx={{ borderRadius: 999, px: 4 }}
                >
                  {loadingMore ? <CircularProgress size={22} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      {isAuthenticated && (
        <Fab
          color="primary"
          onClick={scrollToCreate}
          sx={{ position: 'fixed', bottom: 80, right: 24 }}
        >
          <AddIcon />
        </Fab>
      )}

      <BottomNav />
    </Box>
  );
}
