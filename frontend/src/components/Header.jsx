import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getAvatarUrl } from '../utils/helpers';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleProfileClick = () => {
    if (isAuthenticated) navigate('/profile');
    else {
      showSnackbar('Sign in to view your profile', 'info');
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        mb: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
          Social Feed
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Share updates with the community
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Notifications">
          <IconButton size="small" onClick={() => showSnackbar('No new notifications', 'info')}>
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={isAuthenticated ? 'Your profile' : 'Sign in'}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0.5, ml: 0.5 }}>
            <Avatar
              src={user?.profilePic || getAvatarUrl(user?.username || 'Guest', 64)}
              alt={user?.username || 'Guest'}
              sx={{ width: 34, height: 34 }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
