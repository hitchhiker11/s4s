import React from 'react';
import styled from 'styled-components';
import { COLORS, mediaQueries } from '../../styles/tokens';

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  
  ${mediaQueries.md} {
    margin: 40px 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  padding: 0 8px;
  overflow-x: auto;
  gap: 4px;
  
  /* Скрываем скроллбар на мобильных */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  ${mediaQueries.sm} {
    gap: 6px;
    padding: 0 12px;
  }
  
  ${mediaQueries.md} {
    margin-bottom: 15px;
    padding: 0 16px;
    gap: 8px;
    overflow-x: visible;
  }
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  width: 32px;
  height: 32px;
  margin: 0;
  background-color: ${props => props.active ? COLORS.primary : 'white'};
  color: ${props => props.active ? 'white' : COLORS.black};
  border: 1px solid ${props => props.active ? COLORS.primary : '#E5E5E5'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.active || props.disabled ? '' : '#F5F5F5'};
  }

  ${mediaQueries.sm} {
    min-width: 36px;
    width: 36px;
    height: 36px;
    font-size: 13px;
    border-radius: 7px;
  }

  ${mediaQueries.md} {
    min-width: 40px;
    width: 40px;
    height: 40px;
    font-size: 14px;
    border-radius: 8px;
  }
  
  ${mediaQueries.lg} {
    min-width: 50px;
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
`;

const NavigationButton = styled(PageButton)`
  width: auto;
  min-width: auto;
  padding: 0 8px;
  font-size: 11px;
  white-space: nowrap;
  
  ${mediaQueries.sm} {
    padding: 0 12px;
    font-size: 12px;
  }
  
  ${mediaQueries.md} {
    padding: 0 15px;
    font-size: 14px;
  }
  
  ${mediaQueries.lg} {
    padding: 0 20px;
    font-size: 16px;
  }
`;

const PageButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  min-width: 0;
  
  ${mediaQueries.sm} {
    gap: 6px;
  }
  
  ${mediaQueries.md} {
    gap: 8px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 12px;
  color: ${COLORS.gray700};
  margin-top: 8px;
  text-align: center;
  padding: 0 16px;
  line-height: 1.4;

  ${mediaQueries.sm} {
    font-size: 13px;
    margin-top: 10px;
  }
  
  ${mediaQueries.md} {
    font-size: 14px;
    margin-top: 10px;
    padding: 0;
  }
  
  ${mediaQueries.lg} {
    font-size: 16px;
  }
`;

/**
 * Pagination component
 * @param {object} props
 * @param {number} props.currentPage - The current active page
 * @param {number} props.totalPages - The total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {function} props.onPageChange - Function to call when page changes, receives new page number
 */
const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  // Если страниц меньше 2, не показываем пагинацию
  if (totalPages <= 1) return null;

  // Функция для определения количества отображаемых кнопок в зависимости от ширины экрана
  const getMaxButtons = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 576) return 3; // xs - очень маленькие экраны
      if (width < 768) return 5; // sm - маленькие экраны  
      return 7; // md и больше - полный набор
    }
    return 5; // fallback для SSR
  };

  // Определяем, какие кнопки страниц показывать
  const maxButtons = getMaxButtons();
  let pageButtons = [];
  let startPage, endPage;

  if (totalPages <= maxButtons) {
    // Если страниц меньше или равно максимуму, показываем все
    startPage = 1;
    endPage = totalPages;
  } else {
    // Если страниц больше максимума, показываем группу страниц вокруг текущей
    const halfButtons = Math.floor(maxButtons / 2);
    if (currentPage <= halfButtons + 1) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + halfButtons >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfButtons;
      endPage = currentPage + halfButtons;
    }
  }

  // Добавляем кнопку для первой страницы, если она не включена
  if (startPage > 1) {
    pageButtons.push(
      <PageButton
        key={1}
        active={1 === currentPage}
        onClick={() => onPageChange(1)}
      >
        1
      </PageButton>
    );
    
    // Добавляем многоточие, если первая страница не следует сразу за выбранным диапазоном
    if (startPage > 2) {
      pageButtons.push(
        <PageButton key="ellipsis-start" disabled={true}>...</PageButton>
      );
    }
  }

  // Создаем массив кнопок страниц для выбранного диапазона
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <PageButton
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </PageButton>
    );
  }

  // Добавляем кнопку для последней страницы, если она не включена
  if (endPage < totalPages) {
    // Добавляем многоточие, если последняя страница не следует сразу за выбранным диапазоном
    if (endPage < totalPages - 1) {
      pageButtons.push(
        <PageButton key="ellipsis-end" disabled={true}>...</PageButton>
      );
    }
    
    pageButtons.push(
      <PageButton
        key={totalPages}
        active={totalPages === currentPage}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </PageButton>
    );
  }

  return (
    <PaginationContainer>
      <ButtonsContainer>
        <NavigationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Назад
        </NavigationButton>

        <PageButtonsContainer>
          {pageButtons}
        </PageButtonsContainer>

        <NavigationButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Вперед
        </NavigationButton>
      </ButtonsContainer>
      
      {totalItems && (
        <PaginationInfo>
          Страница {currentPage} из {totalPages} (всего {totalItems} товаров)
        </PaginationInfo>
      )}
    </PaginationContainer>
  );
};

export default Pagination; 