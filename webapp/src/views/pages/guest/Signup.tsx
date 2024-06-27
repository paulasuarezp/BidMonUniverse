import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as yup from "yup";
import { signup as signupAPI } from '../../../api/userAPI';
import { AccessLevel, User } from '../../../shared/sharedTypes';
import * as fieldsValidation from '../../../utils/fieldsValidation';
import { showError } from "../../../utils/fieldsValidation";
import Button from '../../components/buttons/Button';
import BirthdayDatePicker from '../../components/calendar/BirthdayPicker';
import Container from '../../components/container/Container';
import Paper from '../../components/paper/Paper';

//#region COMPONENT Signup
export default function Signup() {
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [birthdayError, setBirthdayError] = useState<string>('');
  const navigate = useNavigate();

  const schema = fieldsValidation.signupValidationSchema;
  type UserSchema = yup.InferType<typeof schema>;
  const { register, handleSubmit, control, formState: { errors } } = useForm<UserSchema>({
    resolver: yupResolver(schema)
  });

  const onSubmit = handleSubmit(data => trySignup(data));

  const trySignup = (user: UserSchema) => {
    if (user.username && user.password && birthday) {
      let newUser: User = { username: user.username, birthday: birthday.toISOString(), password: user.password, role: AccessLevel.Standard, profileImg: "" };
      signupAPI(user.username, user.password, birthday.toISOString()).then((response) => {
        if (response.error) {
          fieldsValidation.showError(response.error, "Error al registrar el usuario", Swal.close);
        } else {
          successSignup(newUser);
        }
      });
    } else {
      fieldsValidation.showError("Todos los campos son obligatorios.", "Por favor, revíse el formulario.", Swal.close)
    }
  }

  const successSignup = (user: User) => {
    Swal.fire({
      title: 'Cuenta creada',
      text: "¡Cuenta " + user.username + " creada con éxito! Has recibido 100 Zens de bienvenida, ¡disfrútalos!",
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#81c784',
      confirmButtonText: 'Inicia sesión',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    }).catch((e) => {
      showError("Error inesperado", e.message, Swal.close)
    })
  }

  const updateBirthday = (date: any) => {
    if (date) {
      try {
        fieldsValidation.birthdayConstraints.validateSync(date.toDate(), { abortEarly: false });
        setBirthday(date.toDate());
        setBirthdayError('');
      } catch (error) {
        setBirthday(undefined);
        if (error instanceof yup.ValidationError) {
          setBirthdayError(error.errors[0]);
        } else {
          setBirthdayError('Debe de introducir una fecha de nacimiento válida.');
        }
      }
    } else {
      setBirthday(undefined);
      setBirthdayError('Debe de introducir una fecha de nacimiento válida.');
    }
  };

  return (
    <Container>
      <Paper
        title="Registro"
        imageSrc="logo-sf.png"
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          pt: 2,
          mt: { xs: 0, sm: 5 },
          mb: { xs: 0, sm: 0 },
        }}
      >
        <Box component='form' onSubmit={onSubmit} noValidate sx={{ pl: 2, pr: 2, pb: 2 }}>
          <TextField
            id='username'
            fullWidth
            label="Nombre de usuario"
            margin="normal"
            sx={{ mb: 4 }}
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <BirthdayDatePicker
            onChange={(date) => updateBirthday(date)}
            error={birthdayError}
          />

          <Divider sx={{ my: 2 }} />

          <TextField
            id='password'
            fullWidth
            label="Contraseña"
            type="password"
            autoComplete='current-password'
            margin='normal'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            id='confirmPassword'
            fullWidth
            label="Confirmar contraseña"
            type="password"
            autoComplete='current-password'
            margin="normal"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type='submit'
            buttonType="primary"
            label='Registrarse'
            fullWidth
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión aquí</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
//#endregion
