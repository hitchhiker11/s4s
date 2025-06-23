import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { useBasket } from '../hooks/useBasket';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, ANIMATION, mediaQueries } from '../styles/tokens';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${COLORS.white};
  overflow: hidden;
  width: 100%;
  height: 100%; /* Fill the entire grid cell */
  transition: ${ANIMATION.transitionBase};
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};

  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  @media (min-width: 600px) {
    padding-left: 0;
    padding-right: 0;
  }

  ${mediaQueries.md} {
    border-right-width: 4px;
    border-bottom-width: 4px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${COLORS.white};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0; /* Prevent container from shrinking */

  @media (min-width: 768px) {
    height: 250px; /* Reduced from 330px for more consistent sizing */
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;

  @media (min-width: 768px) {
    max-width: 90%;
    max-height: 90%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FEFEFE;
  padding: ${SPACING.md} ${SPACING.lg};
  gap: 4px;
  width: 100%;
  text-align: center;
  // height: 150px; 
  overflow: hidden;

  @media (min-width: 600px) {
    height: 180px; /* Slightly taller on larger screens */
    padding: ${SPACING.md} ${SPACING.lg};
    gap: ${SPACING.md};
  }
`;

const BrandTitle = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(10px, 3vw, 18px);
  line-height: 1.05;
  color: ${COLORS.primary};
  text-transform: uppercase;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const ProductTitle = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(10px, 3vw, 18px);
  line-height: 1.2;
  color: ${COLORS.black};
  margin: 0;
  text-align: center;
  width: 100%;
  
  /* Limit to 2 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.4em; /* 2 lines × line-height */

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const Price = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, ${TYPOGRAPHY.size["3xl"]});
  line-height: 0.9;
  color: ${COLORS.primary};
  margin-top: auto; /* Push to bottom of flex container */
  padding-top: ${SPACING.xs};

  @media (min-width: 1024px) {
    font-size: ${TYPOGRAPHY.size["3xl"]};
  }
`;

const DividerLine = styled.hr`
  border: none;
  border-top: 2px dashed rgba(0, 0, 0, 0.25);
  width: 100%;
  margin: 0;
  flex-shrink: 0; /* Prevent from shrinking */

  @media (min-width: 1024px) {
    border-top-width: 2px;
  }
`;

const CartActionArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FEFEFE;
  padding: 8px 38px;
  width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  flex-shrink: 0; /* Prevent from shrinking */
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background-color: ${props => props.disabled ? '#FEFEFE' : COLORS.gray100};
  }

  @media (min-width: 600px) {
    padding: ${SPACING.md} ${SPACING.xl};
  }
`;

const AddToCartText = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(10px, 3vw, 18px);
  line-height: 1;
  color: ${props => props.isPreOrder ? COLORS.black : COLORS.primary};
  text-transform: uppercase;

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Use the basket hook if external handler is not provided
  const { addToBasket } = useBasket({
    initialFetch: false, // Don't fetch basket data on mount
    staleTime: 60000 // 1 minute cache
  });

  const handleAddToCart = async (e) => {
    // Prevent navigation to product detail page when clicking add to cart
    e.preventDefault();
    e.stopPropagation();
    
    const productId = parseInt(product.ID || product.id, 10); // Convert ID to number
    const hasZeroQuantity = product.CATALOG_QUANTITY === "0" || product.quantity === 0;
    // Check if product can be added to cart (either available or zero quantity for pre-order)
    const canAddToCart = (product.CATALOG_AVAILABLE === 'Y' || product.available) || hasZeroQuantity;

    if (!productId || isLoading || !canAddToCart) return;

    setIsLoading(true);

    try {
      if (onAddToCart) {
        // Use provided handler if available
        await onAddToCart(product);
      } else {
        // Otherwise use the basket hook
        await addToBasket({ product_id: productId, quantity: 1 });
      }
      
      // Invalidate queries to refresh basket count
      queryClient.invalidateQueries(['basket']);
      queryClient.invalidateQueries(['basketCount']);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const brandName = product.BRAND_NAME || product.brand || "Brand";
  const productName = product.NAME || product.name || "Product Name";
  const priceValue = product.PRICE || product.price || 0;
  
  // Use the correct image path (assuming it's already processed by transformers.js)
  const imageUrl = product.imageUrl || product.image || '/images/no-image.png';
  
  // Check availability and quantity - UPDATED LOGIC
  const isAvailable = product.CATALOG_AVAILABLE === 'Y' || product.available === true;
  // Just check quantity for pre-order status, regardless of availability
  const isPreOrder = product.CATALOG_QUANTITY === "0" || product.quantity === 0;
  
  // Get the correct product detail URL from CODE field
  const productCode = product.CODE || product.code || '';
  const detailUrl = product.productLink || product.detailUrl || `/detail/${productCode}`;

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(priceValue);

  return (
    <Card>
      <a href={detailUrl} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
        <ImageContainer>
          <Image 
            src={imageUrl} 
            alt={productName} 
            loading="lazy"
          />
        </ImageContainer>
        <Content>
          <BrandTitle>{brandName}</BrandTitle> 
          <ProductTitle>{productName}</ProductTitle>
          <Price>{formattedPrice}</Price>
        </Content>
      </a>
      <DividerLine />
      <CartActionArea 
        onClick={handleAddToCart}
        disabled={(!isAvailable && !isPreOrder) || isLoading}
      >
        <AddToCartText isPreOrder={isPreOrder}>
          {isLoading ? 'Добавление...' : isPreOrder ? 'Предзаказ' : 'В корзину'}
        </AddToCartText>
      </CartActionArea>
    </Card>
  );
};

export default ProductCard; 