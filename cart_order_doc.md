# 📚 Документация API корзины

```markdown
# 🛒 API корзины для неавторизованных пользователей

## 🎯 Принцип работы

### Идентификация пользователя (FUSER_ID)
- **FUSER_ID** - уникальный идентификатор корзины неавторизованного пользователя
- Генерируется на основе: `session_id + user_agent + ip + timestamp`
- Сохраняется в сессии PHP: `$_SESSION['BX_SALE_FUSER']`
- **Создается напрямую в БД** через прямые SQL-запросы в таблицу `b_sale_fuser`
- Корзина сохраняется в `b_sale_basket` и доступна между сессиями

### Механизм персистентности
1. **Первичная идентификация**: При первом обращении создается FUSER_ID
2. **Сохранение сессии**: ID сохраняется в PHP session и cookie браузера
3. **Прямая связка с БД**: **Обход Sale событий** - запись напрямую в `b_sale_fuser` и `b_sale_basket`
4. **Восстановление**: При повторных запросах корзина загружается через `Sale\Basket::loadItemsForFUser()`

### ⚡ Технические решения
- **Обход SessionLocalStorageManager**: Избегание проблемных событий Sale модуля
- **Прямые SQL-запросы**: Сохранение элементов корзины без вызова `$basket->save()`
- **Дублирование в сессию**: Резервное хранение для надежности

## 📡 API Endpoints

### 🔍 Получение корзины
```http
GET /api/basket
```
**Параметры:**
- `format` *(опционально)* - формат ответа (`full`, `compact`)

**Ответ:**
```json
{
  "meta": {
    "fuser_id": 3118093150,
    "site_id": "s1", 
    "format": "full",
    "request_time": "2025-05-28 19:06:06"
  },
  "basket": {
    "items": [
      {
        "id": 1862,
        "product_id": 8193,
        "name": "Поло Eiger Tac Parabellum SS XL",
        "quantity": 2,
        "price": 3950,
        "total_price": 7900,
        "currency": "RUB",
        "weight": 0,
        "can_buy": true,
        "properties": []
      }
    ],
    "summary": {
      "count": 1,
      "quantity": 2,
      "total_price": 7900,
      "base_price": 7900,
      "weight": 0,
      "currency": "RUB",
      "fuser_id": 3118093150
    }
  }
}
```

### ➕ Добавление товара
```http
POST /api/basket
Content-Type: application/json

{
  "product_id": 8193,
  "quantity": 2,
  "properties": [
    {
      "CODE": "COLOR",
      "NAME": "Цвет", 
      "VALUE": "Красный"
    },
    {
      "CODE": "SIZE",
      "NAME": "Размер",
      "VALUE": "XL"
    }
  ]
}
```

**Поля:**
- `product_id` *(обязательно)* - ID товара из каталога
- `quantity` *(опционально, по умолчанию: 1)* - количество товара
- `properties` *(опционально)* - массив дополнительных свойств товара

**Ответ при успехе:**
```json
{
  "success": true,
  "message": "Товар добавлен в корзину",
  "data": {
    "success": true,
    "action": "added",
    "item": { 
      /* данные добавленного товара */ 
            "id": 1867,
            "product_id": 8193,
            "name": "Поло Eiger Tac Parabellum SS XL ASIA/L EUR (grey)",
            "quantity": 2,
            "price": 3950,
            "total_price": 7900,
            "currency": "RUB",
            "weight": "0.00",
            "can_buy": true,
            "properties": []
      },
    "basket_total": 
      { /* общая информация о корзине */ 
            "count": 1,
            "quantity": 2,
            "total_price": 7900,
            "base_price": 7900,
            "weight": 0,
            "currency": "RUB",
            "fuser_id": 3118093150
      }
  }
}

```

### ✏️ Обновление количества
```http
PATCH /api/basket
Content-Type: application/json

{
  "basket_item_id": 1862,
  "quantity": 3
}
```

**Поля:**
- `basket_item_id` *(обязательно)* - ID элемента в корзине
- `quantity` *(обязательно)* - новое количество (0 = удалить товар)

### ❌ Удаление товара
```http
DELETE /api/basket
Content-Type: application/json

{
  "basket_item_id": 1862
}
```

### 🧹 Очистка корзины
```http
DELETE /api/basket
Content-Type: application/json

{
  "clear_all": "Y"
}
```

## 🛍️ Создание заказа

### 📋 Оформление заказа
```http
POST /api/order_create
Content-Type: application/json

