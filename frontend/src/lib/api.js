import axios from 'axios';
import { mockCategories, mockNewArrivals, mockBrands, mockBestsellers } from './mockData';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BITRIX_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Для работы с сессиями Bitrix
});

// Проверка, находимся ли мы в режиме разработки
const isDevelopment = process.env.NODE_ENV === 'development';

// Моковые данные для разработки
const mockData = {
  basketCount: 5,
  products: [
    { id: 1, name: 'Товар 1', price: 1200, image: '/images/product1.jpg' },
    { id: 2, name: 'Товар 2', price: 2500, image: '/images/product2.jpg' },
    { id: 3, name: 'Товар 3', price: 3800, image: '/images/product3.jpg' },
  ],
  productDetail: {
    id: 1, 
    name: 'Товар 1', 
    price: 1200, 
    description: 'Подробное описание товара 1',
    characteristics: [
      { name: 'Вес', value: '2 кг' },
      { name: 'Размер', value: '20x30x40 см' },
    ],
    images: ['/images/product1.jpg', '/images/product1-2.jpg']
  },
  searchResults: [
    { id: 1, name: 'Товар 1', price: 1200, image: '/images/product1.jpg' },
    { id: 2, name: 'Товар 2', price: 2500, image: '/images/product2.jpg' },
  ],
  // Моковые товары с подкатегориями, соответствующими реальным подкатегориям из структуры каталога

  // Для "Тюнинг оружия" (tuning)
  subCategoryProducts: [
    // Внешний тюнинг карабинов
    { id: 'sca-ssa1-001', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Коллиматорный прицел EIGER TAC RedDot', price: 8500, productLink: '/catalog/tuning/optics-carbine/sca-ssa1-001', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'optics-carbine' },
    { id: 'sca-ssa1-002', imageUrl: '/images/heats/aim2.png', brand: 'Magpul', name: 'Тактическое цевье Magpul MOE M-LOK', price: 4200, productLink: '/catalog/tuning/external-carbine/sca-ssa1-002', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'external-carbine' },
    { id: 'sca-ssa1-003', imageUrl: '/images/heats/aim3.png', brand: 'Fab Defense', name: 'Приклад Fab Defense GL-CORE', price: 6700, productLink: '/catalog/tuning/external-carbine/sca-ssa1-003', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'external-carbine' },
    { id: 'sca-ssa1-004', imageUrl: '/images/heats/aim4.png', brand: 'Vector Optics', name: 'Оптический прицел Vector Maverick 1-6x24', price: 12500, productLink: '/catalog/tuning/optics-carbine/sca-ssa1-004', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'optics-carbine' },
    { id: 'sca-ssa1-005', imageUrl: '/images/heats/aim.png', brand: 'Leapers UTG', name: 'Сошки Leapers UTG Recon Flex M-LOK', price: 3200, productLink: '/catalog/tuning/external-carbine/sca-ssa1-005', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'external-carbine' },

    // Внутренний тюнинг, детали для карабинов/пистолетов
    { id: 'sca-ssa2-001', imageUrl: '/images/heats/aim2.png', brand: 'Prometheus', name: 'Усиленный поршень Prometheus Hard Piston', price: 2100, productLink: '/catalog/tuning/parts-rifle-carbine/sca-ssa2-001', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'parts-rifle-carbine' },
    { id: 'sca-ssa2-002', imageUrl: '/images/heats/aim3.png', brand: 'Guarder', name: 'Пружина Guarder SP120', price: 950, productLink: '/catalog/tuning/parts-rifle-carbine/sca-ssa2-002', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'parts-rifle-carbine' },
    { id: 'sca-ssa2-003', imageUrl: '/images/heats/aim4.png', brand: 'LayLax', name: 'Стволик LayLax Nine Ball 6.03mm', price: 3800, productLink: '/catalog/tuning/parts-rifle-carbine/sca-ssa2-003', CATALOG_AVAILABLE: 'Y', category: 'tuning', subCategory: 'parts-rifle-carbine' },

    // Для "Экипировка" (equipment)
    // Подсумки, стрелковая одежда, защита, сумки и т.д. - распределяем по смыслу
    { id: 'scb-ssb1-001', imageUrl: '/images/heats/aim.png', brand: 'Ars Arma', name: 'Плитник Ars Arma A-18 Skanda', price: 15500, productLink: '/catalog/equipment/for-carbine-shooting/scb-ssb1-001', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'for-carbine-shooting' },
    { id: 'scb-ssb1-002', imageUrl: '/images/heats/aim2.png', brand: 'Wartech', name: 'Нагрудник Wartech TV-110', price: 7800, productLink: '/catalog/equipment/for-carbine-shooting/scb-ssb1-002', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'for-carbine-shooting' },
    { id: 'scb-ssb1-003', imageUrl: '/images/heats/aim3.png', brand: 'ANA Tactical', name: 'Поясной ремень ANA M2', price: 4300, productLink: '/catalog/equipment/shooting-apparel/scb-ssb1-003', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'shooting-apparel' },
    { id: 'scb-ssb1-004', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-004', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-005', imageUrl: '/images/heats/aim.png', brand: 'SRVV', name: 'Разгрузочный жилет SRVV Centurion', price: 9900, productLink: '/catalog/equipment/for-carbine-shooting/scb-ssb1-005', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'for-carbine-shooting' },
    { id: 'scb-ssb1-006', imageUrl: '/images/heats/aim2.png', brand: 'Mordor Tac.', name: 'Пояс Варбелт Mordor Tac. UMTBS', price: 6500, productLink: '/catalog/equipment/shooting-apparel/scb-ssb1-006', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'shooting-apparel' },
    { id: 'scb-ssb1-007', imageUrl: '/images/heats/aim3.png', brand: 'Ars Arma', name: 'Подсумок гранатный Ars Arma', price: 900, productLink: '/catalog/equipment/pouches/scb-ssb1-007', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-008', imageUrl: '/images/heats/aim4.png', brand: 'Wartech', name: 'Административный подсумок Wartech UP-104', price: 1500, productLink: '/catalog/equipment/pouches/scb-ssb1-008', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-009', imageUrl: '/images/heats/aim.png', brand: 'ANA Tactical', name: 'Подсумок для радиостанции ANA', price: 1100, productLink: '/catalog/equipment/pouches/scb-ssb1-009', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-010', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Панель MOLLE набедренная EIGER TAC', price: 2800, productLink: '/catalog/equipment/pouches/scb-ssb1-010', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-011', imageUrl: '/images/heats/aim3.png', brand: 'SRVV', name: 'Подсумок медицинский отрывной SRVV', price: 3200, productLink: '/catalog/equipment/pouches/scb-ssb1-011', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-012', imageUrl: '/images/heats/aim4.png', brand: 'Mordor Tac.', name: 'Подсумок для сброса магазинов Mordor Tac.', price: 1800, productLink: '/catalog/equipment/pouches/scb-ssb1-012', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-013', imageUrl: '/images/heats/aim.png', brand: 'Ars Arma', name: 'Камербанд скелетный Ars Arma', price: 3500, productLink: '/catalog/equipment/shooting-apparel/scb-ssb1-013', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'shooting-apparel' },
    { id: 'scb-ssb1-014', imageUrl: '/images/heats/aim2.png', brand: 'Wartech', name: 'Плечевые накладки Wartech TV-108', price: 1300, productLink: '/catalog/equipment/shooting-apparel/scb-ssb1-014', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'shooting-apparel' },
    { id: 'scb-ssb1-015', imageUrl: '/images/heats/aim3.png', brand: 'ANA Tactical', name: 'Подсумок утилитарный ANA малый', price: 950, productLink: '/catalog/equipment/pouches/scb-ssb1-015', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-016', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Быстросбросы для плитника EIGER TAC', price: 2100, productLink: '/catalog/equipment/equipment-accessories/scb-ssb1-016', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'equipment-accessories' },
    { id: 'scb-ssb1-017', imageUrl: '/images/heats/aim.png', brand: 'SRVV', name: 'Кобура набедренная SRVV', price: 2900, productLink: '/catalog/equipment/equipment-accessories/scb-ssb1-017', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'equipment-accessories' },
    { id: 'scb-ssb1-018', imageUrl: '/images/heats/aim2.png', brand: 'Mordor Tac.', name: 'Подсумок двойной для пистолетных магазинов Mordor Tac.', price: 1400, productLink: '/catalog/equipment/pouches/scb-ssb1-018', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-019', imageUrl: '/images/heats/aim3.png', brand: 'Ars Arma', name: 'Паховый модуль Ars Arma', price: 4800, productLink: '/catalog/equipment/equipment-accessories/scb-ssb1-019', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'equipment-accessories' },
    { id: 'scb-ssb1-020', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-020', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-021', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-021', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-022', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-022', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-023', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-023', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-024', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-024', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-025', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-025', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-026', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-026', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-027', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-027', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-028', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-028', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-029', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-029', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-030', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-030', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-031', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-031', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-032', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-032', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-033', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-033', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-034', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-034', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-035', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-035', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-036', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-036', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-037', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-037', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-038', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-038', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-039', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-039', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-040', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-040', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-041', imageUrl: '/images/heats/aim.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-041', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-042', imageUrl: '/images/heats/aim2.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-042', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-043', imageUrl: '/images/heats/aim3.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-043', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
    { id: 'scb-ssb1-044', imageUrl: '/images/heats/aim4.png', brand: 'EIGER TAC', name: 'Подсумок для магазина АК быстрый', price: 1200, productLink: '/catalog/equipment/pouches/scb-ssb1-044', CATALOG_AVAILABLE: 'Y', category: 'equipment', subCategory: 'pouches' },
  ]
};

// Функция для оборачивания вызова API с автоматическим моком в случае ошибки
const withErrorHandling = async (apiCall, mockResponse) => {
  if (isDevelopment) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn(`API call failed, using mock data instead. Error: ${error.message}`);
      return mockResponse;
    }
  } else {
    // В продакшене пробрасываем ошибку дальше
    return await apiCall();
  }
};

// Перехватчик для добавления sessid в каждый запрос
api.interceptors.request.use((config) => {
  // Получаем sessid из window, если мы в браузере
  if (typeof window !== 'undefined' && window.BX && window.BX.bitrix_sessid) {
    config.headers['X-Bitrix-Sessid'] = window.BX.bitrix_sessid();
    
    // Для POST-запросов также добавляем sessid в тело запроса
    if (config.method === 'post' && config.data) {
      // Если данные - строка, преобразуем в объект
      let data = config.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Если не можем преобразовать, создаем новый объект
          data = {};
        }
      }
      
      // Добавляем sessid в тело запроса
      config.data = {
        ...data,
        sessid: window.BX.bitrix_sessid(),
      };
    }
  }
  
  return config;
});

