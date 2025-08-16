import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries, BREAKPOINTS } from '../../styles/tokens';
import { useBasket } from '../../hooks/useBasket';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';

// Completely restructured CardWrapper to fix height calculation issues
const CardWrapper = styled.div`
  position: relative;
  background-color: ${COLORS.white};
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  transition: ${ANIMATION.transitionBase};
  width: 100%; /* Take full width of grid cell */
  max-width: 100%; /* Prevent overflow from parent grid */
  min-width: 0; /* Allow shrinking below content size */
  /* overflow: hidden; */ /* Remove this to allow toasts to be visible */
  
  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }
  
  ${mediaQueries.lg} {
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

  @media (min-width: 500px) and (max-width: 767px) {
    aspect-ratio: 4 / 3;
    padding: ${SPACING.xs};
  }

  ${mediaQueries.md} {
    aspect-ratio: 4 / 3; /* Slightly shorter on tablet */
  }

  ${mediaQueries.lg} {
    aspect-ratio: 1 / 1; /* Back to square on desktop */
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

  ${mediaQueries.lg} {
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
  width: 100%;
  max-width: 100%;
  overflow: hidden; /* Prevent text overflow */
  
  @media (min-width: 500px) and (max-width: 767px) {
    padding: ${SPACING.sm} ${SPACING.sm};
  }
  
  ${mediaQueries.lg} {
    padding: ${SPACING.xl} ${SPACING.lg};
  }
`;

