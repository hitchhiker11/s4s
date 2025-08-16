import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Импортируем методы API для работы с брендами
import { getBrandByCode, getCatalogItemsByBrand } from '../../lib/api/bitrix';
import { transformCatalogItems } from '../../lib/api/transformers';
import { loadBitrixCore } from '../../lib/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProductGrid from '../../components/ProductGrid';
import Pagination from '../../components/Pagination';
import ResponsiveProductSection from '../../components/ResponsiveProductSection';
import SubscriptionForm from '../../components/SubscriptionForm';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

import { SIZES, COLORS, mediaQueries, SPACING } from '../../styles/tokens';

// Add import for useBasket hook
import { useBasket } from '../../hooks/useBasket';

// Styled components
const Container = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  ${mediaQueries.sm} { padding: 0 16px; }
  ${mediaQueries.md} { padding: 0 20px; }
  ${mediaQueries.lg} { padding: 0 40px; }
`;

const PageTitle = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 1em;
  color: #1C1C1C;
  margin-top: 24px;
  margin-bottom: 24px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const BrandInfo = styled.div`
  // margin-bottom: 16px;
  
  padding: 24px;
  padding-bottom: 0;
  background: ${COLORS.gray50};
  border-radius: 8px;
  
  ${mediaQueries.md} {
    padding: 32px;
    padding-bottom: 0;
    // margin-bottom: 48px;

  }
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  
  ${mediaQueries.md} {
    gap: 32px;
    margin-bottom: 24px;
  }
`;

const BrandLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: ${COLORS.white};
  border-radius: 8px;
  padding: 8px;
  
  ${mediaQueries.md} {
    width: 120px;
    height: 120px;
    padding: 12px;
  }
`;

const BrandDetails = styled.div`
  flex: 1;
`;

const BrandName = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: #1C1C1C;
  margin: 0 0 8px 0;
  
  ${mediaQueries.md} {
    font-size: 32px;
    margin: 0 0 12px 0;
  }
`;

const BrandMeta = styled.div`
  color: ${COLORS.gray600};
  font-size: 14px;
  
  ${mediaQueries.md} {
    font-size: 16px;
  }
