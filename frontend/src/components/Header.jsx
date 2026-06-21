import { Box, Typography, Avatar, IconButton, Badge, Chip } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/helpers';

export default function Header() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
        Social
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={<StarIcon sx={{ color: '#f59e0b !important', fontSize: 18 }} />}
          label="50"
          size="small"
          sx={{ bgcolor: '#fef3c7', fontWeight: 600, '& .MuiChip-label': { px: 0.5 } }}
        />
        <Chip
          label="₹0.00"
          size="small"
          sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }}
        />
        <IconButton size="small" sx={{ color: '#374151' }}>
          <Badge variant="dot" color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        <Avatar
          src={user?.profilePic || getAvatarUrl(user?.username || 'U', 64)}
          alt={user?.username}
          sx={{ width: 36, height: 36, border: '2px solid #22c55e' }}
        />
      </Box>
    </Box>
  );
}
