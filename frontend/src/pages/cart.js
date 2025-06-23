import React, { useState, useEffect } from 'react';
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
import { useBasket } from '../hooks/useBasket';
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
  
  // Use the basket hook to get real basket data
  const {
    basketItems,
    basketData,
    basketCount,
    basketTotalPrice,
    isLoading,
    error,
    updateBasketItem,
    removeFromBasket,
    addToBasket,
    refetchBasket
  } = useBasket({
    initialFetch: true,
    refetchOnWindowFocus: true,
    staleTime: 30000 // 30 seconds
  });

  // Fetch basket data on component mount
  useEffect(() => {
    refetchBasket();
  }, [refetchBasket]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle adding products from "Recently Viewed" section
  const handleAddToCartRecentlyViewed = (product) => {
    const productId = parseInt(product.ID || product.id, 10); // Convert ID to number
    addToBasket({ product_id: productId, quantity: 1 });
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product}
      onAddToCart={handleAddToCartRecentlyViewed}
    />
  );

  // Handle quantity changes for cart items
  const handleQuantityChange = (itemId, newQuantity) => {
    // Ensure numeric value for API call
    const quantity = newQuantity === '' ? 1 : Math.max(1, parseInt(newQuantity, 10) || 1);
    updateBasketItem(itemId, quantity);
  };

  // Handle removing items from cart
  const handleRemoveItem = (itemId) => {
    removeFromBasket(itemId);
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
  const formattedCartItems = basketItems?.map(item => ({
    id: item.id,
    imageUrl: item.product_image || '/images/product-placeholder.png',
    name: item.name,
    brand: item.brand_name || 'Бренд',
    price: item.price,
    description: item.description || '',
    quantity: item.quantity,
    stock: item.available_quantity || 10, // Default to 10 if not provided
    productLink: item.detail_page_url || `/product/${item.id}`
  })) || [];

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

      <main className={styles.cartPageContainer}>
        <CartTabs activeTab={activeTab} onTabClick={handleTabClick} />
        
        <div className={styles.cartLayout}>
          {activeTab === 'cart' && (
            <section className={styles.cartItemsSection}>
              <h1 className={styles.mainTitle}>Моя корзина</h1>
              {isLoading ? (
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
        title="Новые поступления"
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
