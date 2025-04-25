import React from 'react';
import ResponsiveCategorySection from '../ResponsiveCategorySection';
import ResponsiveProductSection from '../ResponsiveProductSection';

// Example categories data
const categoriesData = [
  {
    id: 1,
    title: 'Тюнинг',
    imageUrl: '/images/categories/tuning.jpg',
    link: '/catalog/tuning',
    showTitle: true
  },
  {
    id: 2,
    title: 'Экипировка',
    imageUrl: '/images/categories/equipment.jpg',
    link: '/catalog/equipment',
    showTitle: true
  },
  {
    id: 3,
    title: 'Обслуживание',
    imageUrl: '/images/categories/service.jpg',
    link: '/catalog/service',
    showTitle: true
  },
  {
    id: 4,
    title: 'Аксессуары',
    imageUrl: '/images/categories/accessories.jpg',
    link: '/catalog/accessories',
    showTitle: true
  }
];

// Example featured products data
const featuredProductsData = [
  {
    id: 101,
    brand: 'STRIKE INDUSTRIES',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАЙСОН-ГУАДАЛУПЕ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    imageUrl: '/images/products/sight1.jpg',
    productLink: '/product/101',
    CATALOG_AVAILABLE: 'Y',
    preOrder: true
  },
  {
    id: 102,
    brand: 'STRIKE INDUSTRIES',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАЙСОН-МЭДЖИК С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    imageUrl: '/images/products/sight2.jpg',
    productLink: '/product/102',
    CATALOG_AVAILABLE: 'Y',
    preOrder: true
  },
  {
    id: 103,
    brand: 'HOLOSUN',
    name: 'Коллиматорный прицел HS510C',
    price: 35000,
    imageUrl: '/images/products/sight3.jpg',
    productLink: '/product/103',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 104,
    brand: 'MAGPUL',
    name: 'Тактические перчатки',
    price: 1800,
    imageUrl: '/images/products/gloves.jpg',
    productLink: '/product/104',
    CATALOG_AVAILABLE: 'Y'
  }
];

// Example new products data
const newProductsData = [
  {
    id: 201,
    brand: 'ZENITCO',
    name: 'Тактический фонарь 2ПС+',
    price: 12500,
    imageUrl: '/images/products/flashlight.jpg',
    productLink: '/product/201',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 202,
    brand: 'HOLOSUN',
    name: 'Коллиматорный прицел HS403B',
    price: 22000,
    imageUrl: '/images/products/sight4.jpg',
    productLink: '/product/202',
    CATALOG_AVAILABLE: 'Y'
  }
];

// Example brands data
const brandsData = [
  {
    id: 301,
    title: 'ZENITCO',
    imageUrl: '/images/brands/zenitco.png',
    link: '/brands/zenitco',
    showTitle: false
  },
  {
    id: 302,
    title: 'HOLOSUN',
    imageUrl: '/images/brands/holosun.png',
    link: '/brands/holosun',
    showTitle: false
  },
  {
    id: 303,
    title: 'MAGPUL',
    imageUrl: '/images/brands/magpul.png',
    link: '/brands/magpul',
    showTitle: false
  }
];

const FeaturedSections = () => {
  const handleAddToCart = (productId) => {
    console.log(`Added product ${productId} to cart`);
    // Here you would call your actual cart API
  };

  return (
    <div>
      {/* Categories Section */}
      <ResponsiveCategorySection
        categories={categoriesData}
        title="Каталог товаров"
        viewAllLink="/catalog"
        viewAllText="Смотреть все"
      />

      {/* Featured Products Section */}
      <ResponsiveProductSection
        products={featuredProductsData}
        title="Хиты продаж"
        viewAllLink="/catalog/bestsellers"
        viewAllText="Смотреть все"
        onAddToCart={handleAddToCart}
      />

      {/* New Products Section */}
      <ResponsiveProductSection
        products={newProductsData}
        title="Новые поступления"
        viewAllLink="/catalog/new"
        viewAllText="Смотреть все"
        onAddToCart={handleAddToCart}
      />

      {/* Brands Section */}
      <ResponsiveCategorySection
        categories={brandsData}
        title="Бренды"
        viewAllLink="/brands"
        viewAllText="Смотреть все"
      />
    </div>
  );
};

export default FeaturedSections; 