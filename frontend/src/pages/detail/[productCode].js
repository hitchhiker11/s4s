import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import ResponsiveProductSection from '../../components/ResponsiveProductSection';
import ProductCard from '../../components/ProductCard';
import ProductDetailCard from '../../components/ProductDetailCard';
import PreOrderModal from '../../components/modals/PreOrderModal';
import ToastContainer from '../../components/Toast/ToastContainer';
import styles from '../../styles/pages/ProductPage.module.css';
import { useBasket } from '../../hooks/useBasket';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

// TODO: Replace with real API call
const mockProductData = {
  id: '1',
  name: 'Название продукта (Mock)',
  brand: 'MockBrand',
  article: 'MB-001',
  availability: 'Есть в наличии',
  description: 'Описание товара...',
  price: 2100,
  images: [
    { id: 'img1', url: '/images/new-products/aim.png', alt: 'Product image' },
    { id: 'img2', url: '/images/new-products/aim2.png', alt: 'Thumb' },
  ],
  recommended: true,
};

const mockRecentlyViewed = [
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'Бренд',
    name: 'Недавно просмотренный 1',
    price: 2100,
    productLink: '/detail/rv1',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'Бренд',
    name: 'Недавно просмотренный 2',
    price: 2100,
    productLink: '/detail/rv2',
    CATALOG_AVAILABLE: 'Y',
  },
];

