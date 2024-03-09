import { Box, TextField } from '@mui/material';
import Paper from '../components/paper/Paper';
import Button from '../components/button/Button';

//#region COMPONENTE LOGIN
export default function Login() {
  return (
    <Paper 
      title="Iniciar sesión" 
      imageSrc="logo-sf.png"
      elevation={3}
      sx={{ 
        maxWidth: 400, 
        mx: 'auto', 
        pt: 2, 
        mt: { xs: '5.5em', sm: 'auto' } // marginTop de 5.5em en xs (móviles) y 'auto' en sm y tamaños mayores
      }}
    >
      <Box sx={{ pl: 2, pr: 2, pb:2}}>
        <TextField fullWidth label="Correo electrónico" margin="normal" />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" />
        <Button buttonType="primary" label='Iniciar sesión' fullWidth sx={{ mt: 2 }}/>
      </Box>
    </Paper>
  );
};
//#endregion
