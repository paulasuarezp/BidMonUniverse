import * as React from 'react';
import { Avatar, Stack, Button, Typography, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface UserButtonProps extends ButtonProps {
    name: string;
    imageUrl: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    backgroundColor: 'none',
    textTransform: 'none',
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


export default function UserProfileButton({ name, imageUrl, ...rest }: UserButtonProps) {
    return (
        <StyledButton {...rest}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt={name}
                    src={imageUrl}
                    sx={{
                        width: 32,
                        height: 32,
                        color: 'black',
                        bgcolor: 'transparent',
                        backgroundImage: 'url("/selva.avif")', // Imagen de fondo
                        backgroundSize: 'cover', // Cubrir el área completa del avatar
                        backgroundPosition: 'center' // Centrar la imagen de fondo
                    }}
                >
                    {name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography>{name}</Typography>
            </Stack>
        </StyledButton>
    );
};

