import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';

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

// #region PROPS
interface InfoMessageBoxProps {
    seccion?: string;
    message?: string;
}
// #endregion

//#region COMPONENTE INFOMESSAGEBOX
// Componente que muestra un mensaje informativo con una imagen de Snorlax
export default function InfoMessageBox({ message, seccion = 'subastas' }: InfoMessageBoxProps) {
    const navigate = useNavigate();
    const imageSource = '/snorlax.png';

    return (
        <StyledPaper
            elevation={3}
            sx={{
                mt: { xs: '5.5em', sm: 'auto' },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pl: 2, pr: 2, pb: 2 }}>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <img src={imageSource} alt="Pokémon Snorlax" style={{ maxWidth: '30%', height: 'auto' }} />
                    <Typography sx={{ marginBottom: '1em', marginTop: '1em' }}>
                        ¡Vaya! Parece que Snorlax está bloqueando el camino y no hay {seccion} activas en este momento. 😮
                    </Typography>
                    <Typography>
                        {message || '¡Es un buen momento para relajarte y planear tu próxima estrategia de subasta!'}
                    </Typography>
                </Box>
                <Button buttonType="primary" label='Explorar otras áreas' fullWidth onClick={() => navigate('/')} sx={{ mt: 2 }} />
            </Box>
        </StyledPaper>
    );
};
//#endregion
