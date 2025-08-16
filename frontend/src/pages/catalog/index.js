import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';
import ResponsiveProductSection from '../../components/ResponsiveProductSection';
import { getCatalogSections } from '../../lib/api/bitrix';
import { transformSections } from '../../lib/api/transformers';
import { loadBitrixCore } from '../../lib/auth';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import CategoryGridWrapper from '../../components/CategoryGridWrapper';
import SubscriptionForm from '../../components/SubscriptionForm';
import { SIZES, COLORS, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

// Стилизованные компоненты
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

/**
 * Страница каталога по дизайну из Figma
 */
const CatalogPage = ({ seo, initialCategories }) => {
  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();
  
  const catalogIblockId = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
  
  // Fetch categories for main catalog page
  const { data: categoriesData, isError: categoriesIsError } = useQuery('catalogCategories', 
    () => getCatalogSections({ iblock_id: catalogIblockId, tree_mode: 'flat', depth: 3 }),
    {
      initialData: initialCategories && initialCategories.length > 0 ? { data: initialCategories } : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  React.useEffect(() => {
    loadBitrixCore();
  }, []);
  
  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' }
  ];
  
  // Transform categories from API data, similar to HomePage
  const categories = React.useMemo(() => {
    let dataToUse = [];
    if (!categoriesIsError && categoriesData?.data) {
      dataToUse = categoriesData.data;
    } else if (Array.isArray(initialCategories) && initialCategories.length > 0) {
      dataToUse = initialCategories;
    }
    
    // Transform sections from API format
    const allSections = transformSections(Array.isArray(dataToUse) ? dataToUse : []);
    
    // Find the ID of "Каталог сайта" section
    const catalogSectionId = allSections.find(section => 
      section.raw?.fields?.CODE === "katalog_sayta" || section.raw?.fields?.NAME === "Каталог сайта"
    )?.id || "572"; // Default to "572" if not found
    
    // console.log('Found "Каталог сайта" with ID:', catalogSectionId);
    
    // Filter sections that are direct children of "Каталог сайта" (level 2 categories)
    const mainCategories = allSections.filter(section => {
      if (section.raw && section.raw.fields) {
        // Include only sections with IBLOCK_SECTION_ID equal to catalogSectionId (direct children)
        return section.raw.fields.IBLOCK_SECTION_ID === catalogSectionId;
      }
      return false;
    });
    
    // console.log('Found main categories count:', mainCategories.length);
    
    // Map to match expected props for CategoryCard
    const mappedCategories = mainCategories.map(section => {
      // Используем CODE для URL вместо ID, если доступен
      const categoryCode = section.raw?.fields?.CODE || section.id;
      
      return {
        ...section,
        title: section.name, // Add 'title' field from 'name'
        imageUrl: section.image, // Ensure imageUrl is set from image
        link: `/catalog/${categoryCode}`, // Use code instead of ID for better SEO
      };
    });
    
    // console.log('Main categories for display:', mappedCategories);
    
    // Fallback to static categories if no API data
    return mappedCategories.length > 0 ? mappedCategories : [
      { id: 1, title: 'Тюнинг оружия', imageUrl: '/images/categories/tuning.jpg', link: '/catalog/tuning' },
      { id: 2, title: 'Экипировка', imageUrl: '/images/categories/equipment.jpg', link: '/catalog/equipment' },
      { id: 3, title: 'Обслуживание', imageUrl: '/images/categories/maintenance.jpg', link: '/catalog/maintenance' },
      { id: 4, title: 'Релоадинг', imageUrl: '/images/categories/reloading.jpg', link: '/catalog/reloading' },
      { id: 5, title: 'Прочее', imageUrl: '/images/categories/other.jpg', link: '/catalog/other' },
      { id: 6, title: 'Новинки', imageUrl: '/images/categories/new.svg', link: '/catalog/new/all-products' },
      { id: 7, title: 'Хиты продаж', imageUrl: '/images/categories/hits.svg', link: '/catalog/hits/all-products' }
    ];
  }, [categoriesData, categoriesIsError, initialCategories]);
  
  return (
    <>
      <Head>
        <title>{seo?.TITLE || 'Каталог товаров'}</title>
        <meta name="description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta name="keywords" content={seo?.KEYWORDS || 'каталог, товары, интернет-магазин'} />
        <meta property="og:title" content={seo?.TITLE || 'Каталог товаров'} />
        <meta property="og:description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta property="og:type" content="website" />
      </Head>
      
      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <Container>
        <Title>Каталог Shop4Shoot</Title>
        
        <CategoryGridWrapper categories={categories} />
        
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

        <SubscriptionForm noOuterMargin={true} />

      </Container>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();
  const catalogIblockId = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
  
  try {
    // Prefetch categories for main catalog page
    await queryClient.prefetchQuery('catalogCategories', () => 
      getCatalogSections({ iblock_id: catalogIblockId, tree_mode: 'flat', depth: 3 })
    );
    
    const categoriesResult = queryClient.getQueryData('catalogCategories');
    // console.log('[SSR Catalog] Categories prefetched. Result available:', !!categoriesResult);
    
    const initialCategoriesVal = (categoriesResult && !categoriesResult.error && categoriesResult.data) ? categoriesResult.data : [];
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        seo: {
          TITLE: 'Каталог Shop4Shoot - Все категории товаров',
          DESCRIPTION: 'Полный каталог товаров нашего интернет-магазина. Найдите все необходимое для стрелкового спорта.',
          KEYWORDS: 'каталог, товары, интернет-магазин, shop4shoot, стрелковый спорт'
        },
        initialCategories: initialCategoriesVal,
      },
    };
  } catch (error) {
    // console.error('Error fetching main catalog data:', error);
    return {
      props: {
        seo: {
          TITLE: 'Каталог товаров',
          DESCRIPTION: 'Каталог товаров нашего интернет-магазина',
          KEYWORDS: 'каталог, товары, интернет-магазин'
        },
        initialCategories: [],
      },
    };
  }
}

export default CatalogPage; 