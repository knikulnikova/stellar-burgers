import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
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
  isPasswordLoading: boolean;
  passwordError: string | null;
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
  isPasswordLoading: false,
  passwordError: null,
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

//Восстановление пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

//Новый пароль
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
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
    getRegisterSelector: (state) => ({
      data: state.data,
      isAuthChecked: state.isAuthChecked,
      isAuthenticated: state.isAuthenticated,
      isRegisterLoading: state.isRegisterLoading,
      error: state.registerError
    }),
    getLoginSelector: (state) => ({
      data: state.data,
      isAuthChecked: state.isAuthChecked,
      isAuthenticated: state.isAuthenticated,
      isLoginLoading: state.isLoginLoading,
      error: state.loginError
    }),
    getPasswordSelector: (state) => ({
      isPasswordLoading: state.isPasswordLoading,
      error: state.passwordError
    }),
    getUpdateSelector: (state) => ({
      data: state.data,
      isUpdateLoading: state.isUpdateLoading,
      error: state.updateError
    }),
    getLogoutSelector: (state) => ({
      error: state.logoutError
    })
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
      .addCase(forgotPassword.pending, (state) => {
        state.isPasswordLoading = true;
        state.passwordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isPasswordLoading = false;
        state.passwordError = action.error.message ?? null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isPasswordLoading = false;
        state.passwordError = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isPasswordLoading = true;
        state.passwordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isPasswordLoading = false;
        state.passwordError = action.error.message ?? null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isPasswordLoading = false;
        state.passwordError = null;
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
  getLoginSelector,
  getRegisterSelector,
  getPasswordSelector,
  getUpdateSelector,
  getLogoutSelector
} = userSlice.selectors;
