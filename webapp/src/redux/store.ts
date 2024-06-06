import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from 'redux-persist/lib/storage'; // usa el almacenamiento local
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';


import userReducer from "./slices/userSlice";

const persistConfig = {
  key: 'root', // La clave principal bajo la cual se almacenará el estado persistido
  storage, // Tipo de almacenamiento
  whitelist: ['user'] // Slices del estado se almacenarán
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'], // Ignoring specific actions dispatched by redux-persist
        ignoredPaths: ['_persist'], // Commonly used by redux-persist to store non-serializable elements
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
