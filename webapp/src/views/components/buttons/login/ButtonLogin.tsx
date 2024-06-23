import { useState } from 'react';
import { Button, ButtonProps, IconButton, useMediaQuery, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

//#region STYLES
const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  textTransform: 'none',
  backgroundColor: 'none',
  color: '#FFFFFF',
  '&:hover': {
    boxShadow: theme.palette.mode === 'light' ?
      '2px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.25)' : // Sombra para modo claro
      '2px 2px 2px 0px rgba(229, 62, 48, 0.35), 0px 0px 2px 0px rgba(229, 62, 48, 0.35)',
    // '2px 2px 2px 0px rgba(255, 206, 49, 0.35), 0px 0px 2px 0px rgba(255, 206, 49, 0.35)', 
    textShadow: theme.palette.mode === 'light' ?
      '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255,255, 0.4)' : // Sombra para modo claro
      '0 0 10px rgba(229, 62, 48, 0.6), 0 0 20px rgba(229, 62, 48, 0.4)',
  },
  '&:active': {
    outline: 'none',
    border: 'none',
  },
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
}));
//#endregion


//#region COMPONENT LoginButton
export default function LoginButton(props: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const iconVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.8 }
  };

  const textVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 1.2 }
  };

  return (
    <>
      {isMobile ?

        (<IconButton color="inherit" {...props}>
          <AccountCircleIcon />
        </IconButton>)

        :
        (<StyledButton
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          style={{ position: 'relative', overflow: 'hidden' }}
          {...props}
        >
          <motion.div
            animate={isHovered ? 'hidden' : 'visible'}
            variants={iconVariants}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <AccountCircleIcon />
          </motion.div>
          <motion.span
            animate={isHovered ? 'visible' : 'hidden'}
            variants={textVariants}
            transition={{ duration: 0.5 }}
          >
            Iniciar sesión
          </motion.span>
        </StyledButton>)
      }</>
  );
}
//#endregion
