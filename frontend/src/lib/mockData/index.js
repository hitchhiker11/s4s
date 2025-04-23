// Mock data for categories
export const mockCategories = [
  {
    id: 1,
    title: 'Оружие',
    imageUrl: '/images/categories/category-weapons.jpg',
    link: '/catalog/weapons'
  },
  {
    id: 2,
    title: 'Оптика',
    imageUrl: '/images/categories/category-optics.jpg',
    link: '/catalog/optics'
  },
  {
    id: 3,
    title: 'Тактическое снаряжение',
    imageUrl: '/images/categories/category-tactical.jpg',
    link: '/catalog/tactical'
  },
  {
    id: 4,
    title: 'Одежда',
    imageUrl: '/images/categories/category-clothing.jpg',
    link: '/catalog/clothing'
  }
];

// Mock data for new arrivals
export const mockNewArrivals = [
  {
    id: 101,
    name: 'Тактический рюкзак',
    brand: 'Eiger TAC',
    price: 12500,
    imageUrl: '/images/products/tactical-backpack.jpg',
    available: true
  },
  {
    id: 102,
    name: 'Стрелковые очки',
    brand: 'ESS',
    price: 9800,
    imageUrl: '/images/products/shooting-glasses.jpg',
    available: true
  },
  {
    id: 103,
    name: 'Тактические перчатки',
    brand: 'Mechanix',
    price: 3200,
    imageUrl: '/images/products/tactical-gloves.jpg',
    available: true
  },
  {
    id: 104,
    name: 'Наколенники',
    brand: 'Alta',
    price: 4500,
    imageUrl: '/images/products/knee-pads.jpg',
    available: false
  }
];

// Mock data for brands
export const mockBrands = [
  {
    id: 201,
    title: 'Eiger',
    imageUrl: '/images/brands/eiger.jpg',
    link: '/brands/eiger'
  },
  {
    id: 202,
    title: 'Mechanix',
    imageUrl: '/images/brands/mechanix.jpg',
    link: '/brands/mechanix'
  },
  {
    id: 203,
    title: 'ESS',
    imageUrl: '/images/brands/ess.jpg',
    link: '/brands/ess'
  },
  {
    id: 204,
    title: 'Alta',
    imageUrl: '/images/brands/alta.jpg',
    link: '/brands/alta'
  }
];

// Mock data for bestsellers
export const mockBestsellers = [
  {
    id: 301,
    name: 'Тактический жилет',
    brand: 'Eiger TAC',
    price: 28500,
    imageUrl: '/images/products/tactical-vest.jpg',
    available: true
  },
  {
    id: 302,
    name: 'Тактические ботинки',
    brand: 'Eiger TAC',
    price: 15700,
    imageUrl: '/images/products/tactical-boots.jpg',
    available: true
  },
  {
    id: 303,
    name: 'Стрелковые наушники',
    brand: 'Howard Leight',
    price: 11200,
    imageUrl: '/images/products/ear-protection.jpg',
    available: true
  },
  {
    id: 304,
    name: 'Кобура для пистолета',
    brand: 'Eiger TAC',
    price: 7900,
    imageUrl: '/images/products/holster.jpg',
    available: true
  }
];

// Featured brand data
export { featuredBrandData } from './featuredBrand'; 