import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProductCard from '../ProductCard';
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries } from '../../styles/tokens';

const GridContainer = styled.div`
  margin: ${SPACING.lg} 0;
  width: 100%;
`;

const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.md};
`;

const SectionTitle = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.xl};
  color: ${COLORS.black};
  margin: 0;
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: ${TYPOGRAPHY.size.sm};
  color: ${COLORS.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${SPACING.md};
  
  ${mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
  }
  
  ${mediaQueries.md} {
    grid-template-columns: repeat(4, 1fr);
  }
  
  ${mediaQueries.lg} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const PreOrderWrapper = styled.div`
  position: relative;
`;

const PreOrderBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  padding: ${SPACING.xs} 0;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  text-transform: uppercase;
  font-size: ${TYPOGRAPHY.size.xs};
  z-index: 10;
`;

const ProductGrid = ({ 
  products, 
  title = "Товары", 
  viewAllLink = "#", 
  viewAllText = "Смотреть все",
  onAddToCart
}) => {
  return (
    <GridContainer>
      <GridHeader>
        <SectionTitle>{title}</SectionTitle>
        <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>
      </GridHeader>
      
      <Grid>
        {products.map((product, index) => (
          <PreOrderWrapper key={product.id || index}>
            {product.preOrder && (
              <PreOrderBadge>ПРЕДЗАКАЗ</PreOrderBadge>
            )}
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </PreOrderWrapper>
        ))}
      </Grid>
    </GridContainer>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string,
      brand: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      productLink: PropTypes.string,
      CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']).isRequired,
      badge: PropTypes.string,
      preOrder: PropTypes.bool
    })
  ).isRequired,
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func
};

export default ProductGrid; 