`;

const BrandDescription = styled.p`
  color: ${COLORS.gray700};
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  
  ${mediaQueries.md} {
    font-size: 16px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

/**
 * Страница товаров конкретного бренда
 */
const BrandProductsPage = ({ brandData, initialProducts, seo }) => {
  const router = useRouter();
  const { brandCode } = router.query;
  const { page = 1, sort = 'date_create:desc' } = router.query;
  const currentPage = parseInt(page);

  // Initialize basket for add to cart functionality
  const { basketCount } = useBasket({
    initialFetch: false,
    autoInitialize: true,
    staleTime: 60000
  });

  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();

  // Получаем товары бренда
  const { data: productsData, isLoading, error } = useQuery(
    ['brandProducts', brandData?.id, currentPage, sort],
    () => getCatalogItemsByBrand(brandData.id, { 
      page: currentPage,
      limit: 12,
      sort: sort
    }),
    {
      initialData: initialProducts,
      enabled: !!brandData?.id,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000
    }
  );

  // Load Bitrix core
  useEffect(() => {
    loadBitrixCore();
  }, []);

  if (!brandData) {
    return (
      <>
        <Header />
        <Container>
          <ErrorState>Бренд не найден</ErrorState>
        </Container>
        <Footer />
      </>
    );
  }

  // Хлебные крошки
  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/brands', label: 'Бренды' },
    { href: `/brands/${brandCode}`, label: brandData.name }
  ];

  // Transform products data
  const products = React.useMemo(() => {
    if (!productsData?.data) return [];
    return transformCatalogItems(productsData.data);
  }, [productsData]);

  // Pagination logic
  const totalPages = productsData?.meta?.total_pages || 1;
  const totalProducts = productsData?.meta?.total_count || 0;

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage }
    });
  };

  return (
    <>
      <Head>
        <title>{seo?.TITLE || `${brandData.name} - товары бренда | Shop4Shoot`}</title>
        <meta name="description" content={seo?.DESCRIPTION || brandData.previewText || `Все товары бренда ${brandData.name} в нашем интернет-магазине`} />
        <meta name="keywords" content={seo?.KEYWORDS || `${brandData.name}, бренды, товары`} />
        <meta property="og:title" content={seo?.TITLE || `${brandData.name} - товары бренда | Shop4Shoot`} />
        <meta property="og:description" content={seo?.DESCRIPTION || brandData.previewText || `Все товары бренда ${brandData.name}`} />
        <meta property="og:type" content="website" />
        {brandData.imageUrl && (
          <meta property="og:image" content={brandData.imageUrl} />
        )}
      </Head>
      
      <Header mockBasketCount={basketCount || 0} />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <Container>
        {/* Brand Information Section */}
        <BrandInfo>
          <BrandHeader>
            {brandData.imageUrl && (
              <BrandLogo 
                src={brandData.imageUrl} 
                alt={brandData.name}
                onError={(e) => {
                  e.target.src = '/images/brands/placeholder.png';
                }}
              />
            )}
            <BrandDetails>
              <BrandName>{brandData.name}</BrandName>
              <BrandMeta>
                {totalProducts > 0 && `${totalProducts} товаров`}
              </BrandMeta>
            </BrandDetails>
          </BrandHeader>
          {brandData.previewText && (
            <BrandDescription>{brandData.previewText}</BrandDescription>
          )}
        </BrandInfo>

        {/* Products Section */}
        {isLoading ? (
          <LoadingState>Загрузка товаров...</LoadingState>
        ) : error ? (
          <ErrorState>
            Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.
          </ErrorState>
        ) : products.length === 0 ? (
          <ErrorState>
            В данный момент товары этого бренда отсутствуют в наличии
          </ErrorState>
        ) : (
          <>
            <ProductGrid
              showTitleRow={false}
              showHeaderDivider={false}
              gridSectionStyles="padding: 0px 12px 16px 12px"
              products={products.map((p) => ({
                ...p,
                imageUrl: p.image,
                productLink: p.detailUrl,
                CATALOG_AVAILABLE: p.inStock ? 'Y' : 'N',
                CATALOG_QUANTITY: p.quantity ? String(p.quantity) : '0',
                CODE: p.code,
              }))}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalProducts}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Recently Viewed Section */}
        {hasRecentlyViewed && (
          <div style={{ padding: `0 0 0 ${SPACING.md}` }}>
            <ResponsiveProductSection 
              title="Недавно просмотренные"
              subtitle=""
              showViewAllLink={false}
              items={recentlyViewed}
              useSliderOnDesktop={true} // Use slider instead of grid on desktop
              showNavigationOnDesktop={true} // Show navigation arrows on hover
              alwaysSlider={true} // Always use slider regardless of screen width
              gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
            />
          </div>
        )}

        <SubscriptionForm />
      </Container>
      
      <Footer />
    </>
  );
};

/**
 * Получение данных на сервере для SSR
 */
export async function getServerSideProps(context) {
  const { brandCode } = context.params;
  const { page = 1, sort = 'date_create:desc' } = context.query;
  
  const queryClient = new QueryClient();
  
  try {
    // console.log('[SSR] Fetching brand data for code:', brandCode);
    
    // Получаем данные бренда
    const brandData = await getBrandByCode(brandCode);
    
    if (!brandData || brandData.error) {
      // console.log('[SSR] Brand not found:', brandCode);
      return { notFound: true };
    }
    
    // console.log('[SSR] Brand found:', brandData.name, 'ID:', brandData.id);
    
    // Получаем товары бренда для SSR
    await queryClient.prefetchQuery(
      ['brandProducts', brandData.id, parseInt(page), sort],
      () => getCatalogItemsByBrand(brandData.id, {
        page: parseInt(page),
        limit: 12,
        sort: sort
      })
    );
    
    const productsData = queryClient.getQueryData(['brandProducts', brandData.id, parseInt(page), sort]);
    // console.log('[SSR] Products prefetched for brand:', productsData?.data?.length || 0, 'items');
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        brandData,
        initialProducts: productsData,
        seo: {
          TITLE: `${brandData.name} - товары бренда | Shop4Shoot`,
          DESCRIPTION: brandData.previewText || `Все товары бренда ${brandData.name} в нашем интернет-магазине. Качественная продукция от проверенного производителя.`,
          KEYWORDS: `${brandData.name}, бренды, товары, интернет-магазин, качество`
        }
      }
    };
  } catch (error) {
    // console.error('[SSR] Error fetching brand data:', error);
    return { notFound: true };
  }
}

export default BrandProductsPage; 