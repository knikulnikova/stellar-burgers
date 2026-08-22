import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from '../slices/ingredientSlice';
import { feedsSlice } from '../slices/feedSlice';
import { ordersSlice } from '../slices/orderSlice';
import { userSlice } from '../slices/userSlice';
import { constructorSlice } from '../slices/constructorSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  feedsSlice,
  ordersSlice,
  userSlice,
  constructorSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
