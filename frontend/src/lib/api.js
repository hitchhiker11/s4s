import axios from 'axios';

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