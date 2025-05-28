import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

// Completely restructured CardWrapper to fix height calculation issues
const CardWrapper = styled.div`
  position: relative;
  background-color: ${COLORS.white};
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
  width: 100%;
  aspect-ratio: 1 / 1; /* Maintain square aspect ratio */
  padding: ${SPACING.xs};
  position: relative;
  overflow: hidden;

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
  position: absolute;
  inset: 0;
  padding: ${SPACING.xs};

  ${mediaQueries.md} {
  
    padding: ${SPACING.lg};
  }
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

// Modified to create a more predictable height
const TextContent = styled.div`
  display: block;
  text-align: center;
  padding: ${SPACING.md} ${SPACING.sm};
  background-color: ${COLORS.white};
  
  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING.lg};
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
  font-size: clamp(9.2px, 2vw, 23.27px);
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
  font-size: clamp(9.2px, 2vw, 18px);
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
  font-size: clamp(13.88px, 2.5vw, 35px);
  color: ${COLORS.primary};
  margin-top: ${SPACING.sm};
  line-height: 0.67;
  
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

// Simplified button container to avoid flexbox issues
const AddToCartContainer = styled.div`
  padding: ${SPACING.xs} ${SPACING.sm} ${SPACING.xs};
  text-align: center;
  background-color: ${COLORS.white};
  
  ${mediaQueries.md} {
    padding: ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  }
`;

const AddToCartButton = styled.button`
  background-color: transparent;
  color: ${COLORS.black};
  border: none;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(9.2px, 2vw, 14px);
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

  const validProductLink = productLink && typeof productLink === 'string' && productLink.startsWith('/') 
                           ? productLink 
                           : `/catalog/unknown/unknown/${id}`;

  return (
    <CardWrapper>
      {badge && <Badge>{badge}</Badge>}

      <Link href={validProductLink} passHref legacyBehavior>
        <ImageLinkWrapper>
          <CardImageContainer>
            {imageUrl ? (
              <CardImage src={imageUrl} alt={name} loading="lazy" />
            ) : (
              <span style={{ color: COLORS.gray400 }}>Image</span>
            )}
          </CardImageContainer>
        </ImageLinkWrapper>
      </Link>

      <TextContent>
        <Link href={validProductLink} passHref legacyBehavior>
          <BrandLinkWrapper>
            {brand && <Brand>{brand}</Brand>}
            <Name title={name}>{name}</Name>
          </BrandLinkWrapper>
        </Link>
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
    CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']),
    badge: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func
};

export default ProductCard;