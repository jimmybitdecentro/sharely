import {Middleware} from '@reduxjs/toolkit';
import {storageService} from '../../services/storage/storageService';
import {STORAGE_KEYS} from '../../services/storage/storageKeys';
import {setCredentials, logout} from '../slices/authSlice';
import {setTheme} from '../slices/themeSlice';

export const storageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Persist auth state
  if (setCredentials.match(action)) {
    const {token, user} = action.payload;
    storageService.setAuthToken(token);
    if (user) {
      storageService.setUserData(user);
    }
  }

  if (logout.match(action)) {
    storageService.removeAuthToken();
    storageService.removeUserData();
  }

  // Persist theme
  if (setTheme.match(action)) {
    storageService.setTheme(action.payload);
  }

  return result;
};

