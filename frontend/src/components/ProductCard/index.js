import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries } from '../../styles/tokens';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.md};
  height: 100%;
  position: relative;
`;

const ImageLinkWrapper = styled.a`
  display: block;
  text-decoration: none;
  padding: ${SPACING.xl};
  background-color: ${COLORS.white};
`;

const CardImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.white};
  overflow: hidden;
`;

const CardImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${SPACING.xl} ${SPACING.lg};
  gap: ${SPACING.sm};
  background-color: ${COLORS.white};
  flex-grow: 1;
`;

const BrandLinkWrapper = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Brand = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(0.95rem, 5vw, ${TYPOGRAPHY.size.lg});
  color: ${COLORS.primary};
  text-transform: uppercase;
  line-height: 1.2;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.lg};
  }
`;

const Name = styled.h4`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(0.95rem, 5vw, ${TYPOGRAPHY.size.lg});
  color: ${COLORS.black};
  margin: ${SPACING.xs} 0 0 0;
  line-height: 1.2;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.lg};
  }
`;

const Price = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(1.1rem, 8vw, ${TYPOGRAPHY.size['3xl']});
  color: ${COLORS.primary};
  line-height: 1.1;
  margin-top: ${SPACING.md};

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size['3xl']};
  }
`;

const SeparatorLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 2px dashed rgba(0, 0, 0, 0.25);
  margin: 0;

  ${mediaQueries.md} {
    border-top-width: 4px;
  }
`;

const AddToCartContainer = styled.div`
  padding: ${SPACING.lg} ${SPACING.xl};
  width: 100%;
  text-align: center;
  background-color: ${COLORS.white};
`;

const AddToCartButton = styled.button`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(0.95rem, 5vw, ${TYPOGRAPHY.size.lg});
  color: ${COLORS.primary};
  text-transform: uppercase;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: ${ANIMATION.transitionBase};
  line-height: 1.2;

  &:hover:not(:disabled) {
    color: ${COLORS.primaryHover};
    opacity: 0.8;
  }

  &:disabled {
    color: ${COLORS.gray400};
    cursor: not-allowed;
  }

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.lg};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: ${SPACING.md};
  left: ${SPACING.md};
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  border-radius: ${SIZES.borderRadius.round};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.65rem, 4vw, ${TYPOGRAPHY.size.xs});
  font-weight: ${TYPOGRAPHY.weight.bold};
  text-transform: uppercase;
  z-index: 1;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.xs};
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