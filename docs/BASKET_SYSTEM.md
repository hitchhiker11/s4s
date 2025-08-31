# Система Корзины с fuser_id

## Обзор

Новая система корзины обеспечивает персистентность корзины пользователя между сессиями, используя `fuser_id` - уникальный идентификатор корзины, который хранится в localStorage браузера пользователя.

## Ключевые особенности

- **Долгосрочное хранение**: `fuser_id` хранится в localStorage на 365 дней по умолчанию
- **Автоматическая инициализация**: При первом посещении сайта автоматически создается новая корзина
- **Персистентность**: Корзина сохраняется между сессиями, сменой IP-адреса и т.д.
- **Автоматическое восстановление**: Если `fuser_id` истек или недоступен, создается новый

## Файлы системы

1. **`frontend/src/lib/basketUtils.js`** - Утилиты для работы с `fuser_id`
2. **`frontend/src/hooks/useBasket.js`** - Основной хук для работы с корзиной
3. **`frontend/src/lib/api/bitrix.js`** - API методы для работы с корзиной
4. **`frontend/src/components/BasketInitializer.js`** - Компонент автоматической инициализации

## Использование

### Основной хук useBasket

```javascript
import { useBasket } from '../hooks/useBasket';

const MyComponent = () => {
  const {
    basketItems,
    basketCount,
    addToBasket,
    removeFromBasket
  } = useBasket({
    initialFetch: true,
    autoInitialize: true
  });

  const handleAddProduct = async () => {
    await addToBasket({
      product_id: 123,
      quantity: 1
    });
  };

  return <button onClick={handleAddProduct}>Add to Basket</button>;
};
``` 