const BrandLinkWrapper = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  max-width: 100%;
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
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 500px) and (max-width: 767px) {
    font-size: clamp(10px, 1.7vw, 16px);
  }
  
  ${mediaQueries.lg} {
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
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  hyphens: auto;
  
  @media (min-width: 500px) and (max-width: 767px) {
    font-size: clamp(10px, 1.9vw, 15px);
    -webkit-line-clamp: 2;
  }
  
  ${mediaQueries.lg} {
    font-size: 18px;
    -webkit-line-clamp: 3; /* Allow 3 lines on larger screens */
  }
`;

const Price = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(13.88px, 2.5vw, 35px);
  color: ${COLORS.primary};
  margin-top: ${SPACING.sm};
  line-height: 0.67;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 500px) and (max-width: 767px) {
    font-size: clamp(13px, 2.2vw, 24px);
  }
  
  ${mediaQueries.lg} {
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
  
  ${mediaQueries.lg} {
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
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 500px) and (max-width: 767px) {
    padding: ${SPACING.xs} ${SPACING.sm} ${SPACING.xs};
  }
  
  ${mediaQueries.lg} {
    padding: ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  }
`;

// Add toast notification styles
const ToastContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${COLORS.white};
  border: 2px solid ${COLORS.primary};
  padding: ${SPACING.sm} 35px ${SPACING.sm} ${SPACING.md}; /* Right padding increased for close button */
  z-index: 9999; /* Increase z-index to ensure toasts appear above all elements */
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: 12px;
  color: ${COLORS.black};
  text-transform: uppercase;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  min-width: 200px;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
  
  ${mediaQueries.lg} {
    font-size: 14px;
    padding: ${SPACING.md} 40px ${SPACING.md} ${SPACING.lg};
    max-width: 320px;
  }
`;

const ToastCloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: bold;
  color: ${COLORS.primary};
  cursor: pointer;
  padding: 2px;
  line-height: 1;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(231, 25, 74, 0.1);
    border-radius: 2px;
  }
  
  ${mediaQueries.lg} {
    top: 8px;
    right: 8px;
    font-size: 16px;
    width: 20px;
    height: 20px;
    padding: 4px;
  }
`;

// Update button styles for loading state
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
  max-width: 100%;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:disabled {
    color: ${COLORS.gray400};
    cursor: not-allowed;
  }
  
  @media (min-width: 500px) and (max-width: 767px) {
    font-size: clamp(10px, 1.8vw, 13px);
  }
  
  ${mediaQueries.lg} {
    font-size: 14px;
    padding: ${SPACING.sm} 0;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid ${COLORS.gray300};
  border-radius: 50%;
  border-top-color: ${COLORS.primary};
  animation: spin 1s ease-in-out infinite;
  margin-right: ${SPACING.xs};
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  ${mediaQueries.lg} {
    width: 14px;
    height: 14px;
  }
`;

const ProductCard = ({ product, onAddToCart }) => {
  // Use the basket hook to get the addToBasket function
  const { addToBasketWithStockCheck, isLoading: isBasketLoading } = useBasket({ 
    initialFetch: false,
    autoInitialize: true
  });
  
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { toasts, showSuccessToast, showErrorToast, removeToast } = useToast();
  // Remove local toast; use global toast system instead
  const [buttonState, setButtonState] = useState('default'); // 'default', 'loading', 'success', 'error'
  
  const {
    id,
    imageUrl,
    brand,
    name,
    price,
    productLink = '#',
    CATALOG_AVAILABLE,
    CATALOG_QUANTITY,
    badge
  } = product;

  const formatPrice = (num) => {
    if (typeof num !== 'number') return 'Цена не указана';
    return `₽${num.toLocaleString('ru-RU')}`;
  };

  const isAvailable = CATALOG_AVAILABLE === 'Y';
  const isPreOrder = CATALOG_QUANTITY === "0" || CATALOG_QUANTITY === 0;
  const isLoading = isBasketLoading || isLocalLoading || buttonState === 'loading';
  
  // Disable button for pre-order items or if loading
  const isButtonDisabled = isPreOrder || isLoading || !isAvailable;

  // Global toasts are shown from parent pages; keep behavior consistent with /cart

  // Function to close toast manually
  const closeToast = () => {};

  // Reset button state after showing success/error
  const resetButtonState = () => {
    setTimeout(() => {
      setButtonState('default');
    }, 2000);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (isButtonDisabled) {
      console.log(`Product ${id} - button disabled. PreOrder: ${isPreOrder}, Available: ${isAvailable}, Loading: ${isLoading}`);
      return;
    }
    
    setIsLocalLoading(true);
    setButtonState('loading');
    
    try {
      console.log('🛒 [ProductCard] Adding product to basket with stock check:', { id, name, isAvailable, isPreOrder });
      
      // Use the new async API method with stock check to add to basket
      await addToBasketWithStockCheck({
        product_id: id,
        quantity: 1
      });
      
      console.log(`✅ [ProductCard] Successfully added product ${id} to basket`);
      setButtonState('success');
      showSuccessToast('Товар успешно добавлен в корзину');
      resetButtonState();
      
      // Call the parent component's onAddToCart if provided (for backwards compatibility)
      // but don't await it as it's just a callback
      if (onAddToCart) {
        try {
          onAddToCart(id);
        } catch (callbackError) {
          console.warn('Error in onAddToCart callback:', callbackError);
        }
      }
    } catch (error) {
      console.error(`❌ [ProductCard] Failed to add product ${id} to basket:`, error);
      
      // Check if it's a stock-related error
      if (error.stockResponse) {
        console.log('📊 [ProductCard] Stock error details:', error.stockResponse);
        const availableQuantity = error.stockResponse.available_quantity || 0;
        const errorMessage = availableQuantity > 0 
          ? `Доступно только ${availableQuantity} шт.`
          : 'Товар закончился на складе';
        showErrorToast(errorMessage);
        setButtonState('error');
      } else {
        showErrorToast('Ошибка при добавлении товара');
        setButtonState('error');
      }
      
      resetButtonState();
    } finally {
      setIsLocalLoading(false);
    }
  };

  const validProductLink = productLink && typeof productLink === 'string' && productLink.startsWith('/') 
                           ? productLink 
                           : `/catalog/unknown/unknown/${id}`;

  const getButtonText = () => {
    switch (buttonState) {
      case 'loading':
        return '';
      case 'success':
        return 'Добавлено!';
      case 'error':
        return 'Недостаточно товара';
      default:
        if (isPreOrder) return 'Предзаказ';
        if (!isAvailable) return 'Нет в наличии';
        return 'В корзину';
    }
  };

  const getButtonStyles = () => {
    switch (buttonState) {
      case 'success':
        return {
          color: COLORS.success || '#28a745',
          fontWeight: 'bold'
        };
      case 'error':
        return {
          color: COLORS.error || '#dc3545',
          fontWeight: 'bold'
        };
      default:
        return {};
    }
  };

  return (
    <CardWrapper>
      {badge && <Badge>{badge}</Badge>}

      {/* Global Toasts: appear at top-right like on /cart */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />


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
        <AddToCartButton 
          onClick={handleAddToCart} 
          disabled={isButtonDisabled}
          style={getButtonStyles()}
        >
          {buttonState === 'loading' && <LoadingSpinner />}
          {getButtonText()}
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
    price: PropTypes.number,
    productLink: PropTypes.string,
    CATALOG_AVAILABLE: PropTypes.string,
    CATALOG_QUANTITY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    badge: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func
};

export default ProductCard;