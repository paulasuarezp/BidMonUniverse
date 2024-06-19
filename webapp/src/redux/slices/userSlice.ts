import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { UserState, AccessLevel } from '../../shared/sharedTypes';

const initialState: UserState = {
    username: '',
    role: AccessLevel.Guest,
    birthday: '',
    balance: 0,
    profileImg: '',
    socketConnected: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.birthday = action.payload.birthday;
            state.balance = action.payload.balance;
            state.profileImg = action.payload.profileImg;
        },
        resetUser(state) {
            state.username = '';
            state.role = AccessLevel.Guest;
            state.birthday = '';
            state.balance = 0;
            state.profileImg = '';
        },
        setSocketConnected(state, action: PayloadAction<boolean>) {
            state.socketConnected = action.payload;
        }
    }
});

export const { setUser, resetUser, setSocketConnected } = userSlice.actions;

export default userSlice.reducer;