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

import { SIZES, COLORS, mediaQueries, SPACING } from '../../../styles/tokens';

// Add import for useBasket hook
import { useBasket } from '../../../hooks/useBasket';

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
  margin-bottom: 24px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

// Update the CategoriesGrid for proper mobile layout
const CategoriesGrid = styled.div`
  max-width: ${SIZES.containerMaxWidth};
  display: grid;
  width: 100%;
  margin-bottom: 24px;
  
  /* Default to 3 columns for mobile layout, matching the screenshot */
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px;
  
  ${mediaQueries.sm} { 
    gap: 16px;
    margin-bottom: 32px;
  }
  
  ${mediaQueries.md} { 
    /* For desktop, use auto-fill for dynamic layout */
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  ${mediaQueries.lg} { 
    column-gap: 23px;
    row-gap: 23px;
  }
`;

// Copied RecentlyViewed related styles from /catalog/index.js
const RecentlyViewedSection = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 4px solid #B6B6B6;
  margin-bottom: 22px;
`;

const SectionTitle = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 30px;
  line-height: 1.16em;
  color: #1C1C1C;
  padding: 15px 0;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Default 2 columns for smallest screens */
  gap: 9px;
  width: 100%;
  padding: 12px;
  
  ${mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
    padding: 16px;
  }
  
  ${mediaQueries.md} {
    grid-template-columns: repeat(4, 1fr);
    padding: 22px;
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

// Dummy recently viewed data for now - this should come from an API or context in a real app
// Fetch this via API in getServerSideProps or useQuery
const DUMMY_RECENTLY_VIEWED = [
    // Example product structure needed by ProductCard
    // { ID: 'rv1', NAME: 'Recently Viewed Item 1', BRAND_NAME: 'Brand RV', PRICE: 1500, PREVIEW_PICTURE_SRC: '/images/heats/aim.png', CATALOG_AVAILABLE: 'Y' }
];

const mockRecentlyViewedProducts = [
  // Populate with product data similar to ProductGrid's expected format
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv1',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv2',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv3',
    imageUrl: '/images/new-products/aim3.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv3',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv4',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖE ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv4',
    CATALOG_AVAILABLE: 'Y'
  },
];

  // Placeholder add to cart handler
  const handleAddToCartRecentlyViewed = (productId) => {
    console.log(`Adding product ${productId} to cart (from HomePage)`);
    // Add actual cart logic here later
  };

  // In the renderRecentlyViewedProductCard function, remove the onAddToCart prop since ProductCard will handle it internally
  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product}
    />
  );

// Create styled wrappers for the special last row cards
const SingleCardWrapper = styled.div`
  grid-column: 1 / -1; /* Make it span all 3 columns on mobile */
  
  ${mediaQueries.md} {
    grid-column: auto; /* Reset for desktop */
  }
`;

const DoubleCardWrapperFirst = styled.div`
  grid-column: 1 / 3; /* First card spans 2 columns on mobile */
  
  ${mediaQueries.md} {
    grid-column: auto; /* Reset for desktop */
  }
`;

const DoubleCardWrapperSecond = styled.div`
  grid-column: 3 / 4; /* Second card spans 1 column on mobile */
  
  ${mediaQueries.md} {
    grid-column: auto; /* Reset for desktop */
  }
`;

// Специальная карточка "Все товары"
const AllProductsCard = styled(CategoryCard)`
  background-color: ${COLORS.primary};
  
  h3 {
    color: ${COLORS.white};
    font-weight: 700;
  }
