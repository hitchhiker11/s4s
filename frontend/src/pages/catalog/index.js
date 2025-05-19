import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';
import ResponsiveProductSection from '../../components/ResponsiveProductSection';
import { catalogApi } from '../../lib/api';
import { loadBitrixCore } from '../../lib/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import SubscriptionForm from '../../components/SubscriptionForm';
import { SIZES, COLORS, mediaQueries, BREAKPOINTS } from '../../styles/tokens';
import productGridStyles from '../../styles/ProductGridResponsive.module.css'; // Import CSS module

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

const CategoriesGrid = styled.div`
  display: grid;
  width: 100%;
  margin-bottom: 24px;
  overflow: hidden;
  
  /* Mobile layout with 3 columns and special handling for last items */
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px;
  //ДЛЯ NEW
  /* This selector only targets direct children links with SVG images */
  & > a [class^="CategoryCard__CardImage"][src$=".svg"] {
    transform: translateX(1%) translateY(5%) !important;  
    scale: 0.7 !important;
    object-fit: contain !important;
    object-position: top left !important;
  }


  // ДЛЯ HITS
  /* Special rule for the full-width bottom row (green highlighted area) 
     This row likely has a different structure or is wrapped in another container */
  & > div:last-child {
    grid-column: 1 / -1; /* Make the last item span all columns */
    
    & [class^="CategoryCard__CardImage"][src$="hits.svg"] {
      /* Override the default SVG transformation for this specific case */
      transform: translateX(250%) translateY(5%) !important;  
      scale: 0.5 !important;
      object-fit: contain !important;
      object-position: center !important;
    }
  }
  
  /* Mobile image positioning with smaller percentages */
  & > a [class^="CategoryCard__CardImage"]:not([src$=".svg"]) {
    transform: translateX(15%) translateY(17%) !important;
    object-fit: contain !important;
    object-position: bottom right !important;
  }


  
  ${mediaQueries.sm} { 
    gap: 16px;
    margin-bottom: 32px;
  }
  
  ${mediaQueries.xl} { 
    /* Simple 4-column grid for desktop with auto-fill */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
    
    /* Remove any special styling from mobile view */
    & > div {
      grid-column: auto !important;
    }

    /* Styling for image positioning */
    & > a [class^="CategoryCard__CardImageContainer"] {
      justify-content: flex-end !important;  /* Align to right */
      align-items: flex-end !important;  /* Align to bottom */
      overflow: hidden;  /* Ensure overflow is hidden */
    }

    & > a [class^="CategoryCard__CardImage"]:not([src$=".svg"]) {
      max-width: 130% !important;  /* Make images larger to allow partial overflow */
      max-height: 130% !important;
      transform: translateX(17%) translateY(20%) !important;  
      object-fit: contain !important;
      object-position: bottom right !important;
    }

    & > a [class^="CategoryCard__CardImage"][src$=".svg"] {
      max-width: 130% !important;
      max-height: 130% !important;
      transform: translateX(-45%) translateY(-20%) !important;  
      object-fit: contain !important;
      object-position: top left !important;
    }

    @media (max-width: ${BREAKPOINTS.lg - 1}px) {
      & > a [class^="CategoryCard__CardImage"]:not([src$=".svg"]) {
        max-width: 120% !important;
        transform: translateX(-10%) translateY(10%) !important;
      }
      
      & > a [class^="CategoryCard__CardImage"][src$=".svg"] {
        max-width: 120% !important;
        transform: translateX(-25%) translateY(-20%) !important;
      }
    }

    /* Override the mobile last-child styling for desktop view */
    & > div:last-child {
      grid-column: auto !important; /* Reset to auto for desktop */
      
      & [class^="CategoryCard__CardImage"][src$=".svg"] {
        /* Using calc() for adaptive transformations based on viewport width */
        transform: translateX(calc(80% + 25vw * 0.1)) translateY(calc(15% + 5vw * 0.1)) !important;
        scale: 1 !important;
        max-width: calc(120% + 10vw * 0.1) !important;
        max-height: calc(120% + 10vw * 0.1) !important;
        object-fit: contain !important;
        object-position: top left !important;
      }
    }
  }
  
  ${mediaQueries.lg} { 
    column-gap: 23px;
    row-gap: 23px;
  }
  
  & > a {
    overflow: hidden;
  }
`;

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
  gap: 9px;
  width: 100%;
  padding: 12px;
  
  &.${productGridStyles.productGridContainer} {
    
  }
  
  ${mediaQueries.sm} {
    padding: 16px;
  }
  
  ${mediaQueries.md} {
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

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product} // Pass the whole product object
      onAddToCart={handleAddToCartRecentlyViewed} 
    />
  );



