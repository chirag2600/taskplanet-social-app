import { Box, Typography, Avatar, IconButton, Badge, Chip, Tooltip } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getAvatarUrl } from '../utils/helpers';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      showSnackbar('Please sign in to view your profile', 'info');
      navigate('/login');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
        Social
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={<StarIcon sx={{ color: '#f59e0b !important', fontSize: 18 }} />}
          label="50"
          size="small"
          sx={{ bgcolor: 'action.hover', fontWeight: 600, '& .MuiChip-label': { px: 0.5 } }}
        />
        <Chip
          label="₹0.00"
          size="small"
          sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 600, opacity: 0.9 }}
        />
        <Tooltip title="No new notifications">
          <IconButton size="small" onClick={() => showSnackbar('No new notifications', 'info')}>
            <Badge variant="dot" color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title={isAuthenticated ? 'View profile' : 'Sign in'}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar
              src={user?.profilePic || getAvatarUrl(user?.username || 'Guest', 64)}
              alt={user?.username || 'Guest'}
              sx={{ width: 36, height: 36, border: '2px solid', borderColor: 'success.main' }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
