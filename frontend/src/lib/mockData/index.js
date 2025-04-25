// Mock data for categories
export const mockCategories = [
  {
    id: 1,
    title: 'Тюнинг оружия',
    imageUrl: '/images/categories/tuning.svg',
    link: '/catalog/tuning'
  },
  {
    id: 2,
    title: 'Экипировка',
    imageUrl: '/images/categories/equipment.jpg',
    link: '/catalog/equipment'
  },
  {
    id: 3,
    title: 'Обслуживание',
    imageUrl: '/images/categories/maintenance.jpg',
    link: '/catalog/maintenance'
  },
  {
    id: 4,
    title: 'Релоадинг',
    imageUrl: '/images/categories/reloading.jpg',
    link: '/catalog/reloading'
  },
  {
    id: 5,
    title: 'Прочее',
    imageUrl: '/images/categories/other.jpg',
    link: '/catalog/other'
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