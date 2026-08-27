import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
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
  getIsOrderCreatingSelector,
  setOrder,
  clearNewOrder
} from '../../slices/orderSlice';
import { getIsAuthenticatedSelector } from '../../slices/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems: TConstructorBurgerState =
    useSelector(getConstructorItems);
  const orderRequest = useSelector(getIsOrderCreatingSelector);
  const orderModalData = useSelector(getNewOrderSelector);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const orderData = [];
    //Добавляем булочки
    orderData.push(constructorItems.bun._id);
    orderData.push(constructorItems.bun._id);
    //Добавляем остальные ингредиенты
    constructorItems.ingredients.forEach((ingredient) => {
      orderData.push(ingredient._id);
    });

    const result = await dispatch(setOrder(orderData));
    if (setOrder.fulfilled.match(result)) {
      dispatch(clearConstructor());
    }
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
