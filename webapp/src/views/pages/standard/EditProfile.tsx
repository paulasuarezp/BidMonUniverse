import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Box, Divider, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as yup from "yup";
import { User } from '../../../shared/sharedTypes';
import * as fieldsValidation from '../../../utils/fieldsValidation';
import Button from '../../components/buttons/Button';
import Container from '../../components/container/Container';
import PokeballsBox from '../../components/ornament/PokeballsBox';
import Paper from '../../components/paper/Paper';

const avatars = [
    '/avatar/avatar1.png',
    '/avatar/avatar2.png',
    '/avatar/avatar3.png',
    '/avatar/avatar4.png',
    '/avatar/avatar5.png',
    '/avatar/avatar6.png'
];

//#region COMPONENT EditProfile
export default function EditProfile() {
    const sessionUser = useSelector((state: any) => state.user);
    const [selectedAvatar, setSelectedAvatar] = useState(sessionUser.profileImg);
    const navigate = useNavigate();

    const schema = null;
    type UserSchema = yup.InferType<typeof schema>;
    const { register, handleSubmit, formState: { errors } } = useForm<UserSchema>({
        resolver: yupResolver(schema)
    });

    const onSubmit = handleSubmit(data => tryUpdateProfile(data));

    const tryUpdateProfile = (user: UserSchema) => {
        let updatedUser: User = { ...sessionUser, username: user.username, password: user.password, profileImg: selectedAvatar };
        /*  updateUserProfile(updatedUser).then((response) => {
              if (response.error) {
                  fieldsValidation.showError(response.error, "Error al actualizar el perfil", Swal.close);
              } else {
                  successUpdateProfile(updatedUser);
              }
          });*/
    }

    const successUpdateProfile = (user: User) => {
        Swal.fire({
            title: 'Perfil actualizado',
            text: "¡Perfil de " + user.username + " actualizado con éxito!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#81c784',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
        }).catch((e) => {
            fieldsValidation.showError("Error inesperado", e.message, Swal.close)
        })
    }

    const handleBack = () => {
        navigate("/");
    }

    return (
        <Container >
            <Button startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                buttonType="ghost"
                onClick={handleBack}
                label="Volver a la página de inicio"
            />
            <PokeballsBox titulo="Editar Perfil" />
            <Paper
                title="Editar Perfil"
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Avatar alt="Current Avatar" src={selectedAvatar} sx={{ width: 80, height: 80 }} />
                    </Box>
                    <Typography variant="h5" align="center" gutterBottom>
                        {sessionUser.username}
                    </Typography>


                    <Divider sx={{ my: 2 }}><Typography variant="subtitle1">Selecciona un avatar</Typography></Divider>

                    <Grid container spacing={2}>
                        {avatars.map((avatar, index) => (
                            <Grid item xs={4} key={index}>
                                <Avatar
                                    alt={`Avatar ${index + 1}`}
                                    src={avatar}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        cursor: 'pointer',
                                        border: selectedAvatar === avatar ? '2px solid #1976d2' : 'none'
                                    }}
                                    onClick={() => setSelectedAvatar(avatar)}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2 }}><Typography variant="subtitle1">Editar contraseña</Typography></Divider>

                    <TextField
                        id='password'
                        fullWidth
                        label="Nueva Contraseña"
                        type="password"
                        autoComplete='current-password'
                        margin='normal'
                        {...register('password')}
                        error={!!errors.password}
                    />

                    <TextField
                        id='confirmPassword'
                        fullWidth
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        autoComplete='current-password'
                        margin="normal"
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                    />

                    <Button
                        type='submit'
                        buttonType="primary"
                        label='Actualizar Perfil'
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                </Box>
            </Paper>
        </Container>
    );
}
//#endregion
