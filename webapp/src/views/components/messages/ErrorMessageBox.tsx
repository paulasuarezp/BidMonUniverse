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

interface ErrorMessageBoxProps {
    message?: string;
}

//#region COMPONENTE ERRORMESSAGEBOX
// Componente que muestra un mensaje de error con una imagen de Mimikyu
export default function ErrorMessageBox({ message }: ErrorMessageBoxProps) {
    const navigate = useNavigate();

    const imageSource = '/mimikyu.png';

    return (
        <StyledPaper
            elevation={3}
            sx={{
                mt: { xs: '5.5em', sm: 'auto' },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    pl: 2,
                    pr: 2,
                    pb: 2
                }}
            >
                <Box sx={{ flex: 1, textAlign: 'center' }}>

                    <Typography
                        sx={{ marginBottom: '0.2em', marginTop: '1em' }}
                        role="alert"
                        aria-live="assertive"
                    >
                        ¡Oh no! Parece que Mimikyu ha intentado hacerse pasar por nuestros datos y los ha envuelto en su manto de misterio. 👻🎭
                    </Typography>
                    <Box sx={{ flex: 1, textAlign: 'center', mt: { xs: 2, md: 0 } }}>
                        <img
                            src={imageSource}
                            alt="Imagen del Pokémon Mimikyu"
                            style={{ maxWidth: '40%', height: 'auto' }}
                        />
                    </Box>
                    <Typography
                        sx={{ marginBottom: '1em' }}
                        role="alert"
                        aria-live="assertive"
                    >
                        {message || 'Ha ocurrido un error inesperado.'}
                        <br />Por favor, inténtalo de nuevo más tarde. ¡Gracias!
                    </Typography>
                </Box>
            </Box>
            <Button
                buttonType="primary"
                label='Volver a la página principal'
                fullWidth
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
                aria-label="Botón para volver a la página principal"
            />
        </StyledPaper>
    );
};
//#endregion
