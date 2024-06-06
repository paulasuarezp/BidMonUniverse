import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import Paper from '../components/paper/Paper';
import Button from '../components/buttons/Button';
import { login as loginAPI } from '../../api/userAPI';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

//#region COMPONENT Login
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar el mensaje de error


  
  

  const handleLogin = async () => {
    loginAPI(username, password)
      .then(data => {
          if (data.error) {
              console.error('Error en el inicio de sesión desde Login.tsx -> ', data.error);
              setErrorMessage(data.error); // Guardar y mostrar el mensaje de error
          } else {
              setErrorMessage(''); // Limpiar el mensaje de error en caso de éxito
              console.log('Usuario almacenado en el estado global desde Login.tsx -> ', data);
              dispatch(setUser(data.user));
              // Redirigir a la página de inicio
              navigate('/logueado');
          }
      })
      .catch(error => {
          console.error('Error en el inicio de sesión desde Login.tsx -> ', error);
          setErrorMessage(error.message); // Guardar y mostrar el mensaje de error
      });
  };


  return (
    <Paper 
      title="Iniciar sesión" 
      imageSrc="logo-sf.png"
      elevation={3}
      sx={{ 
        maxWidth: 400, 
        mx: 'auto', 
        pt: 2, 
        mt: { xs: '5.5em', sm: 'auto' } 
      }}
    >
      <Box sx={{ pl: 2, pr: 2, pb:2}}>
        <TextField fullWidth label="Usuario" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
        <Button buttonType="primary" label='Iniciar sesión' fullWidth sx={{ mt: 2 }} onClick={handleLogin}/> 
      </Box>
    </Paper>
  );
};
//#endregion