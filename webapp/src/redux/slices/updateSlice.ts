import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UpdatePayload = {
    update: boolean;
    updateId: string;
};

const initialState = {
    update: false,
    updateId: ''
}

const updateSlice = createSlice({
    name: 'update',
    initialState,
    reducers: {
        setUpdate(state, action: PayloadAction<UpdatePayload>) {
            state.update = action.payload.update;
            state.updateId = action.payload.updateId;
        },
        resetUpdate(state) {
            state.update = false;
            state.updateId = '';
        }
    }
});

export const { setUpdate, resetUpdate } = updateSlice.actions;

export default updateSlice.reducer;