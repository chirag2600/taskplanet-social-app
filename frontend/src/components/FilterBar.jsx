import { Box, Chip } from '@mui/material';

const FILTERS = [
  { key: 'latest', label: 'All Post' },
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'mostCommented', label: 'Most Commented' },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
        mb: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {FILTERS.map((filter) => {
        const active = activeFilter === filter.key;
        return (
          <Chip
            key={filter.key}
            label={filter.label}
            onClick={() => onFilterChange(filter.key)}
            sx={{
              flexShrink: 0,
              fontWeight: 600,
              fontSize: 13,
              px: 0.5,
              bgcolor: active ? 'primary.main' : '#fff',
              color: active ? '#fff' : 'text.secondary',
              border: active ? 'none' : '1px solid #e5e7eb',
              '&:hover': {
                bgcolor: active ? 'primary.dark' : '#f3f4f6',
              },
            }}
          />
        );
      })}
    </Box>
  );
}
