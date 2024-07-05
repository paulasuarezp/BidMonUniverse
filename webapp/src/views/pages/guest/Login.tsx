import { Box, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../../../api/userAPI';
import { setSocketConnected, setUser } from '../../../redux/slices/userSlice';
import { connectSocket } from '../../../socket/socketService';
import Button from '../../components/buttons/Button';
import Container from '../../components/container/Container';
import Paper from '../../components/paper/Paper';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar el mensaje de error

  const handleLogin = async () => {
    try {
      const data = await loginAPI(username, password);
      if (data.error) {
        setErrorMessage(data.error); // Guardar y mostrar el mensaje de error
      } else {
        setErrorMessage(''); // Limpiar el mensaje de error en caso de éxito
        dispatch(setUser(data.user));
        if (data.token) {
          dispatch(setSocketConnected(true));
          connectSocket(data.token, data.user.username);
        }
        // Redirigir a la página de inicio
        if (data.user.role === 'admin') navigate('/admin');
        else navigate('/logued');
      }
    } catch (error) {
      setErrorMessage(error.message); // Guardar y mostrar el mensaje de error
    }
  };

  return (
    <Container>
      <Paper
        title="Iniciar sesión"
        imageSrc="logo-sf.png"
        imageAlt="Logo de BidMon Universe"
        elevation={3}
        sx={{
          maxWidth: 400,
          margin: 'auto',
          mt: { xs: 0, sm: 10 },
          mb: { xs: 0, sm: 0 },
          pt: 2,
        }}
      >
        <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
          <TextField
            fullWidth
            error={!!errorMessage}
            id="username"
            label="Usuario"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-describedby={errorMessage ? "username-error" : undefined}
          />
          <TextField
            fullWidth
            error={!!errorMessage}
            id="password"
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={errorMessage ? "password-error" : undefined}
          />
          {errorMessage && (
            <Typography id="username-error" color="error" role="alert">
              {errorMessage}
            </Typography>
          )}
          <Button
            id="loginButton"
            buttonType="primary"
            label='Iniciar sesión'
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿No tienes cuenta? <Link href="/signup" aria-label="Enlace para registrarse">Regístrate aquí</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
