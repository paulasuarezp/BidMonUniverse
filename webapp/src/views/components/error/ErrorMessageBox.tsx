import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import Button from '../buttons/Button';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

//#region STYLES
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    maxWidth: 800,
    width: '100wh', // Ajuste para ocupar toda la anchura
    margin: 'auto',
    position: 'relative',
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: theme.palette.mode === 'light' ?
        'default' : // Sombra para modo claro
        '0px 2px 10px rgba(255, 255, 255, 0.24)',
}));
//#endregion

//#region COMPONENTE ERRORMESSAGEBOX
export default function ErrorMessageBox() {
    const navigate = useNavigate();
    const theme = useTheme();

    const imageSource = '/mimikyu.png';

    return (
        <StyledPaper
            elevation={3}
            sx={{
                mt: { xs: '5.5em', sm: 'auto' }, // marginTop de 5.5em en xs (móviles) y 'auto' en sm y tamaños mayores
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', pl: 2, pr: 2, pb: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ marginBottom: '0.2em', marginTop: '1em' }}>
                        ¡Oh no! Parece que Mimikyu ha intentado hacerse pasar por nuestros datos y los ha envuelto en su manto de misterio. 👻🎭
                    </Typography>
                    <Box sx={{ flex: 1, textAlign: 'center', mt: { xs: 2, md: 0 } }}>
                        <img src={imageSource} alt="Pokémon Mimikyu" style={{ maxWidth: '40%', height: 'auto' }} />
                    </Box>
                    <Typography sx={{ marginBottom: '1em' }}>
                        Nuestro equipo está trabajando duro para desenmascarar el problema.
                        <strong><br />Por favor, intenta cargar tus datos de nuevo más tarde. <br />¡Gracias por tu paciencia y sigue siendo un maestro Pokémon! 💪🔍🔄</strong>
                    </Typography>
                </Box>

            </Box>
            <Button buttonType="primary" label='Volver al inicio' fullWidth onClick={() => navigate('/')} sx={{ mt: 2 }} />
        </StyledPaper>
    );
};
//#endregion
