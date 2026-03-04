import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f472b6', // Pink 400
      light: '#fbcfe8', // Pink 200
      dark: '#db2777', // Pink 600
      contrastText: '#000000',
    },
    secondary: {
      main: '#9ca3af', // Gray 400
      light: '#d1d5db',
      dark: '#4b5563',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Red 500
    },
    background: {
      default: '#0f0a0c', // Very dark pink-tinted black
      paper: '#1a1114', // Slightly lighter dark pink-tinted black
    },
    text: {
      primary: '#fce7f3', // Pink 50
      secondary: '#fbcfe8', // Pink 200
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 },
    h2: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 },
    h3: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
    h4: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
    h5: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 500 },
    h6: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 500 },
    button: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.05em',
    },
    overline: {
      fontFamily: '"JetBrains Mono", monospace',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 16, // Softer, rounder corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          boxShadow: '0 0 15px rgba(244, 114, 182, 0.2)',
          '&:hover': {
            boxShadow: '0 0 25px rgba(244, 114, 182, 0.4)',
          },
        },
        outlinedPrimary: {
          borderWidth: '2px',
          borderColor: 'rgba(244, 114, 182, 0.4)',
          backgroundColor: 'rgba(244, 114, 182, 0.05)',
          '&:hover': {
            borderWidth: '2px',
            borderColor: 'rgba(244, 114, 182, 0.8)',
            backgroundColor: 'rgba(244, 114, 182, 0.15)',
            boxShadow: '0 0 20px rgba(244, 114, 182, 0.3)',
          },
        },
        outlinedError: {
          borderWidth: '2px',
          borderColor: 'rgba(239,68,68,0.3)',
          backgroundColor: 'rgba(239,68,68,0.05)',
          color: '#ef4444',
          '&:hover': {
            borderWidth: '2px',
            borderColor: 'rgba(239,68,68,0.6)',
            backgroundColor: 'rgba(239,68,68,0.15)',
            boxShadow: '0 0 20px rgba(239,68,68,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(244, 114, 182, 0.1)',
          backgroundColor: 'rgba(26, 17, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(244, 114, 182, 0.15)',
            border: '1px solid rgba(244, 114, 182, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 10, 12, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(244, 114, 182, 0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1a1114',
          border: '1px solid rgba(244, 114, 182, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(244, 114, 182, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
        outlinedPrimary: {
          backgroundColor: 'rgba(244, 114, 182, 0.1)',
          borderColor: 'rgba(244, 114, 182, 0.4)',
        },
      },
    },
  },
});
