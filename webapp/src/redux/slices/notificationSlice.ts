import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../shared/sharedTypes';

type NotificationPayload = {
    notification: Notification;
};

const initialState = {
    notifications: [] as Notification[],
    hasNotification: false,
    hasUnreadNotifications: false,
}

const notificationSlice = createSlice({
    name: 'notificationState',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationPayload>) {
            state.notifications.push(action.payload.notification);
            state.hasNotification = true;
            state.hasUnreadNotifications = true;
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(notif => notif.socketId !== action.payload);
            state.hasNotification = state.notifications.length > 0;
        },
        setHasUnreadNotifications(state, action: PayloadAction<boolean>) {
            state.hasUnreadNotifications = action.payload;
        },
        resetNotifications(state) {
            state.notifications = [];
            state.hasNotification = false;
            state.hasUnreadNotifications = false;
        }
    }
});

export const { addNotification, removeNotification, resetNotifications, setHasUnreadNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
