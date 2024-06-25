import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../shared/sharedTypes';

type NotificationPayload = {
    notification: Notification;
};

const initialState = {
    notifications: [] as Notification[],
    hasNotification: false
}

const notificationSlice = createSlice({
    name: 'notificationState',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationPayload>) {
            state.notifications.push(action.payload.notification);
            state.hasNotification = true;
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(notif => notif.socketId !== action.payload);
            state.hasNotification = state.notifications.length > 0;
        },
        resetNotifications(state) {
            state.notifications = [];
            state.hasNotification = false;
        }
    }
});

export const { addNotification, removeNotification, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
