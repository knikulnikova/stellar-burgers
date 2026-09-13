import { test, expect } from '@playwright/test';

test('HAR-файл для ингредиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');
  // Проверяем, что ингредиенты загрузились
  await expect(page.getByTestId('burger_ingredients')).toBeVisible();
});

test.describe('Добавление ингредиентов из списка в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    // Воспроизводим записанный трафик ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  test('Добавление булочки в конструктор', async ({ page }) => {
    await page.goto('/');
    // Находим список ингредиентов
    const ingredients = page.getByTestId('burger_ingredients');
    await expect(ingredients).toBeVisible();
    // Находим булочку "Краторная булка N-200i"
    const bun = ingredients.getByRole('listitem').filter({
      hasText: 'Краторная булка N-200i'
    });
    // Добавляем булочку в конструктор
    await bun.getByRole('button', { name: 'Добавить' }).click();
    // Проверяем булочку в конструкторе
    await expect(page.getByTestId('burger_constructor')).toBeVisible();
    await expect(page.getByTestId('burger_constructor')).toContainText(
      'Краторная булка N-200i'
    );
  });

  test('Добавление начинок в конструктор', async ({ page }) => {
    await page.goto('/');
    // Находим список ингредиентов
    const ingredients = page.getByTestId('burger_ingredients');
    await expect(ingredients).toBeVisible();
    // Находим котлету "Биокотлета из марсианской Магнолии"
    const cutlet = ingredients.getByRole('listitem').filter({
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    await cutlet.getByRole('button', { name: 'Добавить' }).click();
    // Находим салат "Мини-салат Экзо-Плантаго"
    const salad = ingredients.getByRole('listitem').filter({
      hasText: 'Мини-салат Экзо-Плантаго'
    });
    await salad.getByRole('button', { name: 'Добавить' }).click();
    // Находим соус "Соус фирменный Space Sauce"
    const sauce = ingredients.getByRole('listitem').filter({
      hasText: 'Соус фирменный Space Sauce'
    });
    await sauce.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем ингредиенты в конструкторе
    await expect(page.getByTestId('burger_constructor')).toBeVisible();
    await expect(page.getByTestId('burger_constructor')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
    await expect(page.getByTestId('burger_constructor')).toContainText(
      'Мини-салат Экзо-Плантаго'
    );
    await expect(page.getByTestId('burger_constructor')).toContainText(
      'Соус фирменный Space Sauce'
    );
  });
});

test.describe('Тестирование работы модальных окон', () => {
  test.beforeEach(async ({ page }) => {
    // Воспроизводим записанный трафик ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  test('Открытие модального окна и закрытие по клику на крестик', async ({
    page
  }) => {
    await page.goto('/');
    // Находим список ингредиентов
    const ingredients = page.getByTestId('burger_ingredients');
    await expect(ingredients).toBeVisible();
    // Клик по карточке булки и проверка открытия модалки
    await ingredients
      .getByRole('listitem')
      .filter({
        hasText: 'Краторная булка N-200i'
      })
      .click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
    // Клик по крестику и проверка закрытия
    await modal.getByRole('button').click();
    await expect(modal).not.toBeVisible();
  });

  test('Открытие модального окна и закрытие по клику на оверлей', async ({
    page
  }) => {
    await page.goto('/');
    // Находим список ингредиентов
    const ingredients = page.getByTestId('burger_ingredients');
    await expect(ingredients).toBeVisible();
    // Клик по карточке булки и проверка открытия модалки
    await ingredients
      .getByRole('listitem')
      .filter({
        hasText: 'Краторная булка N-200i'
      })
      .click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
    // Клик по оверлею и проверка закрытия
    await page.getByTestId('modal_overlay').click({
      position: { x: 20, y: 20 }
    });
    await expect(modal).not.toBeVisible();
  });
});

test('HAR-файл для запроса данных пользователя', async ({ page, context }) => {
  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false
  });

  // Подкладываем в Cookies accessToken ДО открытия страницы
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  // Подкладываем в LocalStorage refreshToken ДО открытия страницы
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/profile');
  // Проверяем, что нас не выкинуло на логин
  await expect(page.getByText('Профиль')).toBeVisible();
});

test('HAR-файл для запроса создания заказа', async ({ page, context }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: false
  });

  // Подкладываем в Cookies accessToken ДО открытия страницы
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  // Подкладываем в LocalStorage refreshToken ДО открытия страницы
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');
  // Находим список ингредиентов
  const ingredients = page.getByTestId('burger_ingredients');
  await expect(ingredients).toBeVisible();
  // Создаем бургер
  const bun = ingredients.getByRole('listitem').filter({
    hasText: 'Краторная булка N-200i'
  });
  await bun.getByRole('button', { name: 'Добавить' }).click();
  const cutlet = ingredients.getByRole('listitem').filter({
    hasText: 'Биокотлета из марсианской Магнолии'
  });
  await cutlet.getByRole('button', { name: 'Добавить' }).click();
  // Оформляем заказ
  await page
    .getByTestId('burger_constructor')
    .getByRole('button', { name: 'Оформить заказ' })
    .click();
  //Проверяем, что модалка открылась и заказ оформлен
  await expect(page.getByTestId('order_number')).toBeVisible({
    timeout: 30000
  });
});

test('Оформление заказа', async ({ page, context }) => {
  // Воспроизводим записанный трафик
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: false
  });

  // Подкладываем в Cookies accessToken ДО открытия страницы
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  // Подкладываем в LocalStorage refreshToken ДО открытия страницы
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');
  // Находим список ингредиентов
  const ingredients = page.getByTestId('burger_ingredients');
  await expect(ingredients).toBeVisible();
  // Создаем бургер
  const bun = ingredients.getByRole('listitem').filter({
    hasText: 'Краторная булка N-200i'
  });
  await bun.getByRole('button', { name: 'Добавить' }).click();
  const cutlet = ingredients.getByRole('listitem').filter({
    hasText: 'Биокотлета из марсианской Магнолии'
  });
  await cutlet.getByRole('button', { name: 'Добавить' }).click();
  // Оформляем заказ
  await page
    .getByTestId('burger_constructor')
    .getByRole('button', { name: 'Оформить заказ' })
    .click();
  // Проверяем, что модалка открылась и заказ оформлен
  const modal = page.getByTestId('modal');
  await expect(modal).toBeVisible();
  await expect(page.getByTestId('order_number')).toBeVisible({
    timeout: 30000
  });
  // Проверям, что номер заказа верный
  await expect(page.getByTestId('order_number')).toContainText('110124');
  // Проверям, что конструктор пуст
  await expect(page.getByTestId('burger_constructor')).toContainText(
    'Выберите булки'
  );
  await expect(page.getByTestId('burger_constructor')).toContainText(
    'Выберите начинку'
  );
  // Проверям, что модальное окно закрывается
  await modal.getByRole('button').click();
  await expect(modal).not.toBeVisible();
});
