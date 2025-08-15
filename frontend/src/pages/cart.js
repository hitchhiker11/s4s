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
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { getBasketItemImageUrl } from '../lib/imageUtils';
import { checkStock, createOrder, getPaymentForm, getOrderStatus } from '../lib/api/bitrix';
import { normalizePhoneNumber, isValidRussianPhone } from '../lib/phone';
import styles from '../styles/pages/CartPage.module.css';

// Mock data removed - now using real recently viewed data from useRecentlyViewed hook

const breadcrumbItems = [
  { href: '/', label: 'Главная' },
  { href: '/cart', label: 'Корзина' },
];

const CartPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cart');
  
  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();
  
  // All state declarations first
  const [loadingItems, setLoadingItems] = useState(new Set()); // Track which items are loading
  const [cdekDeliveryPrice, setCdekDeliveryPrice] = useState(0); // CDEK delivery price
  const [selectedDelivery, setSelectedDelivery] = useState(null); // Selected delivery info
  const [userFormData, setUserFormData] = useState({});
  
  // Order state
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [isExistingOrder, setIsExistingOrder] = useState(false);
  const [isOrderStatusLoading, setIsOrderStatusLoading] = useState(false);

  // CDEK Widget state management to persist across tab switches
  const [cdekWidgetReady, setCdekWidgetReady] = useState(false);
  const [cdekScriptLoaded, setCdekScriptLoaded] = useState(false);
  
  // Toast system - объявляем рано, чтобы использовать в useEffect
  const { 
    toasts, 
    showSuccessToast, 
    showErrorToast, 
    removeToast 
  } = useToast();

  // Check for order_id parameter and handle existing orders
  const { order_id } = router.query;
  
  // Basket hook moved up to avoid TDZ in effects
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
    clearBasket,
    refetchBasket,
    isFuserIdInitialized,
    fuserId,
    checkStock: basketCheckStock
  } = useBasket({
    initialFetch: true,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
    autoInitialize: true
  });

  const hasBasketItems = Array.isArray(basketItems) && basketItems.length > 0;
  // Ref to track if we've already checked stock for current basket items
  const checkedBasketItemsRef = useRef(new Set());
  
  // Load last order from localStorage if no state and on payment tab
  useEffect(() => {
    if (activeTab === 'payment' && !orderId && !orderNumber && !orderTotal && !hasBasketItems) {
      try {
        const ordersRaw = localStorage.getItem('s4s_recent_orders');
        if (ordersRaw) {
          const orders = JSON.parse(ordersRaw);
          if (Array.isArray(orders) && orders.length > 0) {
            const lastOrder = orders[0]; // Первый = последний добавленный
            console.log('🔄 [Cart] Загружаем последний заказ из localStorage:', lastOrder);
            setOrderId(lastOrder.order_id);
            setOrderNumber(lastOrder.order_number);
            setOrderTotal(Number(lastOrder.total_amount));
            // Восстанавливаем данные пользователя если они есть
            if (lastOrder.customer_data) {
              const [firstName = '', lastName = ''] = (lastOrder.customer_data.name || '').split(' ');
              setUserFormData(prev => ({
                ...prev,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: lastOrder.customer_data.phone || '',
                email: lastOrder.customer_data.email || '',
                comment: lastOrder.customer_data.comment || ''
              }));
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ [Cart] Ошибка загрузки заказа из localStorage:', error);
      }
    }
  }, [activeTab, orderId, orderNumber, orderTotal, hasBasketItems]);
  
  useEffect(() => {
    const handleExistingOrder = async () => {
      if (!router.isReady || !order_id) return;
      
      setIsOrderStatusLoading(true);
      try {
        console.log('🔍 [Cart] Проверка статуса существующего заказа:', order_id);
        
        const orderStatus = await getOrderStatus(order_id);
        
        if (orderStatus.success && orderStatus.data) {
          const { is_paid, order_number } = orderStatus.data;
          
          if (is_paid) {
            // Заказ уже оплачен - редирект на страницу успеха
            console.log('✅ [Cart] Заказ уже оплачен, редирект на payment-success');
            router.push(`/payment-success?order_id=${order_id}&order_number=${order_number}`);
            return;
          } else {
            // Заказ не оплачен - показать страницу payment
            console.log('💳 [Cart] Заказ не оплачен, переход к оплате');
            setOrderId(order_id);
            setOrderNumber(order_number);
            setIsExistingOrder(true);
            setActiveTab('payment');
          }
        } else {
          // Ошибка получения статуса заказа
          console.error('❌ [Cart] Ошибка получения статуса заказа:', orderStatus.error);
          showErrorToast('Заказ не найден или произошла ошибка');
          router.push('/cart');
        }
      } catch (error) {
        console.error('❌ [Cart] Исключение при проверке статуса заказа:', error);
        showErrorToast('Ошибка при проверке статуса заказа');
        router.push('/cart');
      } finally {
        setIsOrderStatusLoading(false);
      }
    };

    handleExistingOrder();
  }, [router.isReady, order_id, router, showErrorToast]);
  
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

  // Handle CDEK delivery price changes
  // const handleDeliveryPriceChange = (price) => {
  //   console.log('🚚 [Cart] CDEK delivery price changed:', price);
  //   setCdekDeliveryPrice(price);
  // };

  // Handle CDEK delivery selection
  const handleDeliverySelect = (deliveryData) => {
    console.log('🚚 [Cart] CDEK delivery selected:', deliveryData);
    setSelectedDelivery(deliveryData);
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product}
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

  // Функция для обработки оплаты заказа
  const handlePayment = async () => {
    if (!orderId) {
      showErrorToast('Ошибка: не найден идентификатор заказа');
      return;
    }
    
    setIsPaymentLoading(true);
    try {
      console.log('💳 [Cart] Получение данных для оплаты заказа:', orderId);
      
      const paymentResponse = await getPaymentForm(orderId);
      
      if (paymentResponse.success && paymentResponse.data) {
        const { direct_payment_url, payment_form } = paymentResponse.data;
        
        // Приоритет у прямой ссылки
        if (direct_payment_url && direct_payment_url.trim()) {
          console.log('💳 [Cart] Редирект на прямую ссылку оплаты:', direct_payment_url);
          window.location.href = direct_payment_url;
        } else if (payment_form && payment_form.trim()) {
          console.log('💳 [Cart] Отправка формы оплаты');
          
          // Создаем временный контейнер для формы
          const formContainer = document.createElement('div');
          formContainer.innerHTML = payment_form.trim();
          
          // Ищем форму в HTML
          const form = formContainer.querySelector('form');
          if (form) {
            form.style.display = 'none';
            document.body.appendChild(formContainer);
            
            setTimeout(() => {
              form.submit();
              setTimeout(() => {
                if (document.body.contains(formContainer)) {
                  document.body.removeChild(formContainer);
                }
              }, 1000);
            }, 100);
          } else {
            throw new Error('Не найдена форма оплаты в ответе сервера');
          }
        } else {
          throw new Error('Не получены данные для оплаты');
        }
      } else {
        throw new Error(paymentResponse.error?.message || 'Ошибка при получении данных оплаты');
      }
    } catch (error) {
      console.error('❌ [Cart] Ошибка при переходе к оплате:', error);
      showErrorToast(error.message || 'Ошибка при переходе к оплате');
      setIsPaymentLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (activeTab === 'cart') {
      setActiveTab('delivery');
    } else if (activeTab === 'delivery') {
      // Normalize and validate phone
      const normalizedPhone = normalizePhoneNumber(userFormData.phoneNumber || '');

      // Валидация обязательных полей
      if (!userFormData.lastName || !userFormData.firstName || !userFormData.patronymic || !normalizedPhone || !userFormData.email) {
        showErrorToast('Пожалуйста, заполните обязательные поля: Фамилия, Имя, Отчество, Телефон, Email');
        return;
      }

      if (!isValidRussianPhone(normalizedPhone)) {
        showErrorToast('Некорректный формат номера телефона. Используйте формат +7XXXXXXXXXX');
        return;
      }

      // Простая валидация email
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email);
      if (!emailValid) {
        showErrorToast('Введите корректный email');
        return;
      }

      if (!selectedDelivery || (!selectedDelivery.delivery && !selectedDelivery.code)) {
        showErrorToast('Пожалуйста, выберите пункт выдачи');
        return;
      }
      
      // Создание заказа
      setIsOrderLoading(true);
      try {
        if (!fuserId) {
          throw new Error('Не удается получить идентификатор корзины');
        }
        
        const deliveryAddress = `${selectedDelivery.address?.city || ''}, ${selectedDelivery.address?.address || ''}`;
        
        const orderData = {
          fuser_id: fuserId,
          customer_name: userFormData.firstName,
          customer_lastname: userFormData.lastName || '',
          customer_middlename: userFormData.patronymic || '',
          customer_phone: normalizedPhone,
          customer_email: userFormData.email,
          cdek_code: selectedDelivery.delivery || selectedDelivery.code || '',
          delivery_address: deliveryAddress,
          comment: userFormData.comment || ''
        };
        
        console.log('🛒 [Cart] Создание заказа с данными:', orderData);
        
        const response = await createOrder(orderData);
        
        if (response.success) {
          const orderId = response.data.order_id;
          const orderNumber = response.data.order_number;
          const totalAmount = Number(response.data.total_amount || subtotal);
          
          setOrderId(orderId);
          setOrderNumber(orderNumber);
          setOrderTotal(totalAmount);
          
          // Сохраняем заказ в localStorage (максимум 2 последних)
          try {
            const newOrder = {
              order_id: orderId,
              order_number: orderNumber,
              total_amount: totalAmount,
              customer_data: {
                name: `${userFormData.firstName} ${userFormData.lastName}`,
                phone: normalizePhoneNumber(userFormData.phoneNumber || ''),
                email: userFormData.email,
                delivery_address: deliveryAddress,
                comment: userFormData.comment || ''
              },
              created_at: Date.now()
            };
            
            // Получаем существующие заказы
            const existingOrdersRaw = localStorage.getItem('s4s_recent_orders');
            let existingOrders = [];
            
            if (existingOrdersRaw) {
              try {
                existingOrders = JSON.parse(existingOrdersRaw);
                if (!Array.isArray(existingOrders)) existingOrders = [];
              } catch {
                existingOrders = [];
              }
            }
            
            // Добавляем новый заказ в начало и оставляем максимум 2
            existingOrders.unshift(newOrder);
            existingOrders = existingOrders.slice(0, 2);
            
            localStorage.setItem('s4s_recent_orders', JSON.stringify(existingOrders));
            console.log('💾 [Cart] Заказ сохранен в localStorage:', newOrder);
          } catch (error) {
            console.warn('⚠️ [Cart] Не удалось сохранить заказ в localStorage:', error);
          }
          
          showSuccessToast(`Заказ №${orderNumber} успешно создан!`);
          
          // Очищаем корзину после успешного создания заказа
          try {
            await clearBasket(fuserId);
            console.log('✅ [Cart] Корзина очищена после создания заказа');
          } catch (clearError) {
            console.warn('⚠️ [Cart] Не удалось очистить корзину:', clearError);
            // Не показываем ошибку пользователю, так как заказ уже создан
          }
          
          setActiveTab('payment');
        } else {
          const apiMessage = response?.error?.message || response?.message || 'Ошибка создания заказа';
          throw new Error(apiMessage);
        }
      } catch (error) {
        console.error('❌ [Cart] Ошибка создания заказа:', error);
        showErrorToast(error.message || 'Ошибка при создании заказа');
      } finally {
        setIsOrderLoading(false);
      }
    } else if (activeTab === 'payment') {
      // На шаге payment кнопка будет обрабатываться через handlePayment
      await handlePayment();
    }
  };

  const getButtonText = () => {
    if (activeTab === 'cart') return 'Перейти к оформлению';
    if (activeTab === 'delivery') {
      return isOrderLoading ? 'Создание заказа...' : 'Продолжить';
    }
    if (activeTab === 'payment') {
      return isPaymentLoading ? 'Переход к оплате...' : 'Оплатить заказ';
    }
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
  const shippingCost = 0; // Temporarily set to 0 as per user request
  const packagingCost = 0; // Free packaging
  
  // Use order total for payment step, basket total for other steps
  // On payment: show last-order total only when basket is empty; otherwise 0
  const subtotal = activeTab === 'payment'
    ? ((orderTotal && orderTotal > 0 && !hasBasketItems) ? Number(orderTotal) : 0)
    : (basketTotalPrice || 0);
  const total = subtotal + packagingCost; // + shippingCost; // Commented out shipping cost addition

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
      },
      available_quantity: item.available_quantity
    });
    
    // Use the correct ID for basket operations (should be basket item ID, not product ID)
    const basketItemId = item.id || item.basket_item_id || item.basket_id;
    
    // Use the new image utility for proper URL formation
    const imageUrl = getBasketItemImageUrl(item);

    // Extract brand name with multiple fallbacks
    const brandName = item.brand_name || item.BRAND_NAME || item.brand || item.BRAND || 
                     item.properties?.BREND?.value || item.properties?.BRAND_NAME?.value ||
                     'OTHER';

    // If available_quantity is not provided by the API, we can show it as available
    // since the item is in the basket (the stock check was done when adding)
    const stockToShow = item.available_quantity !== undefined && item.available_quantity !== null 
      ? item.available_quantity 
      : (item.quantity || 1); // Show at least the quantity in basket

    return {
      id: basketItemId, // Use the correct basket item ID
      imageUrl: imageUrl,
      name: item.name,
      brand: brandName,
      price: item.price,
      description: item.description || '',
      quantity: item.quantity,
      stock: stockToShow, // Always show stock information
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
                  <DeliveryInfoForm 
                    isActiveTab={activeTab === 'delivery'}
                    // onDeliveryPriceChange={handleDeliveryPriceChange}
                    onDeliverySelect={handleDeliverySelect}
                    onUserDataChange={setUserFormData}
                    // CDEK Widget state props
                    cdekWidgetReady={cdekWidgetReady}
                    setCdekWidgetReady={setCdekWidgetReady}
                    cdekScriptLoaded={cdekScriptLoaded}
                    setCdekScriptLoaded={setCdekScriptLoaded}
                    selectedDelivery={selectedDelivery}
                    setSelectedDelivery={setSelectedDelivery}
                  />
                </>
              )}
              {activeTab === 'payment' && (
                <>
                  {isOrderStatusLoading ? (
                    <div className={styles.loaderContainer}>
                      <p>Загрузка информации о заказе...</p>
                    </div>
                  ) : (
                    <>
                      <h1 className={styles.mainTitle}>Оплата заказа</h1>
                      {orderId && (
                        <div className={styles.orderInfo}>
                          <h2 className={styles.orderInfoTitle}>
                            {isExistingOrder ? 'Информация о заказе' : 'Ваш заказ сформирован'}
                          </h2>
                          <div className={styles.orderDetails}>
                            <div className={styles.orderInfoRow}>
                              <span>Номер заказа:</span>
                              <strong>№{orderNumber || orderId}</strong>
                            </div>
                            {orderTotal ? (
                              <div className={styles.orderInfoRow}>
                                <span>Сумма заказа:</span>
                                <strong>₽{Number(orderTotal).toLocaleString('ru-RU')}</strong>
                              </div>
                            ) : null}

                            {!isExistingOrder && (
                              <>
                                <div className={styles.orderInfoRow}>
                                  <span>Получатель:</span>
                                  <span>{userFormData.firstName} {userFormData.lastName}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                  <span>Телефон:</span>
                                  <span>{userFormData.phoneNumber}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                  <span>Email:</span>
                                  <span>{userFormData.email}</span>
                                </div>
                                {selectedDelivery && (
                                  <div className={styles.orderInfoRow}>
                                    <span>Пункт выдачи:</span>
                                    <span>{selectedDelivery.address?.name || 'СДЭК'}, {selectedDelivery.address?.city}, {selectedDelivery.address?.address}</span>
                                  </div>
                                )}
                                {userFormData.comment && (
                                  <div className={styles.orderInfoRow}>
                                    <span>Комментарий:</span>
                                    <span>{userFormData.comment}</span>
                                  </div>
                                )}
                              </>
                            )}
                            {isExistingOrder && (
                              <div className={styles.orderInfoRow}>
                                <span>Статус:</span>
                                <span>Ожидает оплаты</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className={styles.paymentInfo}>
                        <p>После нажатия кнопки "Оплатить заказ" вы будете перенаправлены на безопасную страницу оплаты Робокассы.</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          <aside className={styles.orderDetailsSection}>
             {!isOrderStatusLoading && (
               <OrderSummary
                  subtotal={subtotal}
                  packagingCost={packagingCost}
                  shippingCost={shippingCost}
                  total={total}
                  onCheckout={handleProceedToCheckout}
                  buttonText={getButtonText()}
                  isCheckoutDisabled={
                    (activeTab === 'cart' && (!formattedCartItems || formattedCartItems.length === 0)) ||
                    (activeTab === 'delivery' && isOrderLoading) ||
                    (activeTab === 'payment' && (isPaymentLoading || isExistingOrder && !orderId))
                  }
                  isLoading={isOrderLoading || isPaymentLoading}
                />
             )}
          </aside>
        </div>
      </main>

      {/* Recently Viewed Products Section */}
      {hasRecentlyViewed && (
        <ResponsiveProductSection 
          title="Недавно просмотренные"
          subtitle=""
          viewAllLink="/catalog"
          showViewAllLink={false}
          items={recentlyViewed}
          renderItem={renderRecentlyViewedProductCard}
          useSliderOnDesktop={true} // Use slider instead of grid on desktop
          showNavigationOnDesktop={true} // Show navigation arrows on hover
          alwaysSlider={true} // Always use slider regardless of screen width
        />
      )}

      <Footer />
    </>
  );
};

export default CartPage;
