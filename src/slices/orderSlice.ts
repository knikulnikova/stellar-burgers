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
    }
  },
  selectors: {
    getOrdersSelector: (state) => ({
      orders: state.orders,
      isOrdersLoading: state.isOrdersLoading,
      error: state.ordersError
    }),
    getNewOrderSelector: (state) => ({
      order: state.newOrder,
      orderName: state.newOrderName,
      isOrderCreating: state.isOrderCreating,
      error: state.newOrderError
    }),
    getOrderByNumberSelector: (state) => ({
      order: state.ordersByNumber,
      isOrdersByNumberLoading: state.isOrdersByNumberLoading,
      error: state.ordersByNumberError
    })
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
  getNewOrderSelector,
  getOrderByNumberSelector
} = ordersSlice.selectors;

export const { clearNewOrder } = ordersSlice.actions;
