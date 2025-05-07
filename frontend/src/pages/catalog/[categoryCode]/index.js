import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getCategoryDetails, getSubcategoriesForCategory } from '../../../lib/mockData'; // Using mock data for now
import { loadBitrixCore } from '../../../lib/auth';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import SubCategoryCard from '../../../components/SubCategoryCard';
import ResponsiveProductSection from '../../../components/ResponsiveProductSection'; // For recently viewed
import SubscriptionForm from '../../../components/SubscriptionForm'; // Import the new component

import { SIZES, COLORS, mediaQueries } from '../../../styles/tokens';

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

const SubCategoryGrid = styled.div`
  display: grid;
  width: 100%;
  margin-bottom: 40px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); // Responsive grid
  gap: 20px;

  ${mediaQueries.sm} {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  ${mediaQueries.md} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  ${mediaQueries.lg} {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); // Or fixed 3-4 columns
    gap: 23px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

// Dummy recently viewed data for now - this should come from an API or context in a real app
const DUMMY_RECENTLY_VIEWED = [
  // Add some dummy product objects if you want to test this section
];

const CategoryDetailPage = ({ category, subCategories, seo }) => {
  const router = useRouter();
  const { categoryCode } = router.query;

  const handleAddToCart = (product) => {
    console.log('Dummy AddToCart from CategoryDetailPage', product)
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

  return (
    <>
      <Head>
        <title>{seo?.title || `${category.name} - Каталог`}</title>
        <meta name="description" content={seo?.description || `Подкатегории для ${category.name}`} />
        {/* Add other meta tags as needed */}
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <PageTitle>{category.name}</PageTitle>

        {subCategories && subCategories.length > 0 ? (
          <SubCategoryGrid>
            {subCategories.map(subCat => (
              <SubCategoryCard
                key={subCat.code}
                title={subCat.name}
                imageUrl={subCat.imageUrl}
                link={`/catalog/${categoryCode}/${subCat.code}`}
              />
            ))}
          </SubCategoryGrid>
        ) : (
          <EmptyState>В этой категории пока нет подкатегорий.</EmptyState>
        )}

        {/* Recently Viewed Section - using dummy data for now */}
        {DUMMY_RECENTLY_VIEWED.length > 0 && (
            <ResponsiveProductSection 
                items={DUMMY_RECENTLY_VIEWED}
                title="Недавно просмотренные"
                onAddToCart={handleAddToCart}
            />
        )}

        {/* Use the new SubscriptionForm component */}
        <SubscriptionForm />

      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { categoryCode } = context.query;
  
  // In a real app, you'd fetch this from an API
  // For now, using mock data
  const category = getCategoryDetails(categoryCode);
  const subCategories = getSubcategoriesForCategory(categoryCode);

  if (!category) {
    return { notFound: true }; // Or handle as an error page
  }

  // Dummy SEO data, replace with actual data fetching
  const seo = {
    title: `${category.name} - подкатегории | Shop4Shoot`,
    description: `Ознакомьтесь с подкатегориями товаров в разделе ${category.name} нашего интернет-магазина.`,
  };

  return {
    props: {
      category,
      subCategories,
      seo,
      // You might also want to fetch recently viewed items here for SSR
    },
  };
}

export default CategoryDetailPage; 