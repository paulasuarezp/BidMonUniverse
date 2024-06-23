import { Box, Paper, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';

//#region STYLES
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    maxWidth: 800,
    width: '100%',
    margin: 'auto',
    position: 'relative',
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: theme.palette.mode === 'light' ?
        'default' : // Sombra para modo claro
        '0px 2px 10px rgba(255, 255, 255, 0.24)',
}));
//#endregion

interface SurpriseMessageBoxProps {
    message?: string;
}

//#region COMPONENTE SURPRISEMESSAGEBOX
export default function SurpriseMessageBox({ message }: SurpriseMessageBoxProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    const imageSource = '/jigglypuff.png'; // Asegúrate de tener una imagen apropiada de Jigglypuff

    return (
        <StyledPaper
            elevation={3}
            sx={{
                mt: { xs: '5.5em', sm: 'auto' },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pl: 2, pr: 2, pb: 2 }}>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography sx={{ marginBottom: '1em', marginTop: '1em' }}>
                        ¡Oh, sorpresa! Parece que Jigglypuff ha cantado tan fuerte que tu colección se ha vaciado. 🎤😮
                    </Typography>
                    <img src={imageSource} alt="Pokémon Jigglypuff" style={{ maxWidth: '30%', height: 'auto' }} />
                    <Typography>
                        {message || 'No te preocupes, es el momento perfecto para comenzar tu aventura y capturar algunas cartas. ¡Buena suerte!😉'}
                    </Typography>
                </Box>
                <Button buttonType="primary" label='Ir a capturar cartas' fullWidth onClick={() => navigate('/shop')} sx={{ mt: 2 }} />
            </Box>
        </StyledPaper>
    );
};
//#endregion
