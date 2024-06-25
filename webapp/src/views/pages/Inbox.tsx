import MailIcon from '@mui/icons-material/Mail';
import { Divider, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNotifications } from '../../api/notificationsAPI';
import { RootState } from '../../redux/store';
import { Notification } from '../../shared/sharedTypes';
import BasePageWithNav from './BasePageWithNav';

export default function Inbox() {
    const sessionUser = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);

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

    return (
        <BasePageWithNav title="Bandeja de entrada" showBackButton={false} handleBack={() => { }}>
            <Paper>
                <List>
                    {notifications.map((notification) => (
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
            </Paper>
        </BasePageWithNav>
    );
}
