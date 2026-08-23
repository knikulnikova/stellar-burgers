import { FC } from 'react';
import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { getUserSelector } from '../../slices/userSlice';

export const AppHeader: FC = () => {
  const data = useSelector(getUserSelector);
  return <AppHeaderUI userName={data?.name} />;
};
