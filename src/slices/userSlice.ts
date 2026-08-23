import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../utils/cookie';

type TUserState = {
  data: TUser | null; //данные пользователя
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean; //флаг "пользователь сейчас авторизован?"
  isLoginLoading: boolean;
  loginError: string | null;
  isRegisterLoading: boolean;
  registerError: string | null;
  isUpdateLoading: boolean;
  updateError: string | null;
  logoutError: string | null;
};

const initialState: TUserState = {
  data: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoginLoading: false,
  loginError: null,
  isRegisterLoading: false,
  registerError: null,
  isUpdateLoading: false,
  updateError: null,
  logoutError: null
};

//Регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

//Авторизуем пользователя
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

//Получение данных пользователя
export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

//Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

//Выход из аккаунта
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();

  localStorage.removeItem('refreshToken'); // очищаем refreshToken
  deleteCookie('accessToken'); // очищаем accessToken
  return response.success;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state.data,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked,
    getIsAuthenticatedSelector: (state) => state.isAuthenticated,
    getIsLoginLoadingSelector: (state) => state.isLoginLoading,
    getLoginErrorSelector: (state) => state.loginError,
    getIsRegisterLoadingSelector: (state) => state.isRegisterLoading,
    getRegisterErrorSelector: (state) => state.registerError,
    getIsUpdateLoadingSelector: (state) => state.isUpdateLoading,
    getUpdateErrorSelector: (state) => state.updateError,
    getLogoutErrorSelector: (state) => state.logoutError
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.registerError = action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isRegisterLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.registerError = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.loginError = action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoginLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginError = null;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.data = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUpdateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.updateError = action.error.message ?? null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isUpdateLoading = false;
        state.updateError = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutError = action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.logoutError = null;
      });
  }
});

export const {
  getUserSelector,
  getIsAuthCheckedSelector,
  getIsAuthenticatedSelector,
  getIsLoginLoadingSelector,
  getLoginErrorSelector,
  getIsRegisterLoadingSelector,
  getRegisterErrorSelector,
  getIsUpdateLoadingSelector,
  getUpdateErrorSelector,
  getLogoutErrorSelector
} = userSlice.selectors;
