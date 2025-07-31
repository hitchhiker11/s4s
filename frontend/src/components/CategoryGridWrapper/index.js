import React from 'react';
import styled from 'styled-components';
import CategoryCard from '../CategoryCard';
import { COLORS, mediaQueries } from '../../styles/tokens';

// Основная сетка с правильной адаптивной системой
const GridContainer = styled.div`
  display: grid;
  width: 100%;
  gap: 12px; /* СТРОГО 12px везде */
  margin-bottom: 24px;

  /* МОБИЛЬНАЯ версия: 6-колоночная система с умным позиционированием */
  grid-template-columns: repeat(6, 1fr);

  ${mediaQueries.sm} {
    gap: 16px; /* Сохраняем 16px */
    margin-bottom: 32px;
  }

  ${mediaQueries.lg} {
    /* ДЕСКТОПНАЯ версия: 4-колоночная система (как было изначально) */
    grid-template-columns: repeat(4, 1fr);
    gap: 16px; /* СТРОГО 16px */
    margin-bottom: 40px;
  }

  ${mediaQueries.xl} {
    gap: 16px; /* СТРОГО 16px */
  }
`;

// Обертка для правильного позиционирования карточек в grid
const CardGridWrapper = styled.div`
  /* МОБИЛЬНАЯ версия: 6-колоночная система с точным позиционированием */
  /* 🚨 ВАЖНО: СТРОГО ТОЛЬКО span 2, span 3, span 6! */
  grid-column: ${props => props.mobileGridColumn || 'span 2'};
  ${props => props.mobileGridRow ? `grid-row: ${props.mobileGridRow};` : ''}
  
  ${mediaQueries.lg} {
    /* ДЕСКТОПНАЯ версия: простой 4-колоночный грид */
    /* 🚨 КРИТИЧЕСКИ ВАЖНО: Переопределяем ВСЕ grid свойства */
    grid-column: ${props => props.desktopGridColumn || 'span 1'} !important;
    grid-row: auto !important; /* Принудительно убираем мобильный grid-row */
    /* Автоматическое размещение - CSS Grid сам определит позиции */
  }
  
  /* Обеспечиваем, что содержимое заполняет всю доступную ширину */
  width: 100%;
  height: 100%;
`;

// Стилизованная карточка "Все товары" с особыми стилями только на мобильной версии
const AllProductsCard = styled(CategoryCard)`
  /* Базовые стили */
  width: 100%;
  height: 100%;
  max-width: none;
  
  /* Особые стили только для мобильной версии (до lg) */
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-weight: 700;
  
  ${mediaQueries.lg} {
    /* На десктопе убираем особые стили - делаем как обычную карточку */
    background-color: transparent;
    color: inherit;
    font-weight: inherit;
  }
`;

/**
 * Вычисляет grid-column для МОБИЛЬНОЙ версии (6-колоночная система с умным позиционированием)
 * СТРОГОЕ ПРАВИЛО: Только span 2, span 3, span 6 - НИКОГДА НЕ span 1!
 * @param {number} index - индекс карточки (0-based)
 * @param {number} totalCount - общее количество карточек
 * @returns {string} - значение grid-column для мобильной версии
 */
const getMobileGridColumn = (index, totalCount) => {
  // 🚨 КРИТИЧЕСКИ ВАЖНО: ТОЛЬКО span 2, span 3, span 6!
  // НИКОГДА НЕ span 1 - это запрещено!
  
  let result;
  
  if (totalCount === 1) {
    // 1 карточка: полная ширина
    result = 'span 6';
  } else if (totalCount === 2) {
    // 2 карточки: каждая по 50% 
    result = 'span 3';
  } else if (totalCount === 3) {
    // 3 карточки: каждая по 33.33% - минимальная ширина!
    result = 'span 2';
  } else if (totalCount === 4) {
    // 4 карточки: 3×span2 в первой строке, 1×span6 во второй
    if (index < 3) {
      result = 'span 2';
    } else {
      result = 'span 6';
    }
  } else if (totalCount === 5) {
    // 5 карточек: 3×span2 в первой строке, 2×span3 во второй
    if (index < 3) {
      result = 'span 2';
    } else {
      result = 'span 3';
    }
  } else {
    // Для всех остальных случаев (6, 7, 8, 9+):
    // Группируем по 3 карточки в строку, каждая span 2
    const cardsPerRow = 3;
    const currentRow = Math.floor(index / cardsPerRow);
    const totalRows = Math.ceil(totalCount / cardsPerRow);
    const isLastRow = currentRow === totalRows - 1;
    const cardsInLastRow = totalCount % cardsPerRow;
    
    if (isLastRow) {
      if (cardsInLastRow === 1) {
        // Последняя одинокая карточка: на всю ширину
        result = 'span 6';
      } else if (cardsInLastRow === 2) {
        // Последние 2 карточки: по 50% каждая
        result = 'span 3';
      } else {
        // Последние 3 карточки: по 33.33% каждая (или полная строка)
        result = 'span 2';
      }
    } else {
      // Полные строки: всегда 3 карточки по span 2
      result = 'span 2';
    }
  }
  
  return result;
};

