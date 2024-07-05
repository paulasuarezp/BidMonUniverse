import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkUnreadNotifications } from '../../../../api/notificationsAPI';
import { RootState } from '../../../../redux/store';

// #region COMPONENT InboxButton
export default function InboxButton() {
    const navigate = useNavigate();
    const sessionUser = useSelector((state: RootState) => state.user);
    const hasUnreadNotifications = useSelector((state: RootState) => state.notificationState.hasUnreadNotifications);

    const [hasUnread, setHasUnread] = useState<boolean>(hasUnreadNotifications);

    /**
     * Función para comprobar si el usuario tiene notificaciones sin leer
     * @param username 
     */
    const checkUnread = async (username: string) => {
        try {
            const check = await checkUnreadNotifications(username);
            setHasUnread(check);
        } catch (error) {
            setHasUnread(false);
        }
    }

    const handleClick = () => {
        navigate('/inbox');
    }

    useEffect(() => {
        const fetchUnreadStatus = async () => {
            await checkUnread(sessionUser.username);
        };

        fetchUnreadStatus();
    }, [hasUnreadNotifications, sessionUser.username]);

    return (
        <Badge
            color={'success'}
            variant="dot" invisible={!hasUnread} onClick={handleClick}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s',
                }
            }}
            role="button"
            aria-label="Ir al buzón de notificaciones"
        >
            <MailIcon />
        </Badge>
    );
};
// #endregion