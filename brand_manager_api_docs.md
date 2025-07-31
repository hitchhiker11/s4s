# 🏷️ Документация API управления брендами

## Описание

REST API для автоматизации управления брендами в 1С Битрикс. Система автоматически создает элементы в справочнике брендов на основе уникальных значений свойства товаров и связывает товары с созданными брендами.

## 🎯 Назначение

**Проблема:** У товаров в каталоге есть текстовое свойство `BREND`, но нет связи со справочником брендов через свойство `BRAND_ELEMENT`.

**Решение:** API автоматически:
1. Извлекает уникальные значения брендов из каталога
2. Создает элементы в справочнике брендов
3. Связывает товары с созданными брендами
4. Поддерживает консистентность данных

## 📋 Endpoints

### `POST /api/brand-manager`
**Основной метод для управления брендами**

### `GET /api/brand-manager/status`  
**Проверка состояния системы брендов**

### `GET /api/brand-manager/report`
**Отчет о последней операции**

### `DELETE /api/brand-manager/cleanup`
**Очистка несвязанных брендов**

---

## 🔧 POST /api/brand-manager

### Параметры запроса

#### Основные параметры
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `action` | string | `sync` | Тип операции: `sync`, `create`, `update`, `check` |
| `catalog_iblock_id` | integer | `21` | ID инфоблока каталога товаров |
| `brands_iblock_id` | integer | `22` | ID инфоблока справочника брендов |

#### Настройки свойств
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `brand_property` | string | `BREND` | Код свойства бренда в каталоге |
| `brand_element_property` | string | `BRAND_ELEMENT` | Код свойства связи с элементом бренда |

#### Опции выполнения
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `force_update` | string | `N` | Принудительное обновление существующих брендов |
| `dry_run` | string | `N` | Тестовый режим без изменений |
| `link_products` | string | `Y` | Связывать товары с брендами |
| `with_logging` | string | `Y` | Детальное логирование |
| `batch_size` | integer | `100` | Размер пакета обработки (10-1000) |

### Типы операций (action)

#### `sync` - Полная синхронизация (по умолчанию)
- Создает отсутствующие бренды
- Связывает товары с брендами  
- Комплексная операция

#### `create` - Только создание брендов
- Создает элементы брендов без связывания товаров
- Быстрая операция

#### `update` - Обновление существующих
- Обновляет данные существующих брендов
- Работает как `force_update=Y`

#### `check` - Проверка консистентности
- Анализирует состояние системы
- Не выполняет изменений
- Возвращает статистику и рекомендации

### Примеры запросов

#### Полная синхронизация
```bash
curl -X POST "https://yoursite.com/api/brand-manager" \
  -H "Content-Type: application/json" \
  -d '{"action": "sync"}'
```

#### Тестовый запуск
```bash
curl -X POST "https://yoursite.com/api/brand-manager" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sync",
    "dry_run": "Y",
    "with_logging": "Y"
  }'
```

#### Принудительное обновление
```bash
curl -X POST "https://yoursite.com/api/brand-manager" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sync",
    "force_update": "Y",
    "batch_size": 50
  }'
```

#### Проверка консистентности
```bash
curl -X POST "https://yoursite.com/api/brand-manager" \
  -H "Content-Type: application/json" \
  -d '{"action": "check"}'
```

### Структура ответа

#### Успешная синхронизация
```json
{
  "status": "success",
  "action": "sync",
  "meta": {
    "execution_time": 2.847,
    "timestamp": "2024-01-15 14:30:25",
    "dry_run": false,
    "catalog_iblock_id": 21,
    "brands_iblock_id": 22
  },
  "results": {
    "brands": {
      "total_processed": 25,
      "created": 15,
      "updated": 3,
      "skipped": 7,
      "errors_count": 0,
      "details": {
        "created": [
          {"id": 1001, "name": "Apple", "code": "apple", "action": "created"},
          {"id": 1002, "name": "Samsung", "code": "samsung", "action": "created"}
        ],
        "updated": [
          {"id": 1003, "name": "Sony", "code": "sony", "action": "updated"}
        ],
        "skipped": ["Nokia", "LG", "Xiaomi"],
        "errors": []
      }
    },
    "products": {
      "total_processed": 1250,
      "linked": 1180,
      "already_linked": 45,
      "errors": 25,
      "unlinked": 0
    }
  },
  "recommendations": [
    "25 товаров не удалось связать с брендами",
    "Рекомендуется проверить корректность данных"
  ]
}
```