/**
 * Вычисляет grid-row для МОБИЛЬНОЙ версии (6-колоночная система)
 * @param {number} index - индекс карточки (0-based) 
 * @param {number} totalCount - общее количество карточек
 * @returns {string|null} - значение grid-row или null если не нужно
 */
const getMobileGridRow = (index, totalCount) => {
  // Для специальных случаев с явным указанием строки
  if (totalCount === 4 && index === 3) {
    return '2'; // последняя карточка во второй строке
  }
  
  if (totalCount === 5 && index >= 3) {
    return '2'; // последние 2 карточки во второй строке
  }
  
  // Для 6+ карточек используем новую логику группировки
  if (totalCount >= 6) {
    const cardsPerRow = 3;
    const currentRow = Math.floor(index / cardsPerRow);
    const totalRows = Math.ceil(totalCount / cardsPerRow);
    const isLastRow = currentRow === totalRows - 1;
    const cardsInLastRow = totalCount % cardsPerRow;
    
    // Явное указание строки нужно только для особых случаев в последней строке
    if (isLastRow && cardsInLastRow <= 2) {
      return `${currentRow + 1}`;
    }
  }
  
  // Для остальных случаев автоматическое размещение работает корректно
  return null;
};

/**
 * Вычисляет grid-column для ДЕСКТОПНОЙ версии (4-колоночная система)
 * @param {number} index - индекс карточки (0-based)
 * @param {number} totalCount - общее количество карточек
 * @returns {string} - значение grid-column для десктопной версии
 */
const getDesktopGridColumn = (index, totalCount) => {
  // ДЕСКТОПНАЯ версия: простой 4-колоночный грид
  // Все карточки одинакового размера, автоматическое заполнение по строкам
  
  // Каждая карточка занимает 1 колонку из 4
  // Автоматическое перенесение на новую строку каждые 4 карточки
  return 'span 1';
};

// Функция getDesktopGridRow удалена - для десктопа используем только автоматический flow

const CategoryGridWrapper = ({ categories = [], allProductsCard = null }) => {
  const allCategories = allProductsCard ? [allProductsCard, ...categories] : categories;
  const totalCards = allCategories.length;

  return (
    <GridContainer>
      {allCategories.map((category, index) => {
        const isAllProducts = category.isAllProducts || (allProductsCard && index === 0);
        
        // Получаем позиционирование для мобильной и десктопной версии
        const mobileGridColumn = getMobileGridColumn(index, totalCards);
        const mobileGridRow = getMobileGridRow(index, totalCards);
        const desktopGridColumn = getDesktopGridColumn(index, totalCards);
        // Для десктопа НИКОГДА не используем explicit grid-row - только автоматический flow
        const desktopGridRow = null;
        
        // Базовые стили для обычных карточек
        const baseStyles = {
          width: '100%', // Заполняем всю ширину обертки
          height: '100%', // Заполняем всю высоту обертки
          maxWidth: 'none', // Убираем ограничение ширины
        };
        
        return (
          <CardGridWrapper
            key={category.id}
            title={category.title || category.name}
            mobileGridColumn={mobileGridColumn}
            mobileGridRow={mobileGridRow}
            desktopGridColumn={desktopGridColumn}
            // НЕ передаем desktopGridRow - используем только автоматический flow
          >
            {isAllProducts ? (
              <AllProductsCard
                title={category.title || category.name}
                imageUrl={category.imageUrl || category.image}
                link={category.link}
              />
            ) : (
              <CategoryCard
                title={category.title || category.name}
                imageUrl={category.imageUrl || category.image}
                link={category.link}
                additionalStyles={baseStyles}
              />
            )}
          </CardGridWrapper>
        );
      })}
    </GridContainer>
  );
};

export default CategoryGridWrapper; 