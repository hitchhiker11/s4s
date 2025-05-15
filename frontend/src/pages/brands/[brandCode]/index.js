import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, dehydrate, QueryClient } from 'react-query';

import { catalogApi } from '../../../lib/api';
import { loadBitrixCore } from '../../../lib/auth';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductGrid from '../../../components/ProductGrid';
import ResponsiveProductSection from '../../../components/ResponsiveProductSection';
import Pagination from '../../../components/Pagination';
import SubscriptionForm from '../../../components/SubscriptionForm';

import { SIZES, COLORS, mediaQueries } from '../../../styles/tokens';

// Styled components for this page
const Container = styled.div`
  max-width: 1392px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  
  ${mediaQueries.sm} {
    padding: 0 16px;
  }
  
  ${mediaQueries.md} {
    padding: 0 20px;
  }
  
  ${mediaQueries.lg} {
    padding: 0 40px;
  }
`;

const Title = styled.h1`
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

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

const BrandImage = styled.div`
  margin-bottom: 40px;
  max-width: 300px;
  
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const BrandProductsPage = ({ initialData, brandCode, seo }) => {
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);

  const ITEMS_PER_PAGE = 18; // Defined items per page

  // Fetch products for the brand
  const { data, isLoading, error } = useQuery(
    ['brandProducts', brandCode, currentPage],
    () => catalogApi.getProductsByBrand(brandCode, currentPage, ITEMS_PER_PAGE), 
    {
      initialData,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  useEffect(() => {
    loadBitrixCore();
  }, []);

  if (isLoading && !data) {
    return (
      <>
        <Header />
        <Container><LoadingState>Загрузка товаров...</LoadingState></Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container>
          <EmptyState>
            Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.
          </EmptyState>
        </Container>
        <Footer />
      </>
    );
  }

  const products = data?.ITEMS || [];
  const totalPages = data?.NAV_PARAMS?.TOTAL_PAGES || 1;
  const brandName = data?.SEO?.BRAND_NAME || brandCode;

  // Links for breadcrumbs
  const brandsLink = "/brands";
  const currentBrandLink = `${brandsLink}/${brandCode}`;

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: brandsLink, label: 'Бренды' },
    { href: currentBrandLink, label: brandName },
  ];
  
  const recentlyViewed = data?.RECENTLY_VIEWED || [];

  const handlePageChange = (newPage) => {
    router.push(`/brands/${brandCode}?page=${newPage}`, undefined, { shallow: true });
  };
  
  const handleAddToCart = (product) => {
    console.log('Added to cart (from brand products page):', product);
  };

  const gridContainerStyle = {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '20px',
    rowGap: '30px',
    alignItems: 'start'
  };
  
  const preOrderWrapperProps = {
    style: {
      height: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  };

  return (
    <>
      <Head>
        <title>{seo?.TITLE || `${brandName} | Бренды`}</title>
        <meta name="description" content={seo?.DESCRIPTION || `Товары бренда ${brandName}`} />
        <meta name="keywords" content={seo?.KEYWORDS || `${brandName}, бренды, товары`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <Title>{brandName}</Title>

        {products.length > 0 ? (
          <ProductGrid
            showTitleRow={false}
            products={products}
            onAddToCart={handleAddToCart}
            gridContainerStyle={gridContainerStyle}
            preOrderWrapperProps={preOrderWrapperProps}
          />
        ) : (
          <EmptyState>У этого бренда пока нет товаров.</EmptyState>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {recentlyViewed.length > 0 && (
          <ResponsiveProductSection
            showViewAllLink={false}
            items={recentlyViewed}
            title="Недавно просмотренные"
            onAddToCart={handleAddToCart}
          />
        )}
        
        <SubscriptionForm />

      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { brandCode, page = 1 } = context.query;
  const currentPage = parseInt(page);
  const ITEMS_PER_PAGE = 18;
  const queryClient = new QueryClient();

  if (!brandCode) {
    return { notFound: true };
  }

  try {
    await queryClient.prefetchQuery(
      ['brandProducts', brandCode, currentPage],
      () => catalogApi.getProductsByBrand(brandCode, currentPage, ITEMS_PER_PAGE)
    );
    
    const dehydratedState = dehydrate(queryClient);
    const data = queryClient.getQueryData(['brandProducts', brandCode, currentPage]);
    const seo = data?.SEO || {};
    const pageTitle = seo?.TITLE || `Товары бренда ${brandCode}`;

    return {
      props: {
        dehydratedState,
        brandCode,
        seo,
        pageTitle,
      },
    };
  } catch (error) {
    console.error('Error fetching brand products data:', error);
    return {
      props: {
        brandCode,
        seo: {
          TITLE: `Товары бренда ${brandCode}`,
          DESCRIPTION: `Товары бренда ${brandCode}`,
        },
      },
    };
  }
}

export default BrandProductsPage; 