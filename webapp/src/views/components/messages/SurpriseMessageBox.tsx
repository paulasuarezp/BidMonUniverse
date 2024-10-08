import { Box, Paper, Typography } from '@mui/material';
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

// #region PROPS
interface SurpriseMessageBoxProps {
    message?: string;
}
// #endregion

//#region COMPONENTE SURPRISEMESSAGEBOX
export default function SurpriseMessageBox({ message }: SurpriseMessageBoxProps) {
    const navigate = useNavigate();
    const imageSource = '/jigglypuff.png';


    return (
        <StyledPaper
            elevation={3}
            sx={{
                mt: { xs: '5.5em', sm: 'auto' },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pl: 2, pr: 2, pb: 2 }}>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography
                        sx={{ marginBottom: '1em', marginTop: '1em' }}
                        role="alert"
                        aria-live="polite"
                    >
                        ¡Oh, sorpresa! Parece que Jigglypuff ha cantado tan fuerte que tu colección se ha vaciado. 🎤😮
                    </Typography>
                    <img
                        src={imageSource}
                        alt="Imagen del Pokémon Jigglypuff"
                        style={{ maxWidth: '30%', height: 'auto' }}
                    />
                    <Typography
                        role="alert"
                        aria-live="polite"
                    >
                        {message || 'No te preocupes, es el momento perfecto para comenzar tu aventura y capturar algunas cartas. ¡Buena suerte!😉'}
                    </Typography>
                </Box>
                <Button
                    buttonType="primary"
                    label='Ir a capturar cartas'
                    fullWidth
                    onClick={() => navigate('/shop')}
                    sx={{ mt: 2 }}
                    aria-label="Botón para ir a la tienda y capturar cartas"
                />
            </Box>
        </StyledPaper>
    );
};
//#endregion