#### Проверка консистентности
```json
{
  "status": "success", 
  "action": "check",
  "meta": {
    "catalog_iblock_id": 21,
    "brands_iblock_id": 22
  },
  "statistics": {
    "catalog_products": 1250,
    "unique_brands_in_catalog": 25,
    "brands_in_directory": 23,
    "linked_products": 1180,
    "unlinked_products": 70,
    "orphaned_brands": 2,
    "consistency_score": 94.4
  },
  "recommendations": [
    "Система работает корректно",
    "Найдено 2 неиспользуемых бренда. Рекомендуется очистка"
  ]
}
```

---

## 📊 GET /api/brand-manager/status

### Описание
Получение текущего состояния системы брендов без выполнения изменений.

### Параметры
Те же параметры конфигурации, что и в POST-методе (опционально).

### Пример запроса
```bash
curl -X GET "https://yoursite.com/api/brand-manager/status"
```

### Структура ответа
```json
{
  "status": "success",
  "system_info": {
    "catalog_iblock_id": 21,
    "brands_iblock_id": 22,
    "brand_property": "BREND",
    "brand_element_property": "BRAND_ELEMENT"
  },
  "statistics": {
    "catalog_products": 1250,
    "brands_in_directory": 23,
    "linked_products": 1180,
    "consistency_score": 94.4
  },
  "health_check": {
    "catalog_iblock_exists": true,
    "brands_iblock_exists": true,
    "brand_property_exists": true,
    "brand_element_property_exists": true
  }
}
```

---

## 📄 GET /api/brand-manager/report

### Описание
Получение отчета о последней выполненной операции.

### Пример запроса
```bash
curl -X GET "https://yoursite.com/api/brand-manager/report"
```

### Структура ответа
```json
{
  "message": "Report functionality not implemented yet",
  "suggestion": "Check logs at /local/logs/brand_manager.log"
}
```

---

## 🗑️ DELETE /api/brand-manager/cleanup

### Описание
Удаление брендов, которые не связаны ни с одним товаром.

### Параметры
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `brands_iblock_id` | integer | `22` | ID инфоблока справочника брендов |
| `catalog_iblock_id` | integer | `21` | ID инфоблока каталога |
| `brand_element_property` | string | `BRAND_ELEMENT` | Код свойства связи |
| `dry_run` | string | `N` | Тестовый режим |

### Пример запроса
```bash
curl -X DELETE "https://yoursite.com/api/brand-manager/cleanup" \
  -H "Content-Type: application/json" \
  -d '{"dry_run": "Y"}'
```

### Структура ответа
```json
{
  "status": "success",
  "action": "cleanup", 
  "results": {
    "orphaned_found": 5,
    "deleted": 3,
    "errors": 2
  },
  "details": {
    "deleted_brands": [
      {"ID": "1010", "NAME": "Discontinued Brand 1"},
      {"ID": "1011", "NAME": "Discontinued Brand 2"}
    ],
    "errors": [
      {
        "brand_id": "1012",
        "brand_name": "Protected Brand",
        "error": "Cannot delete protected element"
      }
    ]
  }
}
```

---

## 🔄 Сценарии использования

### Первоначальная настройка
```bash
# 1. Проверяем состояние системы
curl -X GET "/api/brand-manager/status"

# 2. Тестовый запуск
curl -X POST "/api/brand-manager" -d '{"action": "sync", "dry_run": "Y"}'

# 3. Полная синхронизация
curl -X POST "/api/brand-manager" -d '{"action": "sync"}'
```

### Регулярное обслуживание
```bash
# 1. Проверка консистентности
curl -X POST "/api/brand-manager" -d '{"action": "check"}'

# 2. Обновление при необходимости
curl -X POST "/api/brand-manager" -d '{"action": "update"}'

# 3. Очистка неиспользуемых брендов
curl -X DELETE "/api/brand-manager/cleanup"
```

