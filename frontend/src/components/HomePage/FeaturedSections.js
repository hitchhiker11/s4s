import React from 'react';
import ResponsiveCategorySection from '../ResponsiveCategorySection';
import ResponsiveProductSection from '../ResponsiveProductSection';
import { mockCategories, mockNewArrivals, mockBrands, mockBestsellers } from '../../lib/mockData';
import styled from 'styled-components';

const SectionsContainer = styled.div`
  width: 100%;
  overflow-x: hidden; /* Ensure no horizontal scrolling from sliders */
`;

const FeaturedSections = () => {
  const handleAddToCart = (productId) => {
    console.log(`Added product ${productId} to cart`);
    // Here you would call your actual cart API
  };

  // Enable debug mode for development to see viewport size indicator
  const debug = process.env.NODE_ENV === 'development';

  return (
    <SectionsContainer>
      {/* Categories Section */}
      <ResponsiveCategorySection
        categories={mockCategories}
        title="Каталог товаров"
        viewAllLink="/catalog"
        viewAllText="Смотреть все"
        debug={debug}
      />

      {/* New Arrivals Section */}
      <ResponsiveProductSection
        products={mockNewArrivals}
        title="Новые поступления"
        viewAllLink="/catalog/new"
        viewAllText="Смотреть все"
        onAddToCart={handleAddToCart}
        debug={debug}
      />

      {/* Brands Section */}
      <ResponsiveCategorySection
        categories={mockBrands}
        title="Наши бренды"
        viewAllLink="/brands"
        viewAllText="Смотреть все"
        debug={debug}
      />

      {/* Bestsellers Section */}
      <ResponsiveProductSection
        products={mockBestsellers}
        title="Хиты продаж 🔥"
        viewAllLink="/catalog/bestsellers"
        viewAllText="Смотреть все"
        onAddToCart={handleAddToCart}
        debug={debug}
      />
    </SectionsContainer>
  );
};

export default FeaturedSections; 