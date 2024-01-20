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
    padding: theme.spacing(1),
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
            elevation={12}
            background={background}
            {...other}
        >
            <Box sx={{ textAlign: 'center', p: 2 }}>
                {imageSrc && <img src={imageSrc} alt={imageAlt} style={{ maxWidth: '100%', height: 'auto' }} />}
                {title && <Typography variant="h5" component="h2" sx={{ mt: 2 }}>{title}</Typography>}
            </Box>
            {children}
        </StyledPaper>
    );
}
