import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedsLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isFeedsLoading: false,
  error: null
};

//Общая лента заказов
export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getFeedsSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  }
});

export const { getFeedsSelector } = feedsSlice.selectors;
