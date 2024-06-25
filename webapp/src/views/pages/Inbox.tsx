import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DraftsIcon from '@mui/icons-material/Drafts';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { Container, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Pagination, Paper, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNotifications, markAllAsRead, markAsRead } from '../../api/notificationsAPI';
import { setHasUnreadNotifications } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { Notification, NotificationImportance } from '../../shared/sharedTypes';
import Button from '../components/buttons/Button';
import BasePageWithNav from './BasePageWithNav';

export default function Inbox() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);

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
            console.error("Error fetching notifications", error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [sessionUser.username]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead(sessionUser.username);
            dispatch(setHasUnreadNotifications(false));
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all notifications as read", error);
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    }

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
