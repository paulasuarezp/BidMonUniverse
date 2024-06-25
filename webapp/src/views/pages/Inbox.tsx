import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MailIcon from '@mui/icons-material/Mail';
import { Button, Container, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Pagination, Paper, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNotifications, markAllAsRead, markAsRead } from '../../api/notificationsAPI';
import { RootState } from '../../redux/store';
import { Notification } from '../../shared/sharedTypes';
import BasePageWithNav from './BasePageWithNav';

export default function Inbox() {
    const sessionUser = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);

    const fetchNotifications = async () => {
        try {
            const response = await getUserNotifications(sessionUser.username);
            setNotifications(response);
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
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all notifications as read", error);
        }
    }

    // Calcular el índice de las notificaciones a mostrar
    const startIndex = (page - 1) * pageSize;
    const selectedNotifications = notifications.slice(startIndex, startIndex + pageSize);

    return (
        <BasePageWithNav title="Bandeja de entrada" showBackButton={false} handleBack={() => { }}>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Bandeja de entrada
                </Typography>
                <Button variant="contained" color="primary" onClick={handleMarkAllAsRead} style={{ marginBottom: '20px' }}>
                    Marcar todas como leídas
                </Button>
                <Paper>
                    <List>
                        {selectedNotifications.map((notification) => (
                            <React.Fragment key={notification._id}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <MailIcon color={notification.read ? "disabled" : "primary"} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={`Importancia: ${notification.importance}`}
                                        style={{ textDecoration: notification.read ? 'line-through' : 'none' }}
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
