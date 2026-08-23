import { useSelector } from '../../services/store';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../slices/userSlice';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  // получениe состояния загрузки пользователя
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  // получение пользователя из store
  const user = useSelector(getUserSelector);

  // пока идёт чекаут пользователя , показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }
  // если маршрут для авторизованного пользователя, но пользователь не авторизован, то делаем редирект
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // если маршрут для неавторизованного пользователя, но пользователь авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
