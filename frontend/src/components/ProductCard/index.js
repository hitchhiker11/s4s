import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
  height: 100%;
  position: relative;
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  transition: ${ANIMATION.transitionBase};
  
  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }
  
  ${mediaQueries.md} {
    border-right-width: 4px;
    border-bottom-width: 4px;
    
    &:hover {
      border-right-color: ${COLORS.gray500};
      border-bottom-color: ${COLORS.gray500};
    }
  }
`;

const ImageLinkWrapper = styled.a`
  display: block;
  text-decoration: none;
  background-color: ${COLORS.white};
  width: 100%; /* Ensure link takes full width */
  aspect-ratio: 1 / 1; /* Maintain square aspect ratio */
  padding: ${SPACING.xs}; /* Smaller padding for mobile */
  position: relative; /* Add relative positioning for absolute children if needed */
  overflow: hidden; /* Hide overflow from image container */

  ${mediaQueries.md} {
    padding: ${SPACING.lg};
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.white};
  overflow: hidden;
  position: absolute; /* Position absolutely within the link wrapper */
  inset: 0; /* Cover the entire link wrapper area */
  padding: ${SPACING.xs}; /* Smaller padding for mobile */

  ${mediaQueries.md} {
    padding: ${SPACING.lg};
  }
`;

const CardImage = styled.img`
  display: block;
  width: 100%; /* Make image fill container width */
  height: 100%; /* Make image fill container height */
  object-fit: contain; /* Keep contain for product images */
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${SPACING.md} ${SPACING.sm}; /* Smaller padding for mobile */
  gap: ${SPACING.xs};
  background-color: ${COLORS.white};
  flex-grow: 1;
  
  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING.lg};
    gap: ${SPACING.sm};
  }
`;

const BrandLinkWrapper = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Brand = styled.span`
  display: block;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(9.2px, 2vw, 23.27px); /* Smaller font size for mobile based on Figma */
  color: ${COLORS.primary};
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: ${SPACING.xs};
  
  ${mediaQueries.md} {
    font-size: 23.27px;
    margin-bottom: ${SPACING.sm};
  }
`;

const Name = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(9.2px, 2vw, 18px); /* Smaller font size for mobile based on Figma */
  line-height: 1.2;
  margin: 0;
  color: ${COLORS.black};
  text-transform: uppercase;
  
  ${mediaQueries.md} {
    font-size: 18px;
  }
`;

const Price = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(13.88px, 2.5vw, 35px); /* Adjusted font size based on Figma */
  color: ${COLORS.primary};
  margin-top: auto;
  line-height: 0.67; /* Match Figma spec */
  
  ${mediaQueries.md} {
    font-size: 35px;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: ${SPACING.sm};
  left: ${SPACING.sm};
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: 10px;
  padding: 4px 8px;
  z-index: 10;
  
  ${mediaQueries.md} {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const SeparatorLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${COLORS.gray300};
  opacity: 0.35;
`;

const AddToCartContainer = styled.div`
  padding: ${SPACING.xs} ${SPACING.sm} 0; /* Removed bottom padding */
  display: flex;
  justify-content: center;
  
  ${mediaQueries.md} {
    padding: ${SPACING.md} ${SPACING.lg} 0; /* Removed bottom padding */
  }
`;

const AddToCartButton = styled.button`
  background-color: transparent;
  color: ${COLORS.black};
  border: none;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(9.2px, 2vw, 14px); /* Adjusted font size for mobile */
  padding: ${SPACING.xs} 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  
  &:disabled {
    color: ${COLORS.gray400};
    cursor: not-allowed;
  }
  
  ${mediaQueries.md} {
    font-size: 14px;
    padding: ${SPACING.sm} 0;
  }
`;

const ProductCard = ({ product, onAddToCart }) => {
  const {
    id,
    imageUrl,
    brand,
    name,
    price,
    productLink = '#',
    CATALOG_AVAILABLE,
    badge
  } = product;

  const formatPrice = (num) => {
    if (typeof num !== 'number') return 'Цена не указана';
    return `₽${num.toLocaleString('ru-RU')}`;
  };

  const isAvailable = CATALOG_AVAILABLE === 'Y';

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart && isAvailable) {
      onAddToCart(id);
    }
    console.log(`Add to cart clicked: ${id}, Available: ${isAvailable}`);
  };

  return (
    <CardWrapper>
      {badge && <Badge>{badge}</Badge>}

      <ImageLinkWrapper href={productLink}>
        <CardImageContainer>
          {imageUrl ? (
            <CardImage src={imageUrl} alt={name} loading="lazy" />
          ) : (
            <span style={{ color: COLORS.gray400 }}>Image</span>
          )}
        </CardImageContainer>
      </ImageLinkWrapper>

      <TextContent>
        <BrandLinkWrapper href={productLink}>
          {brand && <Brand>{brand}</Brand>}
          <Name title={name}>{name}</Name>
        </BrandLinkWrapper>
        <Price>{formatPrice(price)}</Price>
      </TextContent>

      <SeparatorLine />

      <AddToCartContainer>
        <AddToCartButton onClick={handleAddToCart} disabled={!isAvailable}>
          {isAvailable ? 'В корзину' : 'Нет в наличии'}
        </AddToCartButton>
      </AddToCartContainer>
    </CardWrapper>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    productLink: PropTypes.string,
    CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']).isRequired,
    badge: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;