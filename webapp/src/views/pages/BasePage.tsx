import { Box } from '@mui/material';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { NotificationType } from '../../shared/sharedTypes';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';

//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme: any, children: any }) => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notificationState.notifications);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  const getSeverity = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BidWinner:
        return 'success';
      case NotificationType.CardSold:
        return 'success';
      case NotificationType.AuctionCancelled:
        return 'error';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    notifications.forEach(notification => {
      console.log('Notification en base page:', notification);
      if (toast.current) {
        toast.current.show({
          severity: getSeverity(notification.type),
          summary: NotificationType[notification.type],
          detail: notification.message,
          life: 5000
        });
        handleClose(notification.socketId);
      }
    });
  }, [notifications]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Toast ref={toast} position="bottom-left" />
      <Header toggleTheme={props.toggleTheme} />
      <Box component="main" flexGrow={1} mt={2} mb={2}>
        {props.children}
      </Box>
      <Footer />
    </Box>
  );
}

//#endregion

export default BasePage;
