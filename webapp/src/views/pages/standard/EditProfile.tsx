import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, Badge, Box, Divider, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as yup from "yup";
import { updateUserAvatar, updateUserPassword } from '../../../api/userAPI';
import { setUser } from '../../../redux/slices/userSlice';
import { User } from '../../../shared/sharedTypes';
import { passwordConstraints, showError } from '../../../utils/fieldsValidation';
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

const schema = yup.object().shape({
    password: passwordConstraints.optional(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir').optional(),
});

export default function EditProfile() {
    const sessionUser = useSelector((state: any) => state.user);
    const [selectedAvatar, setSelectedAvatar] = useState(sessionUser.profileImg);
    const [editAvatar, setEditAvatar] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<User>(sessionUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    type UserSchema = yup.InferType<typeof schema>;
    const { register, handleSubmit, formState: { errors } } = useForm<UserSchema>({
        resolver: yupResolver(schema)
    });

    const onSubmitAvatar = () => {
        updateUserAvatar(sessionUser.username, selectedAvatar).then((response) => {
            if (response.error) {
                showError(response.error, "Ha ocurrido un error al actualizar el avatar", Swal.close);
            } else {
                successUpdateProfile();
                dispatch(setUser({ ...sessionUser, profileImg: selectedAvatar }));
            }
        });
    };

    const onSubmitPassword = handleSubmit(data => {
        if (data.password) {
            updateUserPassword(sessionUser.username, data.password).then((response) => {
                if (response.error) {
                    showError(response.error, "Ha ocurrido un error al actualizar la contraseña", Swal.close);
                } else {
                    successUpdateProfile();
                }
            });
        }
    });

    const successUpdateProfile = () => {
        Swal.fire({
            title: 'Perfil actualizado',
            text: "¡Perfil de " + sessionUser.username + " actualizado con éxito!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#81c784',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                setEditAvatar(false);
                setEditPassword(false);
            }
        }).catch((e) => {
            showError("Error inesperado", e.message, Swal.close);
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
            <PokeballsBox titulo="Mi perfil" />
            <Paper
                title="Mi perfil"
                elevation={3}
                sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    pt: 2,
                    mt: { xs: 0, sm: 5 },
                    mb: { xs: 0, sm: 0 },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', mb: 2, minWidth: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Avatar alt="Current Avatar" src={selectedAvatar} sx={{ width: 80, height: 80 }} />
                    </Box>
                    <Typography variant="h5" align="center" gutterBottom>
                        {sessionUser.username}
                    </Typography>

                    <Divider sx={{ my: 2 }}><Typography variant="subtitle1" align="center">Editar perfil</Typography></Divider>

                    {editAvatar == false ?
                        (<Button
                            variant="contained"
                            sx={{ margin: '10px' }}
                            onClick={() => {
                                setEditAvatar(true);
                                setEditPassword(false);
                            }}
                            label="Editar avatar"
                        >
                        </Button>) :
                        (<Button
                            variant="contained"
                            sx={{ margin: '10px' }}
                            onClick={() => {
                                setEditAvatar(false);
                                setEditPassword(false);
                            }}
                            label=" Ocultar editar avatar"
                        >
                        </Button>)}

                    {editPassword == false ?
                        (<Button
                            variant="contained"
                            sx={{ margin: '10px' }}
                            onClick={() => {
                                setEditAvatar(false);
                                setEditPassword(true);
                            }}
                            label="Editar contraseña"
                        />
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ margin: '10px' }}
                                onClick={() => {
                                    setEditAvatar(false);
                                    setEditPassword(false);
                                }}
                                label="Ocultar editar contraseña"
                            />
                        )}
                </Box>

                <Box component='form' onSubmit={editAvatar ? handleSubmit(onSubmitAvatar) : onSubmitPassword} noValidate sx={{ pl: 2, pr: 2, pb: 2 }}>
                    {editAvatar && (
                        <>
                            <Divider sx={{ my: 2 }}><Typography variant="subtitle1" align="center">Selecciona un avatar</Typography></Divider>

                            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                                {avatars.map((avatar, index) => (
                                    <Grid item key={index} xs={4} sm={2}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            badgeContent={selectedAvatar === avatar ? <CheckCircleIcon color="primary" /> : null}
                                        >
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
                                        </Badge>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                    {editPassword && (
                        <>
                            <Divider sx={{ my: 2 }}><Typography variant="subtitle1" align="center">Editar contraseña</Typography></Divider>

                            <TextField
                                id='password'
                                fullWidth
                                label="Nueva Contraseña"
                                type="password"
                                autoComplete='current-password'
                                margin='normal'
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password ? String(errors.password.message) : ''}
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
                                helperText={errors.confirmPassword ? String(errors.confirmPassword.message) : ''}
                            />
                        </>
                    )}

                    {(editAvatar || editPassword) && (
                        <Button
                            type='submit'
                            buttonType="primary"
                            label='Actualizar Perfil'
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                    )}
                </Box>
            </Paper>
        </Container>
    );
}
