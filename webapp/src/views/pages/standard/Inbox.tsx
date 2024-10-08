import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DraftsIcon from '@mui/icons-material/Drafts';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { Container, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Pagination, Paper, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getUserNotifications, markAllAsRead, markAsRead } from '../../../api/notificationsAPI';
import { setHasUnreadNotifications } from '../../../redux/slices/notificationSlice';
import { RootState } from '../../../redux/store';
import { Notification, NotificationImportance } from '../../../shared/sharedTypes';
import Button from '../../components/buttons/Button';
import ErrorMessageBox from '../../components/messages/ErrorMessageBox';
import BasePageWithNav from '../BasePageWithNav';

// #region COMPONENTE INBOX
export default function Inbox() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [error, setError] = useState<string | null>(null);

    /**
     * Obtiene las notificaciones del usuario y las almacena en el estado
     */
    const fetchNotifications = async () => {
        try {
            const response = await getUserNotifications(sessionUser.username);
            setNotifications(response);
            response.forEach(notification => {
                if (!notification.read) {
                    dispatch(setHasUnreadNotifications(true));
                    return;
                }
            });
        } catch (error) {
            setError('Ha ocurrido un error al obtener las notificaciones, por favor inténtalo de nuevo.');
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [sessionUser.username]);

    /**
     * Función para manejar el cambio de página
     * @param event - evento
     * @param value - valor de la página
     */
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    /**
     * Función para marcar una notificación como leída
     * @param id - id de la notificación
     */
    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al marcar la notificación como leída, por favor inténtalo de nuevo.',
                cancelButtonText: 'Cerrar',
            });
        }
    }

    /**
     * Función para marcar todas las notificaciones como leídas
     */
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead(sessionUser.username);
            dispatch(setHasUnreadNotifications(false));
            fetchNotifications();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al marcar las notificaciones como leídas, por favor inténtalo de nuevo.',
                cancelButtonText: 'Cerrar',
            });
        }
    }

    /**
     * Formatea la fecha de la notificación
     * @param date - fecha de la notificación
     * @returns  fecha formateada
     */
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    }

    /**
     * Devuelve un icono si la notificación es importante
     * @param importance - importancia de la notificación
     * @returns  icono de importancia
     */
    const getImportanceIcon = (importance: string) => {
        switch (importance) {
            case NotificationImportance.High:
                return (
                    <Tooltip title="Notificación importante" arrow>
                        <NotificationImportantIcon color="error" />
                    </Tooltip>
                );
            default:
                return null;
        }
    }

    // Calcular el índice de las notificaciones a mostrar
    const startIndex = (page - 1) * pageSize;
    const selectedNotifications = notifications.slice(startIndex, startIndex + pageSize);

    if (error) {
        return (
            <BasePageWithNav title="Bandeja de entrada" showBackButton={false} handleBack={() => { }}>
                <ErrorMessageBox message='Se ha producido un error al obtener las notificaciones. Por favor, inténtalo más tarde.' />
            </BasePageWithNav>
        );
    }

    return (
        <BasePageWithNav title="Bandeja de entrada" showBackButton={false} handleBack={() => { }}>
            <Container>
                <Button buttonType='primary' onClick={handleMarkAllAsRead} style={{ marginBottom: '20px' }} label='Marcar todas como leídas' />
                <Paper>
                    <List>
                        {selectedNotifications.map((notification) => (
                            <React.Fragment key={notification._id}>
                                <ListItem
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        {!notification.read &&
                                            <Tooltip title="Notificación no leída" arrow>
                                                <MarkEmailUnreadIcon color="primary" />
                                            </Tooltip>
                                        }

                                        {notification.read &&
                                            <Tooltip title="Notificación leída" arrow>
                                                <DraftsIcon color="disabled" />
                                            </Tooltip>
                                        }
                                        {getImportanceIcon(notification.importance)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={formatDate(notification.creationDate)}
                                    />
                                    {!notification.read && (
                                        <Tooltip title="Marcar como leída" arrow>
                                            <IconButton edge="end" aria-label="Marcar como leída" onClick={() => handleMarkAsRead(notification._id!)}>
                                                <CheckCircleIcon color="action" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Pagination
                        count={Math.ceil(notifications.length / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}
                    />
                </Paper>
            </Container>
        </BasePageWithNav>
    );
}
// #endregion