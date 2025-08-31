# Руководство по интеграции форм с бэкендом

## Обзор

Интегрированы три модальных окна с бэкендом Bitrix для отправки данных форм в соответствующие инфоблоки:

1. **RequestModal** - Форма оформления заявки (ID инфоблока: 24)
2. **ContactsModal** - Форма заказа звонка (ID инфоблока: 23)  
3. **PreOrderModal** - Форма предзаказа (ID инфоблока: 25)

## API Endpoints

### Базовый endpoint
```
POST https://shop4shoot.com/api/form/?iblock_id={iblock_id}
```

### Структура запроса
```json
{
  "iblock_id": 24,
  "fields": {
    "field_name": "value",
    ...
  }
}
```

### Структура ответа
```json
{
  "success": true,
  "id": 8282,
  "message": "Заявка успешно создана"
}
```

## Формы и их поля

### 1. RequestModal (ID: 24)

**Обязательные поля:**
- `first_name` - Имя клиента
- `last_name` - Фамилия клиента  
- `phone_number` - Номер телефона
- `email` - Email клиента

**Необязательные поля:**
- `comment` - Комментарий клиента

**Пример использования:**
```javascript
import { submitRequestForm } from '../lib/api/bitrix';

const requestData = {
  first_name: 'Александр',
  last_name: 'Иванов',
  phone_number: '+79991234567',
  email: 'example@email.com',
  comment: 'Текст комментария'
};

try {
  const result = await submitRequestForm(requestData);
  if (result.success) {
    console.log('Заявка отправлена:', result.id);
  }
} catch (error) {
  console.error('Ошибка:', error.message);
}
```

### 2. ContactsModal (ID: 23)

**Обязательные поля:**
- `first_name` - Имя клиента
- `phone_number` - Номер телефона

**Пример использования:**
```javascript
import { submitCallbackForm } from '../lib/api/bitrix';

const callbackData = {
  first_name: 'Александр',
  phone_number: '+79991234567'
};

try {
  const result = await submitCallbackForm(callbackData);
  if (result.success) {
    console.log('Заявка на звонок отправлена:', result.id);
  }
} catch (error) {
  console.error('Ошибка:', error.message);
}
```

### 3. PreOrderModal (ID: 25)

**Обязательные поля:**
- `first_name` - Имя клиента
- `last_name` - Фамилия клиента
- `surname` - Отчество клиента
- `phone_number` - Номер телефона
- `email` - Email клиента

**Необязательные поля:**
- `comment` - Пожелания клиента
- `product_name` - Название товара
- `product_article` - Артикул товара
- `product_id` - Код товара

**Пример использования:**
```javascript
import { submitPreOrderForm } from '../lib/api/bitrix';

const preOrderData = {
  first_name: 'Александр',
  last_name: 'Иванов', 
  surname: 'Петрович',
  phone_number: '+79991234567',
  email: 'example@email.com',
  comment: 'Комментарий',
  product_name: 'Тестовый товар',
  product_article: 'TEST-001',
  product_id: '12345'
};

try {
  const result = await submitPreOrderForm(preOrderData);
  if (result.success) {
    console.log('Предзаказ оформлен:', result.id);
  }
} catch (error) {
  console.error('Ошибка:', error.message);
}
```

## Возможности модальных окон

### Валидация форм
- Автоматическая валидация обязательных полей
- Проверка формата email и телефона
- Отображение ошибок валидации под полями

### UX функции  
- Состояния загрузки во время отправки
- Toast уведомления об успехе/ошибке
- Автоматическое закрытие модалки после успешной отправки
- Блокировка полей во время отправки
- Очистка формы при закрытии модалки

### Адаптивность
- Полная поддержка мобильных устройств
- Адаптивная верстка
- Портал рендеринг для правильного отображения поверх всего контента

## Использование модальных окон

### RequestModal
```jsx
import RequestModal from './modals/RequestModal';

<RequestModal
  isOpen={isRequestModalOpen}
  onClose={() => setIsRequestModalOpen(false)}
  initialValues={{
    name: 'Предзаполненное имя',
    email: 'test@example.com'
  }}
/>
```

### ContactsModal  
```jsx
import ContactsModal from './modals/ContactsModal';

<ContactsModal
  isOpen={isContactsModalOpen}
  onClose={() => setIsContactsModalOpen(false)}
/>
```

### PreOrderModal
```jsx
import PreOrderModal from './modals/PreOrderModal';

<PreOrderModal
  isOpen={isPreOrderModalOpen}
  onClose={() => setIsPreOrderModalOpen(false)}
  productName="Название товара"
  productDescription="Описание товара"
  productId="12345"
  productArticle="ARTICLE-001"
/>
```

## Тестирование

Для тестирования создан компонент `FormsTestPage.js` в папке `components/debug/`.

### Запуск тестирования:
1. Добавьте `FormsTestPage` на любую страницу
2. Проверьте каждую форму на:
   - Валидацию полей
   - Отправку данных
   - Отображение уведомлений
   - Адаптивность

### Проверка в Network:
1. Откройте DevTools → Network
2. Заполните и отправьте форму
3. Проверьте запрос к `/api/form/?iblock_id={id}`
4. Убедитесь в правильной структуре запроса

## Обработка ошибок

Все API функции возвращают структурированные ошибки:

```javascript
try {
  const result = await submitForm(data);
} catch (error) {
  // error.message содержит локализованное сообщение об ошибке
  console.error('Ошибка отправки формы:', error.message);
}
```

## Добавленные API функции

В `lib/api/bitrix.js` добавлены:

- `submitForm(formData)` - базовая функция для отправки форм
- `submitRequestForm(requestData)` - для формы заявки  
- `submitCallbackForm(callbackData)` - для формы звонка
- `submitPreOrderForm(preOrderData)` - для формы предзаказа

## Переменные окружения

Убедитесь что в `.env` настроен правильный URL API:

```
NEXT_PUBLIC_BITRIX_URL=https://shop4shoot.com/api
``` 