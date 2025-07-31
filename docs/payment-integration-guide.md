# 🚀 Исправленная интеграция с системой оплаты Битрикс

## ✅ Что было исправлено

Система теперь использует **правильный API Битрикс** для получения ссылок и форм оплаты вместо самодельной генерации URL.

### 🔧 Изменения в бэкенде (`OrderNew.php`)

#### Было (неправильно):
```php
// Самодельная генерация URL Робокассы
$directPaymentUrl = $this->buildRobokassaUrl($payment, $service);
```

#### Стало (правильно):
```php
// Использование родного API Битрикс
$paySystemService = PaySystem\Manager::getObjectById($payment->getPaymentSystemId());

if ($paySystemService->getField('NEW_WINDOW') === 'N') {
    // Форма оплаты для встраивания
    $initResult = $paySystemService->initiatePay(
        $payment, 
        $context->getRequest(), 
        PaySystem\BaseServiceHandler::STRING
    );
    $paymentForm = $initResult->getTemplate();
} else {
    // Прямая ссылка для редиректа
    $initResult = $paySystemService->initiatePay(
        $payment, 
        $context->getRequest(), 
        PaySystem\BaseServiceHandler::CURL
    );
    $directPaymentUrl = $initResult->getTemplate();
}
```

### 🎯 Новый формат ответа API

```json
{
  "success": true,
  "data": {
    "order_id": 318,
    "payment_id": 42,
    "payment_system": "Банковская карта",
    "payment_system_id": 3,
    "amount": 1500.00,
    "currency": "RUB",
    "payment_form": "<form>...</form>",           // Если NEW_WINDOW='N'
    "direct_payment_url": "https://...",          // Если NEW_WINDOW='Y'
    "new_window": true                            // Флаг открытия в новом окне
  }
}
```

---

## 🌐 Изменения во фронтенде

### 🔄 Улучшенная обработка оплаты

```javascript
const handlePayment = async () => {
  const response = await getPaymentForm(order_id);
  const { payment_form, direct_payment_url, new_window } = response.data;
  
  if (direct_payment_url) {
    // Прямой редирект (например, Робокасса)
    if (new_window) {
      window.open(direct_payment_url, '_blank');
    } else {
      window.location.href = direct_payment_url;
    }
  } else if (payment_form) {
    // Встроенная форма оплаты
    const formContainer = document.createElement('div');
    formContainer.innerHTML = payment_form;
    document.body.appendChild(formContainer);
    
    const form = formContainer.querySelector('form');
    if (form) {
      if (new_window) form.target = '_blank';
      form.submit();
    }
  }
};
```

### 🐛 Отладочная информация

В `development` режиме на странице оплаты показывается полная отладочная информация:

```javascript
{process.env.NODE_ENV === 'development' && (
  <div style={{ /* debug styles */ }}>
    <strong>Debug Info:</strong>
    <pre>{JSON.stringify(orderData, null, 2)}</pre>
  </div>
)}
```

---

## 📋 Поддерживаемые платежные системы

### 🏦 Робокасса (ID: 3)
- **NEW_WINDOW**: обычно `'Y'` 
- **Тип**: `direct_payment_url`
- **Поведение**: Прямой редирект на auth.robokassa.ru

### 💳 Другие системы
- **NEW_WINDOW**: может быть `'Y'` или `'N'`
- **Тип**: `payment_form` или `direct_payment_url`
- **Поведение**: В зависимости от настроек платежной системы

---

## 🧪 Тестирование

### 1. Тестовая страница: `/test-payment`

Позволяет протестировать:
- ✅ Email-ссылки `/cart/?order_id=XXX`
- ✅ Прямые ссылки `/payment?order_id=XXX`
- ✅ Разные типы платежных систем

### 2. Проверка работы API

```bash
# Статус заказа
GET /api/order?action=get_status&order_id=318

# Форма оплаты
GET /api/order?action=get_payment_form&order_id=318
```

### 3. Проверка логов

В `development` режиме все отладочные данные выводятся в:
- Консоль браузера
- Debug секция на странице оплаты
- Логи API контроллера

---

## 🔍 Диагностика проблем

### Проблема: "Платежная система не найдена"
```
Проверьте ID платежной системы в заказе:
$order->getPaymentCollection()->current()->getPaymentSystemId()
```

### Проблема: "Ошибка получения формы оплаты"
```
Проверьте настройки платежной системы в админке Битрикс:
/bitrix/admin/sale_pay_system.php
```

### Проблема: "Форма оплаты не найдена"
```
Проверьте NEW_WINDOW настройку:
- NEW_WINDOW='Y' → direct_payment_url
- NEW_WINDOW='N' → payment_form
```

---

## 🎯 Преимущества новой реализации

### ✅ Надежность
- Использует родной API Битрикс
- Автоматическая поддержка всех платежных систем
- Правильная обработка подписей и параметров

### ✅ Универсальность  
- Поддержка форм и прямых ссылок
- Обработка разных режимов окон
- Совместимость со всеми обработчиками

### ✅ Масштабируемость
- Легко добавлять новые платежные системы
- Автоматическая обработка новых типов
- Минимальные изменения при обновлениях

---

## 📞 Поддержка

Если возникают проблемы:

1. **Проверьте логи** в debug режиме
2. **Убедитесь** что платежная система настроена в Битрикс
3. **Протестируйте** на `/test-payment`
4. **Обратитесь** к документации: `/docs/payment-flow.md`

---

*Обновлено: 2024-01-15*  
*Версия: 2.0 (исправленная)* 