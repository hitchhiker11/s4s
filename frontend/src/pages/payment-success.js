import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ResponsiveProductSection from '../components/ResponsiveProductSection';
import ProductCard from '../components/ProductCard';
import { useBasket } from '../hooks/useBasket';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import styles from '../styles/pages/PaymentSuccessPage.module.css';

// Mock data removed - now using real recently viewed data from useRecentlyViewed hook

const breadcrumbItems = [
  { href: '/', label: 'Главная' },
  { href: '/cart', label: 'Корзина' },
  { href: '/payment-success', label: 'Оплата завершена' },
];

const PaymentSuccessPage = () => {
  const router = useRouter();
  const { order_id, order_number } = router.query;
  const [effectiveOrder, setEffectiveOrder] = React.useState({ id: null, number: null });

  React.useEffect(() => {
    const metaRaw = typeof window !== 'undefined' ? localStorage.getItem('s4s_unpaid_order_meta') : null;
    if (metaRaw) {
      try {
        const meta = JSON.parse(metaRaw);
        if (meta?.order_id && meta?.order_number) {
          setEffectiveOrder({ id: meta.order_id, number: meta.order_number });
          // Очистим, если успешно на странице успеха
          localStorage.removeItem('s4s_unpaid_order_meta');
          return;
        }
      } catch {}
    }
    setEffectiveOrder({ id: order_id || null, number: order_number || null });
  }, [order_id, order_number]);

  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product}
    />
  );

  const handleContinueShopping = () => {
    router.push('/catalog');
  };

  return (
    <>
      <Head>
        <title>Заказ оплачен - Shop4Shoot</title>
        <meta name="description" content="Ваш заказ успешно оплачен и принят в обработку" />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.paymentSuccessContainer}>
        <div className={styles.successContent}>
          <div className={styles.successMessage}>
            <img 
              src="/images/placeholder.png" 
              alt="Заказ оплачен" 
              className={styles.successImage}
            />
            <h1 className={styles.successTitle}>
              Заказ №{effectiveOrder.number || effectiveOrder.id || '<>'} оплачен
            </h1>
            <p className={styles.successDescription}>
              Спасибо за покупку! Ваш заказ принят в обработку. 
              Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.
            </p>
            <button 
              onClick={handleContinueShopping}
              className={styles.continueShoppingButton}
            >
              Продолжить покупки
            </button>
          </div>
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

export default PaymentSuccessPage; 