import React from 'react';
import Box from '@mui/material/Box';
import MuiPaper, { PaperProps as MuiPaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface CustomPaperProps {
    background?: 'img' | 'color';
    title?: string;
    imageSrc?: string;
    imageAlt?: string;
}

const StyledPaper = styled(MuiPaper)<CustomPaperProps & MuiPaperProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
    position: 'relative',
    borderRadius: 16,
    padding: theme.spacing(1),
    boxShadow: theme.palette.mode === 'light' ? 
    'default': // Sombra para modo claro
    '0px 2px 10px rgba(255, 255, 255, 0.24)', 

}));


export default function Paper({
    background,
    title,
    imageSrc,
    imageAlt,
    children,
    ...other
}: CustomPaperProps & MuiPaperProps) {
    return (
        <StyledPaper
            square={false}
            elevation={16}
            background={background}
            {...other}
        >
            <Box sx={{ textAlign: 'center'}}>
                {imageSrc && <img src={imageSrc} alt={imageAlt} style={{ maxWidth: '70%', height: 'auto' }} />}
                {title && <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{title}</Typography>}
            </Box>
            {children}
        </StyledPaper>
    );
}
