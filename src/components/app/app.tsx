import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { Preloader } from '@ui';

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  // const isIngredientsLoading = false;
  // const ingredients = [];
  // const error = null;

  const navigate = useNavigate();

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      <Routes>
        {backgroundLocation && (
          <>
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title={'Детали ингредиента'}
                  onClose={() => {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title={'Детали ингредиента'}
                  onClose={() => {
                    navigate(-1);
                  }}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal
                    title={'Детали ингредиента'}
                    onClose={() => {
                      navigate(-1);
                    }}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>
    </div>

    // <div className={styles.app}>
    //   <AppHeader />
    //   {isIngredientsLoading ? (
    //     <Preloader />
    //   ) : error ? (
    //     <div className={`${styles.error} text text_type_main-medium pt-4`}>
    //       {error}
    //     </div>
    //   ) : ingredients.length > 0 ? (
    //     <ConstructorPage />
    //   ) : (
    //     <div className={`${styles.title} text text_type_main-medium pt-4`}>
    //       Нет игредиентов
    //     </div>
    //   )}
    // </div>
  );
};

export default App;
