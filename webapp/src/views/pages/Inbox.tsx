import MailIcon from '@mui/icons-material/Mail';
import { Divider, List, ListItem, ListItemIcon, ListItemText, Pagination, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNotifications } from '../../api/notificationsAPI';
import { RootState } from '../../redux/store';
import { Notification } from '../../shared/sharedTypes';
import BasePageWithNav from './BasePageWithNav';

export default function Inbox() {
    const sessionUser = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const response = await getUserNotifications(sessionUser.username);
                setNotifications(response);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };

        getNotifications();
    }, [sessionUser.username]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Calcular el índice de las notificaciones a mostrar
    const startIndex = (page - 1) * pageSize;
    const selectedNotifications = notifications.slice(startIndex, startIndex + pageSize);

    return (
        <BasePageWithNav title="Bandeja de entrada" showBackButton={false} handleBack={() => { }}>

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
        </BasePageWithNav>
    );
}
