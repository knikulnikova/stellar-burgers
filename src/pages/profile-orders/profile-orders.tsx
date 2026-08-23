import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  getOrdersSelector,
  getIsOrdersLoadingSelector
} from '../../slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getOrdersSelector);
  const isOrdersLoading = useSelector(getIsOrdersLoadingSelector);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
