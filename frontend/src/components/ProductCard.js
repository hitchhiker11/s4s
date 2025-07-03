import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { useBasket } from '../hooks/useBasket';
import { useToast } from '../hooks/useToast';
import QuantityControl from './QuantityControl';
import ToastContainer from './Toast/ToastContainer';
import PreOrderModal from './modals/PreOrderModal';
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

  @media (min-width: 500px) {
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
  height: 120px; /* Reduced from 200px for mobile */
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
  justify-content: flex-start;
  background-color: #FEFEFE;
  padding: ${SPACING.sm} ${SPACING.md}; /* Reduced padding */
  gap: 2px; /* Reduced gap */
  width: 100%;
  text-align: center;
  /* Fixed height for consistency across all cards */
  height: 80px; /* Reduced from 160px */
  overflow: hidden;
  box-sizing: border-box;

  @media (min-width: 500px) {
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
  /* Fixed height to ensure consistency */
  height: 1.1em;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const ProductTitle = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(10px, 3vw, 18px);
  line-height: 1.1; /* Reduced from 1.2 */
  color: ${COLORS.black};
  margin: 0;
  text-align: center;
  width: 100%;
  
  /* Fixed height for exactly 2 lines to ensure consistency */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.2em; /* Reduced from 2.4em */
  flex-shrink: 0;

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
  flex-shrink: 0;

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
  padding: 4px 20px; /* Reduced padding for mobile */
  width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  flex-shrink: 0; /* Prevent from shrinking */
  opacity: ${props => props.disabled ? 0.7 : 1};
  /* Fixed height to accommodate both simple button and QuantityControl */
  min-height: 35px; /* Reduced from 50px for mobile */
  box-sizing: border-box;

  &:hover {
    background-color: ${props => props.disabled ? '#FEFEFE' : COLORS.gray100};
  }

  @media (min-width: 500px) {
    padding: ${SPACING.md} ${SPACING.xl};
    min-height: 60px;
  }

  @media (max-width: 768px) {
    min-height: 35px; /* Reduced from 50px */
    padding: 4px 20px; /* Consistent reduced padding */
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
  const [quantityLoading, setQuantityLoading] = React.useState(false);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Toast system
  const { 
    toasts, 
    showSuccessToast, 
    showErrorToast, 
    removeToast 
  } = useToast();
  
  // Use the basket hook to manage cart operations and check if item is in cart
  const { 
    addToBasket, 
    updateBasketItem, 
    removeFromBasket, 
    basketItems = [],
    isFuserIdInitialized,
    checkStock
  } = useBasket({
    initialFetch: true, // Fetch basket data to check if item is in cart
    staleTime: 30000 // 30 seconds cache
  });

  // Find if this product is already in the basket
  const basketItem = React.useMemo(() => {
    if (!basketItems || basketItems.length === 0) return null;
    
    const productId = parseInt(product.ID || product.id, 10);
    return basketItems.find(item => 
      parseInt(item.product_id, 10) === productId
    );
  }, [basketItems, product]);

  const isInBasket = Boolean(basketItem);
  const basketQuantity = basketItem?.quantity || 1;

  // Function to add item to basket with stock check
  const addToBasketWithStockCheck = async (productId, quantity = 1) => {
    try {
      console.log('🔍 [ProductCard] Checking stock before adding to basket:', { productId, quantity });
      
      // First check stock availability
      const stockResponse = await checkStock(productId, quantity);
      
      console.log('📋 [ProductCard] Stock check response:', stockResponse);
      
      if (stockResponse && stockResponse.success !== undefined) {
        const availableQuantity = parseInt(stockResponse.available_quantity, 10) || 0;
        
        if (!stockResponse.success && stockResponse.available === false) {
          if (availableQuantity === 0) {
            // No stock available
            showErrorToast(`Товар "${product.NAME || product.name}" недоступен на складе`);
            return false;
          } else if (availableQuantity > 0 && availableQuantity < quantity) {
            // Partial stock available - add available quantity
            console.log(`🔄 [ProductCard] Adding available quantity: ${availableQuantity} instead of ${quantity}`);
            await addToBasket({ product_id: productId, quantity: availableQuantity });
            showErrorToast(`Добавлено ${availableQuantity} шт. Больше нет на складе`);
            return true;
          }
        } else if (stockResponse.success && stockResponse.available === true) {
          // Stock is available in requested quantity
          console.log(`✅ [ProductCard] Stock available, adding ${quantity} to basket`);
          await addToBasket({ product_id: productId, quantity });
          return true;
        }
      } else if (stockResponse && stockResponse.error) {
        // Handle API error responses
        console.error(`❌ [ProductCard] Stock check error:`, stockResponse.error);
        showErrorToast(`Ошибка при проверке товара: ${stockResponse.error}`);
        return false;
      }
      
      // Fallback - try to add anyway
      await addToBasket({ product_id: productId, quantity });
      return true;
    } catch (error) {
      console.error('❌ [ProductCard] Exception during stock check and add:', error);
      
      // Check if it's a stock-related error
      if (error.message.includes('недостаточно') || error.message.includes('insufficient')) {
        showErrorToast(error.message);
      } else {
        showErrorToast(`Ошибка при добавлении товара в корзину: ${error.message}`);
      }
      return false;
    }
  };

  const handleAddToCart = async (e) => {
    // Prevent navigation to product detail page when clicking add to cart
    e.preventDefault();
    e.stopPropagation();
    
    const productId = parseInt(product.ID || product.id, 10);

    if (!productId || isLoading) return;

    setIsLoading(true);

    try {
      if (onAddToCart) {
        await onAddToCart(product);
        showSuccessToast(`Товар "${product.NAME || product.name}" добавлен в корзину`);
      } else {
        const success = await addToBasketWithStockCheck(productId, 1);
        if (success) {
          const productName = product.NAME || product.name;
          showSuccessToast(`Товар "${productName}" добавлен в корзину`);
        }
      }
      
      queryClient.invalidateQueries(['basket']);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Error toast is already shown in addToBasketWithStockCheck
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreOrder = (e) => {
    // Prevent navigation to product detail page when clicking pre-order
    e.preventDefault();
    e.stopPropagation();
    
    setIsPreOrderModalOpen(true);
  };

  const handleClosePreOrderModal = () => {
    setIsPreOrderModalOpen(false);
  };

  const handleQuantityChange = async (newQuantity) => {
    if (!basketItem || quantityLoading) return;
    
    setQuantityLoading(true);
    
    try {
      const quantity = newQuantity === '' ? 1 : Math.max(1, parseInt(newQuantity, 10) || 1);
      const productId = parseInt(basketItem.product_id, 10);
      
      // Check stock before updating quantity
      console.log('🔍 [ProductCard] Checking stock for quantity change:', { productId, quantity });
      
      const stockResponse = await checkStock(productId, quantity);
      
      if (stockResponse && stockResponse.success !== undefined) {
        const availableQuantity = parseInt(stockResponse.available_quantity, 10) || 0;
        
        if (!stockResponse.success && stockResponse.available === false) {
          if (availableQuantity === 0) {
            // Remove item completely if no stock available
            console.log(`❌ [ProductCard] Removing item: no stock available`);
            await removeFromBasket(basketItem.id);
            showErrorToast(`Товар "${product.NAME || product.name}" больше не доступен и был удален из корзины`);
            queryClient.invalidateQueries(['basket']);
            return;
          } else if (availableQuantity > 0 && availableQuantity < quantity) {
            // Update quantity to available amount
            console.log(`🔄 [ProductCard] Updating quantity to available amount: ${availableQuantity}`);
            await updateBasketItem(basketItem.id, availableQuantity);
            // showErrorToast(`Количество изменено на ${availableQuantity} (недостаточно на складе)`);
            showErrorToast(`Недостаточно на складе (доступно ${availableQuantity} шт.)`);
            queryClient.invalidateQueries(['basket']);
            return;
          }
        }
      }
      
      // Stock is available or check failed - proceed with update
      await updateBasketItem(basketItem.id, quantity);
      queryClient.invalidateQueries(['basket']);
    } catch (error) {
      console.error('Error updating quantity:', error);
      showErrorToast(`Ошибка при изменении количества: ${error.message}`);
    } finally {
      setQuantityLoading(false);
    }
  };

  const handleRemoveFromBasket = async () => {
    if (!basketItem || quantityLoading) return;
    
    setQuantityLoading(true);
    
    try {
      await removeFromBasket(basketItem.id);
      const productName = product.NAME || product.name;
      showSuccessToast(`Товар "${productName}" удален из корзины`);
      queryClient.invalidateQueries(['basket']);
    } catch (error) {
      console.error('Error removing from basket:', error);
      showErrorToast(`Ошибка при удалении товара: ${error.message}`);
    } finally {
      setQuantityLoading(false);
    }
  };

  const brandName = product.BRAND_NAME || product.brand || "Brand";
  const productName = product.NAME || product.name || "Product Name";
  const priceValue = product.PRICE || product.price || 0;
  
  const imageUrl = product.imageUrl || product.image || '/images/no-image.png';
  
  const isAvailable = product.CATALOG_AVAILABLE === 'Y' || product.available === true;
  const hasZeroQuantity = product.CATALOG_QUANTITY === "0" || product.quantity === 0;
  const isPreOrder = !isAvailable || hasZeroQuantity;
  
  const productCode = product.CODE || product.code || '';
  const detailUrl = product.productLink || product.detailUrl || `/detail/${productCode}`;

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(priceValue);

  return (
    <Card>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      {/* PreOrder Modal */}
      <PreOrderModal
        isOpen={isPreOrderModalOpen}
        onClose={handleClosePreOrderModal}
        productName={productName}
        productDescription={`${brandName} - ${productName}`}
        productId={product.ID || product.id}
        productArticle={product.CODE || product.code || product.article}
      />
      
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
      
      {/* Show QuantityControl if item is in basket, otherwise show Add to Cart or PreOrder button */}
      {isInBasket && isFuserIdInitialized ? (
        <CartActionArea style={{ cursor: 'default' }}>
          <QuantityControl
            quantity={basketQuantity}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveFromBasket}
            isLoading={quantityLoading}
            size="compact"
            showRemoveOnOne={true}
            className="productCardStyle"
          />
        </CartActionArea>
      ) : (
        <CartActionArea 
          onClick={isPreOrder ? handlePreOrder : handleAddToCart}
          disabled={isLoading}
        >
          <AddToCartText isPreOrder={isPreOrder}>
            {isLoading ? 'Загрузка...' : isPreOrder ? 'Предзаказ' : 'В корзину'}
          </AddToCartText>
        </CartActionArea>
      )}
    </Card>
  );
};

export default ProductCard; 