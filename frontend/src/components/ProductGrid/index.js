import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProductCard from '../ProductCard';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

const GridSection = styled.section`
  width: 100%;
  padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  background-color: ${COLORS.white};

  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.lg} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.lg} ${SPACING['2xl']};
  }

  ${mediaQueries.lg} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING.lg} ${SPACING['3xl']};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${SPACING.xl};

  ${mediaQueries.md} {
    margin-bottom: ${SPACING.xl};
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  max-height: 28px;

  ${mediaQueries.sm} {
    border-top-width: 2px;
    padding: ${SPACING.md} 0;
  }

  ${mediaQueries.md} {
    border-top-width: 4px;
    max-height: 45px;
  }
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 2px;
  background-color: ${COLORS.gray400};
  width: 100%;
  margin: 0;

  ${mediaQueries.md} {
    height: 4px;
  }
`;

const Title = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, ${TYPOGRAPHY.size.xl});
  color: ${props => props.useGradient ? 'transparent' : COLORS.black};
  margin: 0;
  line-height: 1.16;

  ${props => props.useGradient && `
    background: linear-gradient(91.3deg, #E7194A 1.11%, #FFAA00 138.8%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `}
`;

const SubtitleContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  min-height: 45px;

  ${mediaQueries.sm} {
    border-bottom-width: 2px;
    padding: ${SPACING.md} 0;
  }

  ${mediaQueries.md} {
    border-bottom-width: 4px;
  }
`;

const Subtitle = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: clamp(1rem, 5vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${COLORS.gray500};
  margin: 0;
  line-height: 1.16;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: clamp(1rem, 5vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${COLORS.black};
  text-decoration: none;
  white-space: nowrap;
  line-height: 0.68;

  &:hover {
    color: ${COLORS.primary};
    text-decoration: underline;
  }

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
  gap: ${SPACING.md};
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  justify-content: space-between;

  ${mediaQueries.sm} {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
    gap: ${SPACING.lg};
  }

  ${mediaQueries.md} {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: ${SPACING.xl};
  }

  ${mediaQueries.lg} {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
  }

  @media (max-width: ${BREAKPOINTS.lg - 1}px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: ${SPACING.md};
    gap: ${SPACING.md};

    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    grid-template-columns: unset;
    justify-content: flex-start;

    & > * {
      flex-shrink: 0;
      width: 70%;
      scroll-snap-align: start;
      height: auto;
      align-self: flex-start;

      ${mediaQueries.xs} {
         width: 75%;
      }
    }
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

const EmptyMessage = styled.div`
  padding: ${SPACING.xl};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.gray400};
  width: 100%;
`;

const ProductGrid = ({ 
  products = [], 
  title = "Товары", 
  subtitle = "",
  viewAllLink = "#", 
  viewAllText = "Смотреть все",
  onAddToCart,
  useGradientTitle = false
}) => {
  // Ensure products is an array
  const productItems = Array.isArray(products) ? products : [];
  
  return (
    <GridSection>
      <HeaderContainer>
        <TitleRow>
          <Title useGradient={useGradientTitle}>{title}</Title>
          {viewAllLink && <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>}
        </TitleRow>
        {subtitle && (
          <>
            <HeaderDivider />
            <SubtitleContainer>
              <Subtitle>{subtitle}</Subtitle>
            </SubtitleContainer>
          </>
        )}
      </HeaderContainer>
      
      {productItems.length > 0 ? (
        <GridContainer>
          {productItems.map((product, index) => (
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
        </GridContainer>
      ) : (
        <EmptyMessage>Нет доступных товаров</EmptyMessage>
      )}
    </GridSection>
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
  ),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func,
  useGradientTitle: PropTypes.bool
};

export default ProductGrid; 