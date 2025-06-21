import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ 
  user: userReducer,
  // Add other reducers here if needed
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user'] // Only persist user state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const errorMiddleware = store => next => action => {
  if (action.error) {
    console.error('Redux error:', action.error);
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware),
});

export const persistor = persistStore(store);
