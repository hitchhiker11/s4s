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
    link: '/catalog/equipment',
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
    imageUrl: '/images/new-products/baseball-hat.png',
    brand: 'EIGER TAC',
    name: 'Бейсболка с липучкой рип-стоп',
    price: 2100,
    productLink: '/product/eiger-tac-cap-atacs-fg',
    CATALOG_AVAILABLE: 'Y',
    badge: 'new',
  },
  {
    id: 'prod-102',
    imageUrl: '/images/new-products/aim.png',
    brand: 'DECIBULLZ',
    name: 'Беруши CUSTOM MOLDED EARPLUGS',
    price: 3450,
    productLink: '/product/decibullz-earplugs-green',
    CATALOG_AVAILABLE: 'Y',
  },
  {
    id: 'prod-103',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'EIGER TAC',
    name: 'Кронштейн магнитный для фонаря',
    price: 2100,
    productLink: '/product/eiger-tac-mount-x-wm03',
    CATALOG_AVAILABLE: 'Y',
    badge: 'sale',
  },
  {
    id: 'prod-104',
    imageUrl: '/images/new-products/aim3.png',
    brand: 'EIGER TAC',
    name: 'Ресивер нижний Eiger Tac ET-15',
    price: 2100,
    productLink: '/product/eiger-tac-lower-gen3',
    CATALOG_AVAILABLE: 'N',
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
  {
    id: 'brand-5',
    title: 'HELIKON-TEX',
    imageUrl: '/images/brands/helikon.png',
    link: '/brands/helikon-tex',
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

export const categoryData = {
  tuning: {
    name: "Тюнинг оружия",
    code: "tuning",
    subCategories: [
      { name: "Все", code: "all", imageUrl: "/images/subcategories/tuning-all.jpg" },
      { name: "Внешний тюнинг карабинов", code: "external-carbine", imageUrl: "/images/subcategories/tuning-carbine-external.jpg" },
      { name: "Внешний тюнинг пистолетов", code: "external-pistol", imageUrl: "/images/subcategories/tuning-pistol-external.jpg" },
      { name: "Запчасти для пистолетов и револьверов", code: "parts-pistol-revolver", imageUrl: "/images/subcategories/tuning-pistol-parts.jpg" },
      { name: "Запчасти для ружей и карабинов", code: "parts-rifle-carbine", imageUrl: "/images/subcategories/tuning-rifle-parts.jpg" },
      { name: "Магазины для карабинов", code: "mags-carbine", imageUrl: "/images/subcategories/tuning-carbine-mags.jpg" },
      { name: "Магазины для пистолетов", code: "mags-pistol", imageUrl: "/images/subcategories/tuning-pistol-mags.jpg" },
      { name: "Оптика для карабинов", code: "optics-carbine", imageUrl: "/images/subcategories/tuning-carbine-optics.jpg" },
      { name: "Оптика для пистолетов", code: "optics-pistol", imageUrl: "/images/subcategories/tuning-pistol-optics.jpg" },
      { name: "Фонари и ЛЦУ", code: "lights-lasers", imageUrl: "/images/subcategories/tuning-lights-lasers.jpg" },
      // { name: "Фонари и ЛЦУ", code: "lights-lasers", imageUrl: "/images/subcategories/tuning-lights-lasers.jpg" },
    ],
  },
  equipment: {
    name: "Экипировка",
    code: "equipment",
    subCategories: [
      { name: "Все", code: "all", imageUrl: "/images/subcategories/equip-all.jpg" },
      { name: "Для стрельбы из карабина", code: "for-carbine-shooting", imageUrl: "/images/subcategories/equip-carbine.jpg" },
      { name: "Для стрельбы из пистолета", code: "for-pistol-shooting", imageUrl: "/images/subcategories/equip-pistol.jpg" },
      { name: "Защита зрения", code: "eye-protection", imageUrl: "/images/subcategories/equip-eyes.jpg" },
      { name: "Защита слуха", code: "ear-protection", imageUrl: "/images/subcategories/equip-ears.jpg" },
      { name: "Подсумки", code: "pouches", imageUrl: "/images/subcategories/equip-pouches.jpg" },
      { name: "Стрелковая одежда", code: "shooting-apparel", imageUrl: "/images/subcategories/equip-apparel.jpg" },
      { name: "Сумки, чехлы, боксы", code: "bags-cases-boxes", imageUrl: "/images/subcategories/equip-bags.jpg" },
      // { name: "Таймеры", code: "timers", imageUrl: "/images/subcategories/equip-timers.jpg" },
    ],
  },
  maintenance: {
    name: "Обслуживание",
    code: "maintenance",
    subCategories: [
      { name: "Все", code: "all", imageUrl: "/images/subcategories/maint-all.jpg" },
      { name: "Инструмент для чистки и ухода", code: "cleaning-tools", imageUrl: "/images/subcategories/maint-tools.jpg" },
      { name: "Обслуживание", code: "general-maintenance", imageUrl: "/images/subcategories/maint-general.jpg" }, // Consider a more specific name if possible
      { name: "Средства для чистки и ухода", code: "cleaning-supplies", imageUrl: "/images/subcategories/maint-supplies.jpg" },
      // { name: "Средства для чистки и ухода", code: "cleaning-supplies", imageUrl: "/images/subcategories/maint-supplies.jpg" },
    ],
  },
  reloading: {
    name: "Релоадинг",
    code: "reloading",
    subCategories: [
      { name: "Все", code: "all", imageUrl: "/images/subcategories/reload-all.jpg" },
      { name: "Детали для станков", code: "press-parts", imageUrl: "/images/subcategories/reload-press-parts.jpg" },
      { name: "Дозаторы пороха", code: "powder-measures", imageUrl: "/images/subcategories/reload-powder.jpg" },
      { name: "Матрицы", code: "dies", imageUrl: "/images/subcategories/reload-dies.jpg" },
      { name: "Станки", code: "presses", imageUrl: "/images/subcategories/reload-presses.jpg" },
      { name: "Фрезы для обработки гильз", code: "case-processing-tools", imageUrl: "/images/subcategories/reload-case-prep.jpg" },
    ],
  },
  other: {
    name: "Прочее",
    code: "other",
    subCategories: [
      { name: "Все", code: "all", imageUrl: "/images/subcategories/other-all.jpg" },
      { name: "Аксессуары для экипировки", code: "equipment-accessories", imageUrl: "/images/subcategories/other-equip-acc.jpg" },
    ],
  },
  new: {
    name: "Новинки",
    code: "new",
    subCategories: [], // No subcategories as per user instruction
    isDirectLink: true, // Indicates it should link directly to a product listing, not a subcategory list
    link: "/catalog/new/all-products" // Example direct link
  },
  hits: {
    name: "Хиты продаж",
    code: "hits",
    subCategories: [], // No subcategories
    isDirectLink: true,
    link: "/catalog/hits/all-products" // Example direct link
  },
};

// Helper function to get subcategories for a category code
export const getSubcategoriesForCategory = (categoryCode) => {
  return categoryData[categoryCode]?.subCategories || [];
};

// Helper function to get category details
export const getCategoryDetails = (categoryCode) => {
  return categoryData[categoryCode] || null;
};

// Main categories for the catalog page (can be derived from categoryData keys)
export const mainCategories = Object.values(categoryData).map(cat => ({
  id: cat.code, // using code as id
  title: cat.name,
  // Assuming you have a default image for main categories or a specific one in categoryData
  imageUrl: cat.subCategories[0]?.imageUrl || `/images/categories/${cat.code}.jpg`,
  link: cat.isDirectLink ? cat.link : `/catalog/${cat.code}`,
  isDirectLink: cat.isDirectLink || false,
})); 