import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION } from '../../styles/tokens';

// --- Styled Components based on Figma --- 

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white}; // Figma uses #FEFEFE, very close to our white
  box-shadow: ${SHADOWS.md}; // 4px 4px 0px rgba(182, 182, 182, 1)
  height: 100%;
  position: relative; // Needed for absolute positioning of the badge
  // No border or radius specified in Figma
`;

const ImageLinkWrapper = styled.a`
  display: block;
  text-decoration: none;
  padding: ${SPACING.xl}; // Generous padding around the image container
  background-color: ${COLORS.white};
`;

const CardImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; // Maintain square aspect ratio
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.white};
  overflow: hidden; // Prevent image spilling
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
  padding: ${SPACING.xl} ${SPACING.lg}; // Approx 29px 17px from Figma
  gap: ${SPACING.sm}; // Reduced gap to better match Figma spacing
  background-color: ${COLORS.white}; // Match card background
  flex-grow: 1;
`;

const BrandLinkWrapper = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Brand = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily}; // Rubik
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.lg}; // Adjusted to 20px, Figma's 23px is large
  color: ${COLORS.primary};
  text-transform: uppercase;
  line-height: 1.2;
`;

const Name = styled.h4`
  font-family: ${TYPOGRAPHY.fontFamily}; // Rubik
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.lg}; // Adjusted to 20px
  color: ${COLORS.black};
  margin: ${SPACING.xs} 0 0 0; // Add small top margin
  line-height: 1.2;
  // Allow wrapping
`;

const Price = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily}; // Rubik
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size['3xl']}; // 35px
  color: ${COLORS.primary};
  line-height: 1.1;
  margin-top: ${SPACING.md}; // More space above price
`;

const SeparatorLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1.5px dashed rgba(0, 0, 0, 0.25); // Match Figma stroke/color
  margin: 0; 
`;

const AddToCartContainer = styled.div`
  padding: ${SPACING.lg} ${SPACING.xl}; // Approx 19px 38px
  width: 100%;
  text-align: center;
  background-color: ${COLORS.white};
`;

const AddToCartButton = styled.button`
  font-family: ${TYPOGRAPHY.fontFamily}; // Rubik
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.lg}; // Adjusted to 20px
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
`;

// Badge component (example, customize as needed)
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
  font-size: ${TYPOGRAPHY.size.xs}; 
  font-weight: ${TYPOGRAPHY.weight.bold};
  text-transform: uppercase;
  z-index: 1; 
  // Add specific badge image/icon if needed from Figma
`;

// --- Main Component Logic --- 
const ProductCard = ({ product, onAddToCart }) => {
  const { 
    id, 
    imageUrl, 
    brand, 
    name, 
    price, 
    productLink = '#', 
    CATALOG_AVAILABLE, 
    badge // Get badge prop
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
      {/* Conditionally render Badge - adjust logic/content as needed */}
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

// Update PropTypes
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    productLink: PropTypes.string,
    CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']).isRequired, // Make required if always present
    badge: PropTypes.string, // Optional badge text
  }).isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard; 