`;

// Преобразуем данные из API в формат для наших компонентов
const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;
  
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    code: apiCategory.fields?.CODE || '',
    image: apiCategory.fields?.PICTURE ? `/upload/${apiCategory.fields.PICTURE}` : null,
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
    imageUrl: subcat.fields?.PICTURE ? `/upload/${subcat.fields.PICTURE}` : null,
  }));
};

// Update the CategoryCardWrapper with a version that handles both mobile and desktop
const CategoryCardWrapper = ({ categories, allProductsCard }) => {
  // Add "All Products" card at the beginning if provided
  const allCategories = allProductsCard 
    ? [allProductsCard, ...categories]
    : categories;
    
  // For mobile layout, we need special handling for the last row
  const totalCards = allCategories.length;
  const remainder = totalCards % 3;
  
  // If remainder is 1 or 2, we need special handling for the last 1 or 2 cards in mobile view
  const standardCardsCount = remainder === 0 ? totalCards : totalCards - remainder;
  const standardCategories = allCategories.slice(0, standardCardsCount);
  const lastRowCategories = allCategories.slice(standardCardsCount);

  return (
    <CategoriesGrid>
      {/* Standard cards render normally in both mobile and desktop */}
      {standardCategories.map((category, index) => (
        <CategoryCard 
          key={category.id}
          title={category.title || category.name} 
          imageUrl={category.imageUrl || category.image}
          link={category.link}
          additionalStyles={{ 
            maxWidth: '260px',
            ...(index === 0 && allProductsCard ? { 
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontWeight: 700
            } : {})
          }} 
        />
      ))}

      {/* For mobile: Special handling for last 1 or 2 cards to match the design */}
      {lastRowCategories.length === 1 && (
        <SingleCardWrapper>
          <CategoryCard 
            key={lastRowCategories[0].id}
            title={lastRowCategories[0].title || lastRowCategories[0].name} 
            imageUrl={lastRowCategories[0].imageUrl || lastRowCategories[0].image}
            link={lastRowCategories[0].link}
            additionalStyles={{ maxWidth: '260px' }} 
          />
        </SingleCardWrapper>
      )}
      
      {lastRowCategories.length === 2 && (
        <>
          <DoubleCardWrapperFirst>
            <CategoryCard 
              key={lastRowCategories[0].id}
              title={lastRowCategories[0].title || lastRowCategories[0].name}
              imageUrl={lastRowCategories[0].imageUrl || lastRowCategories[0].image}
              link={lastRowCategories[0].link}
            />
          </DoubleCardWrapperFirst>
          <DoubleCardWrapperSecond>
            <CategoryCard 
              key={lastRowCategories[1].id}
              title={lastRowCategories[1].title || lastRowCategories[1].name}
              imageUrl={lastRowCategories[1].imageUrl || lastRowCategories[1].image}
              link={lastRowCategories[1].link}
            />
          </DoubleCardWrapperSecond>
        </>
      )}
    </CategoriesGrid>
  );
};

const CategoryDetailPage = ({ initialCategory, initialSubCategories, initialNewProducts, seo }) => {
  const router = useRouter();
  const { categoryCode } = router.query;
  
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

  // Преобразуем товары для компонента ResponsiveProductSection
  const formattedNewProducts = React.useMemo(() => {
    return newProducts.map(product => ({
      id: product.id,
      imageUrl: product.image,
      brand: product.brand,
      name: product.name,
      price: product.price,
      productLink: product.detailUrl,
      CATALOG_AVAILABLE: product.inStock ? 'Y' : 'N'
    }));
  }, [newProducts]);

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
          // Используем CategoryCardWrapper с форматированными подкатегориями и картой "Все товары"
          <CategoryCardWrapper 
            categories={subCategories} 
            allProductsCard={allProductsCard}
          />
        ) : (
          <EmptyState>В этой категории пока нет подкатегорий.</EmptyState>
        )}

        {/* Recently Viewed Section - API data needed */} 
        {newProductsIsLoading ? (
          <LoadingState>Загрузка товаров...</LoadingState>
        ) : formattedNewProducts && formattedNewProducts.length > 0 ? (
          <ResponsiveProductSection 
            title="Новые поступления"
            subtitle=""
            viewAllLink={`/catalog/${categoryCode}/all`}
            showViewAllLink={true}
            items={formattedNewProducts}
            renderItem={renderRecentlyViewedProductCard}
            gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
          />
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