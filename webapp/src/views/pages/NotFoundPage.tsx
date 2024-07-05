import { Box, Paper, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';
import Container from '../components/container/Container';


//#region STYLES
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  maxWidth: 800,
  width: '100wh', // Ajuste para ocupar toda la anchura
  margin: 'auto',
  position: 'relative',
  borderRadius: 16,
  padding: theme.spacing(1),
  boxShadow: theme.palette.mode === 'light' ?
    '0px 4px 6px rgba(0,0,0,0.1)' :
    '0px 2px 10px rgba(255, 255, 255, 0.24)',

}));
//#endregion


//#region COMPONENTE NOTFOUNDPAGE
export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageSource = theme.palette.mode === 'light' ? '/404_light.png' : '/404_dark.png';

  return (
    <Container role="main"> {/* Añadir un rol semántico */}
      <StyledPaper elevation={3} sx={{ mt: { xs: '5.5em', sm: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
          <Typography color="textSecondary" sx={{ mb: '0.2em', mt: '1em' }}>
            Parece que has intentado explorar una zona cubierta por niebla...
          </Typography>
          <Typography color="textPrimary" sx={{ mb: '1em', fontSize: '1.5rem' }}>
            ¡No podemos encontrar esta página!
          </Typography>

          <img src={imageSource} alt="Imagen de Pokémon confundido indicando error 404" style={{ maxWidth: '80%', height: 'auto' }} />

          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/')} sx={{ mt: 2 }} label='Volver a la página de inicio' />

        </Box>
      </StyledPaper>
    </Container>
  );
};

//#endregion