import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getCategoryDetails, getSubcategoriesForCategory } from '../../../lib/mockData'; // Using mock data for now
import { loadBitrixCore } from '../../../lib/auth';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CategoryCard from '../../../components/CategoryCard'; // Use CategoryCard
import ResponsiveProductSection from '../../../components/ResponsiveProductSection'; // For recently viewed
import SubscriptionForm from '../../../components/SubscriptionForm'; 
import ProductCard from '../../../components/ProductCard'; // Needed for Recently Viewed inside ResponsiveProductSection

import { SIZES, COLORS, mediaQueries, SPACING } from '../../../styles/tokens'; // Added SPACING

// Styled components (can be reused or adapted from other catalog pages)
const Container = styled.div`
  max-width: 1392px;
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

// Copied CategoriesGrid from /catalog/index.js for consistent layout
const CategoriesGrid = styled.div`
  max-width: ${SIZES.containerMaxWidth};
  display: grid;
  width: 100%;
  margin-bottom: 24px;
  
  /* Default to 3 columns for the desired layout, even on smaller screens */
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px; /* Start with a mobile-first gap */
  
 
  ${mediaQueries.sm} { 
    gap: 16px;
    margin-bottom: 32px;
  }
  
  ${mediaQueries.md} { 
    /* On desktop, use auto-fill to allow cards to flow naturally without special handling */
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px;
    margin-bottom: 40px;
    
    /* Override the CategoryCardWrapper's special handling for desktop */
    & > div[style*="grid-column: 1 / -1"] {
      display: contents !important; /* This makes the children act as direct children of the parent grid */
    }
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

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product} // Pass the whole product object
      onAddToCart={handleAddToCartRecentlyViewed} 
    />
  );

// Copied CategoryCardWrapper from /catalog/index.js
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
          imageUrl={category.imageUrl} // Pass null/undefined imageUrl here
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
              imageUrl={category.imageUrl} // Pass null/undefined imageUrl here
              link={category.link}
            />
          ))}
        </div>
      )}
    </CategoriesGrid>
  );
};

const CategoryDetailPage = ({ category, subCategories, seo }) => {
  const router = useRouter();
  const { categoryCode } = router.query;

  // AddToCart handler for recently viewed items
  const handleAddToCart = (product) => {
    console.log('Dummy AddToCart from CategoryDetailPage', product);
    // Add actual basket logic here
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

  // Format subCategories for CategoryCardWrapper
  const formattedSubCategories = subCategories.map(subCat => ({
    id: subCat.code, // Use code as unique id
    title: subCat.name,
    link: `/catalog/${categoryCode}/${subCat.code}`,
    imageUrl: null // Explicitly set imageUrl to null for blank space
  }));

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

        {formattedSubCategories && formattedSubCategories.length > 0 ? (
          // Use CategoryCardWrapper with formatted subcategories
          <CategoryCardWrapper categories={formattedSubCategories} />
        ) : (
          <EmptyState>В этой категории пока нет подкатегорий.</EmptyState>
        )}

        {/* Recently Viewed Section - API data needed */} 
        {DUMMY_RECENTLY_VIEWED.length > 0 && (
            <RecentlyViewedSection>
              <SectionHeader>
                  <SectionTitle>Недавно просмотренные</SectionTitle>
              </SectionHeader>
              {/* Using ProductsGrid directly until ResponsiveProductSection is confirmed needed/working */}
              <ProductsGrid>
                  {DUMMY_RECENTLY_VIEWED.map(product => (
                      <ProductCard key={product.ID} product={product} onAddToCart={handleAddToCart}/>
                  ))}
              </ProductsGrid>
            </RecentlyViewedSection>
        )}

        <ResponsiveProductSection 
          title="Новые поступления"
          subtitle=""
          viewAllLink="/catalog?filter=new"
          showViewAllLink={false}
          items={mockRecentlyViewedProducts} // Use 'items' prop name
          renderItem={renderRecentlyViewedProductCard} // Pass the render function
          onAddToCart={handleAddToCartRecentlyViewed} // Still needed for ProductCard via renderItem
        />
        <SubscriptionForm />

      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { categoryCode } = context.query;
  
  // Fetch category details and subcategories from API or use mock
  const category = getCategoryDetails(categoryCode);
  const subCategories = getSubcategoriesForCategory(categoryCode);
  // TODO: Fetch Recently Viewed from API here

  if (!category) {
    return { notFound: true }; 
  }

  // Dummy SEO data
  const seo = {
    title: `${category.name} - подкатегории | Shop4Shoot`,
    description: `Ознакомьтесь с подкатегориями товаров в разделе ${category.name} нашего интернет-магазина.`,
  };

  return {
    props: {
      category,
      subCategories,
      seo,
      // Pass recently viewed items data if fetched
    },
  };
}

export default CategoryDetailPage; 