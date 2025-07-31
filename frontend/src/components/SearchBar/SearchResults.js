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

// Новые стили для товаров
const ProductResultItem = styled(ResultItem)`
  padding: 12px 16px;
  gap: 10px;
  
  a {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const ProductImage = styled.div`
  width: 50px;
  height: 50px;
  min-width: 40px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${COLORS.gray100};
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductBrand = styled.span`
  font-size: 12px;
  color: ${COLORS.gray600};
  font-weight: ${TYPOGRAPHY.weight.medium};
  margin-bottom: 2px;
`;

const ProductName = styled.span`
  font-size: 14px;
  color: ${COLORS.black};
  font-weight: ${TYPOGRAPHY.weight.regular};
`;

const ProductPrice = styled.span`
  font-size: 14px;
  color: ${COLORS.primary};
  font-weight: ${TYPOGRAPHY.weight.medium};
  margin-left: auto;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  min-width: 70px;
`;

const AvailabilityBadge = styled.span`
  font-size: 11px;

  border-radius: 3px;
  background-color: ${props => props.available ? COLORS.successLight : COLORS.errorLight};
  color: ${props => props.available ? COLORS.success : COLORS.error};
  margin-left: 0;
  margin-top: 4px;
  align-self: flex-start;
  display: block;
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

  console.log('Rendering search results:', { hasBrands, hasCategories, hasProducts, results });

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

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
          <SectionTitle>Товары</SectionTitle>
          {results.products.map((product) => (
            <ProductResultItem 
              key={`product-${product.id}`} 
              onClick={() => onResultClick('product', product)}
            >
              <Link href={`/detail/${product.slug}`}>
                <ProductImage src={product.imageUrl} />
                <ProductInfo>
                  <ProductBrand>{product.brand}</ProductBrand>
                  <ProductName>{product.name}</ProductName>
                </ProductInfo>
                <ProductPrice>
                  {formatPrice(product.price)}
                  {product.available !== undefined && (
                    <AvailabilityBadge available={product.available}>
                      {product.available ? 'В наличии' : 'Нет в наличии'}
                    </AvailabilityBadge>
                  )}
                </ProductPrice>
              </Link>
            </ProductResultItem>
          ))}
        </ResultSection>
      )}
      
      {hasResults && (
        <ResultSection>
          <SectionTitle>Поиск по запросу</SectionTitle>
          <ResultItem onClick={() => onResultClick('search', { query })}>
            <Link href={`/search?q=${encodeURIComponent(query)}`}>
              <ResultItemTitle>Показать все результаты для "{query}"</ResultItemTitle>
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