// API методы для работы с каталогом
export const catalogApi = {
  // Получение списка товаров
  getProducts: async (sectionId) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/loadItems.php', { sectionId });
        return data;
      },
      mockData.products
    );
  },
  
  // Получение детальной информации о товаре
  getProductDetail: async (productId) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/getProductDetail.php', { productId });
        return data;
      },
      mockData.productDetail
    );
  },
  
  // Поиск товаров
  searchProducts: async (query) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/search/catalog/index.php', { query });
        return data;
      },
      mockData.searchResults
    );
  },

  // Получение товаров подкатегории
  getProductsBySubCategory: async (categoryCode, subCategoryCode, page = 1, limit = 10) => {
    // Mapping for user-friendly names using actual URL slugs as keys
    const categoryNameMap = {
      'tuning': 'Тюнинг Оружия',
      'equipment': 'Экипировка и Снаряжение',
      'maintenance': 'Обслуживание и Уход',
      'reloading': 'Релоадинг',
      'other': 'Прочее',
      // Add other main category slugs if they exist
    };
    const subCategoryNameMap = {
      // Subcategories for 'tuning'
      'external-carbine': 'Внешний тюнинг карабина',
      'optics-carbine': 'Оптика для карабинов',
      'parts-rifle-carbine': 'ЗИП и внутренний тюнинг (Винтовки/Карабины)',
      'external-pistol': 'Внешний тюнинг пистолета',
      'optics-pistol': 'Оптика для пистолетов',
      'parts-pistol': 'ЗИП и внутренний тюнинг (Пистолеты)',
      
      // Subcategories for 'equipment'
      'for-carbine-shooting': 'Для стрельбы из карабина',
      'shooting-apparel': 'Стрелковая одежда',
      'pouches': 'Подсумки',
      'equipment-accessories': 'Аксессуары для экипировки',
      'ballistic-protection': 'Баллистическая защита',
      'bags-and-cases': 'Сумки и чехлы',
      
      // Add other subcategory slugs and their Cyrillic names as needed
    };

    const currentCategoryName = categoryNameMap[categoryCode] || categoryCode;
    const currentSubCategoryName = subCategoryNameMap[subCategoryCode] || subCategoryCode;

    return withErrorHandling(
      async () => {
        // Здесь должен быть реальный запрос к /ajax/catalog/getSubCategoryProducts.php или аналогичному
        // const { data } = await api.post('/ajax/catalog/getSubCategoryProducts.php', { categoryCode, subCategoryCode, page, limit });
        // return data;
        
        // Временный мок для разработки
        console.log(`Fetching subcategory products for ${categoryCode}/${subCategoryCode}, page ${page}`);
        const allSubCategoryProducts = mockData.subCategoryProducts.filter(
          p => p.category === categoryCode && p.subCategory === subCategoryCode
        );
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = allSubCategoryProducts.slice(startIndex, endIndex);
        
        return {
          ITEMS: paginatedProducts,
          NAV_PARAMS: { // Пример параметров пагинации
            CURRENT_PAGE: page,
            TOTAL_PAGES: Math.ceil(allSubCategoryProducts.length / limit),
            TOTAL_ITEMS: allSubCategoryProducts.length
          },
          SEO: { // Пример SEO данных with Cyrillic names
            TITLE: `Товары: ${currentSubCategoryName} - ${currentCategoryName}`,
            DESCRIPTION: `Купить ${currentSubCategoryName} в категории ${currentCategoryName}`,
            CATEGORY_NAME: currentCategoryName,
            SUBCATEGORY_NAME: currentSubCategoryName
          }
        };
      },
      // Возвращаем отфильтрованные и пагинированные моковые данные при ошибке в dev режиме
      (() => {
        console.warn(`Mocking subcategory products for ${categoryCode}/${subCategoryCode}, page ${page}`);
        const allSubCategoryProducts = mockData.subCategoryProducts.filter(
          p => p.category === categoryCode && p.subCategory === subCategoryCode
        );
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = allSubCategoryProducts.slice(startIndex, endIndex);
        return {
          ITEMS: paginatedProducts,
          NAV_PARAMS: {
            CURRENT_PAGE: page,
            TOTAL_PAGES: Math.ceil(allSubCategoryProducts.length / limit),
            TOTAL_ITEMS: allSubCategoryProducts.length
          },
           SEO: { // Fallback SEO with Cyrillic names
            TITLE: `Мок: ${currentSubCategoryName} - ${currentCategoryName}`,
            DESCRIPTION: `Мок: Купить ${currentSubCategoryName} в ${currentCategoryName}`,
            CATEGORY_NAME: currentCategoryName,
            SUBCATEGORY_NAME: currentSubCategoryName
          }
        };
      })()
    );
  },

  // Получение товаров бренда
  getProductsByBrand: async (brandCode, page = 1, limit = 10) => {
    // Similar approach as getProductsBySubCategory
    return withErrorHandling(
      async () => {
        // Here should be a real request to /ajax/catalog/getBrandProducts.php or similar
        // const { data } = await api.post('/ajax/catalog/getBrandProducts.php', { brandCode, page, limit });
        // return data;
        
        // Temporary mock for development
        console.log(`Fetching brand products for ${brandCode}, page ${page}`);
        
        // Get the brand name from mockBrands
        const brand = mockBrands.find(b => {
          // Extract code from link (e.g., /brands/fab-defense -> fab-defense)
          const linkParts = b.link.split('/');
          const code = linkParts[linkParts.length - 1];
          return code === brandCode;
        });
        
        // Create filtered products based on brand name
        const brandName = brand ? brand.title : brandCode;
        
        // Mock products with the brand name
        const mockBrandProducts = Array.from({ length: 36 }, (_, index) => ({
          id: `${brandCode}-${index + 1}`,
          imageUrl: `/images/heats/aim${index % 4 || ''}.png`,
          brand: brandName,
          name: `Товар бренда ${brandName} #${index + 1}`,
          price: 2000 + (index * 100),
          productLink: `/product/${brandCode}-product-${index + 1}`,
          CATALOG_AVAILABLE: index % 5 === 0 ? 'N' : 'Y',
        }));
        
        // Paginate the results
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = mockBrandProducts.slice(startIndex, endIndex);
        
        return {
          ITEMS: paginatedProducts,
          NAV_PARAMS: {
            CURRENT_PAGE: page,
            TOTAL_PAGES: Math.ceil(mockBrandProducts.length / limit),
            TOTAL_ITEMS: mockBrandProducts.length
          },
          SEO: {
            TITLE: `Товары бренда ${brandName}`,
            DESCRIPTION: `Купить товары бренда ${brandName} в нашем магазине`,
            BRAND_NAME: brandName
          }
        };
      },
      // Return filtered mocked data in case of error in dev mode
      (() => {
        console.warn(`Mocking brand products for ${brandCode}, page ${page}`);
        
        // Get the brand name
        const brand = mockBrands.find(b => {
          const linkParts = b.link.split('/');
          const code = linkParts[linkParts.length - 1];
          return code === brandCode;
        });
        const brandName = brand ? brand.title : brandCode;
        
        // Mock products with the brand name
        const mockBrandProducts = Array.from({ length: 36 }, (_, index) => ({
          id: `${brandCode}-${index + 1}`,
          imageUrl: `/images/heats/aim${index % 4 || ''}.png`,
          brand: brandName,
          name: `Товар бренда ${brandName} #${index + 1}`,
          price: 2000 + (index * 100),
          productLink: `/product/${brandCode}-product-${index + 1}`,
          CATALOG_AVAILABLE: index % 5 === 0 ? 'N' : 'Y',
        }));
        
        // Paginate the results
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = mockBrandProducts.slice(startIndex, endIndex);
        
        return {
          ITEMS: paginatedProducts,
          NAV_PARAMS: {
            CURRENT_PAGE: page,
            TOTAL_PAGES: Math.ceil(mockBrandProducts.length / limit),
            TOTAL_ITEMS: mockBrandProducts.length
          },
          SEO: {
            TITLE: `Товары бренда ${brandName}`,
            DESCRIPTION: `Купить товары бренда ${brandName} в нашем магазине`,
            BRAND_NAME: brandName
          }
        };
      })()
    );
  },
};

