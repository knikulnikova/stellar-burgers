import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorBurgerState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorBurgerState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    setBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (bun: TIngredient) => {
        const id = nanoid();
        return { payload: { ...bun, id } };
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{
        index: number;
        direction: 'up' | 'down';
      }>
    ) => {
      //Получаем новый индекс в массиве
      const newIndex =
        action.payload.direction === 'up'
          ? action.payload.index - 1
          : action.payload.index + 1;

      const temp = state.ingredients[action.payload.index];
      state.ingredients[action.payload.index] = state.ingredients[newIndex];
      state.ingredients[newIndex] = temp;
    },

    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  },
  selectors: {
    getConstructorItems: (state) => state
  }
});

export const {
  addIngredient,
  setBun,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const { getConstructorItems } = constructorSlice.selectors;
