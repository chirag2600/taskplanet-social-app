import { createTheme } from '@mui/material/styles';

/** Shared layout tokens */
export const layout = {
  radius: {
    sm: 6,
    md: 10,
    lg: 12,
  },
  shadow: {
    card: '0 1px 2px rgba(0,0,0,0.06)',
    cardHover: '0 4px 12px rgba(0,0,0,0.08)',
  },
};

export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
        dark: '#1d4ed8',
        light: '#3b82f6',
      },
      secondary: {
        main: '#64748b',
      },
      success: {
        main: '#16a34a',
      },
      background: {
        default: isDark ? '#0b1120' : '#f8fafc',
        paper: isDark ? '#131c2e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? '#1e293b' : '#e2e8f0',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: layout.radius.md,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: layout.radius.sm,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: layout.radius.sm },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: layout.radius.sm, fontWeight: 500 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: layout.radius.lg,
            boxShadow: 'none',
            border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: layout.radius.sm,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: { borderRadius: layout.radius.lg, boxShadow: layout.shadow.cardHover },
        },
      },
    },
  });
};

export default getTheme('light');
