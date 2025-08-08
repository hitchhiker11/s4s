# Исправления для Safari WebKit - Swiper слайдеры

## Внесенные изменения

### 1. Обновление импортов и модулей

**Проблема**: Устаревший способ инициализации Swiper модулей через `SwiperCore.use()`

**Исправления**:
- Заменили `SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper'` на `{ Autoplay, Pagination, Navigation } from 'swiper/modules'`
- Удалили `SwiperCore.use([Autoplay, Pagination, Navigation])`
- Добавили `modules={[Autoplay, Pagination, Navigation]}` в props компонента Swiper

### 2. Добавлены CSS исправления для Safari WebKit

**Файлы изменены**:
- `frontend/src/styles/globals.css` - глобальные исправления
- `frontend/src/styles/safari-swiper-fixes.css` - специфичные исправления для Safari
- `frontend/src/pages/_app.js` - подключение новых стилей

**CSS исправления включают**:
- `transform: translate3d(0, 0, 0)` - принудительное ускорение GPU
- `backface-visibility: hidden` - устранение мерцания
- `transform-style: preserve-3d` - улучшение 3D трансформаций
- Исправления для изображений и touch events

### 3. Настройки Swiper для лучшей совместимости

**Добавленные параметры**:
- `speed={600}` - контролируемая скорость анимации
- `touchStartPreventDefault={false}` - улучшенная обработка touch events
- `simulateTouch={true}` - эмуляция touch на десктопе
- `allowTouchMove={true}` - разрешение свайпов
- `watchSlidesProgress={true}` - отслеживание прогресса слайдов
- `preloadImages={false}` - отключение предзагрузки для производительности
- `lazy={true}` - ленивая загрузка
- `observer={true}` - автоматическое обновление при изменениях DOM
- `observeParents={true}` - отслеживание изменений в родительских элементах

### 4. Оптимизации для производительности

**В styled-components добавлены**:
- CSS свойства для hardware acceleration
- Исправления для sub-pixel rendering
- Предотвращение image dragging и selection

## Тестирование

### Рекомендуемые проверки в Safari:

1. **Основная функциональность**:
   - Автопроигрывание слайдов
   - Навигация свайпами
   - Кнопки навигации (если используются)
   - Пагинация

2. **Производительность**:
   - Плавность анимаций
   - Отсутствие лагов при свайпах
   - Корректная загрузка изображений

3. **Responsive дизайн**:
   - Корректное отображение на разных размерах экрана
   - Работа в портретной и альбомной ориентации на мобильных

### Устройства для тестирования:
- iPhone (Safari iOS)
- iPad (Safari iPadOS)
- macOS Safari (последние версии)
- Старые версии Safari (если поддерживаются)

## Дополнительные рекомендации

### 1. Мониторинг производительности
```javascript
// Добавьте для отладки в development режиме
const swiperParams = {
  on: {
    slideChange: function () {
      console.log('Slide changed:', this.activeIndex);
    },
    touchStart: function () {
      console.log('Touch start');
    },
    touchEnd: function () {
      console.log('Touch end');
    }
  }
};
```

### 2. Lazy loading оптимизация
Для больших изображений рекомендуется:
```jsx
<img 
  src={slide.image} 
  loading="lazy"
  decoding="async"
  alt={`slide-${slide.id}`} 
/>
```

### 3. Content Security Policy
Если используется CSP, убедитесь что разрешены:
- `'unsafe-inline'` для стилей (или используйте nonce)
- `transform` и `translate3d` CSS свойства

### 4. Fallback для старых браузеров
```css
@supports not (transform: translate3d(0, 0, 0)) {
  .swiper-slide {
    /* Fallback стили для очень старых браузеров */
  }
}
```

## Возможные проблемы и решения

### Проблема: Слайдер не инициализируется
**Решение**: Проверьте что модули правильно импортированы и переданы в `modules` prop

### Проблема: Изображения мерцают
**Решение**: Убедитесь что CSS с `backface-visibility: hidden` применяется

### Проблема: Медленные анимации
**Решение**: Проверьте что `transform3d(0, 0, 0)` применяется к слайдам

### Проблема: Touch events не работают
**Решение**: Проверьте настройки `touchStartPreventDefault` и `simulateTouch`

## Контакты

При возникновении проблем обращайтесь к документации Swiper:
- https://swiperjs.com/swiper-api
- https://swiperjs.com/demos

Версия Swiper в проекте: 11.2.6