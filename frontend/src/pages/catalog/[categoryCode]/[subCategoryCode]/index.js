import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, dehydrate, QueryClient } from 'react-query';

import { catalogApi } from '../../../../lib/api'; // Adjusted path
import { loadBitrixCore } from '../../../../lib/auth'; // Adjusted path
import Header from '../../../../components/Header'; // Adjusted path
import Footer from '../../../../components/Footer'; // Adjusted path
import Breadcrumbs from '../../../../components/Breadcrumbs'; // Adjusted path
import ProductGrid from '../../../../components/ProductGrid'; // Adjusted path
import ResponsiveProductSection from '../../../../components/ResponsiveProductSection'; // Adjusted path
import Pagination from '../../../../components/Pagination'; // Adjusted path
import SubscriptionForm from '../../../../components/SubscriptionForm'; // Import the new component

import { SIZES, COLORS, mediaQueries } from '../../../../styles/tokens'; // Adjusted path

// Styled components for this page (can be adjusted or extended)
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

// Renamed component to avoid conflict and reflect its purpose
const SubCategoryProductsPage = ({ initialData, categoryCode, subCategoryCode, sectionId, seo }) => {
  const router = useRouter();
  // categoryCode and subCategoryCode are now directly from props (passed by getServerSideProps)
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);

  // Fetch products for the subcategory
  const { data, isLoading, error } = useQuery(
    // sectionId might still be relevant for some API calls, or it might be part of category/subCategory logic
    ['subCategoryProducts', categoryCode, subCategoryCode, sectionId, currentPage],
    // Ensure catalogApi.getProductsBySubCategory can handle categoryCode if needed, or use a more specific API method
    () => catalogApi.getProductsBySubCategory(categoryCode, subCategoryCode, sectionId, currentPage, 18), 
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
  const totalPages = data?.NAV_RESULT?.nPageCount || 1;
  // Names should ideally come from `data` fetched by the API for this specific subCategory
  const subCategoryName = data?.SECTION?.NAME || subCategoryCode; 
  const categoryName = data?.PARENT_SECTION?.NAME || categoryCode; // Fallback to code
  // Links for breadcrumbs
  const catalogLink = "/catalog";
  const categoryLink = `${catalogLink}/${categoryCode}`;
  const currentSubCategoryLink = `${categoryLink}/${subCategoryCode}`;

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: catalogLink, label: 'Каталог' }, // Main catalog page
    { href: categoryLink, label: categoryName }, // Parent category page
    { href: currentSubCategoryLink, label: subCategoryName } // Current subcategory products page
  ];
  
  const recentlyViewed = data?.RECENTLY_VIEWED || [];

  const handlePageChange = (newPage) => {
    // sectionId might or might not be needed in the URL depending on API and routing for pagination
    const queryParams = sectionId ? `?sectionId=${sectionId}&page=${newPage}` : `?page=${newPage}`;
    router.push(`/catalog/${categoryCode}/${subCategoryCode}${queryParams}`, undefined, { shallow: true });
  };
  
  const handleAddToCart = (product) => {
    console.log('Added to cart (from subCategoryProducts page):', product);
  };

  return (
    <>
      <Head>
        <title>{seo?.TITLE || `${subCategoryName} - ${categoryName} | Каталог`}</title>
        <meta name="description" content={seo?.DESCRIPTION || `Товары из подкатегории ${subCategoryName} категории ${categoryName}`} />
        <meta name="keywords" content={seo?.KEYWORDS || `${subCategoryName}, ${categoryName}, каталог, товары`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <Title>{subCategoryName}</Title>

        {products.length > 0 ? (
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <EmptyState>В этой подкатегории пока нет товаров.</EmptyState>
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
  const { categoryCode, subCategoryCode, sectionId = 0, page = 1 } = context.query;
  const currentPage = parseInt(page);
  const queryClient = new QueryClient();

  if (!categoryCode || !subCategoryCode) {
    return { notFound: true }; // Essential params are missing
  }

  try {
    await queryClient.prefetchQuery(
      ['subCategoryProducts', categoryCode, subCategoryCode, sectionId, currentPage],
      () => catalogApi.getProductsBySubCategory(categoryCode, subCategoryCode, sectionId, currentPage, 18)
    );
    
    const dehydratedState = dehydrate(queryClient);
    const data = queryClient.getQueryData(['subCategoryProducts', categoryCode, subCategoryCode, sectionId, currentPage]);
    const seo = data?.SEO || {};
    // Names should ideally come from API response for consistency
    const currentSubCategoryName = data?.SECTION?.NAME || subCategoryCode;
    const parentCategoryName = data?.PARENT_SECTION?.NAME || categoryCode;

    return {
      props: {
        dehydratedState,
        categoryCode,
        subCategoryCode,
        sectionId: sectionId, // sectionId might still be used by API or for specific logic
        seo,
        pageTitle: `${currentSubCategoryName} - ${parentCategoryName}`,
      },
    };
  } catch (error) {
    console.error('Error fetching subcategory products data:', error);
    return {
      props: {
        categoryCode,
        subCategoryCode,
        sectionId: sectionId,
        seo: {},
        pageTitle: `${subCategoryCode} - ${categoryCode}`, // Fallback title
        error: JSON.stringify(error) // Send error for debugging on client if needed
      },
    };
  }
}

export default SubCategoryProductsPage; // Renamed export 