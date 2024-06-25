import MailIcon from '@mui/icons-material/Mail';
import { useTheme } from '@mui/material';
import Badge from '@mui/material/Badge';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkUnreadNotifications } from '../../../../api/notificationsAPI';
import { RootState } from '../../../../redux/store';

export default function InboxButton() {
    const navigate = useNavigate();
    const theme = useTheme();
    const sessionUser = useSelector((state: RootState) => state.user);
    const notifications = useSelector((state: RootState) => state.notificationState.notifications);

    const [hasUnread, setHasUnread] = useState<boolean>(false);

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
    }, [notifications, sessionUser.username]);

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
            }}>
            <MailIcon />
        </Badge>
    );
};
