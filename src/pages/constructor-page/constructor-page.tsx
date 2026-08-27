import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { getIngredientsSelector } from '../../slices/ingredientSlice';

export const ConstructorPage: FC = () => {
  const { ingredients, isIngredientsLoading, error } = useSelector(
    getIngredientsSelector
  );

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {isIngredientsLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <BurgerIngredients />
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет игредиентов
          </div>
        )}
        <BurgerConstructor />
      </div>
    </main>
  );
};
