import { Box, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PublicIcon from '@mui/icons-material/Public';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const NAV_ITEMS = [
  { label: 'Home', icon: HomeOutlinedIcon },
  { label: 'Tasks', icon: AssignmentOutlinedIcon },
  { label: 'Social', icon: PublicIcon, active: true },
  { label: 'Leader Board', icon: EmojiEventsOutlinedIcon },
  { label: 'Chat', icon: ChatBubbleOutlineIcon },
];

export default function BottomNav() {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'primary.main',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 1,
        px: 1,
        zIndex: 1100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
        <Box
          key={label}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#fff',
            opacity: active ? 1 : 0.75,
            minWidth: 56,
          }}
        >
          <Box
            sx={{
              bgcolor: active ? '#fff' : 'transparent',
              color: active ? 'primary.main' : '#fff',
              borderRadius: 2,
              p: 0.75,
              display: 'flex',
              mb: 0.25,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <Typography variant="caption" sx={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
