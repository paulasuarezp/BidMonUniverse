// MiBoton.js
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import './buttonPrincipal.css';

export interface ButtonProps {
    label?: string;
    onClick?: () => void;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'light' ? '#111111' : '#ececec', // Cambiado para adaptarse al esquema de color
    '&:hover': {
        color: '#FFFFFF',
    },
}));

export default function ButtonPrincipal({ label, onClick }: ButtonProps) {
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
            <motion.button className="btn" whileHover={whileHover} onClick={onClick} >
                <StyledTypography variant="h4" sx={{ color: 'inherit' }}>{label}</StyledTypography>
            </motion.button>
        </div >
    );
}
