import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
        dark: '#1d4ed8',
        light: '#3b82f6',
      },
      secondary: {
        main: '#f59e0b',
      },
      success: {
        main: '#22c55e',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f3f4f6',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#111827',
        secondary: mode === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
            border: mode === 'dark' ? '1px solid #334155' : 'none',
          },
        },
      },
    },
  });

export default getTheme('light');
