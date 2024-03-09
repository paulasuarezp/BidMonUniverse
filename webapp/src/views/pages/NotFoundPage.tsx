import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import Button from '../components/button/Button';
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
  padding: theme.spacing(1),
  boxShadow: theme.palette.mode === 'light' ? 
  'default': // Sombra para modo claro
  '0px 2px 10px rgba(255, 255, 255, 0.24)', 

}));

const SecondaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? 'rgba(18, 18, 18, 0.5)' : 'rgba(255, 255, 255, 0.5)',
  fontSize: '1.4em',
  textAlign: 'center',
  borderRadius: '4px',
}));

const PrincipalText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? 'rgba(18, 18, 18)' : 'rgba(255, 255, 255)',
  fontSize: '1.6em',
  borderRadius: '4px',
  textAlign: 'center',
}));
//#endregion


//#region COMPONENTE NOTFOUNDPAGE
export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageSource = theme.palette.mode === 'light' ? '404_light.png' : '404_dark.png';
  
  return (
    <StyledPaper 
      elevation={3}
      sx={{ 
        mt: { xs: '5.5em', sm: 'auto' } // marginTop de 5.5em en xs (móviles) y 'auto' en sm y tamaños mayores
      }}
    >
      <Box sx={{ display:'flex', flexDirection:'column',alignContent:'center', pl: 2, pr: 2, pb:2}}>
      <SecondaryText sx={{ marginBottom: '0.2em', marginTop:'1em' }}>
          Parece que has intentado explorar una zona cubierta por niebla...
        </SecondaryText>
        <PrincipalText sx={{ marginBottom: '1em' }}>
          ¡No podemos encontrar esta página!
        </PrincipalText>
      
        <img src={imageSource} alt="Pokémon Confundido"  style={{  alignSelf:'center', maxWidth: '80%', height: 'auto' }}/>
        
        
        <Button buttonType="primary" label='Volver al inicio' fullWidth   onClick={() => navigate('/')} sx={{ mt: 2 }}/>
        
      </Box>
    </StyledPaper>
  );
};
//#endregion