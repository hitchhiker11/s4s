import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens';

const PaginationContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${SPACING.lg} 0;
  margin-top: ${SPACING.xl};
  margin-bottom: ${SPACING.xl};
`;

const PageButton = styled.button`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.regular};
  font-size: ${TYPOGRAPHY.size.md};
  color: ${props => props.isActive ? COLORS.white : COLORS.black};
  background-color: ${props => props.isActive ? COLORS.primary : COLORS.white};
  border: 1px solid ${props => props.isActive ? COLORS.primary : COLORS.gray300};
  padding: ${SPACING.sm} ${SPACING.md};
  margin: 0 ${SPACING.xs};
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: ${props => !props.isActive && COLORS.gray100};
    border-color: ${props => !props.isActive && COLORS.gray400};
  }

  &:disabled {
    color: ${COLORS.gray400};
    background-color: ${COLORS.gray100};
    border-color: ${COLORS.gray200};
    cursor: not-allowed;
  }
  
  ${mediaQueries.sm} {
    font-size: ${TYPOGRAPHY.size.sm};
    padding: ${SPACING.xs} ${SPACING.sm};
  }
`;

const Ellipsis = styled.span`
  padding: ${SPACING.sm} ${SPACING.xs};
  color: ${COLORS.gray500};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.size.md};
  align-self: flex-end; /* Align with bottom of buttons */
  line-height: 1.5; /* Adjust to match button height better */
`;

/**
 * Pagination component
 * @param {object} props
 * @param {number} props.currentPage - The current active page
 * @param {number} props.totalPages - The total number of pages
 * @param {function} props.onPageChange - Function to call when page changes, receives new page number
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max direct page numbers to show (e.g., 1 ... 3 4 5 ... 10)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) { // Show all pages if not too many
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Ellipsis after first page if needed
      if (currentPage > halfMaxPages + 2) {
        pageNumbers.push('...');
      }

      // Determine middle range
      let startPage = Math.max(2, currentPage - halfMaxPages);
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages);

      if (currentPage <= halfMaxPages + 1) {
        endPage = Math.min(totalPages -1, maxPagesToShow);
      } else if (currentPage >= totalPages - halfMaxPages) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Ellipsis before last page if needed
      if (currentPage < totalPages - halfMaxPages -1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer aria-label="Pagination">
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Предыдущая
      </PageButton>

      {pageNumbers.map((number, index) => {
        if (number === '...') {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
        }
        return (
          <PageButton
            key={number}
            onClick={() => onPageChange(number)}
            isActive={currentPage === number}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Следующая
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination; 