// Wrapper component for category cards to handle the last row layout
const CategoryCardWrapper = ({ categories }) => {
  const totalCards = categories.length;
  const remainder = totalCards % 3;

  const fullRowsCount = Math.floor(totalCards / 3);
  const standardCardsCount = fullRowsCount * 3;
  const standardRowCategories = categories.slice(0, standardCardsCount);
  const lastRowCategories = categories.slice(standardCardsCount);

  return (
    <CategoriesGrid>
      {/* Render full rows normally */}
      {standardRowCategories.map(category => (
        <CategoryCard 
          key={category.id}
          title={category.title} 
          imageUrl={category.imageUrl} 
          link={category.link}
        />
      ))}

      {/* Handle the last row specially if it's not a full row of 3 and not empty */}
      {remainder > 0 && (
        <div style={{
          gridColumn: '1 / -1', // Make this div span all columns of the parent CategoriesGrid
          display: 'grid',
          // If 1 card in last row, it's 1fr. If 2 cards, they are 1fr 1fr.
          gridTemplateColumns: `repeat(${lastRowCategories.length}, 1fr)`,
          gap: 'inherit' // Use the same gap as the parent CategoriesGrid
        }}>
          {lastRowCategories.map(category => (
            <CategoryCard 
              key={category.id}
              title={category.title} 
              imageUrl={category.imageUrl} 
              link={category.link}
              
            />
          ))}
        </div>
      )}
    </CategoriesGrid>
  );
};

/**
 * Страница каталога по дизайну из Figma
 */
const CatalogPage = ({ initialData, sectionId, seo }) => {
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);
  
  const { data, isLoading, error } = useQuery(
    ['catalog', sectionId, currentPage],
    () => catalogApi.getProducts(sectionId, currentPage),
    {
      initialData,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );
  
  React.useEffect(() => {
    loadBitrixCore();
  }, []);
  
  if (isLoading && !data) {
    return (
      <>
        <Header />
        <Container>
          <LoadingState>Загрузка каталога...</LoadingState>
        </Container>
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
            Произошла ошибка при загрузке каталога. Пожалуйста, попробуйте позже.
          </EmptyState>
        </Container>

        <Footer />
      </>
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' }
  ];
  
  const categories = data?.CATEGORIES || [
    { id: 1, title: 'Тюнинг оружия', imageUrl: '/images/categories/tuning.jpg', link: '/catalog/tuning' },
    { id: 2, title: 'Экипировка', imageUrl: '/images/categories/equipment.jpg', link: '/catalog/equipment' },
    { id: 3, title: 'Обслуживание', imageUrl: '/images/categories/maintenance.jpg', link: '/catalog/maintenance' },
    { id: 4, title: 'Релоадинг', imageUrl: '/images/categories/reloading.jpg', link: '/catalog/reloading' },
    { id: 5, title: 'Прочее', imageUrl: '/images/categories/other.jpg', link: '/catalog/other' },
    { id: 6, title: 'Новинки', imageUrl: '/images/categories/new.svg', link: '/catalog/new/all-products' },
    { id: 7, title: 'Хиты продаж', imageUrl: '/images/categories/hits.svg', link: '/catalog/hits/all-products' }
  ];
  
  const recentlyViewed = data?.RECENTLY_VIEWED || [];
  
  return (
    <>
      <Head>
        <title>{seo?.TITLE || 'Каталог товаров'}</title>
        <meta name="description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta name="keywords" content={seo?.KEYWORDS || 'каталог, товары, интернет-магазин'} />
        <meta property="og:title" content={seo?.TITLE || 'Каталог товаров'} />
        <meta property="og:description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta property="og:type" content="website" />
        {data?.SECTION?.PICTURE_SRC && (
          <meta property="og:image" content={data.SECTION.PICTURE_SRC} />
        )}
      </Head>
      
      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <Container>
        <Title>Каталог Shop4Shoot</Title>
        
        <CategoryCardWrapper categories={categories} />
        
        {recentlyViewed.length > 0 && (
          <RecentlyViewedSection>
            <SectionHeader>
              <SectionTitle>Недавно просмотренные</SectionTitle>
            </SectionHeader>
            
            <ProductsGrid className={productGridStyles.productGridContainer}>
              {recentlyViewed.map(product => (
                <ProductCard key={product.ID} product={product} />
              ))}
            </ProductsGrid>
          </RecentlyViewedSection>
        )}
        
        <ResponsiveProductSection 
          title="Недавно просмотренные"
          subtitle=""
          viewAllLink="/catalog?filter=new"
          showViewAllLink={false}
          items={mockRecentlyViewedProducts} // Use 'items' prop name
          gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
          
        />

        <SubscriptionForm />

      </Container>
      
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { sectionId = 0 } = context.query;
  const page = context.query.page || 1;
  
  const queryClient = new QueryClient();
  
  try {
    await queryClient.prefetchQuery(['catalog', sectionId, page], () => 
      catalogApi.getProducts(sectionId, page)
    );
    
    const dehydratedState = dehydrate(queryClient);
    const data = queryClient.getQueryData(['catalog', sectionId, page]);
    const seo = data?.SEO || {};
    
    return {
      props: {
        dehydratedState,
        sectionId,
        seo,
      },
    };
  } catch (error) {
    console.error('Error fetching main catalog data:', error);
    return {
      props: {
        sectionId,
        seo: {},
      },
    };
  }
}

export default CatalogPage; 