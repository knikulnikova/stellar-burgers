import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { TNewOrder } from '@api';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type TOrdersState = {
  orders: TOrder[];
  isOrdersLoading: boolean;
  ordersError: string | null;
  newOrder: TNewOrder | null;
  newOrderName: string | null;
  isOrderCreating: boolean;
  newOrderError: string | null;
  ordersByNumber: TOrder[];
  isOrdersByNumberLoading: boolean;
  ordersByNumberError: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isOrdersLoading: false,
  ordersError: null,
  newOrder: null,
  newOrderName: null,
  isOrderCreating: false,
  newOrderError: null,
  ordersByNumber: [],
  isOrdersByNumberLoading: false,
  ordersByNumberError: null
};

//Заказы пользователя
export const getOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

//Сделать заказ
export const setOrder = createAsyncThunk(
  'orders/setOrder',
  async (data: string[]) => orderBurgerApi(data)
);

//Найти заказ по номерму
export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
      state.newOrderName = null;
      state.newOrderError = null;
    },
    clearOrderByNumber: (state) => {
      state.ordersByNumber = [];
      state.isOrdersByNumberLoading = false;
      state.ordersByNumberError = null;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getIsOrdersLoadingSelector: (state) => state.isOrdersLoading,
    getOrdersErrorSelector: (state) => state.ordersError,
    getNewOrderSelector: (state) => state.newOrder,
    getNewOrderNameSelector: (state) => state.newOrderName,
    getIsOrderCreatingSelector: (state) => state.isOrderCreating,
    getNewOrderErrorSelector: (state) => state.newOrderError,
    getOrdersByNumberSelector: (state) => state.ordersByNumber,
    getIsOrdersByNumberLoadingSelector: (state) =>
      state.isOrdersByNumberLoading,
    getOrdersByNumberErrorSelector: (state) => state.ordersByNumberError
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError = action.error.message ?? null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(setOrder.pending, (state) => {
        state.isOrderCreating = true;
        state.newOrderError = null;
      })
      .addCase(setOrder.rejected, (state, action) => {
        state.isOrderCreating = false;
        state.newOrderError = action.error.message ?? null;
      })
      .addCase(setOrder.fulfilled, (state, action) => {
        state.isOrderCreating = false;
        state.newOrder = action.payload.order;
        state.newOrderName = action.payload.name;
        state.newOrderError = null;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrdersByNumberLoading = true;
        state.ordersByNumber = [];
        state.ordersByNumberError = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrdersByNumberLoading = false;
        state.ordersByNumberError = action.error.message ?? null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrdersByNumberLoading = false;
        state.ordersByNumber = action.payload.orders;
        state.ordersByNumberError = null;
      });
  }
});

export const {
  getOrdersSelector,
  getIsOrdersLoadingSelector,
  getOrdersErrorSelector,
  getNewOrderSelector,
  getNewOrderNameSelector,
  getIsOrderCreatingSelector,
  getNewOrderErrorSelector,
  getOrdersByNumberSelector,
  getIsOrdersByNumberLoadingSelector,
  getOrdersByNumberErrorSelector
} = ordersSlice.selectors;

export const { clearNewOrder, clearOrderByNumber } = ordersSlice.actions;
