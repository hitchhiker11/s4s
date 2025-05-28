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
import styles from '../../../../styles/ProductGridResponsive.module.css'; // Import new CSS module

// Styled components for this page (can be adjusted or extended)
const Container = styled.div`
  max-width: 1920px;
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
const SubCategoryProductsPage = ({ initialData, categoryCode, subCategoryCode, seo }) => {
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);

  const ITEMS_PER_PAGE = 18; // Defined items per page

  // Fetch products for the subcategory
  const { data, isLoading, error } = useQuery(
    ['subCategoryProducts', categoryCode, subCategoryCode, currentPage], // Updated query key
    () => catalogApi.getProductsBySubCategory(categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE), 
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
  const totalPages = data?.NAV_PARAMS?.TOTAL_PAGES || 1; // Updated to use NAV_PARAMS
  // Use categoryCode and subCategoryCode for names directly, or enhance API to provide them
  const subCategoryName = data?.SEO?.SUBCATEGORY_NAME || subCategoryCode; 
  const categoryName = data?.SEO?.CATEGORY_NAME || categoryCode;

  // Links for breadcrumbs
  const catalogLink = "/catalog";
  const categoryLink = `${catalogLink}/${categoryCode}`;
  const currentSubCategoryLink = `${categoryLink}/${subCategoryCode}`;

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: catalogLink, label: 'Каталог' },
    { href: categoryLink, label: categoryName }, // Uses resolved or fallback categoryName
    { href: currentSubCategoryLink, label: subCategoryName }, // Uses resolved or fallback subCategoryName
  ];
  
  const recentlyViewed = data?.RECENTLY_VIEWED || []; // Assuming RECENTLY_VIEWED might still come from data

  const handlePageChange = (newPage) => {
    router.push(`/catalog/${categoryCode}/${subCategoryCode}?page=${newPage}`, undefined, { shallow: true }); // Simplified query params
  };
  
  const handleAddToCart = (product) => {
    console.log('Added to cart (from subCategoryProducts page):', product);
  };

  // Use CSS module class instead of inline styles
  const gridContainerClassName = styles.productGridContainer;
  
  // Добавьте эти пропсы для PreOrderWrapper
  const preOrderWrapperProps = {
    className: styles.preOrderWrapper
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
        <Title style={{ display: 'none' }}>{subCategoryName}</Title>

        {products.length > 0 ? (
          <ProductGrid
            showTitleRow={false}
            products={products}
            onAddToCart={handleAddToCart}
            gridContainerClassName={gridContainerClassName}
            preOrderWrapperProps={preOrderWrapperProps}
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
            showViewAllLink={false}
            items={recentlyViewed}
            title="Недавно просмотренные"
            onAddToCart={handleAddToCart}
            gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
          />
        )}
        
        <SubscriptionForm />

      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { categoryCode, subCategoryCode, page = 1 } = context.query; // Removed sectionId from destructuring
  const currentPage = parseInt(page);
  const ITEMS_PER_PAGE = 18; // Ensure this matches the client-side usage
  const queryClient = new QueryClient();

  if (!categoryCode || !subCategoryCode) {
    return { notFound: true }; // Essential params are missing
  }

  try {
    await queryClient.prefetchQuery(
      ['subCategoryProducts', categoryCode, subCategoryCode, currentPage], // Updated query key
      () => catalogApi.getProductsBySubCategory(categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE)
    );
    
    const dehydratedState = dehydrate(queryClient);
    const data = queryClient.getQueryData(['subCategoryProducts', categoryCode, subCategoryCode, currentPage]);
    const seo = data?.SEO || {};
    // For pageTitle, we can use SEO title or construct from codes/names
    const pageTitle = seo?.TITLE || `${subCategoryCode} - ${categoryCode}`;

    return {
      props: {
        dehydratedState,
        categoryCode,
        subCategoryCode,
        seo, // Pass the whole SEO object
        // sectionId is removed as it's not used by the API call for this page anymore
        pageTitle, // This can be used in Head if needed, or rely on seo.TITLE
      },
    };
  } catch (error) {
    console.error('Error fetching subcategory products data:', error);
    // Prepare props for error display or fallback
    const pageTitle = `${subCategoryCode} - ${categoryCode}`; // Fallback title
    return {
      props: {
        categoryCode,
        subCategoryCode,
        seo: { TITLE: pageTitle, DESCRIPTION: 'Ошибка загрузки данных' }, // Provide basic SEO for error page
        pageTitle,
        error: error.message ? error.message : 'Unknown error fetching data', // Pass a serializable error message
      },
    };
  }
}

export default SubCategoryProductsPage; 