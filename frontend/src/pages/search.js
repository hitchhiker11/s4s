import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// API методы
import { searchData } from '../lib/searchUtils';
import { loadBitrixCore } from '../lib/auth';

// Компоненты
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import SubscriptionForm from '../components/SubscriptionForm';

// Стили
import { SIZES, COLORS, mediaQueries, SPACING } from '../styles/tokens';

// Add import for useBasket hook
import { useBasket } from '../hooks/useBasket';

// Styled Components
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
  margin-bottom: 8px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 24px;
    margin-bottom: 12px;
  }
`;

const SadPlaceholderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  margin-bottom: 20px;
`;

const SadPlaceholderImage = styled.img`
  width: 120px;
  height: 120px;
  opacity: 0.7;

  ${mediaQueries.sm} {
    width: 140px;
    height: 140px;
  }

  ${mediaQueries.md} {
    width: 160px;
    height: 160px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px 50px;
  color: #666;
  font-size: 18px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const SearchPage = ({ initialQuery, initialProducts, initialPagination, seo }) => {
  const router = useRouter();
  const { q: queryParam, page = '1' } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 24;

  // Add the useBasket hook
  const { addToBasket, refetchBasket } = useBasket({
    initialFetch: false,
    staleTime: 60000 // 1 minute
  });

  // Используем query из URL или из initialQuery
  const searchQuery = queryParam || initialQuery || '';

  // Запрос результатов поиска с пагинацией
  const { data: searchDataResult, isError: searchIsError, isLoading: searchIsLoading } = useQuery(
    ['searchResults', searchQuery, currentPage, ITEMS_PER_PAGE],
    () => searchData(searchQuery, 'desktop', {
      page: currentPage,
      limit: ITEMS_PER_PAGE
    }),
    {
      enabled: !!searchQuery && searchQuery.length >= 2,
      staleTime: 1000 * 60 * 5, // 5 минут
      keepPreviousData: true, // Важно для пагинации
    }
  );

  // Извлекаем товары из результатов поиска
  const products = React.useMemo(() => {
    if (searchDataResult?.products) {
      return searchDataResult.products;
    }

    // Fallback к initialProducts если есть
    if (initialProducts) {
      return initialProducts;
    }

    return [];
  }, [searchDataResult, initialProducts]);

  // Получаем метаданные для пагинации
  const pagination = React.useMemo(() => {
    if (searchDataResult?.pagination) {
      return searchDataResult.pagination;
    }

    // Fallback к initialPagination если есть
    if (initialPagination) {
      return initialPagination;
    }

    return {
      totalPages: 1,
      currentPage: 1,
      totalItems: products.length
    };
  }, [searchDataResult, initialPagination, products]);

  // Update the handleAddToCart function to use the useBasket hook
  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10); // Convert ID to number
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
      console.log('Product added to cart:', productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Обработчик смены страницы
  const handlePageChange = (newPage) => {
    router.push({
      pathname: '/search',
      query: {
        q: searchQuery,
        page: newPage
      }
    });
  };

  useEffect(() => {
    loadBitrixCore();
  }, []);

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/search', label: 'Поиск' },
  ];

  // Если есть поисковый запрос, добавляем его в breadcrumbs
  if (searchQuery) {
    breadcrumbItems.push({
      href: `/search?q=${encodeURIComponent(searchQuery)}`,
      label: `Результаты: "${searchQuery}"`
    });
  }

  return (
    <>
      <Head>
        <title>{seo?.title || (searchQuery ? `Результаты поиска: "${searchQuery}" - Shop4Shoot` : 'Поиск по сайту - Shop4Shoot')}</title>
        <meta name="description" content={seo?.description || (searchQuery ? `Найдите товары по запросу "${searchQuery}" в интернет-магазине Shop4Shoot` : 'Ищите товары в нашем интернет-магазине снаряжения для стрельбы и охоты')} />
        <meta name="robots" content="index, follow" />
        {searchQuery && <meta name="keywords" content={`${searchQuery}, поиск, товары, интернет-магазин`} />}
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <PageTitle>
          {searchQuery && searchQuery.length >= 2
            ? `Результаты поиска: "${searchQuery}"`
            : 'Поиск по товарам'
          }
        </PageTitle>

        {searchIsLoading ? (
          <LoadingState>Поиск товаров...</LoadingState>
        ) : products && products.length > 0 ? (
          <>
            <ProductGrid
              showTitleRow={false}
              showHeaderDivider={false}
              gridSectionStyles={`
                padding: 0px 0px 16px 12px !important;
                @media (min-width: 768px) {
                  padding: 0px 0px 16px 12px !important;
                }
                @media (min-width: 1200px) {
                  padding: 0px 0px 16px 12px !important;
                }
                @media (min-width: 1920px) {
                  padding: 0px 0px 16px 12px !important;
                }
              `}
              products={products.map(product => ({
                ...product,
                imageUrl: product.imageUrl || product.image,
                productLink: product.detailUrl || `/detail/${product.slug}`,
                CATALOG_AVAILABLE: product.available ? 'Y' : 'N',
                CATALOG_QUANTITY: product.quantity ? String(product.quantity) : "0",
                CODE: product.code || product.slug
              }))}
            />

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : searchQuery && searchQuery.length >= 2 ? (
          <>
            <SadPlaceholderContainer>
              <SadPlaceholderImage src="/images/placeholder-sad.png" alt="Ничего не найдено" />
            </SadPlaceholderContainer>
            <EmptyState>
              По вашему запросу "{searchQuery}" ничего не найдено.
              <br />
              Попробуйте изменить поисковый запрос или воспользуйтесь навигацией по категориям.
            </EmptyState>
          </>
        ) : (
          <>
            <SadPlaceholderContainer>
              <SadPlaceholderImage src="/images/placeholder-sad.png" alt="Поиск товаров" />
            </SadPlaceholderContainer>
            <EmptyState>
              Введите поисковый запрос для поиска товаров.
            </EmptyState>
          </>
        )}

        <SubscriptionForm />
      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { q: queryParam, page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 24;
  const queryClient = new QueryClient();

  const searchQuery = queryParam || '';

  try {
    let initialProducts = [];
    let initialPagination = {
      totalPages: 1,
      currentPage: 1,
      totalItems: 0
    };

    // Если есть поисковый запрос, предварительно запрашиваем результаты
    if (searchQuery && searchQuery.length >= 2) {
      await queryClient.prefetchQuery(['searchResults', searchQuery, currentPage, ITEMS_PER_PAGE], () =>
        searchData(searchQuery, 'desktop', {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        })
      );

      // Получаем данные из кэша
      const searchDataResult = queryClient.getQueryData(['searchResults', searchQuery, currentPage, ITEMS_PER_PAGE]);

      if (searchDataResult?.products) {
        initialProducts = searchDataResult.products;
      }

      if (searchDataResult?.pagination) {
        initialPagination = searchDataResult.pagination;
      }
    }

    // SEO данные
    const seo = {
      title: searchQuery ? `Результаты поиска: "${searchQuery}" | Shop4Shoot` : 'Поиск по товарам | Shop4Shoot',
      description: searchQuery
        ? `Найдите товары по запросу "${searchQuery}" в нашем интернет-магазине Shop4Shoot`
        : 'Ищите товары в нашем интернет-магазине снаряжения для стрельбы и охоты',
    };

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialQuery: searchQuery,
        initialProducts,
        initialPagination,
        seo,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialQuery: searchQuery,
        initialProducts: [],
        initialPagination: {
          totalPages: 1,
          currentPage: 1,
          totalItems: 0
        },
        seo: {
          title: searchQuery ? `Результаты поиска: "${searchQuery}" | Shop4Shoot` : 'Поиск по товарам | Shop4Shoot',
          description: searchQuery
            ? `Найдите товары по запросу "${searchQuery}" в нашем интернет-магазине Shop4Shoot`
            : 'Ищите товары в нашем интернет-магазине снаряжения для стрельбы и охоты',
        },
      },
    };
  }
}

export default SearchPage;
