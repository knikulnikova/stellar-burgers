import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type TIngredientsState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};
//Список ингредиентов
export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

export const { getIngredientsSelector } = ingredientsSlice.selectors;
