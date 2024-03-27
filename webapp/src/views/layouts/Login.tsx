import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import Paper from '../components/paper/Paper';
import Button from '../components/button/Button';
import { login as loginAPI } from '../../api/userAPI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { SessionUser } from '../../shared/sharedTypes';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar el mensaje de error

  const { login } = useAuth();

  const navigate = useNavigate();
  

  const handleLogin = async () => {
    loginAPI(user, password)
      .then(token => {
          console.log('Inicio de sesión exitoso y token almacenado desde Login.tsx -> ', token.token);
          setErrorMessage(''); // Limpiar el mensaje de error en caso de éxito
          localStorage.setItem('userToken', token.token); 
          let sessionUser: SessionUser = { username: user, token: token.token };
          login(sessionUser); // Llamar a la función de inicio de sesión del contexto de autenticación
          navigate('/logueado');
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
        <TextField fullWidth label="Usuario" margin="normal" value={user} onChange={(e) => setUser(e.target.value)} />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
        <Button buttonType="primary" label='Iniciar sesión' fullWidth sx={{ mt: 2 }} onClick={handleLogin}/> 
      </Box>
    </Paper>
  );
};
