// MiBoton.js
import { Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import './buttonPrincipal.css';

// #region PROPS
export interface ButtonProps {
    label?: string;
    onClick?: () => void;
}
// #endregion

// #region STYLES
const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'light' ? '#111111' : '#ececec', // Cambiado para adaptarse al esquema de color
    fontSize: '1.2em',
    '&:hover': {
        color: '#FFFFFF',
    },
}));
// #endregion

// #region COMPONENT ButtonPrincipal
export default function ButtonPrincipal({ label, onClick }: ButtonProps) {
    const theme = useTheme();

    const whileHover = {
        scale: 1.1,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    };

    return (
        <div className="container">
            <motion.div className="bolita bolita1" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.div className="bolita bolita2" animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} />
            <motion.button className="btn" whileHover={whileHover} onClick={onClick} style={{ color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} role="button" aria-label={label}>
                <StyledTypography variant="body1" sx={{ color: 'inherit' }}>{label}</StyledTypography>
            </motion.button>
        </div >
    );
}
// #endregion