{
  "name": "Иван",
  "surname": "Петров", 
  "patronymic": "Сергеевич",
  "phone": "+7 (999) 123-45-67",
  "email": "ivan.petrov@example.com",
  "comment": "Доставить до 18:00",
  "payment_method": 1,
  "delivery_method": 1,
  "delivery_address": "г. Москва, ул. Ленина, д. 1, кв. 10"
}
```

**Обязательные поля:**
- `name` - имя покупателя
- `phone` - телефон (валидация на 11 цифр)
- `email` - email (валидация формата)

**Опциональные поля:**
- `surname` - фамилия
- `patronymic` - отчество  
- `comment` - комментарий к заказу
- `payment_method` - ID способа оплаты (по умолчанию: 1)
- `delivery_method` - ID способа доставки (по умолчанию: 1)
- `delivery_address` - адрес доставки

### Алгоритм создания заказа:
1. **Валидация данных**: Проверка обязательных полей и форматов
2. **Проверка корзины**: Корзина должна содержать товары
3. **Создание/поиск пользователя**: 
   - Поиск по email в `b_user`
   - Если не найден - создание нового через `CUser::Add()`
   - Генерация случайного пароля (8 символов)
   - Добавление в группу "Покупатели" (ID: 2)
4. **Создание заказа**: `Sale\Order::create($siteId, $userId)`
5. **Настройка заказа**:
   - Установка типа плательщика (физ.лицо)
   - Привязка корзины: `$order->setBasket($basket)`
   - Установка валюты и комментария
6. **Настройка доставки**: 
   - Создание отгрузки через `ShipmentCollection`
   - Использование EmptyDeliveryService при ошибках
7. **Настройка оплаты**: 
   - Создание платежа через `PaymentCollection`
   - Автовыбор первой доступной платежной системы
8. **Заполнение свойств заказа**:
   - Email, телефон, ФИО через `PropertyCollection`
   - Адрес доставки при наличии
9. **Сохранение**: `$order->doFinalAction(true)` → `$order->save()`
10. **Очистка**: Удаление временных данных из сессии

### Ответ при успешном создании:
```json
{
  "success": true,
  "message": "Заказ успешно создан",
  "data": {
    "order_id": 123,
    "order_number": "00000123", 
    "total_price": 7900,
    "currency": "RUB", 
    "user_id": 456,
    "payment_url": "/payment/pay.php?ORDER_ID=123&PAYMENT_ID=789"
  }
}
```

## 🔧 Технические особенности

### Архитектура решения
```
Запрос API → BasketBase → Прямые SQL → БД Битрикс
                ↓
         Обход Sale событий
                ↓ 
    Дублирование в PHP Session
```

### Обработка критических ошибок
- **SessionLocalStorageManager**: Полный обход через прямые SQL-запросы
- **FUSER создание**: Fallback механизм через `createFuserDirectly()`
- **Сохранение корзины**: Метод `saveBasketWithoutEvents()` избегает событий
- **Логирование**: Детальные логи в `/local/logs/fuser_debug.log`

### Безопасность
- **Валидация email**: `filter_var($email, FILTER_VALIDATE_EMAIL)`
- **Санитизация SQL**: `$DB->ForSQL()` для входящих данных
- **Ограничения**: Проверка существования товаров через каталог
- **Сессионная безопасность**: Уникальный FUSER на основе fingerprint'а

### Производительность  
- **Ленивая загрузка**: Корзина загружается только при обращении
- **Кеширование в объекте**: `$this->basket` на время запроса
- **Минимум SQL**: Оптимизированные запросы INSERT/UPDATE
- **Сессионное дублирование**: Быстрый доступ без обращения к БД

## 🚨 Диагностика проблем

### Проверка корзины не сохраняется
```bash
# Проверить логи FUSER
tail -f /local/logs/fuser_debug.log

# Проверить таблицы БД
SELECT * FROM b_sale_fuser WHERE SESSION_ID = 'session_id';
SELECT * FROM b_sale_basket WHERE FUSER_ID = 123;
```

### Товары исчезают после перезагрузки
1. **Проверить создание FUSER**: Лог должен содержать `real_fuser_id > 0`
2. **Проверить сессию**: `$_SESSION['BX_SALE_REAL_FUSER']` должен сохраняться
3. **Проверить cookies**: Браузер должен сохранять `PHPSESSID`

### Ошибки при создании заказа
- **Проверить способы доставки**: `SELECT * FROM b_sale_delivery;`
- **Проверить способы оплаты**: `SELECT * FROM b_sale_pay_system;`
- **Проверить свойства заказа**: Должны быть настроены для типа плательщика

## 📱 Тестирование

### Postman коллекция - Полный цикл
```javascript
// 1. Добавление товара
POST /api/basket
{
  "product_id": 8193,
  "quantity": 2
}

