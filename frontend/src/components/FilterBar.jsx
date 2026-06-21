import { Box, Button } from '@mui/material';

const FILTERS = [
  { key: 'latest', label: 'Latest' },
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'mostCommented', label: 'Most Commented' },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        mb: 2,
        borderBottom: 1,
        borderColor: 'divider',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {FILTERS.map((filter) => {
        const active = activeFilter === filter.key;
        return (
          <Button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            disableRipple
            sx={{
              flexShrink: 0,
              minWidth: 'auto',
              px: 1.5,
              py: 1.25,
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              color: active ? 'primary.main' : 'text.secondary',
              borderRadius: 0,
              borderBottom: 2,
              borderColor: active ? 'primary.main' : 'transparent',
              mb: '-1px',
              '&:hover': {
                bgcolor: 'transparent',
                color: active ? 'primary.main' : 'text.primary',
              },
            }}
          >
            {filter.label}
          </Button>
        );
      })}
    </Box>
  );
}
