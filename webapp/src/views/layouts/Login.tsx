import React from 'react';
import { Box, TextField } from '@mui/material';
import Paper from '../components/paper/Paper';
import Button from '../components/button/Button';

export default function Login() {
  return (
    <Paper 
      title="Iniciar sesión" 
      imageSrc="logo-sf.png"
      elevation={3}
      sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}
    >
      <Box sx={{ p: 2 }}>
        <TextField fullWidth label="Correo electrónico" margin="normal" />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" />
        <Button buttonType="primary" label='Iniciar sesión' fullWidth sx={{ mt: 2 }}/>
      </Box>
    </Paper>
  );
};

