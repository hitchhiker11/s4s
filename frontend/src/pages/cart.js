import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import ResponsiveProductSection from '../components/ResponsiveProductSection';
import ProductCard from '../components/ProductCard';
import CartTabs from '../components/CartTabs/CartTabs';
import DeliveryInfoForm from '../components/DeliveryInfoForm/DeliveryInfoForm';
import ToastContainer from '../components/Toast/ToastContainer';
import { useBasket } from '../hooks/useBasket';
import { useToast } from '../hooks/useToast';
import { getBasketItemImageUrl } from '../lib/imageUtils';
import { checkStock } from '../lib/api/bitrix';
import styles from '../styles/pages/CartPage.module.css';

// Mock data only for recently viewed products
const mockRecentlyViewedProducts = [
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv1',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv2',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv3',
    imageUrl: '/images/new-products/aim3.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv3',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv4',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖE ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv4',
    CATALOG_AVAILABLE: 'Y'
  },
];

const breadcrumbItems = [
  { href: '/', label: 'Главная' },
  { href: '/cart', label: 'Корзина' },
];

const CartPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cart');
  const [loadingItems, setLoadingItems] = useState(new Set()); // Track which items are loading
  
  // Toast system
  const { 
    toasts, 
    showSuccessToast, 
    showErrorToast, 
    removeToast 
  } = useToast();
  
  // Ref to track if we've already checked stock for current basket items
  const checkedBasketItemsRef = useRef(new Set());
  
  // Use the basket hook to get real basket data
  const {
    basketItems,
    basketData,
    basketCount,
    basketTotalPrice,
    isLoading: isBasketLoading,
    error,
    updateBasketItem,
    removeFromBasket,
    addToBasket,
    refetchBasket,
    isFuserIdInitialized,
    checkStock: basketCheckStock
  } = useBasket({
    initialFetch: true,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
    autoInitialize: true
  });

  // Check stock for all items when basket items are loaded
  useEffect(() => {
    const checkStockForCurrentBasketItems = async () => {
      if (!basketItems || basketItems.length === 0) {
        console.log('🔍 [Cart] No basket items to check stock for');
        return;
      }

      // Only check stock if fuser_id is initialized and we're not currently loading
      if (!isFuserIdInitialized || isBasketLoading) {
        console.log('🔍 [Cart] Skipping stock check - fuser_id not initialized or basket loading:', {
          isFuserIdInitialized,
          isBasketLoading
        });
        return;
      }

      // Create a signature for current basket state to avoid duplicate checks
      const currentBasketSignature = basketItems.map(item => `${item.id}-${item.product_id}-${item.quantity}`).join(',');
      
      // If we've already checked this exact basket state, skip
      if (checkedBasketItemsRef.current.has(currentBasketSignature)) {
        console.log('🔄 [Cart] Skipping stock check - already checked this basket state:', currentBasketSignature);
        return;
      }

      console.log('🔍 [Cart] Starting stock check for basket items:', {
        itemCount: basketItems.length,
        basketSignature: currentBasketSignature,
        items: basketItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity
        }))
      });

      // Track items that need stock updates
      let stockUpdatesMade = false;

      for (const item of basketItems) {
        try {
          // Validate item data before stock check
          if (!item.product_id || !item.quantity || !item.id) {
            console.warn(`⚠️ [Cart] Skipping item with missing data:`, {
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              name: item.name
            });
            continue;
          }

          const productId = parseInt(item.product_id, 10);
          const currentQuantity = parseInt(item.quantity, 10);
          const basketItemId = item.id;

          console.log(`🔍 [Cart] Checking stock for item:`, {
            basketItemId,
            productId,
            currentQuantity,
            name: item.name
          });
          
          const stockResponse = await basketCheckStock(productId, currentQuantity);
          
          console.log(`📋 [Cart] Stock check response for item ${basketItemId}:`, stockResponse);
          
          if (stockResponse && stockResponse.success !== undefined) {
            const availableQuantity = parseInt(stockResponse.available_quantity, 10) || 0;
            
            if (!stockResponse.success && stockResponse.available === false) {
              if (availableQuantity === 0) {
                // Remove item completely if no stock available
                console.log(`❌ [Cart] Removing item ${basketItemId}: ${item.name} (no stock available)`);
                await removeFromBasket(basketItemId);
                showErrorToast(`Товар "${item.name}" больше не доступен и был удален из корзины`);
                stockUpdatesMade = true;
              } else if (availableQuantity > 0 && availableQuantity < currentQuantity) {
                // Update quantity to available amount
                console.log(`🔄 [Cart] Updating item ${basketItemId} quantity from ${currentQuantity} to ${availableQuantity}`);
                await updateBasketItem(basketItemId, availableQuantity);
                showErrorToast(`Количество товара "${item.name}" было изменено на ${availableQuantity} (недостаточно на складе)`);
                stockUpdatesMade = true;
              }
            } else if (stockResponse.success && stockResponse.available === true) {
              // Item is available in requested quantity - no action needed
              console.log(`✅ [Cart] Item ${basketItemId} is available in requested quantity (${currentQuantity})`);
            }
          } else if (stockResponse && stockResponse.error) {
            // Handle API error responses
            console.error(`❌ [Cart] Stock check error for item ${basketItemId}:`, stockResponse.error);
            showErrorToast(`Ошибка при проверке товара "${item.name}": ${stockResponse.error}`);
          }
        } catch (error) {
          console.error(`❌ [Cart] Exception during stock check for item ${item.id}:`, error);
          showErrorToast(`Ошибка при проверке товара "${item.name}"`);
        }
      }
      
      // Mark this basket state as checked only if no updates were made
      // If updates were made, the useEffect will run again with new basket state
      if (!stockUpdatesMade) {
        console.log('✅ [Cart] Stock check completed, marking basket state as checked:', currentBasketSignature);
        checkedBasketItemsRef.current.add(currentBasketSignature);
        
        // Clean up old signatures to prevent memory leaks (keep only last 5)
        if (checkedBasketItemsRef.current.size > 5) {
          const signatures = Array.from(checkedBasketItemsRef.current);
          checkedBasketItemsRef.current = new Set(signatures.slice(-5));
        }
      } else {
        console.log('🔄 [Cart] Stock updates were made, will recheck with new basket state');
      }
    };

    // Only run stock check if we have basket items and basket is not currently loading
    if (basketItems && basketItems.length > 0 && !isBasketLoading && isFuserIdInitialized) {
      checkStockForCurrentBasketItems();
    }
  }, [basketItems, isBasketLoading, isFuserIdInitialized]); // ✅ Оптимизированные зависимости

  // Fetch basket data on component mount, but only after fuser_id is initialized
  useEffect(() => {
    if (isFuserIdInitialized) {
      console.log('fuser_id initialized, fetching basket data on cart page');
      refetchBasket();
    }
  }, [refetchBasket, isFuserIdInitialized]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle adding products from "Recently Viewed" section
  const handleAddToCartRecentlyViewed = (product) => {
    console.log(`Adding recently viewed product to cart from Cart page - ProductCard will handle stock check`);
    // Note: Stock check is now handled directly in ProductCard component via addToBasketWithStockCheck
    // This function is kept for backwards compatibility but actual logic is in ProductCard
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product}
      onAddToCart={handleAddToCartRecentlyViewed}
    />
  );

  // Handle quantity changes for cart items
  const handleQuantityChange = async (itemId, newQuantity) => {
    console.log('🔄 [Cart] Handling quantity change:', {
      itemId,
      newQuantity,
      newQuantityType: typeof newQuantity,
      currentBasketItems: basketItems
    });
    
    // Add item to loading set
    setLoadingItems(prev => new Set([...prev, itemId]));
    
    try {
      // Ensure numeric value for API call
      const quantity = newQuantity === '' ? 1 : Math.max(1, parseInt(newQuantity, 10) || 1);
      
      console.log('🔄 [Cart] Processed quantity:', {
        originalQuantity: newQuantity,
        processedQuantity: quantity,
        itemId: itemId
      });
      
      await updateBasketItem(itemId, quantity);
      console.log('✅ [Cart] Basket item quantity updated successfully');
    } catch (error) {
      console.error('❌ [Cart] Failed to update basket item quantity:', error);
      // Show error message from the thrown exception
      showErrorToast(error.message || 'Ошибка при обновлении количества');
    } finally {
      // Remove item from loading set
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Handle removing items from cart
  const handleRemoveItem = async (itemId) => {
    // Add item to loading set
    setLoadingItems(prev => new Set([...prev, itemId]));
    
    try {
      await removeFromBasket(itemId);
    } catch (error) {
      console.error('Failed to remove basket item:', error);
      showErrorToast(error.message || 'Ошибка при удалении товара');
    } finally {
      // Remove item from loading set
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (activeTab === 'cart') {
      setActiveTab('delivery');
    } else if (activeTab === 'delivery') {
      // Would validate delivery form data here
      setActiveTab('payment');
    } else if (activeTab === 'payment') {
      // Would handle final payment processing here
      console.log('Finalizing order...');
    }
  };

  const getButtonText = () => {
    if (activeTab === 'cart') return 'Перейти к оформлению';
    if (activeTab === 'delivery') return 'Продолжить';
    if (activeTab === 'payment') return 'Оплатить заказ';
    return 'Продолжить';
  };

  // Dynamic breadcrumb based on active tab
  const dynamicBreadcrumbs = [
    { name: 'Главная', link: '/' },
    { name: 'Корзина', link: '/cart' },
    { 
      name: activeTab === 'cart' 
        ? 'Моя корзина' 
        : activeTab === 'delivery' 
          ? 'Информация о доставке' 
          : 'Оплата', 
      link: '/cart' 
    },
  ];

  // Calculate order summary values
  const subtotal = basketTotalPrice || 0;
  const shippingCost = basketItems && basketItems.length > 0 ? 650 : 0; // Example shipping cost
  const packagingCost = 0; // Free packaging
  const total = subtotal + shippingCost + packagingCost;

  // Format cart items for the CartItem component
  const formattedCartItems = basketItems?.map(item => {
    // Log the raw item structure to understand what IDs we have
    console.log('🔍 [Cart] Raw basket item structure:', {
      rawItem: item,
      availableIds: {
        id: item.id,
        basket_id: item.basket_id,
        basket_item_id: item.basket_item_id,
        product_id: item.product_id
      }
    });
    
    // Use the correct ID for basket operations (should be basket item ID, not product ID)
    const basketItemId = item.id || item.basket_item_id || item.basket_id;
    
    // Use the new image utility for proper URL formation
    const imageUrl = getBasketItemImageUrl(item);

    // Extract brand name with multiple fallbacks
    const brandName = item.brand_name || item.BRAND_NAME || item.brand || item.BRAND || 
                     item.properties?.BREND?.value || item.properties?.BRAND_NAME?.value ||
                     'Бренд';

    return {
      id: basketItemId, // Use the correct basket item ID
      imageUrl: imageUrl,
      name: item.name,
      brand: brandName,
      price: item.price,
      description: item.description || '',
      quantity: item.quantity,
      stock: item.available_quantity || 10, // Default to 10 if not provided
      productLink: item.detail_page_url || `/product/${item.id}`,
      isLoading: loadingItems.has(basketItemId) // Add loading state for this item
    };
  }) || [];

  return (
    <>
      <Head>
        <title>
          {activeTab === 'cart' && 'Моя корзина - Shop4Shoot'}
          {activeTab === 'delivery' && 'Информация о доставке - Shop4Shoot'}
          {activeTab === 'payment' && 'Оплата - Shop4Shoot'}
        </title>
        <meta name="description" content="Проверьте и оформите ваш заказ в интернет-магазине Shop4Shoot" />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <main className={styles.cartPageContainer}>
        <CartTabs activeTab={activeTab} onTabClick={handleTabClick} />
        
        <div className={styles.cartLayout}>
          {activeTab === 'cart' && (
            <section className={styles.cartItemsSection}>
              <h1 className={styles.mainTitle}>Моя корзина</h1>
              {isBasketLoading && basketItems.length === 0 ? (
                <div className={styles.loaderContainer}>
                  <p>Загрузка корзины...</p>
                </div>
              ) : error ? (
                <div className={styles.errorContainer}>
                  <p>Ошибка при загрузке корзины. Пожалуйста, попробуйте позже.</p>
                </div>
              ) : formattedCartItems.length > 0 ? (
                formattedCartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))
              ) : (
                <div className={styles.emptyCartContainer}>
                  <p className={styles.emptyCartMessage}>Ваша корзина пуста.</p>
                  <button 
                    className={styles.continueShoppingButton}
                    onClick={() => router.push('/catalog')}
                  >
                    Перейти в каталог
                  </button>
                </div>
              )}
            </section>
          )}

          {(activeTab === 'delivery' || activeTab === 'payment') && (
            <section className={styles.contentSection}>
              {activeTab === 'delivery' && (
                <>
                  <DeliveryInfoForm />
                </>
              )}
              {activeTab === 'payment' && (
                <>
                  <h1 className={styles.mainTitle}>Оплата</h1>
                  <div className={styles.placeholderContent}>
                    <p>Здесь будет форма для выбора способа оплаты и ввода платежных данных.</p>
                  </div>
                </>
              )}
            </section>
          )}

          <aside className={styles.orderDetailsSection}>
             <OrderSummary
                subtotal={subtotal}
                packagingCost={packagingCost}
                shippingCost={shippingCost}
                total={total}
                onCheckout={handleProceedToCheckout}
                buttonText={getButtonText()}
                isCheckoutDisabled={activeTab === 'cart' && (!formattedCartItems || formattedCartItems.length === 0)}
              />
          </aside>
        </div>
      </main>

      {/* Recently Viewed Products Section */}
      <ResponsiveProductSection 
        title="Рекомендуемые"
        subtitle=""
        viewAllLink="/catalog?filter=new"
        items={mockRecentlyViewedProducts}
        renderItem={renderRecentlyViewedProductCard}
        onAddToCart={handleAddToCartRecentlyViewed}
      />

      <Footer />
    </>
  );
};

export default CartPage;
