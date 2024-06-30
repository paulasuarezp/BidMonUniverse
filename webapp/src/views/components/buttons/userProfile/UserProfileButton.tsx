import { Avatar, Button, ButtonProps, Stack, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';

// #region PROPS
interface UserButtonProps extends ButtonProps {
    name: string;
    imageUrl: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
// #endregion

// #region STYLES
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
// #endregion


// #region COMPONENT UserProfileButton
export default function UserProfileButton({ name, imageUrl, ...rest }: UserButtonProps) {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <StyledButton {...rest} role='button' aria-label={`Botón de perfil de ${name}`}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt={name}
                    src={imageUrl}
                    sx={{
                        width: 32,
                        height: 32,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    {name.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && <Typography variant='body1'>{name}</Typography>}
            </Stack>
        </StyledButton>
    );
};
// #endregion