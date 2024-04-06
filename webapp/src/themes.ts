// src/themes.ts
import { createTheme } from '@mui/material/styles';


// Paleta para tema CLARO
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E5750', // Azul claro como acento primario
    },
    secondary: {
      main: '#FFCE31', // Amarillo Pikachu como acento secundario
      light: '#F8E26E', // Amarillo más claro para contraste
      dark: '#FFB74D', // Amarillo más oscuro para contraste
    },
    background: {
      default: '#F5F5F5', // Fondo principal blanco
      paper: '#FFFFFF',   // Fondo secundario gris claro
    },
    text: {
      primary: '#333333', // Texto principal gris oscuro
      secondary: '#666666', // Texto secundario gris medio
    },
    error: {
      main: '#EE6E73', // Rojo para elementos interactivos y errores
    },
    success: {
      main: '#78C850', // Verde suave para mensajes de éxito
    },
    warning: {
      main: '#FFA726', // Naranja para destacados y advertencias
    },
  },
  typography: {
    fontFamily: [
      'Nunito', 
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  // Otros ajustes de personalización...
});

// Paleta para tema OSCURO
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4C8CFF', // Un azul más claro y brillante que se destaca en el fondo oscuro
    },
    secondary: {
      main: '#FFD700', // Amarillo más brillante que se destaca en fondo oscuro
    },
    background: {
      default: '#121212', // Fondo principal oscuro
      paper: '#1e1e1e',   // Fondo secundario aún más oscuro
    },
    text: {
      primary: '#E0E0E0', // Texto principal más claro para contraste
      secondary: '#A0A0A0', // Texto secundario más suave
    },
    error: {
      main: '#FF6E73', // Rojo más brillante para visibilidad
    },
    success: { 
      main: '#66BB6A', // Verde más claro
    },
    warning: {
      main: '#FFB74D', // Naranja más claro y visible
    },
  },
  typography: {
    fontFamily: [
      'Nunito', 
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  
});


export const birthdayDatePickerTheme = (theme: any) => createTheme({
  ...theme,
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          borderRadius: '6px',
          borderWidth: '0px',
          borderColor: '#2196f3',
          border: '0px solid',
          backgroundColor: theme.palette.background.paper,
        }
      }
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : theme.palette.secondary.main,
            border:'none',
            borderRadius:'5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
        },
      },
    },
    MuiPickersMonth: {
      styleOverrides: {
        monthButton: {
          color: theme.palette.text.primary,
          border: 'none',
          alignitems: 'center',
          '&:hover': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : theme.palette.secondary.main,
            border:'none',
            borderRadius:'5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
        }
      }
    },
    MuiPickersYear: {
      styleOverrides: {
        yearButton: {
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : theme.palette.secondary.main,
            border:'none',
            borderRadius:'5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main, 
          },
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        }
      }
    }
  }
})