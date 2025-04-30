// Centralized mock data for frontend development

export const mockCategories = [
  {
    id: 'cat-1',
    title: 'Тюнинг',
    imageUrl: '/images/categories/tuning.jpg',
    link: '/catalog/tuning',
    showTitle: true
  },
  {
    id: 'cat-2',
    title: 'Экипировка',
    imageUrl: '/images/categories/equipment.jpg',
    link: '/catalog/gear',
    showTitle: true
  },
  {
    id: 'cat-3',
    title: 'Обслуживание',
    imageUrl: '/images/categories/maintenance.jpg',
    link: '/catalog/maintenance',
    showTitle: true
  },
  {
    id: 'cat-4',
    title: 'Релоадинг',
    imageUrl: '/images/categories/reloading.jpg',
    link: '/catalog/reloading',
    showTitle: true
  },
  // {
  //   id: 5,
  //   title: 'Прочее',
  //   imageUrl: '/images/categories/other.jpg',
  //   link: '/catalog/other',
  // },
];

export const mockNewArrivals = [
  {
    id: 'prod-101',
    imageUrl: '/images/new-products/baseball-hat.png', // Replace
    brand: 'EIGER TAC',
    name: 'Бейсболка с липучкой рип-стоп A-TACS FsdfsdfsdfG', // Example long name
    price: 2100,
    productLink: '/product/eiger-tac-cap-atacs-fg',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
    badge: 'new', // Add badge property
  },
   {
    id: 'prod-102',
    imageUrl: '/images/new-products/aim.png', // Replace
    brand: 'DECIBULLZ',
    name: 'Беруши CUSTOM MOLDED EARPLUGS зеленые',
    price: 3450,
    productLink: '/product/decibullz-earplugs-green',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
  },
   {
    id: 'prod-103',
    imageUrl: '/images/new-products/aim2.png', // Replace
    brand: 'EIGER TAC',
    name: 'Кронштейн магнитный для фонаря Olight X-WM03', 
    price: 2100, // Example duplicate price
    productLink: '/product/eiger-tac-mount-x-wm03',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
    badge: 'sale', // Example sale badge
  },
   {
    id: 'prod-104',
    imageUrl: '/images/new-products/aim3.png', // Replace
    brand: 'EIGER TAC',
    name: 'Ресивер нижний Eiger Tac ET-15 GEN3 stripped', 
    price: 2100, // Example duplicate price
    productLink: '/product/eiger-tac-lower-gen3',
    CATALOG_AVAILABLE: 'N', // Example unavailable product
  },
  // Add more products as needed
];

// Mock brands data
export const mockBrands = [
  {
    id: 'brand-1',
    title: 'STAСK DATA DEFENS',
    imageUrl: '/images/brands/stack_data.png',
    link: '/brands/stack-data-defens',
    showTitle: false
  },
  {
    id: 'brand-2',
    title: 'FAB DEFENSE',
    imageUrl: '/images/brands/fab_defense.png',
    link: '/brands/fab-defense',
    showTitle: false
  },
  {
    id: 'brand-3',
    title: 'ARMANOV',
    imageUrl: '/images/brands/armanov.png',
    link: '/brands/armanov',
    showTitle: false
  },
  {
    id: 'brand-4',
    title: 'TANFOGLIO',
    imageUrl: '/images/brands/tanfoglio.png',
    link: '/brands/tanfoglio',
    showTitle: false
  },
];

// Mock bestseller products data
export const mockBestsellers = [
  {
    id: 'best-101',
    imageUrl: '/images/heats/aim.png', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-pistol-sight',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-102',
    imageUrl: '/images/heats/aim2.png', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-stock',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-103',
    imageUrl: '/images/heats/aim3.png', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-ammo',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-104',
    imageUrl: '/images/heats/aim4.png', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-vest',
    CATALOG_AVAILABLE: 'Y',
  },
]; 