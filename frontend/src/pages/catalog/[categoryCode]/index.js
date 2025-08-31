import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Импортируем методы API вместо моков
import { getCategoryByCode, getSubcategories, getCatalogItemsByCategory } from '../../../lib/api/bitrix';
import { transformCatalogItems } from '../../../lib/api/transformers';
// Закомментируем моки, но оставим импорт для fallback
// import { getCategoryDetails, getSubcategoriesForCategory } from '../../../lib/mockData';
import { loadBitrixCore } from '../../../lib/auth';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CategoryCard from '../../../components/CategoryCard';
import ResponsiveProductSection from '../../../components/ResponsiveProductSection';
import SubscriptionForm from '../../../components/SubscriptionForm'; 
import ProductCard from '../../../components/ProductCard';
import CategoryGridWrapper from '../../../components/CategoryGridWrapper';

import { SIZES, COLORS, mediaQueries, SPACING } from '../../../styles/tokens';

// Add import for useBasket hook
import { useBasket } from '../../../hooks/useBasket';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';

// Styled components (can be reused or adapted from other catalog pages)
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

// Преобразуем данные из API в формат для наших компонентов
const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;
  
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    code: apiCategory.fields?.CODE || '',
    // Prefer direct URLs from API if available; fallback to legacy numeric PICTURE id
    image: apiCategory.fields?.PICTURE_PREVIEW_SRC
      || apiCategory.fields?.PICTURE_SRC
      || (apiCategory.fields?.PICTURE ? `/upload/${apiCategory.fields.PICTURE}` : null),
  };
};

const transformSubcategories = (apiSubcategories, parentCategoryCode) => {
  if (!apiSubcategories || !Array.isArray(apiSubcategories)) return [];
  
  return apiSubcategories.map(subcat => ({
    id: subcat.id,
    name: subcat.name,
    code: subcat.fields?.CODE || '',
    // Формируем ссылку в формате /catalog/[categoryCode]/[subCategoryCode]
    link: `/catalog/${parentCategoryCode}/${subcat.fields?.CODE || subcat.id}`,
    // Prefer direct URLs from API if available; fallback to legacy numeric PICTURE id
    imageUrl: subcat.fields?.PICTURE_PREVIEW_SRC
      || subcat.fields?.PICTURE_SRC
      || (subcat.fields?.PICTURE ? `/upload/${subcat.fields.PICTURE}` : null),
  }));
};



const CategoryDetailPage = ({ initialCategory, initialSubCategories, initialNewProducts, seo }) => {
  const router = useRouter();
  const { categoryCode } = router.query;
  
  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();
  
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

  // Запрос подкатегорий по ID категории
  const { data: subCategoriesData, isError: subCategoriesIsError, isLoading: subCategoriesIsLoading } = useQuery(
    ['subcategories', category?.id],
    () => getSubcategories(category.id, { tree_mode: 'flat' }),
    {
      enabled: !!category?.id,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  // Преобразуем подкатегории в формат для отображения
  const subCategories = React.useMemo(() => {
    if (subCategoriesData?.data) {
      return transformSubcategories(subCategoriesData.data, categoryCode);
    }
    
    // Fallback к initialSubCategories если есть
    if (initialSubCategories) {
      return initialSubCategories;
    }
    
    return [];
  }, [subCategoriesData, initialSubCategories, categoryCode]);

  // Запрос новых товаров категории
  const { data: newProductsData, isError: newProductsIsError, isLoading: newProductsIsLoading } = useQuery(
    ['newCategoryProducts', category?.id],
    () => getCatalogItemsByCategory(category.id, { 
      include_subsections: 'Y',
      limit: 12,
      sort: 'date_create:asc'
    }),
    {
      enabled: !!category?.id,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );

  // Преобразуем новые товары в формат для отображения
  const newProducts = React.useMemo(() => {
    if (newProductsData?.data) {
      return transformCatalogItems(newProductsData.data);
    }
    
    // Fallback к initialNewProducts если есть
    if (initialNewProducts) {
      return initialNewProducts;
    }
    
    return [];
  }, [newProductsData, initialNewProducts]);

  // Update the handleAddToCart function to use the useBasket hook
  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10); // Convert ID to number
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
      console.log('Product added to cart:', productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

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
    { href: `/catalog/${categoryCode}`, label: category.name } // Current page
  ];

  // Создаем карточку "Все товары"
  const allProductsCard = {
    id: 'all-products',
    name: 'Все товары',
    title: 'Все',
    link: `/catalog/${categoryCode}/all`,
    imageUrl: null,
    isAllProducts: true
  };

  return (
    <>
      <Head>
        <title>{seo?.title || `${category.name} - Каталог`}</title>
        <meta name="description" content={seo?.description || `Подкатегории для ${category.name}`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <PageTitle>{category.name}</PageTitle>

        {subCategoriesIsLoading ? (
          <LoadingState>Загрузка подкатегорий...</LoadingState>
        ) : subCategories && subCategories.length > 0 ? (
          // Используем новый CategoryGridWrapper с форматированными подкатегориями и картой "Все товары"
          <CategoryGridWrapper 
            categories={subCategories} 
            allProductsCard={allProductsCard}
          />
        ) : (
          <EmptyState>В этой категории пока нет подкатегорий.</EmptyState>
        )}

        {/* Recently Viewed Section - API data needed */} 
        {hasRecentlyViewed && (
          <ResponsiveProductSection 
            title="Недавно просмотренные"
            subtitle=""
            viewAllLink="/catalog?filter=new"
            showViewAllLink={false}
            items={recentlyViewed}
            useSliderOnDesktop={true} // Use slider instead of grid on desktop
            showNavigationOnDesktop={true} // Show navigation arrows on hover
            alwaysSlider={true} // Always use slider regardless of screen width
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
  const { categoryCode } = context.query;
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
    
    // Предварительно запрашиваем подкатегории
    await queryClient.prefetchQuery(['subcategories', category.id], () => 
      getSubcategories(category.id, { tree_mode: 'flat' })
    );
    
    // Получаем данные подкатегорий из кэша
    const subCategoriesData = queryClient.getQueryData(['subcategories', category.id]);
    const subCategories = subCategoriesData?.data 
      ? transformSubcategories(subCategoriesData.data, categoryCode)
      : [];
    
    // Предварительно запрашиваем новые товары категории
    await queryClient.prefetchQuery(['newCategoryProducts', category.id], () => 
      getCatalogItemsByCategory(category.id, { 
        include_subsections: 'Y',
        limit: 12,
        sort: 'date_create:asc'
      })
    );
    
    // Получаем данные новых товаров из кэша
    const newProductsData = queryClient.getQueryData(['newCategoryProducts', category.id]);
    const newProducts = newProductsData?.data
      ? transformCatalogItems(newProductsData.data)
      : [];
    
    // SEO данные
    const seo = {
      title: `${category.name} - подкатегории | Shop4Shoot`,
      description: `Ознакомьтесь с подкатегориями товаров в разделе ${category.name} нашего интернет-магазина.`,
    };
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialCategory: category,
        initialSubCategories: subCategories,
        initialNewProducts: newProducts,
        seo,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    // Используем мок-данные как fallback
    // const category = getCategoryDetails(categoryCode);
    // const subCategories = getSubcategoriesForCategory(categoryCode);
    
    // if (!category) {
    //  return { notFound: true }; 
    // }
    
    return { notFound: true };
  }
}

export default CategoryDetailPage;
