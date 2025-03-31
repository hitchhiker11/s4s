import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BITRIX_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Для работы с сессиями Bitrix
});

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
    try {
      const { data } = await api.post('/ajax/catalog/loadItems.php', { sectionId });
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Получение детальной информации о товаре
  getProductDetail: async (productId) => {
    try {
      const { data } = await api.post('/ajax/catalog/getProductDetail.php', { productId });
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },
  
  // Поиск товаров
  searchProducts: async (query) => {
    try {
      const { data } = await api.post('/search/catalog/index.php', { query });
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

// API методы для работы с корзиной
export const basketApi = {
  // Добавление товара в корзину
  addToBasket: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/ajax/catalog/basketHandler.php', {
        id: productId,
        quantity,
        method: 'add',
      });
      return data;
    } catch (error) {
      console.error('Error adding to basket:', error);
      throw error;
    }
  },
  
  // Обновление количества товара в корзине
  updateBasketItem: async (productId, quantity) => {
    try {
      const { data } = await api.post('/ajax/catalog/basketHandler.php', {
        id: productId,
        quantity,
        method: 'update',
      });
      return data;
    } catch (error) {
      console.error('Error updating basket item:', error);
      throw error;
    }
  },
  
  // Удаление товара из корзины
  removeFromBasket: async (productId) => {
    try {
      const { data } = await api.post('/ajax/catalog/basketHandler.php', {
        id: productId,
        method: 'delete',
      });
      return data;
    } catch (error) {
      console.error('Error removing from basket:', error);
      throw error;
    }
  },
  
  // Очистка корзины
  clearBasket: async () => {
    try {
      const { data } = await api.post('/ajax/catalog/basketHandler.php', {
        method: 'deleteAll',
      });
      return data;
    } catch (error) {
      console.error('Error clearing basket:', error);
      throw error;
    }
  },
  
  // Получение количества товаров в корзине
  getBasketCount: async () => {
    try {
      const { data } = await api.get('/ajax/getProductCountInBasket.php');
      return data;
    } catch (error) {
      console.error('Error getting basket count:', error);
      throw error;
    }
  },
};

// API методы для работы с формами
export const formsApi = {
  // Отправка формы K1
  submitK1Form: async (formData) => {
    try {
      const { data } = await api.post('/ajax/k1Form.php', formData);
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },
};

export default api; 