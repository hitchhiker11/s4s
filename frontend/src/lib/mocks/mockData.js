/**
 * Мок-данные для разработки, используемые вместо запросов к серверу Bitrix
 */

// Данные слайдера для раздела About
export const aboutSliderMockData = {
  success: true,
  data: [
    {
      id: 1,
      image: '/images/slider/slider-image-1.svg',
      title: 'Лучшее предложение',
      brand: 'Recover Tactical',
      brandLogo: [
        '/images/slider/logo-vector-1.svg',
        '/images/slider/logo-vector-2.svg',
        '/images/slider/logo-vector-3.svg', 
        '/images/slider/logo-vector-4.svg'
      ]
    },
    {
      id: 2,
      image: '/images/slider/slider-image-1.svg',
      title: 'Премиум качество',
      brand: 'Recover Tactical',
      brandLogo: [
        '/images/slider/logo-vector-1.svg',
        '/images/slider/logo-vector-2.svg',
        '/images/slider/logo-vector-3.svg',
        '/images/slider/logo-vector-4.svg'
      ]
    },
    {
      id: 3,
      image: '/images/slider/slider-image-1.svg',
      title: 'Профессиональное снаряжение',
      brand: 'Recover Tactical',
      brandLogo: [
        '/images/slider/logo-vector-1.svg',
        '/images/slider/logo-vector-2.svg',
        '/images/slider/logo-vector-3.svg',
        '/images/slider/logo-vector-4.svg'
      ]
    },
    {
      id: 4,
      image: '/images/slider/slider-image-1.svg',
      title: 'Эксклюзивные модели',
      brand: 'Recover Tactical',
      brandLogo: [
        '/images/slider/logo-vector-1.svg',
        '/images/slider/logo-vector-2.svg',
        '/images/slider/logo-vector-3.svg',
        '/images/slider/logo-vector-4.svg'
      ]
    },
  ]
};

// Данные о количестве товаров в корзине
export const basketCountMockData = {
  success: true,
  count: 5
};

// Мок данные для каталога товаров
export const catalogMockData = {
  success: true,
  data: {
    items: [
      {
        id: 1,
        name: 'Тактический пистолетный кобура',
        price: 3450,
        image: '/images/catalog/product-1.jpg',
        discount: 10,
        inStock: true
      },
      {
        id: 2,
        name: 'Оптический прицел X4',
        price: 12500,
        image: '/images/catalog/product-2.jpg',
        discount: 0,
        inStock: true
      },
      {
        id: 3,
        name: 'Тактические перчатки',
        price: 1800,
        image: '/images/catalog/product-3.jpg',
        discount: 0,
        inStock: true
      }
    ],
    pagination: {
      total: 24,
      currentPage: 1,
      perPage: 12
    }
  }
}; 