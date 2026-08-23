import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds, getFeedsSelector } from '../../slices/feedSlice';
import { getIngredientsSelector } from '../../slices/ingredientSlice';

export const Feed: FC = () => {
  const { orders, isFeedsLoading } = useSelector(getFeedsSelector);
  const { isIngredientsLoading } = useSelector(getIngredientsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (isFeedsLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <div>Нет заказов</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
