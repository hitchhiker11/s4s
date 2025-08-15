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
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  padding: 0 8px;
  gap: 4px;

  /* Middle container scrolls on very small screens */
  & > .Pagination__PageButtonsWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 4px;
  }
  & > .Pagination__PageButtonsWrapper::-webkit-scrollbar { display: none; }
  
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

  // Гидрация: избегаем чтения window при первом рендере, чтобы совпасть с SSR
  const [maxButtons, setMaxButtons] = React.useState(5);

  React.useEffect(() => {
    const computeMaxButtons = () => {
      const width = window.innerWidth;
      if (width < 576) return 3; // xs - очень маленькие экраны
      if (width < 768) return 5; // sm - маленькие экраны
      return 7; // md и больше - полный набор
    };

    const update = () => setMaxButtons(computeMaxButtons());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Prefetch next page route in background on capable browsers/devices
  React.useEffect(() => {
    if (!totalPages || currentPage >= totalPages) return;

    // Light heuristics for weak devices: avoid prefetch on very slow connections or battery saving
    const connection = typeof navigator !== 'undefined' && (navigator.connection || navigator.webkitConnection || navigator.mozConnection);
    const saveData = connection && connection.saveData;
    const effectiveType = connection && connection.effectiveType; // 'slow-2g','2g','3g','4g'
    const isSlow = effectiveType === '2g' || effectiveType === 'slow-2g';

    if (saveData || isSlow) return; // Skip prefetch to save data

    // Use Speculation Rules API when available
    try {
      if ('speculationRules' in document && document.speculationRules) {
        const nextPage = currentPage + 1;
        const link = typeof window !== 'undefined' ? window.location.pathname : '';
        const url = new URL(link, window.location.origin);
        url.searchParams.set('page', String(nextPage));
        const rules = {
          prefetch: [{ source: 'list', urls: [url.toString()] }]
        };
        const script = document.createElement('script');
        script.type = 'speculationrules';
        script.text = JSON.stringify(rules);
        document.head.appendChild(script);
        return () => {
          if (document.head.contains(script)) document.head.removeChild(script);
        };
      }
    } catch (_) {
      // noop
    }

    // Fallback: create an invisible <link rel="prefetch">
    const nextPage = currentPage + 1;
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(nextPage));
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url.toString();
    prefetchLink.as = 'fetch';
    prefetchLink.crossOrigin = 'anonymous';
    document.head.appendChild(prefetchLink);
    return () => {
      if (document.head.contains(prefetchLink)) document.head.removeChild(prefetchLink);
    };
  }, [currentPage, totalPages]);

  // Определяем, какие кнопки страниц показывать
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

        <PageButtonsContainer className="Pagination__PageButtonsWrapper">
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