// src/themes.ts
import { esES as coreEsES } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid/locales';
import { esES as esESDate } from '@mui/x-date-pickers/locales';

// Revisar los colores en https://color.review
// Paleta para tema CLARO
export const lightTheme = createTheme(
  coreEsES,
  esES,
  esESDate,
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#0046C7', // Azul claro como acento primario
        light: '#7baaff', // Azul oscuro como acento primario
        contrastText: '#FFFFFF', // Texto de contraste blanco
      },
      secondary: {
        main: '#1D448B', // Amarillo Pikachu como acento secundario
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
        main: '#B30001', // Rojo para texto de error
        light: '#F7DEDF', // A90505 Rojo para elementos interactivos y errores
        dark: '#8B0000', // Rojo para elementos interactivos y errores
        contrastText: '#FFFFFF', // Texto de contraste blanco
      },
      success: {
        main: '#0AFF22', // 6AE66F Verde suave para mensajes de éxito
        light: '#96D398', // Verde suave para mensajes de éxito
        dark: '#6AE66F', //  Verde suave para mensajes de éxito
        contrastText: '#000000', // Texto de contraste 
      },
      warning: {
        main: '#FFA726', // Naranja para destacados y advertencias
      },
    },
    typography: {
      fontFamily: 'Nunito, Avenir, Helvetica, Arial, sans-serif',
      h1: {
        fontSize: '3rem',
      },
      h2: {
        fontSize: '2rem',
      },
      h3: {
        fontSize: '1.25rem',
      },
      body1: {
        fontSize: '1rem', // Texto del cuerpo principal
        fontWeight: 'normal',
      },
      body2: {
        fontSize: '0.875rem', // Texto del cuerpo secundario, menor tamaño
        fontWeight: 'normal',
      },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: '#0046C7', // Color del enlace
            fontWeight: 'bold', // Enlace en negrita por defecto
            textDecoration: 'none', // Sin subrayado por defecto
            '&:hover': {
              textDecoration: 'underline', // Subrayado al hacer hover
              color: '#002975', // Color cuando se hace hover
            },
          },
        },
      },

    },
    // Otros ajustes de personalización...
  });

// Paleta para tema OSCURO
export const darkTheme = createTheme(
  coreEsES,
  esES,
  esESDate,
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#4cd4ff', //  4cd4ff Un azul más claro y brillante que se destaca en el fondo oscuro
        contrastText: '#FFFFFF', // Texto de contraste blanco
      },
      secondary: {
        main: '#FFD700', // Amarillo más brillante que se destaca en fondo oscuro
      },
      background: {
        default: '#121212', // Fondo principal oscuro
        paper: '#1e1e1e',   // Fondo secundario aún más oscuro
      },
      text: {
        primary: '#FFFFFF', // Texto principal más claro para contraste
        secondary: '#E0E0E0', // Texto secundario más suave

      },
      error: {
        main: '#FD8E91', // Rojo más brillante para visibilidad
        light: '#B30001', // Rojo para elementos interactivos y errores
        dark: '#8B0000', // Rojo para elementos interactivos y errores
        contrastText: '#FFFFFF', // Texto de contraste blanco

      },
      success: {
        main: '#6AE66F', // Verde más claro
        contrastText: '#FFFFFF', // Texto de contraste blanco
      },
      warning: {
        main: '#FFB74D', // Naranja más claro y visible
      },
    },
    typography: {
      fontFamily: 'Nunito, Avenir, Helvetica, Arial, sans-serif',
      h1: {
        fontSize: '3rem',
      },
      h2: {
        fontSize: '2rem',
      },
      h3: {
        fontSize: '1.25rem',
      },
      body1: {
        fontSize: '1rem', // Texto del cuerpo principal
        fontWeight: 'normal',
      },
      body2: {
        fontSize: '0.875rem', // Texto del cuerpo secundario, menor tamaño
        fontWeight: 'normal',
      },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: '#4cd4ff', // Color del enlace
            fontWeight: 'bold', // Enlace en negrita por defecto
            textDecoration: 'none', // Sin subrayado por defecto
            '&:hover': {
              textDecoration: 'underline', // Subrayado al hacer hover
              color: '#FFD700', // Color cuando se hace hover
            },
          },
        },
      },
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
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : '#8FDAF1',
            border: 'none',
            borderRadius: '5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
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
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : '#8FDAF1',
            border: 'none',
            borderRadius: '5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
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
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main.dark : '#8FDAF1',
            border: 'none',
            borderRadius: '5px',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.text,
          },
          '&.Mui-focused': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
          },
          '&:focus': {
            border: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#E1F8FF',
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
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
        }
      }
    },
  }
})
