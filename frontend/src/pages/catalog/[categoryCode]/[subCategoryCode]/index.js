import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, dehydrate, QueryClient } from 'react-query';

// API методы
import { getCategoryByCode, getSubcategories, getCatalogItemsBySubCategoryCode } from '../../../../lib/api/bitrix';
import { transformCatalogItems } from '../../../../lib/api/transformers';
import { loadBitrixCore } from '../../../../lib/auth';

// Компоненты
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ProductGrid from '../../../../components/ProductGrid';
import Pagination from '../../../../components/Pagination';
import SubscriptionForm from '../../../../components/SubscriptionForm';
import { useBasket } from '../../../../hooks/useBasket';

// Стили
import { SIZES, COLORS, mediaQueries } from '../../../../styles/tokens';

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

const SubCategoryProductsPage = ({ initialCategory, initialSubCategory, initialProducts, seo }) => {
  const router = useRouter();
  const { categoryCode, subCategoryCode, page = '1' } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12; // Количество товаров на странице

  const { addToBasket, refetchBasket } = useBasket({
    initialFetch: false,
    staleTime: 60000 // 1 minute
  });

  // Запрос категории по коду
  const { data: categoryData, isError: categoryIsError } = useQuery(
    ['category', categoryCode],
    () => getCategoryByCode(categoryCode, { limit: 1 }),
    {
      enabled: !!categoryCode,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  // Запрос подкатегории по коду
  const { data: subCategoryData, isError: subCategoryIsError } = useQuery(
    ['subcategory', subCategoryCode],
    () => getCategoryByCode(subCategoryCode, { limit: 1 }),
    {
      enabled: !!subCategoryCode,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  // Получаем данные категории
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

  // Получаем данные подкатегории
  const subCategory = React.useMemo(() => {
    if (subCategoryData?.data && subCategoryData.data.length > 0) {
      return transformCategory(subCategoryData.data[0]);
    }
    
    // Fallback к initialSubCategory если есть
    if (initialSubCategory) {
      return initialSubCategory;
    }
    
    return null;
  }, [subCategoryData, initialSubCategory]);

  // Запрос товаров подкатегории с пагинацией
  const { data: productsData, isError: productsIsError, isLoading: productsIsLoading } = useQuery(
    ['subcategoryProducts', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE],
    () => getCatalogItemsBySubCategoryCode(categoryCode, subCategoryCode, { 
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      sort: 'date_create:asc',
      include_subsections: 'Y'
    }),
    {
      enabled: !!categoryCode && !!subCategoryCode,
      staleTime: 1000 * 60 * 5, // 5 минут
      keepPreviousData: true, // Важно для пагинации
      refetchOnWindowFocus: false, // Отключаем рефетч при фокусе окна
      refetchOnMount: false, // Отключаем рефетч при монтировании
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
 
  // Обработчик смены страницы
  const handlePageChange = (newPage) => {
    router.push({
      pathname: `/catalog/${categoryCode}/${subCategoryCode}`,
      query: { page: newPage }
    });
  };

  // Обработчик добавления в корзину
  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10);
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
      console.log('Product added to cart:', productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  useEffect(() => {
    loadBitrixCore();
  }, []);

  // Если категория или подкатегория не найдена
  if (!category || !subCategory) {
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

  // Строим хлебные крошки
  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: `/catalog/${categoryCode}`, label: category.name },
    { href: `/catalog/${categoryCode}/${subCategoryCode}`, label: subCategory.name }, // Текущая страница
  ];

  return (
    <>
      <Head>
        <title>{seo?.title || `${subCategory.name} - ${category.name} | Shop4Shoot`}</title>
        <meta name="description" content={seo?.description || `Товары в категории ${subCategory.name}`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <Title>{subCategory.name}</Title>

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
  const { categoryCode, subCategoryCode, page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12;
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
    
    // Предварительно запрашиваем подкатегорию по коду
    await queryClient.prefetchQuery(['subcategory', subCategoryCode], () => 
      getCategoryByCode(subCategoryCode, { limit: 1 })
    );
    
    // Получаем данные подкатегории из кэша
    const subCategoryData = queryClient.getQueryData(['subcategory', subCategoryCode]);
    
    // Если подкатегория не найдена, возвращаем 404
    if (!subCategoryData?.data || subCategoryData.data.length === 0) {
      return { notFound: true };
    }
    
    const subCategory = transformCategory(subCategoryData.data[0]);
    
    // Предварительно запрашиваем товары подкатегории с новым методом API
    await queryClient.prefetchQuery(
      ['subcategoryProducts', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE], 
      () => getCatalogItemsBySubCategoryCode(categoryCode, subCategoryCode, { 
        limit: ITEMS_PER_PAGE,
        page: currentPage,
        sort: 'date_create:asc',
        include_subsections: 'Y'
      })
    );
    
    // Получаем данные товаров из кэша
    const productsData = queryClient.getQueryData(['subcategoryProducts', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE]);
    const products = productsData?.data
      ? transformCatalogItems(productsData.data)
      : [];
    
    // SEO данные
    const seo = {
      title: `${subCategory.name} - ${category.name} | Shop4Shoot`,
      description: `Товары в категории ${subCategory.name} в нашем интернет-магазине Shop4Shoot.`,
    };
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialCategory: category,
        initialSubCategory: subCategory,
        initialProducts: products,
        seo,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}

export default SubCategoryProductsPage; 