### Восстановление после ошибок
```bash
# 1. Принудительная синхронизация
curl -X POST "/api/brand-manager" -d '{
  "action": "sync",
  "force_update": "Y",
  "batch_size": 50
}'

# 2. Проверка результата
curl -X POST "/api/brand-manager" -d '{"action": "check"}'
```

## 📋 Логирование

### Файлы логов
- **Операции:** `/local/logs/brand_manager.log`
- **Ошибки:** `/local/logs/brand_manager_errors.log`

### Пример записи лога операции
```json
{
  "timestamp": "2024-01-15 14:30:25",
  "type": "brand_created", 
  "action": "sync",
  "dry_run": false,
  "data": {
    "id": 1001,
    "name": "Apple",
    "code": "apple",
    "action": "created"
  }
}
```

### Пример записи лога ошибки
```json
{
  "timestamp": "2024-01-15 14:30:30",
  "error": "Failed to create brand: Duplicate entry",
  "file": "/path/to/brandmanager.php",
  "line": 245,
  "context": {
    "brand": "Samsung"
  },
  "action": "sync"
}
```

## ⚠️ Ограничения и рекомендации

### Производительность
- **Максимальный batch_size:** 1000
- **Рекомендуемый batch_size:** 100
- **Timeout:** 300 секунд
- **Memory limit:** 512MB

### Безопасность
- Используйте `dry_run=Y` перед реальными операциями
- Проверяйте логи после выполнения
- Делайте резервные копии перед массовыми операциями

### Мониторинг
```bash
# Проверка консистентности каждые 4 часа
*/0 4 * * * curl -s -X POST "yoursite.com/api/brand-manager" -d '{"action":"check"}' >> /var/log/brand_check.log

# Еженедельная очистка
0 2 * * 0 curl -s -X DELETE "yoursite.com/api/brand-manager/cleanup" >> /var/log/brand_cleanup.log
```

## 🚨 Коды ошибок

| Код | Описание | Решение |
|-----|----------|---------|
| 400 | Неверные параметры | Проверьте корректность переданных параметров |
| 403 | Native routes отключены | Включите `useNativeRoute` в конфигурации |
| 404 | Инфоблок не найден | Проверьте существование инфоблоков |
| 500 | Внутренняя ошибка | Проверьте логи ошибок |

## 🛠️ Диагностика проблем

### Проблема: "Brand property not found"
```bash
# Проверьте существование свойства
SELECT * FROM b_iblock_property 
WHERE IBLOCK_ID = 21 AND CODE = 'BREND';
```

### Проблема: "No brands found in catalog"
```bash
# Проверьте значения свойства
SELECT pev.VALUE, COUNT(*) as cnt 
FROM b_iblock_property_enum pev
JOIN b_iblock_property p ON p.ID = pev.PROPERTY_ID
WHERE p.IBLOCK_ID = 21 AND p.CODE = 'BREND'
GROUP BY pev.VALUE;
```

### Проблема: Низкий consistency_score
1. Запустите `action=check` для анализа
2. Выполните `action=sync` с `force_update=Y`
3. Проверьте логи на наличие ошибок

---

## 💡 Примеры интеграции

### PHP
```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://yoursite.com/api/brand-manager");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'action' => 'sync',
    'dry_run' => 'N'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$result = json_decode($response, true);
curl_close($ch);

if ($result['status'] === 'success') {
    echo "Синхронизация завершена успешно!\n";
    echo "Создано брендов: " . $result['results']['brands']['created'] . "\n";
    echo "Связано товаров: " . $result['results']['products']['linked'] . "\n";
}
?>
```

### JavaScript
```javascript
async function syncBrands() {
  try {
    const response = await fetch('/api/brand-manager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'sync',
        batch_size: 100
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('Синхронизация завершена:', result);
    }
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
  }
}
```

---

**🎉 API готов к использованию!** 

Начните с проверки статуса системы, затем выполните тестовую синхронизацию с `dry_run=Y`, и после этого запустите полную синхронизацию. 