// 2. Проверка корзины  
GET /api/basket

// 3. Обновление количества
PATCH /api/basket  
{
  "basket_item_id": "{{item_id}}",
  "quantity": 3
}

// 4. Создание заказа
POST /api/order_create
{
  "name": "Test User",
  "phone": "+79991234567", 
  "email": "test@example.com"
}

// 5. Проверка очистки корзины
GET /api/basket
```

### Проверка персистентности
1. **Первая сессия**: Добавить товар → Получить FUSER_ID
2. **Закрыть браузер** (но сохранить cookie)  
3. **Новая сессия**: Открыть → Проверить корзину → Должна быть заполнена
4. **Проверить FUSER_ID**: Должен остаться тем же

### Нагрузочное тестирование
- **Множественные добавления**: 100+ товаров в корзину
- **Параллельные сессии**: Разные FUSER_ID не пересекаются
- **Очистка старых FUSER**: Автоочистка через 30 дней неактивности

## 🔗 Интеграция с фронтендом

### JavaScript SDK
```javascript
class BasketAPI {
  static baseURL = '/api';
  
  // Добавление товара
  static async addProduct(productId, quantity = 1, properties = []) {
    const response = await fetch(`${this.baseURL}/basket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        properties: properties
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  // Получение корзины
  static async getBasket() {
    const response = await fetch(`${this.baseURL}/basket`);
    return response.json();
  }
  
  // Обновление количества
  static async updateQuantity(basketItemId, quantity) {
    const response = await fetch(`${this.baseURL}/basket`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basket_item_id: basketItemId,
        quantity: quantity
      })
    });
    return response.json();
  }
  
  // Удаление товара
  static async removeItem(basketItemId) {
    const response = await fetch(`${this.baseURL}/basket`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basket_item_id: basketItemId
      })
    });
    return response.json();
  }
  
  // Создание заказа
  static async createOrder(userData) {
    const response = await fetch(`${this.baseURL}/order_create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
}

// Использование
try {
  const result = await BasketAPI.addProduct(8193, 2);
  console.log('Товар добавлен:', result);
} catch (error) {
  console.error('Ошибка:', error);
}
```

### React Hook для корзины
```javascript
import { useState, useEffect } from 'react';

export function useBasket() {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBasket = async () => {
    setLoading(true);
    try {
      const data = await BasketAPI.getBasket();
      setBasket(data.basket);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productId, quantity = 1) => {
    try {
      await BasketAPI.addProduct(productId, quantity);
      await loadBasket(); // Перезагружаем корзину
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBasket();
  }, []);

  return {
    basket,
    loading,
    error,
    addProduct,
    loadBasket
  };
}
```

### Хранение состояния
- **Основное хранение**: Автоматически в БД через FUSER_ID
- **Кеширование клиента**: localStorage для быстрого отображения счетчика
- **Синхронизация**: При загрузке страницы всегда запрашивать актуальную корзину
- **Offline handling**: Показ закешированных данных при отсутствии сети

## ⚙️ Администрирование

### Мониторинг корзин
```sql
-- Статистика активных корзин
SELECT 
  COUNT(*) as active_baskets,
  SUM(QUANTITY) as total_items,
  DATE(DATE_INSERT) as date
FROM b_sale_basket 
WHERE ORDER_ID IS NULL 
GROUP BY DATE(DATE_INSERT);

-- Старые неиспользуемые FUSER
SELECT * FROM b_sale_fuser 
WHERE DATE_UPDATE < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Очистка старых данных
```sql
-- Удаление корзин старше 30 дней
DELETE b FROM b_sale_basket b
JOIN b_sale_fuser f ON b.FUSER_ID = f.ID  
WHERE b.ORDER_ID IS NULL 
AND f.DATE_UPDATE < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Удаление неиспользуемых FUSER
DELETE FROM b_sale_fuser 
WHERE DATE_UPDATE < DATE_SUB(NOW(), INTERVAL 30 DAY)
AND ID NOT IN (SELECT DISTINCT FUSER_ID FROM b_sale_basket);
```

---
**Создано**: 28.05.2025  
**Версия**: 2.0 (Critical Fix Edition)  
**Статус**: ✅ Протестировано и работает
```
