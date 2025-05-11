import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header'; // Assuming Header component exists
import Footer from '../components/Footer'; // Assuming Footer component exists
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import ResponsiveProductSection from '../components/ResponsiveProductSection'; // Use responsive wrapper
import ProductCard from '../components/ProductCard'; // Import card for rendering
import ProductGrid from '../components/ProductGrid'; // For "Recently Viewed"
import CartTabs from '../components/CartTabs/CartTabs'; // Added import
import DeliveryInfoForm from '../components/DeliveryInfoForm/DeliveryInfoForm'; // Added import
import styles from '../styles/pages/CartPage.module.css';
// Mock data for demonstration
const initialMockCartItems = [
  {
    id: '1',
    imageUrl: '/images/new-products/aim.png', // Replace with actual image path or use a placeholder service
    name: 'Полное название продукта, даже если оно очень длинное',
    brand: 'Бренд',
    price: 2100,
    description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.',
    quantity: 1,
    stock: 8,
    productLink: '/product/1'
  },
  {
    id: '2',
    imageUrl: '/images/new-products/aim.png', // Replace with actual image path
    name: 'Еще один товар, тоже с длинным названием для проверки верстки',
    brand: 'Другой Бренд',
    price: 1500,
    description: 'Consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.',
    quantity: 2,
    stock: 5,
    productLink: '/product/2'
  }
];

const mockRecentlyViewedProducts = [
  // Populate with product data similar to ProductGrid's expected format
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
  { href: `/cart/`, label: 'Моя корзина' } 
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialMockCartItems); // Use state for cart items
  const [activeTab, setActiveTab] = useState('cart'); // 'cart', 'delivery', 'payment'

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Placeholder add to cart handler
  const handleAddToCartRecentlyViewed = (productId) => {
    console.log(`Adding product ${productId} to cart (from HomePage)`);
    // Add actual cart logic here later
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product} // Pass the whole product object
      onAddToCart={handleAddToCartRecentlyViewed} 
    />
  );

  // Placeholder functions for quantity changes and item removal
  const handleQuantityChange = (itemId, newQuantity) => {
    console.log(`Attempting to change item ${itemId} quantity to ${newQuantity}`);
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId 
          ? { ...item, quantity: newQuantity === '' ? '' : Math.max(0, parseInt(newQuantity,10) || 0) } // Allow temp empty, ensure number
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    console.log(`Attempting to remove item ${itemId}`);
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const handleProceedToCheckout = () => {
    if (activeTab === 'cart') {
      setActiveTab('delivery'); // Move to delivery tab
    } else if (activeTab === 'delivery') {
      // Here you would typically validate delivery form data
      console.log('Proceeding to payment with items:', cartItems);
      setActiveTab('payment'); // Move to payment (placeholder)
    } else if (activeTab === 'payment') {
      // Here you would handle final payment processing
      console.log('Finalizing order...');
      // Navigate to checkout page or trigger checkout process
    }
  };

  const getButtonText = () => {
    if (activeTab === 'cart') return 'Перейти к оформлению';
    if (activeTab === 'delivery') return 'Продолжить';
    if (activeTab === 'payment') return 'Оплатить заказ'; // Example
    return 'Продолжить';
  };

  const breadcrumbs = [
    { name: 'Главная', link: '/' },
    { name: 'Корзина', link: '/cart' },
    { name: activeTab === 'cart' ? 'Моя корзина' : activeTab === 'delivery' ? 'Информация о доставке' : 'Оплата', link: '/cart' }, // Dynamic breadcrumb
  ];

  // Calculate totals based on the current cartItems state
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity === '' ? 0 : item.quantity), 0);
  const shippingCost = cartItems.length > 0 ? 650 : 0; // Example: shipping only if items exist
  const packagingCost = 0; // Example
  const total = subtotal + shippingCost + packagingCost;

  return (
    <>
      <Head>
        <title>
          {activeTab === 'cart' && 'Моя корзина - ShopShoot'}
          {activeTab === 'delivery' && 'Информация о доставке - ShopShoot'}
          {activeTab === 'payment' && 'Оплата - ShopShoot'}
        </title>
        <meta name="description" content="Проверьте и оформите ваш заказ в интернет-магазине ShopShoot" />
      </Head>
      <Header breadcrumbs={breadcrumbs} />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.cartPageContainer}>
        <CartTabs activeTab={activeTab} onTabClick={handleTabClick} /> {/* Added CartTabs */}
        
        <div className={styles.cartLayout}>
          {activeTab === 'cart' && (
            <section className={styles.cartItemsSection}>
              <h1 className={styles.mainTitle}>Моя корзина</h1>
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))
              ) : (
                <p className={styles.emptyCartMessage}>Ваша корзина пуста.</p>
              )}
            </section>
          )}

          {(activeTab === 'delivery' || activeTab === 'payment') && (
            <section className={styles.contentSection}> {/* New section for delivery/payment */}
              {activeTab === 'delivery' && (
                <>
                  {/* <div className={styles.infoText}>Lorem ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.</div> */}
                  <DeliveryInfoForm />
                </>
              )}
              {activeTab === 'payment' && (
                <>
                  <h1 className={styles.mainTitle}>Оплата</h1>
                  {/* Placeholder for Payment Form/Info */}
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
                buttonText={getButtonText()} // Pass dynamic button text
                isCheckoutDisabled={activeTab === 'cart' && cartItems.length === 0}
              />
          </aside>
        </div>
      </main>

        {/* New Arrivals Section using Responsive Wrapper */}
        <ResponsiveProductSection 
          title="Новые поступления"
          subtitle=""
          viewAllLink="/catalog?filter=new"
          items={mockRecentlyViewedProducts} // Use 'items' prop name
          renderItem={renderRecentlyViewedProductCard} // Pass the render function
          onAddToCart={handleAddToCartRecentlyViewed} // Still needed for ProductCard via renderItem
        />

      {/* <ProductGrid
        title="Недавно просмотренные"
        products={mockRecentlyViewedProducts}
        viewAllLink="#" // Optional: link to a page with all recently viewed items
        viewAllText="Смотреть все" // Optional
        // onAddToCart prop can be omitted if not applicable here or handled differently
      /> */}
      <Footer />
    </>
  );
};

export default CartPage;
