// MiBoton.js
import { motion } from 'framer-motion';
import './buttonPrincipal.css';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';



export interface ButtonProps  {
    label?: string;
  }

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontFamily:  'Pokemon', 
    color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
    '&:hover': {
        color: '#FFFFFF',
      },
  }));

export default function ButtonPrincipal({ label }:ButtonProps) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const whileHover = {
        scale: 1.1,
        transition: {
            duration: 0.5, // Duración en segundos
            ease: "easeInOut" // Tipo de "ease". Puede ser "linear", "easeIn", "easeOut", "easeInOut", etc.
        }
    };
    const bolita1Variants = {
        animate: {
            x: [0, 20, 0, -20, 0], // Movimiento circular en el eje X
            y: [0, -20, -40, -20, 0], // Movimiento circular en el eje Y
            transition: {
                duration: 4,
                ease: "linear",
                repeat: Infinity,
            }
        }
    };
    const bolita2Variants = {
        animate: {
            x: [0, 30, 0, -40, 0], // Movimiento circular en el eje X
            y: [0, -30, -60, -40, 0], // Movimiento circular en el eje Y
            transition: {
                duration: 4,
                ease: "linear",
                repeat: Infinity,
            }
        }
    };
    return (
        <div className="container">
             <motion.div
                className="bolita1"
                variants={bolita1Variants}
                animate="animate"
            />
            <motion.div
                className="bolita2"
                variants={bolita2Variants}
                animate="animate"
            />
            <motion.button
                className="btn"
                whileHover={whileHover}
                onClick={handleLoginClick}
            >
            <StyledTypography variant="h4" sx={{ flexGrow: 1, marginLeft: 1, marginBottom: 2 }}>  {label} </StyledTypography>
           
            </motion.button>
        </div>
    );
}

