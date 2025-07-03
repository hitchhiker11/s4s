import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// API методы
import { getCategoryByCode, getCatalogItemsByCategory } from '../../../lib/api/bitrix';
import { transformCatalogItems } from '../../../lib/api/transformers';
import { loadBitrixCore } from '../../../lib/auth';

// Компоненты
import Layout from '../../../components/Layout';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductGrid from '../../../components/ProductGrid';
import Pagination from '../../../components/Pagination';
import SubscriptionForm from '../../../components/SubscriptionForm';

// Стили
import { SIZES, COLORS, mediaQueries, SPACING } from '../../../styles/tokens';

// Add import for useBasket hook
import { useBasket } from '../../../hooks/useBasket';

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
  margin-bottom: 24px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

// Трансформация данных из API
const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;
  
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    code: apiCategory.fields?.CODE || '',
    image: apiCategory.fields?.PICTURE ? `/upload/${apiCategory.fields.PICTURE}` : null,
  };
};

const CategoryAllProductsPage = ({ initialCategory, initialProducts, seo }) => {
  const router = useRouter();
  const { categoryCode, page = '1' } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 24; // Увеличенный лимит элементов на странице

  // Add the useBasket hook
  const { addToBasket, refetchBasket } = useBasket({
    initialFetch: false,
    staleTime: 60000 // 1 minute
  });

  // Запрос категории по символьному коду
  const { data: categoryData, isError: categoryIsError } = useQuery(
    ['category', categoryCode],
    () => getCategoryByCode(categoryCode, { limit: 1 }),
    {
      enabled: !!categoryCode,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  // Извлекаем информацию о категории из полученных данных
  const category = React.useMemo(() => {
    if (categoryData?.data && categoryData.data.length > 0) {
      return transformCategory(categoryData.data[0]);
    }
    
    // Fallback к initialCategory если есть
    if (initialCategory) {
      return initialCategory;
    }
    
    return null;
  }, [categoryData, initialCategory]);

  // Запрос товаров категории со всеми подкатегориями с пагинацией
  const { data: productsData, isError: productsIsError, isLoading: productsIsLoading } = useQuery(
    ['categoryProducts', category?.id, currentPage, ITEMS_PER_PAGE],
    () => getCatalogItemsByCategory(category.id, { 
      include_subsections: 'Y',
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      sort: 'date_create:asc' // Изменена сортировка с desc на asc
    }),
    {
      enabled: !!category?.id,
      staleTime: 1000 * 60 * 5, // 5 минут
      keepPreviousData: true, // Важно для пагинации
    }
  );

  // Преобразуем товары в формат для отображения
  const products = React.useMemo(() => {
    if (productsData?.data) {
      return transformCatalogItems(productsData.data);
    }
    
    // Fallback к initialProducts если есть
    if (initialProducts) {
      return initialProducts;
    }
    
    return [];
  }, [productsData, initialProducts]);

  // Получаем метаданные для пагинации
  const pagination = React.useMemo(() => {
    if (productsData?.meta) {
      return {
        totalPages: productsData.meta.total_pages || Math.ceil(productsData.meta.total_count / ITEMS_PER_PAGE),
        currentPage: currentPage,
        totalItems: productsData.meta.total_count || 0
      };
    }
    
    return {
      totalPages: 1,
      currentPage: 1,
      totalItems: products.length
    };
  }, [productsData, products, currentPage, ITEMS_PER_PAGE]);

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
      pathname: `/catalog/${categoryCode}/all`,
      query: { page: newPage }
    });
  };

  useEffect(() => {
    loadBitrixCore();
  }, []);

  if (!category) {
    return (
      <>
        <Header />
        <Container>
          <EmptyState>Категория не найдена.</EmptyState>
        </Container>
        <Footer />
      </>
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: `/catalog/${categoryCode}`, label: category.name },
    { href: `/catalog/${categoryCode}/all`, label: 'Все товары' }, // Текущая страница
  ];

  return (
    <>
      <Head>
        <title>{seo?.title || `${category.name} - Все товары`}</title>
        <meta name="description" content={seo?.description || `Все товары в категории ${category.name}`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <PageTitle>{category.name} - Все товары</PageTitle>

        {productsIsLoading ? (
          <LoadingState>Загрузка товаров...</LoadingState>
        ) : products && products.length > 0 ? (
          <>
            <ProductGrid 
              showTitleRow={false}
              products={products.map(product => ({
                ...product,
                imageUrl: product.image,
                productLink: product.detailUrl,
                CATALOG_AVAILABLE: product.inStock ? 'Y' : 'N',
                CATALOG_QUANTITY: product.quantity ? String(product.quantity) : "0",
                CODE: product.code
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
        ) : (
          <EmptyState>В этой категории пока нет товаров.</EmptyState>
        )}

        <SubscriptionForm />
      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { categoryCode, page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 24;
  const queryClient = new QueryClient();
  
  try {
    // Предварительно запрашиваем категорию по коду
    await queryClient.prefetchQuery(['category', categoryCode], () => 
      getCategoryByCode(categoryCode, { limit: 1 })
    );
    
    // Получаем данные категории из кэша
    const categoryData = queryClient.getQueryData(['category', categoryCode]);
    
    // Если категория не найдена, возвращаем 404
    if (!categoryData?.data || categoryData.data.length === 0) {
      return { notFound: true };
    }
    
    const category = transformCategory(categoryData.data[0]);
    
    // Предварительно запрашиваем товары категории
    await queryClient.prefetchQuery(['categoryProducts', category.id, currentPage, ITEMS_PER_PAGE], () => 
      getCatalogItemsByCategory(category.id, { 
        include_subsections: 'Y',
        limit: ITEMS_PER_PAGE,
        page: currentPage,
        sort: 'date_create:asc' // Изменена сортировка с desc на asc
      })
    );
    
    // Получаем данные товаров из кэша
    const productsData = queryClient.getQueryData(['categoryProducts', category.id, currentPage, ITEMS_PER_PAGE]);
    const products = productsData?.data
      ? transformCatalogItems(productsData.data)
      : [];
    
    // SEO данные
    const seo = {
      title: `${category.name} - Все товары | Shop4Shoot`,
      description: `Все товары в категории ${category.name} в нашем интернет-магазине Shop4Shoot.`,
    };
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialCategory: category,
        initialProducts: products,
        seo,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}

export default CategoryAllProductsPage; 