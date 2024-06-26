import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

// #region PROPS
export interface ButtonProps extends ButtonBaseProps {
  label?: string;
  buttonType?: 'primary' | 'secondary' | 'ghost' | 'back' | 'confirm' | 'cancel' | 'section';
}
// #endregion

// #region STYLES
const defaultStyles = ({ theme }: any) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  border: 'none',
  '&:hover': {
    border: 'none',
  },
  '&:active': {
    border: 'none',
  },
  '&:focus': {
    border: 'none',
  },
  '&.Mui-focusVisible': {
    outline: 'none',
    boxShadow: 'none',
  },
});

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'buttonType',
})<ButtonProps>(({ theme, buttonType }) => {
  const commonStyles = defaultStyles({ theme });

  const typeStyles: any = {
    primary: {
      color: theme.palette.mode === 'light' ? '#FFFFFF' : '#000000',
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.palette.mode === 'light' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : '0px 4px 8px rgba(255, 255, 255, 0.2)',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: theme.palette.mode === 'light' ? '0px 6px 12px rgba(0, 0, 0, 0.3)' : '0px 6px 12px rgba(255, 255, 255, 0.3)',
      },
    },
    ghost: {
      color: theme.palette.primary.main,
      border: `0.1em solid ${theme.palette.primary.main}`,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        border: `0.1em solid ${theme.palette.primary.light}`,
      },
    },
    secondary: {
      color: theme.palette.mode === 'light' ? '#FFFFFF' : '#000000',
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
    back: {
      color: theme.palette.error.main,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.contrastText,
      },
    },
    confirm: {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.dark,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        backgroundColor: theme.palette.success.main,
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.10)',
      },
    },
    cancel: {
      color: theme.palette.mode === 'light' ? theme.palette.error.main : '#000000',
      backgroundColor: theme.palette.error.light,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
        color: '#FFFFFF',
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.10)',
      },
    },
    section: {
      color: theme.palette.mode === 'light' ? theme.palette.primary.main : '#FFFFFF',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      fontSize: '1.4em',
      padding: 0,
      '& .MuiSvgIcon-root': {
        color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
      },
      '&:hover': {
        color: theme.palette.mode === 'light' ? '#FFFFFF' : '#FFFFFF',
        backgroundColor: theme.palette.primary.main,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        padding: theme.spacing(1),
        '& .MuiSvgIcon-root': {
          color: theme.palette.primary.contrastText,
        },
      },
      transition: 'background-color 0.3s ease, color 0.3s ease, padding 0.3s ease',
    },
  };

  return {
    ...commonStyles,
    ...typeStyles[buttonType || 'primary'],
  };
});
// #endregion

// #region COMPONENT Button
export default function Button(props: ButtonProps) {
  const { label = "Default Label", buttonType = "primary", ...rest } = props;

  return (
    <StyledButton buttonType={buttonType} {...rest}>
      {label}
    </StyledButton>
  );
}
// #endregion