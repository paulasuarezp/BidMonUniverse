// src/themes.ts
import { ThemeOptions, createTheme } from '@mui/material/styles';
import { color } from 'framer-motion';


// Paleta para tema CLARO
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E5750', // Azul claro como acento primario
    },
    secondary: {
      main: '#FFCE31', // Amarillo Pikachu como acento secundario
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
          borderRadius: '4px',
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
          color: '#1565c0',
          borderRadius: '7px',
          borderWidth: '0px',
          borderColor: '#2196f3',
          border: '0px solid',
          backgroundColor: '#90caf9',
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            backgroundColor: '#e3f2fd', // Ejemplo: un azul claro en hover
          },
          '&.Mui-selected': {
            backgroundColor: '#2196f3', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
          '&.Mui-checked': {
            backgroundColor: 'red', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
          '&.Mui-focused': {
            backgroundColor: 'green', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
        },
        daySelected: {
          backgroundColor: 'magenta',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0d47a1',
          },
          '&.Mui-checked': {
            backgroundColor: 'red', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
          '&.Mui-focused': {
            backgroundColor: 'green', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
        },
        // Estilos para los días seleccionados
        day: {
          backgroundColor: 'magenta',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0d47a1',
          },
          '&.Mui-checked': {
            backgroundColor: 'red', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
          '&.Mui-focused': {
            backgroundColor: 'green', // Azul más oscuro para los días seleccionados
            color: '#fff', // Letra blanca para los días seleccionados
          },
        },
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