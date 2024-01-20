import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Only include variant, size, and color
//type ButtonBaseProps = Pick<MuiButtonProps, 'variant' | 'size' | 'color'>;

// Use all except disableRipple
 type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

export interface ButtonProps extends ButtonBaseProps {
  label?: string;
  buttonType?: 'primary' | 'secondary'; 
}




const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'buttonType', // Filtrar propiedad personalizada para evitar errores en el DOM
})<ButtonProps>(({ theme, buttonType }) => {
  return {
    ...(buttonType === 'primary' && {
      color: theme.palette.primary.contrastText, 
      backgroundColor: theme.palette.primary.main, 
      variant: 'contained',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, 
      },
    }),
    ...(buttonType === 'secondary' && {
      color: theme.palette.secondary.main,
      border: `0.1em solid ${theme.palette.secondary.main}`,
      variant: 'outlined',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        border: `0.1em solid ${theme.palette.secondary.light}`,
      },
    }),
    textTransform: 'none',
  };
});



function Button(props: ButtonProps) {
  const { label = "Default Label", buttonType = "primary", ...rest } = props;

  return (
    <StyledButton buttonType={buttonType} {...rest}>
        {label}
    </StyledButton> 
  );
}


export default Button;
