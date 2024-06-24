import { Alert, Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { NotificationType } from '../../shared/sharedTypes';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';


//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme: any, children: any }) => {

  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notificationState.notifications);
  const hasNotification = useSelector((state: RootState) => state.notificationState.hasNotification);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  const getSeverity = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BidWinner:
        return 'success';
      case NotificationType.AuctionCancelled:
        return 'error';
      default:
        return 'info';
    }
  }

  useEffect(() => {
    console.log('Notificaciones:', notifications);
    /*
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        handleClose(notifications[0].id);
      }
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);*/
  }, [notifications, hasNotification]);


  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header toggleTheme={props.toggleTheme} />
      <Box component="main" flexGrow={1} mt={2} mb={2}>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            onClose={() => handleClose(notification.id)}
            severity={getSeverity(notification.type)}
            sx={{ mt: 10 }}
          >
            {notification.message}
          </Alert>
        ))}
        {/* Aquí va el contenido principal de la página */}
        {props.children}
      </Box>
      <Footer />
    </Box>
  );
}
//#endregion
export default BasePage;
