import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

//#region PROPS
// Only include variant, size, and color
//type ButtonBaseProps = Pick<MuiButtonProps, 'variant' | 'size' | 'color'>;

// Use all except disableRipple
type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

export interface ButtonProps extends ButtonBaseProps {
  label?: string;
  buttonType?: 'primary' | 'secondary' | 'ghost' | 'back' | 'confirm' | 'cancel';
}
//#endregion

//#region STYLES
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'buttonType', // Filtrar propiedad personalizada para evitar errores en el DOM
})<ButtonProps>(({ theme, buttonType }) => {
  return {
    ...(buttonType === 'primary' && {
      color: theme.palette.mode === 'light' ? '#FFFFFF' : '#000000', // Color del texto dependiendo del tema
      backgroundColor: theme.palette.primary.main,
      fontWeight: 'bold', // Texto en negrita
      variant: 'contained',
      boxShadow: theme.palette.mode === 'light' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : '0px 4px 8px rgba(255, 255, 255, 0.2)', // Sombra según el tema
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.mode === 'light' ? '#FFFFFF' : '#FFFFFF', // Color del texto dependiendo del tema
        boxShadow: theme.palette.mode === 'light' ? '0px 6px 12px rgba(0, 0, 0, 0.3)' : '0px 6px 12px rgba(255, 255, 255, 0.3)', // Sombra más intensa al hacer hover
      },
    }),
    ...(buttonType === 'ghost' && {
      color: theme.palette.primary.main,
      border: `0.1em solid ${theme.palette.primary.main}`,
      fontWeight: 'bold', // Texto en negrita
      variant: 'outlined',
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.mode === 'light' ? '#FFFFFF' : '#000000', // Color del texto dependiendo del tema
        border: `0.1em solid ${theme.palette.primary.light}`,
      },
    }),
    ...(buttonType === 'secondary' && {
      color: theme.palette.mode === 'light' ? '#FFFFFF' : '#000000', // Color del texto dependiendo del tema
      backgroundColor: theme.palette.secondary.main,
      fontWeight: 'bold', // Texto en negrita
      variant: 'contained',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.mode === 'light' ? '#FFFFFF' : '#FFFFFF', // Color del texto dependiendo del tema
      },
    }),
    ...(buttonType === 'back' && {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
      fontWeight: 'bold', // Texto en negrita
      variant: 'text',
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.mode === 'light' ? '#000000' : '#000000', // Color del texto dependiendo del tema
      },
    }),

    ...(buttonType === 'confirm' && {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.dark,
      fontWeight: 'bold', // Texto en negrita
      variant: 'contained',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)', // Sombras
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Transiciones suaves
      '&:hover': {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF', // Color del texto dependiendo del tema
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.10)', // Sombras más fuertes al hacer hover
      },
    }),

    ...(buttonType === 'cancel' && {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.light,
      fontWeight: 'bold', // Texto en negrita
      variant: 'contained',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)', // Sombras
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Transiciones suaves
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
        color: '#FFFFFF', // Color del texto blanco
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.10)', // Sombras más fuertes al hacer hover
      },
    }),




    textTransform: 'none',
  };
});
//#endregion

//#region COMPONENTE BUTTON
export default function Button(props: ButtonProps) {
  const { label = "Default Label", buttonType = "primary", ...rest } = props;

  return (
    <StyledButton buttonType={buttonType} {...rest}>
      {label}
    </StyledButton>
  );
}
//#endregion