const ProductDetailPage = ({ productData = mockProductData, breadcrumbs = [] }) => {
  const router = useRouter();
  const { productCode } = router.query;

  // Basket operations and data
  const {
    basketItems,
    addToBasketWithStockCheck,
    updateBasketItem,
    removeFromBasket,
    checkStock,
    isFuserIdInitialized,
  } = useBasket({ initialFetch: true, autoInitialize: true, staleTime: 60000 });

  // Local loading state for quantity updates
  const [quantityLoading, setQuantityLoading] = useState(false);

  // Find if product already in basket
  const basketItem = basketItems.find(
    (item) => Number(item.product_id) === Number(productData.id)
  );

  const isInBasket = Boolean(basketItem);
  const basketQuantity = basketItem ? basketItem.quantity : 1;

  // Toast system
  const { toasts, showSuccessToast, showErrorToast, removeToast } = useToast();

  // Pre-order modal state
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = React.useState(false);

  const handleAddToCart = async (product) => {
    const productId = parseInt(product.productId || product.id || product.ID, 10);
    try {
      await addToBasketWithStockCheck({ product_id: productId, quantity: 1 });
      showSuccessToast('Товар успешно добавлен в корзину');
    } catch (error) {
      if (error.stockResponse) {
        const availableQuantity = error.stockResponse.available_quantity || 0;
        const message = availableQuantity > 0 ? `Доступно только ${availableQuantity} шт.` : 'Товар закончился на складе';
        showErrorToast(message);
      } else {
        showErrorToast(error.message || 'Ошибка при добавлении товара');
      }
    }
  };

  // Quantity change handler (uses stock check)
  const handleQuantityChange = async (newQuantity) => {
    if (!basketItem || quantityLoading) return;

    setQuantityLoading(true);
    try {
      const productId = parseInt(basketItem.product_id, 10);
      // Проверяем склад
      const stockResp = await checkStock(productId, newQuantity);
      if (stockResp && stockResp.success === false) {
        const available = stockResp.available_quantity || 0;
        const msg = available > 0
          ? `Доступно только ${available} шт.`
          : 'Товар закончился на складе';
        showErrorToast(msg);
        return;
      }

      await updateBasketItem(basketItem.id, newQuantity);
      showSuccessToast('Количество обновлено');
    } catch (err) {
      console.error('Error updating quantity', err);
      showErrorToast(err.message || 'Ошибка при изменении количества');
    } finally {
      setQuantityLoading(false);
    }
  };

  const handleRemoveFromBasket = async () => {
    if (!basketItem || quantityLoading) return;

    setQuantityLoading(true);
    try {
      await removeFromBasket(basketItem.id);
      showSuccessToast('Товар удалён из корзины');
    } catch (err) {
      console.error('Error removing from basket', err);
      showErrorToast(err.message || 'Ошибка при удалении товара');
    } finally {
      setQuantityLoading(false);
    }
  };

  const handlePreOrder = () => {
    setIsPreOrderModalOpen(true);
  };

  const handleClosePreOrderModal = () => {
    setIsPreOrderModalOpen(false);
  };

  const renderRecentlyViewedCard = (p) => (
    <ProductCard key={p.id} product={p} />
  );

  // Use breadcrumbs passed from getServerSideProps if available, otherwise fallback to a minimal chain
  const breadcrumbItems = breadcrumbs.length
    ? breadcrumbs
    : [
        { href: '/', label: 'Главная' },
        { href: '/catalog', label: 'Каталог' },
        { href: `/detail/${productCode}`, label: productData.name || 'Товар' },
      ];

  if (router.isFallback) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{productData.name} – Shop4Shoot</title>
        <meta name="description" content={productData.description?.substring(0, 160)} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.productPageContainer}>
        <div className={styles.productLayout}>
          <section className={styles.productDetailSection}>
            <ProductDetailCard
              product={productData}
              onAddToCart={handleAddToCart}
              onPreOrder={handlePreOrder}
              isInBasket={isInBasket && isFuserIdInitialized}
              basketQuantity={basketQuantity}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveFromBasket}
              quantityLoading={quantityLoading}
            />
          </section>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <PreOrderModal
        isOpen={isPreOrderModalOpen}
        onClose={handleClosePreOrderModal}
        productName={productData.name}
        productDescription={productData.description}
        productId={productData.id}
        productArticle={productData.article}
      />

      <ResponsiveProductSection
        title="Недавно просмотренные"
        subtitle=""
        items={mockRecentlyViewed}
        showViewAllLink={false}
        renderItem={renderRecentlyViewedCard}
      />
      <Footer />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { productCode } = params;

  try {
    // Fetch product data from Bitrix via API
    const { getCatalogItem, getCatalogSectionById } = await import('../../lib/api/bitrix');
    const { transformCatalogItem } = await import('../../lib/api/transformers');

    const apiResponse = await getCatalogItem({ code: productCode, with_images: 'Y', format: 'full' });

    if (apiResponse.error || !apiResponse.data) {
      return { notFound: true };
    }

    // Transform to component format
    let transformed = transformCatalogItem(apiResponse.data);

    // Normalize images for ProductDetailCard (need id/url/alt)
    const normalizedImages = (transformed.images || []).map((url, idx) => ({
      id: `img${idx}`,
      url,
      alt: transformed.name,
    }));

    const productData = { ...transformed, images: normalizedImages };

    // Build breadcrumbs chain based on category hierarchy
    const breadcrumbs = [
      { href: '/', label: 'Главная' },
      { href: '/catalog', label: 'Каталог' },
    ];

    try {
      // Определяем id раздела, в котором находится товар. Учитываем разные варианты, которые может вернуть API.
      const sectionId =
        apiResponse?.data?.fields?.IBLOCK_SECTION_ID ||
        apiResponse?.data?.fields?.SECTION_ID ||
        apiResponse?.data?.SECTION_ID ||
        apiResponse?.data?.section_id ||
        null;

      if (sectionId) {
        const categoryChain = [];
        const visited = new Set();
        let currentId = sectionId;

        // Traverse up the category tree to the root (max 10 levels to avoid infinite loop)
        for (let i = 0; i < 10 && currentId && !visited.has(currentId); i++) {
          visited.add(currentId);
          const sectionResp = await getCatalogSectionById(currentId, { with_element_count: 'N' });

          if (sectionResp.error || !sectionResp.data || sectionResp.data.length === 0) break;

          const section = sectionResp.data[0];
          // Skip technical root like "katalog_sayta"
          const sectionCode = section.fields?.CODE || section.code;
          if (sectionCode && sectionCode.toLowerCase() !== 'katalog_sayta') {
            categoryChain.unshift(section);
          }

          // Prepare for next iteration (parent)
          currentId = section.fields?.IBLOCK_SECTION_ID || section.fields?.SECTION_ID || null;
        }

        // Build hrefs incrementally for each section in chain
        const pathSegments = [];
        categoryChain.forEach((sec) => {
          const code = sec.fields?.CODE || sec.code || sec.id;
          const label = sec.name || sec.fields?.NAME || 'Категория';
          pathSegments.push(code);
          breadcrumbs.push({ href: `/catalog/${pathSegments.join('/')}`, label });
        });
      }
    } catch (crumbErr) {
      console.error('Error building breadcrumbs:', crumbErr);
    }

    // Finally add the product itself (no link)
    breadcrumbs.push({ href: `/detail/${productCode}`, label: productData.name || 'Товар' });

    return { props: { productData, breadcrumbs } };
  } catch (err) {
    console.error('Error fetching product data', err);
    return { notFound: true };
  }
}

export default ProductDetailPage; 