import React from 'react';
import styled from 'styled-components';
import { COLORS, mediaQueries } from '../../styles/tokens';

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  background-color: ${props => props.active ? COLORS.primary : 'white'};
  color: ${props => props.active ? 'white' : COLORS.black};
  border: 1px solid ${props => props.active ? COLORS.primary : '#E5E5E5'};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active || props.disabled ? '' : '#F5F5F5'};
  }

  ${mediaQueries.md} {
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
`;

const NavigationButton = styled(PageButton)`
  width: auto;
  padding: 0 15px;
  ${mediaQueries.md} {
    padding: 0 20px;
  }
`;

const PageButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: ${COLORS.gray700};
  margin-top: 10px;
  text-align: center;

  ${mediaQueries.md} {
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

  // Определяем, какие кнопки страниц показывать
  // Всегда показываем 5 страниц, если доступно
  let pageButtons = [];
  let startPage, endPage;

  if (totalPages <= 5) {
    // Если страниц 5 или меньше, показываем все
    startPage = 1;
    endPage = totalPages;
  } else {
    // Если страниц больше 5, показываем группу страниц вокруг текущей
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
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