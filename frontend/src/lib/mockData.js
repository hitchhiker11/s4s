// Centralized mock data for frontend development

export const mockCategories = [
  {
    id: 'cat-1',
    title: 'Тюнинг оружия',
    imageUrl: 'https://via.placeholder.com/300x200/EAEAEA/1C1C1C?text=Tuning', // Replace with actual image URL
    link: '/catalog/tuning',
  },
  {
    id: 'cat-2',
    title: 'Экипировка',
    imageUrl: 'https://via.placeholder.com/300x200/EAEAEA/1C1C1C?text=Gear', // Replace with actual image URL
    link: '/catalog/gear',
  },
  {
    id: 'cat-3',
    title: 'Обслуживание',
    imageUrl: 'https://via.placeholder.com/300x200/EAEAEA/1C1C1C?text=Maintenance', // Replace with actual image URL
    link: '/catalog/maintenance',
  },
  {
    id: 'cat-4',
    title: 'Релоадинг',
    imageUrl: 'https://via.placeholder.com/300x200/EAEAEA/1C1C1C?text=Reloading', // Replace with actual image URL
    link: '/catalog/reloading',
  },
  // Add more categories based on Figma if needed
  // {
  //   id: 5,
  //   title: 'Прочее',
  //   imageUrl: 'https://via.placeholder.com/300x200/EAEAEA/1C1C1C?text=Other', // Replace with actual image URL
  //   link: '/catalog/other',
  // },
];

export const mockNewArrivals = [
  {
    id: 'prod-101',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Cap', // Replace
    brand: 'EIGER TAC',
    name: 'Бейсболка с липучкой рип-стоп A-TACS FG', // Example long name
    price: 2100,
    productLink: '/product/eiger-tac-cap-atacs-fg',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
    badge: 'new', // Add badge property
  },
   {
    id: 'prod-102',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Earplugs', // Replace
    brand: 'DECIBULLZ',
    name: 'Беруши CUSTOM MOLDED EARPLUGS зеленые',
    price: 3450,
    productLink: '/product/decibullz-earplugs-green',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
  },
   {
    id: 'prod-103',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Mount', // Replace
    brand: 'EIGER TAC',
    name: 'Кронштейн магнитный для фонаря Olight X-WM03', 
    price: 2100, // Example duplicate price
    productLink: '/product/eiger-tac-mount-x-wm03',
    CATALOG_AVAILABLE: 'Y', // Add availability flag
    badge: 'sale', // Example sale badge
  },
   {
    id: 'prod-104',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Lower', // Replace
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
    imageUrl: 'https://via.placeholder.com/250x100/FFFFFF/1C1C1C?text=STACK+DATA+DEFENS',
    link: '/brands/stack-data-defens',
  },
  {
    id: 'brand-2',
    title: 'FAB DEFENSE',
    imageUrl: 'https://via.placeholder.com/250x100/FFFFFF/E7194A?text=FAB+DEFENSE',
    link: '/brands/fab-defense',
  },
  {
    id: 'brand-3',
    title: 'ARMANOV',
    imageUrl: 'https://via.placeholder.com/250x100/FFFFFF/1C1C1C?text=ARMANOV',
    link: '/brands/armanov',
  },
  {
    id: 'brand-4',
    title: 'TANFOGLIO',
    imageUrl: 'https://via.placeholder.com/250x100/FFFFFF/E7194A?text=TANFOGLIO',
    link: '/brands/tanfoglio',
  },
];

// Mock bestseller products data
export const mockBestsellers = [
  {
    id: 'best-101',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Tool', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-pistol-sight',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-102',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Stock', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-stock',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-103',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Ammo', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-ammo',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'best-104',
    imageUrl: 'https://via.placeholder.com/200x200/FAFAFA/1C1C1C?text=Vest', 
    brand: 'EIGER TAC',
    name: 'ПРИЦЕЛ ДЛЯ ПИСТОЛЕТА ТАКОЙ ТО МОДЕЛИ С ДЛИННЫМ НАЗВАНИЕМ',
    price: 2100,
    productLink: '/product/eiger-tac-vest',
    CATALOG_AVAILABLE: 'Y',
  },
]; 