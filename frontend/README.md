# React Frontend для Bitrix CMS

Этот проект представляет собой React-фронтенд для интернет-магазина на базе Bitrix CMS с использованием Next.js для серверного рендеринга и SEO-оптимизации.

## Особенности проекта

- **Next.js SSR** для SEO-критичных страниц (каталог, детальные страницы товаров)
- **React Query** для кэширования и управления состоянием
- **Styled Components** для стилизации компонентов
- **Интеграция с Bitrix** через существующие AJAX-обработчики

## Структура проекта

```
/frontend
├── src
│   ├── components       # Повторно используемые React-компоненты
│   ├── pages            # Маршруты Next.js
│   │   ├── catalog      # Страницы каталога
│   │   └── ...
│   ├── styles           # Глобальные стили
│   └── lib
│       ├── api.js       # AJAX-клиент для взаимодействия с Bitrix
│       └── auth.js      # Управление сессиями и токенами Bitrix
└── public
    ├── bitrix           # Симлинк на существующие ассеты Bitrix
    └── images           # Статические изображения
```

## Требования

- Node.js 14+ и npm 7+
- Существующая установка Bitrix CMS с доступными AJAX-обработчиками
- Настроенные SEO-параметры в компонентах Bitrix

## Установка

1. Клонировать репозиторий:

```bash
git clone [url-репозитория]
cd frontend
```

2. Установить зависимости:

```bash
npm install
```

3. Создать файл `.env.local` и настроить переменные окружения:

```
NEXT_PUBLIC_BITRIX_URL=http://your-bitrix-site.com
```

## Разработка

Для запуска проекта в режиме разработки:

```bash
npm run dev
```

Проект будет доступен по адресу [http://localhost:3000](http://localhost:3000).

## Сборка и деплой

1. Сборка проекта:

```bash
npm run build
```

2. Запуск собранного проекта:

```bash
npm run start
```

## Интеграция с Bitrix

### AJAX-обработчики

Проект использует существующие AJAX-обработчики Bitrix:

- `/ajax/catalog/basketHandler.php` - для работы с корзиной
- `/ajax/getProductCountInBasket.php` - для получения количества товаров в корзине
- `/ajax/catalog/loadItems.php` - для загрузки списка товаров (должен быть создан)

### Сессии Bitrix

Для корректной работы с сессиями Bitrix используется перехватчик запросов, который добавляет токен сессии в каждый запрос:

```javascript
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && window.BX && window.BX.bitrix_sessid) {
    config.headers['X-Bitrix-Sessid'] = window.BX.bitrix_sessid();
  }
  return config;
});
```

## SEO-оптимизация

Для SEO-критичных страниц используется серверный рендеринг (SSR) с Next.js:

```javascript
export async function getServerSideProps(context) {
  // Получение данных от Bitrix для предварительного рендеринга
  const data = await catalogApi.getProducts(sectionId);
  
  return {
    props: {
      initialData: data,
    },
  };
}
```

## Тестирование

```bash
npm run test
```

## Лицензия

ISC 