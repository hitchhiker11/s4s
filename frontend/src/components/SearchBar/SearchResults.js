import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { COLORS, TYPOGRAPHY, SPACING } from '../../styles/tokens';

// Styled components for search results
const ResultsContainer = styled.div`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 0;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
`;

const ResultSection = styled.div`
  border-bottom: 1px solid ${COLORS.gray200};
  padding: 0;
`;

const SectionTitle = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 14px;
  color: ${COLORS.gray600};
  padding: 12px 16px;
  background-color: ${COLORS.gray100};
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  transition: background-color 0.2s;
  cursor: pointer;
  font-family: ${TYPOGRAPHY.fontFamily};
  
  &:hover {
    background-color: ${COLORS.gray100};
  }
  
  a {
    color: ${COLORS.black};
    text-decoration: none;
    width: 100%;
    display: block;
  }
`;

const ResultItemTitle = styled.span`
  font-weight: ${TYPOGRAPHY.weight.regular};
  font-size: 16px;
  line-height: 1.4;
  color: ${COLORS.black};
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: ${COLORS.gray600};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: 16px;
`;

const SearchResults = ({ 
  isVisible,
  query,
  results,
  onResultClick 
}) => {
  if (!isVisible || !query) return null;
  
  const hasBrands = results?.brands?.length > 0;
  const hasCategories = results?.categories?.length > 0;
  const hasProducts = results?.products?.length > 0;
  const hasResults = hasBrands || hasCategories || hasProducts;

  return (
    <ResultsContainer isVisible={isVisible}>
      {!hasResults && (
        <NoResults>
          {query.length < 3 
            ? 'Введите не менее 3 символов для поиска' 
            : 'Ничего не найдено по запросу'}
        </NoResults>
      )}
      
      {hasBrands && (
        <ResultSection>
          <SectionTitle>Найденный бренд</SectionTitle>
          {results.brands.map((brand) => (
            <ResultItem key={`brand-${brand.id}`} onClick={() => onResultClick('brand', brand)}>
              <Link href={`/brands/${brand.slug}`}>
                <ResultItemTitle>{brand.name}</ResultItemTitle>
              </Link>
            </ResultItem>
          ))}
        </ResultSection>
      )}
      
      {hasCategories && (
        <ResultSection>
          <SectionTitle>Найденная категория / подкатегория</SectionTitle>
          {results.categories.map((category) => (
            <ResultItem key={`category-${category.id}`} onClick={() => onResultClick('category', category)}>
              <Link href={`/catalog/${category.slug}`}>
                <ResultItemTitle>{category.name}</ResultItemTitle>
              </Link>
            </ResultItem>
          ))}
        </ResultSection>
      )}
      
      {hasProducts && (
        <ResultSection>
          <SectionTitle>Запрос</SectionTitle>
          <ResultItem onClick={() => onResultClick('search', { query })}>
            <Link href={`/search?q=${encodeURIComponent(query)}`}>
              <ResultItemTitle>{query}</ResultItemTitle>
            </Link>
          </ResultItem>
        </ResultSection>
      )}
    </ResultsContainer>
  );
};

SearchResults.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  query: PropTypes.string,
  results: PropTypes.shape({
    brands: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    ),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    ),
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    )
  }),
  onResultClick: PropTypes.func
};

SearchResults.defaultProps = {
  isVisible: false,
  query: '',
  results: {
    brands: [],
    categories: [],
    products: []
  },
  onResultClick: () => {}
};

export default SearchResults; 