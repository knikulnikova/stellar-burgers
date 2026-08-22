import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  TConstructorBurgerState,
  clearConstructor
} from '../../slices/constructorSlice';
import {
  getNewOrderSelector,
  setOrder,
  clearNewOrder
} from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems: TConstructorBurgerState =
    useSelector(getConstructorItems);

  const {
    isOrderCreating: orderRequest,
    order: orderModalData,
    error: newOrderError
  } = useSelector(getNewOrderSelector);

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const orderData = [];
    //Добавляем булочки
    orderData.push(constructorItems.bun._id);
    orderData.push(constructorItems.bun._id);
    //Добавляем остальные ингредиенты
    constructorItems.ingredients.forEach((ingredient) => {
      orderData.push(ingredient._id);
    });

    dispatch(setOrder(orderData)).then(() => {
      if (!orderRequest && !newOrderError) {
        dispatch(clearConstructor());
      }
    });
  };
  const closeOrderModal = () => {
    dispatch(clearNewOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