// API методы для работы с корзиной
export const basketApi = {
  // Добавление товара в корзину
  addToBasket: async (productId, quantity = 1) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/basketHandler.php', {
          id: productId,
          quantity,
          method: 'add',
        });
        return data;
      },
      { success: true, message: 'Товар добавлен в корзину', basketCount: mockData.basketCount + 1 }
    );
  },
  
  // Обновление количества товара в корзине
  updateBasketItem: async (productId, quantity) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/basketHandler.php', {
          id: productId,
          quantity,
          method: 'update',
        });
        return data;
      },
      { success: true, message: 'Количество товара обновлено' }
    );
  },
  
  // Удаление товара из корзины
  removeFromBasket: async (productId) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/basketHandler.php', {
          id: productId,
          method: 'delete',
        });
        return data;
      },
      { success: true, message: 'Товар удален из корзины', basketCount: Math.max(0, mockData.basketCount - 1) }
    );
  },
  
  // Очистка корзины
  clearBasket: async () => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/catalog/basketHandler.php', {
          method: 'deleteAll',
        });
        return data;
      },
      { success: true, message: 'Корзина очищена', basketCount: 0 }
    );
  },
  
  // Получение количества товаров в корзине
  getBasketCount: async () => {
    return withErrorHandling(
      async () => {
        const { data } = await api.get('/ajax/getProductCountInBasket.php');
        return data;
      },
      mockData.basketCount
    );
  },
};

// API методы для работы с формами
export const formsApi = {
  // Отправка формы K1
  submitK1Form: async (formData) => {
    return withErrorHandling(
      async () => {
        const { data } = await api.post('/ajax/k1Form.php', formData);
        return data;
      },
      { success: true, message: 'Форма успешно отправлена' }
    );
  },
};

export default api; 