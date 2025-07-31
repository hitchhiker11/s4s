# CategoryGridWrapper - Строгая 6-колоночная система

Компонент для отображения карточек категорий с **математически точным** позиционированием в 6-колоночной сетке CSS Grid.

## 🚨 ИСПРАВЛЕННЫЕ ПРОБЛЕМЫ

### ДО (проблемы):
- ❌ Две карточки смыкались в пропорции 2:1 вместо 50/50
- ❌ Одинокая карточка не растягивалась на всю ширину
- ❌ Непостоянный gap: 12px → 16px → 20px → 23px
- ❌ Сложная логика с множественными обертками

### ПОСЛЕ (решения):
- ✅ Две карточки строго по 50% (span 3 каждая)
- ✅ Одинокая карточка занимает 100% ширины (span 6)
- ✅ **СТРОГО 12px gap везде** на всех экранах
- ✅ Простая и понятная логика позиционирования

## 🔧 СТРОГИЕ ПРАВИЛА 6-КОЛОНОЧНОЙ СИСТЕМЫ

### CSS Grid база:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px; /* СТРОГО 12px везде */
}
```

### Размеры карточек:
- **span 2**: стандартная карточка (33.33% ширины)
- **span 3**: расширенная карточка (50% ширины) 
- **span 6**: полная ширина (100%)

### Алгоритм позиционирования:

| Количество | Раскладка | CSS правила |
|------------|-----------|-------------|
| **1 карточка** | Полная ширина | `grid-column: span 6` |
| **2 карточки** | По 50% каждая | `grid-column: span 3` |
| **3 карточки** | По 33.33% каждая | `grid-column: span 2` |
| **4 карточки** | 3×span2 + 1×span6 | Строка 1: `span 2` × 3<br/>Строка 2: `span 6` |
| **5 карточек** | 3×span2 + 2×span3 | Строка 1: `span 2` × 3<br/>Строка 2: `span 3` × 2 |
| **6 карточек** | 2 ряда по 3 карточки | `span 2` все карточки |
| **7 карточек** | 6×span2 + 1×span6 | Строки 1-2: `span 2` × 6<br/>Строка 3: `span 6` |
| **8 карточек** | 6×span2 + 2×span3 | Строки 1-2: `span 2` × 6<br/>Строка 3: `span 3` × 2 |
| **9+ карточек** | Алгоритм | Полные строки × 3 + остаток по правилам |

## 📱 Адаптивность

### Мобильная версия (до lg):
- Простая сетка: `grid-template-columns: repeat(3, 1fr)`
- Gap: 12px
- Автоматическое размещение карточек

### Десктопная версия (lg+):
- **СТРОГАЯ 6-колоночная система**
- Gap: 12px
- Точное позиционирование через `grid-column` и `grid-row`

## 🎯 Использование

### Базовое использование:
```jsx
import CategoryGridWrapper from '../components/CategoryGridWrapper';

const categories = [
  { id: 1, name: 'Категория 1', link: '/cat1', imageUrl: '/img1.jpg' },
  { id: 2, name: 'Категория 2', link: '/cat2', imageUrl: '/img2.jpg' },
];

<CategoryGridWrapper categories={categories} />
```

### С карточкой "Все товары":
```jsx
const allProductsCard = {
  id: 'all',
  name: 'Все товары',
  link: '/catalog/all',
  isAllProducts: true
};

<CategoryGridWrapper 
  categories={categories} 
  allProductsCard={allProductsCard}
/>
```

## 🧮 Математика позиционирования

### Функции расчета:

#### `getGridColumn(index, totalCount)`
Возвращает правильное значение `grid-column` для каждой карточки:
- Анализирует общее количество карточек
- Применяет строгие правила позиционирования
- Возвращает: `'span 2'`, `'span 3'`, или `'span 6'`

#### `getGridRow(index, totalCount)`
Возвращает `grid-row` только когда необходимо явное указание:
- Для случаев с переносом на новую строку
- Возвращает номер строки или `null`

### Примеры CSS вывода:

**2 карточки:**
```css
.card:nth-child(1) { grid-column: span 3; }
.card:nth-child(2) { grid-column: span 3; }
```

**4 карточки:**
```css
.card:nth-child(1) { grid-column: span 2; }
.card:nth-child(2) { grid-column: span 2; }
.card:nth-child(3) { grid-column: span 2; }
.card:nth-child(4) { grid-column: span 6; grid-row: 2; }
```

## 🔍 Структура данных

### Формат категории:
```javascript
{
  id: string|number,
  name: string,
  title?: string,        // fallback: name
  link: string,
  imageUrl?: string,
  image?: string,        // fallback: imageUrl
  isAllProducts?: boolean
}
```

### Props компонента:
```typescript
interface CategoryGridWrapperProps {
  categories: Category[];
  allProductsCard?: Category | null;
}
```

## 📊 Демо и тестирование

Для тестирования всех сценариев используйте:
```bash
# Запуск demo страницы
npm run dev
# Перейдите к /components/CategoryGridWrapper/demo
```

Demo позволяет тестировать:
- ✅ 1-10+ карточек
- ✅ С карточкой "Все товары" и без
- ✅ Все breakpoint'ы
- ✅ Правильность позиционирования

## 🎨 Кастомизация

### Стили карточки "Все товары":
```javascript
const isAllProducts = category.isAllProducts;
const additionalStyles = {
  maxWidth: '260px',
  ...(isAllProducts ? {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontWeight: 700,
  } : {}),
};
```

### Изменение gap'а:
**ВНИМАНИЕ**: Gap строго зафиксирован на 12px. Изменение требует обновления в:
- `GridContainer` styled-component
- Все медиа-запросы
- Соответствующие компоненты слайдеров

## 🏗️ Архитектура

### Преимущества новой системы:
1. **Простота**: Одна функция для расчета позиций
2. **Предсказуемость**: Строгие правила без исключений
3. **Производительность**: Нет лишних DOM элементов
4. **Мaintainability**: Понятная логика без магических чисел

### Замененные компоненты:
- ❌ `SingleCardWrapper`
- ❌ `DoubleCardWrapperFirst/Second`
- ❌ Сложная функция `getDesktopLayout`
- ❌ Множественные обертки для мобильной версии

## 🧪 Тестовые кейсы

| Тест | Ожидаемый результат |
|------|---------------------|
| 1 карточка | span 6 (100% ширины) |
| 2 карточки | span 3 + span 3 (50% + 50%) |
| 3 карточки | span 2 × 3 (33.33% каждая) |
| Все сценарии | Строго 12px gap |
| Responsive | Корректная работа на всех экранах |

---

**Версия**: 2.0.0 (Строгая 6-колоночная система)
**Последнее обновление**: Исправление всех проблем позиционирования
**Совместимость**: React 17+, styled-components 5+ 