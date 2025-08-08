import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
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
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }

  ${props => props.customStyles}
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${SPACING.xl};

  ${mediaQueries.md} {
    margin-bottom: ${SPACING.xl};
  }

  ${props => props.customStyles}
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
    max-height: 45px;
  }

  ${mediaQueries.lg} {
    border-top-width: 4px;
  }

  ${props => props.customStyles}
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 2px;
  background-color: ${COLORS.gray400};
  width: 100%;
  // margin: 0 0 22px 0;

  @media (min-width: 992px) {
    height: 4px;
  }

  ${props => props.customStyles}
`;

const Title = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(1.25rem, 6vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${props => props.useGradient ? 'transparent' : COLORS.black};
  margin: 0;
  line-height: 1.16;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
  
  ${props => props.useGradient && `
    background: linear-gradient(91.3deg, #E7194A 1.11%, #FFAA00 138.8%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `}
`;

const SubtitleContainer = styled.div`
  display: none; /* hide on mobile by default */
  width: 100%;
  border-bottom: 4px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  max-height: 28px;

  ${mediaQueries.md} {
    display: flex; /* show from tablet/desktop */
    max-height: 45px;
    align-items: center; 
  }

  ${props => props.customStyles}
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

  ${props => props.customStyles}
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

  ${props => props.customStyles}
`;

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;

  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  ${mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  ${mediaQueries.xxl} {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  ${props => props.customStyles}
`;

const PreOrderWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* Allow shrinking below content size */
  /* overflow: hidden; */ /* Remove this to allow toasts to be visible */
  ${props => props.customStyles}
`;

// Mirror ProductSlider's ProductCardWrapper for consistent image positioning and layout
const ProductCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* Allow shrinking below content size */
  /* overflow: hidden; */ /* Keep toasts visible */
  display: block;
  height: auto;
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

  ${props => props.customStyles}
`;

const EmptyMessage = styled.div`
  padding: ${SPACING.xl};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.gray400};
  width: 100%;

  ${props => props.customStyles}
`;

const ProductGrid = ({ 
  products = [], 
  title = "Товары", 
  subtitle = "",
  viewAllLink = "#", 
  viewAllText = "Смотреть все",
  useGradientTitle = false,
  sectionClassName = '',
  gridContainerClassName = '',
  // New props for customization and control
  showTitleRow = true,
  showViewAllLink = true,
  gridContainerStyle = {},
  preOrderWrapperProps = {},
  productCardProps = {},
  // Custom styles for each styled component
  gridSectionStyles = '',
  headerContainerStyles = '',
  titleRowStyles = '',
  headerDividerStyles = '',
  titleStyles = '',
  subtitleContainerStyles = '',
  subtitleStyles = '',
  viewAllLinkStyles = '',
  gridContainerStyles = '',
  preOrderWrapperStyles = '',
  preOrderBadgeStyles = '',
  emptyMessageStyles = '',
}) => {
  // Ensure products is an array
  const productItems = Array.isArray(products) ? products : [];
  
  return (
    <GridSection className={sectionClassName} customStyles={gridSectionStyles}>
      <HeaderContainer customStyles={headerContainerStyles}>
        {showTitleRow && (
          <TitleRow customStyles={titleRowStyles}>
            <Title useGradient={useGradientTitle} customStyles={titleStyles}>{title}</Title>
            {showViewAllLink && viewAllLink && (
              <Link href={viewAllLink} passHref legacyBehavior>
                <ViewAllLink customStyles={viewAllLinkStyles}>{viewAllText}</ViewAllLink>
              </Link>
            )}
          </TitleRow>
        )}
        {/* Always render bottom divider below the title */}
        <HeaderDivider customStyles={headerDividerStyles} />
        {subtitle && (
          <SubtitleContainer customStyles={subtitleContainerStyles}>
            <Subtitle customStyles={subtitleStyles}>{subtitle}</Subtitle>
          </SubtitleContainer>
        )}
      </HeaderContainer>
      
      {productItems.length > 0 ? (
        <GridContainer 
          className={gridContainerClassName} 
          style={gridContainerStyle}
          customStyles={gridContainerStyles}
        >
          {productItems.map((product, index) => (
            <PreOrderWrapper 
              key={product.id || index} 
              customStyles={preOrderWrapperStyles}
              {...preOrderWrapperProps}
            >
              {product.preOrder && (
                <PreOrderBadge customStyles={preOrderBadgeStyles}>ПРЕДЗАКАЗ</PreOrderBadge>
              )}
              <ProductCardWrapper>
                <ProductCard
                  product={product}
                  {...productCardProps}
                />
              </ProductCardWrapper>
            </PreOrderWrapper>
          ))}
        </GridContainer>
      ) : (
        <EmptyMessage customStyles={emptyMessageStyles}>Нет доступных товаров</EmptyMessage>
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
  useGradientTitle: PropTypes.bool,
  sectionClassName: PropTypes.string,
  gridContainerClassName: PropTypes.string,
  // New propTypes
  showTitleRow: PropTypes.bool,
  showViewAllLink: PropTypes.bool,
  gridContainerStyle: PropTypes.object,
  preOrderWrapperProps: PropTypes.object,
  productCardProps: PropTypes.object,
  // Custom styles propTypes
  gridSectionStyles: PropTypes.string,
  headerContainerStyles: PropTypes.string,
  titleRowStyles: PropTypes.string,
  headerDividerStyles: PropTypes.string,
  titleStyles: PropTypes.string,
  subtitleContainerStyles: PropTypes.string,
  subtitleStyles: PropTypes.string,
  viewAllLinkStyles: PropTypes.string,
  gridContainerStyles: PropTypes.string,
  preOrderWrapperStyles: PropTypes.string,
  preOrderBadgeStyles: PropTypes.string,
  emptyMessageStyles: PropTypes.string,
};

export default ProductGrid;