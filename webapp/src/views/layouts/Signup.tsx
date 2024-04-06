import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import Paper from '../components/paper/Paper';
import Button from '../components/button/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import * as fieldsValidation from '../../utils/fieldsValidation';
import { showError } from "../../utils/fieldsValidation";
import { User } from '../../shared/sharedTypes';
import BirthdayDatePicker from '../components/calendar/BirthdayPicker';



//#region COMPONENT Signup
export default function Signup() {
    const [birthday, setBirthday] = useState<Date | undefined>(undefined);
    const [birthdayError, setBirthdayError] = useState<string>('');


    const schema = fieldsValidation.signupValidationSchema;
    type UserSchema = yup.InferType<typeof schema>;
    const { register, handleSubmit, control, formState: { errors } } = useForm<UserSchema>({
        resolver: yupResolver(schema)
    });

    const onSubmit = handleSubmit(data => trySignup(data));

    const trySignup = (user: UserSchema) => {
        if (user.username && user.password && birthday) {
            let newUser: User = { username: user.username, birthday: birthday.toISOString(), password: user.password, role:"standard", profileImg: "" };
            console.log('Usuario a registrar -> ', newUser);
        } else {
            fieldsValidation.showError("Debe de introducir", "Por favor, revíselas.", Swal.close)
        }
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
      <Box component='form' onSubmit={onSubmit} noValidate sx={{ pl: 2, pr: 2, pb:2}}>
        <TextField 
          id='username'
          fullWidth 
          label="Nombre de usuario" 
          margin="normal" 
          {...register('username')}
          helperText={errors.username?.message}
        />

        <BirthdayDatePicker 
          onChange={(date) => updateBirthday(date)}
          error={birthdayError ? birthdayError : ''}
        />

        <TextField 
          id='password'
          fullWidth 
          label="Contraseña" 
          type="password" 
          autoComplete='current-password'
          margin="normal" 
          {...register('password')}
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
          helperText={errors.confirmPassword?.message}
        />
        
        <Button 
          type='submit' 
          buttonType="primary" 
          label='Iniciar sesión' 
          fullWidth 
          sx={{ mt: 2 }} 
        /> 
      </Box>
    </Paper>
    );

}
//#endregion