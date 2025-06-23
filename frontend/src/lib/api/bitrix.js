import axios from 'axios';

// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BITRIX_URL || 'https://shop4shoot.com/api';
console.log('SHOP4SHOOT DEBUG: API_BASE_URL in bitrix.js initialized to:', API_BASE_URL);
const CATALOG_IBLOCK_ID = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
const BRANDS_IBLOCK_ID = process.env.NEXT_PUBLIC_BRANDS_IBLOCK_ID || '21'; // Assuming brands might be in the same iblock or a different one
const SLIDER_IBLOCK_ID = process.env.NEXT_PUBLIC_SLIDER_IBLOCK_ID || '21'; // Assuming slider data might be in a specific iblock

// Create axios instance with default config
const bitrixApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for handling API errors consistently
const handleApiError = (error, endpoint) => {
  console.error(`API Error (${endpoint}):`, error.response?.status, error.response?.data, error.message);
  
  // Return structured error object
  return {
    error: true,
    message: error.response?.data?.error || error.message || 'Unknown API error',
    status: error.response?.status ?? null,
    data: error.response?.data ?? null,
  };
};

/**
 * Catalog API Services
 */

/**
 * Fetch catalog items with flexible filtering options
 * @param {Object} params - Query parameters based on catalog API documentation
 * @returns {Promise<Object>} Catalog data or error object
 */
export const getCatalogItems = async (params = {}) => {
  try {
    // Ensure iblock_id is provided, defaulting to environment variable or '21'
    const queryParams = {
      iblock_id: CATALOG_IBLOCK_ID,
      ...params,
    };
    
    const response = await bitrixApi.get('/catalog', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogItems');
  }
};

/**
 * Get catalog item details by ID
 * @param {number|string} itemId - Item ID
 * @param {Object} params - Additional query parameters (iblock_id will be overridden)
 * @returns {Promise<Object>} Item details or error object
 */
export const getCatalogItemById = async (itemId, params = {}) => {
  try {
    if (!itemId) throw new Error('Item ID is required');
    
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID, // Ensure correct iblock_id for catalog items
    };

    const response = await bitrixApi.get(`/catalog/${itemId}`, { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogItemById');
  }
};

/**
 * Sections (Categories) API Services
 */

/**
 * Get all catalog section/categories
 * @param {Object} params - Query parameters for sections API (iblock_id will be overridden if not for sections)
 * @returns {Promise<Object>} Sections data or error object
 */
export const getCatalogSections = async (params = {}) => {
  try {
    // Set defaults for common parameters, ensuring correct iblock_id for sections
    const queryParams = {
      iblock_id: CATALOG_IBLOCK_ID, // Sections are part of the main catalog iblock
      tree_mode: params.tree_mode || 'nested',
      depth: params.depth || 3,
      with_element_count: params.with_element_count || 'Y',
      ...params,
    };
    
    const response = await bitrixApi.get('/sections', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogSections');
  }
};

/**
 * Get section by ID with optional subsections
 * @param {number|string} sectionId - Section ID
 * @param {Object} params - Additional query parameters (iblock_id will be overridden)
 * @returns {Promise<Object>} Section data or error object
 */
export const getCatalogSectionById = async (sectionId, params = {}) => {
  try {
    if (!sectionId) throw new Error('Section ID is required');
    
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID, // Sections are part of the main catalog iblock
      section_id: sectionId,
    };

    const response = await bitrixApi.get('/sections', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogSectionById');
  }
};

/**
 * Get subcategories for a specific category by code
 * @param {string} categoryCode - Symbol code of the category
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Subcategories data or error object
 */
export const getCategoryByCode = async (categoryCode, params = {}) => {
  try {
    if (!categoryCode) throw new Error('Category code is required');
    
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID,
      code: categoryCode,
    };

    const response = await bitrixApi.get('/sections', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCategoryByCode');
  }
};

/**
 * Get subcategories for a specific parent category
 * @param {number|string} parentSectionId - ID of the parent category
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Subcategories data or error object
 */
export const getSubcategories = async (parentSectionId, params = {}) => {
  try {
    if (!parentSectionId) throw new Error('Parent section ID is required');
    
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID,
      parent_section_id: parentSectionId,
      tree_mode: params.tree_mode || 'flat',
    };

    const response = await bitrixApi.get('/sections', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getSubcategories');
  }
};

/**
 * Get category tree with specified depth
 * @param {Object} params - Query parameters like depth, max_depth, etc.
 * @returns {Promise<Object>} Category tree data or error object
 */
export const getCategoryTree = async (params = {}) => {
  try {
    const queryParams = {
      iblock_id: CATALOG_IBLOCK_ID,
      tree_mode: 'nested',
      depth: params.depth || 3,
      ...params,
    };
    
    const response = await bitrixApi.get('/sections', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCategoryTree');
  }
};

/**
 * Get catalog items for a specific category with options for including subcategories
 * @param {number|string} sectionId - Section ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Catalog items data or error object
 */
export const getCatalogItemsByCategory = async (sectionId, params = {}) => {
  try {
    if (!sectionId) throw new Error('Section ID is required');
    
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID,
      section_id: sectionId,
      include_subsections: params.include_subsections || 'Y',
    };

    const response = await bitrixApi.get('/catalog', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogItemsByCategory');
  }
};

/**
 * Brands API Services
 */

/**
 * Get all brands with optional filtering
 * @param {Object} params - Query parameters for brands API (iblock_id will be overridden)
 * @returns {Promise<Object>} Brands data or error object
 */
export const getBrands = async (params = {}) => {
  try {
    // Set defaults for common parameters, ensuring correct iblock_id for brands
    const queryParams = {
      iblock_id: BRANDS_IBLOCK_ID,
      with_product_count: params.with_product_count || 'Y',
      ...params,
    };
    
    const response = await bitrixApi.get('/brands', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getBrands');
  }
};

/**
 * Get brand details with products
 * @param {string} brandName - Brand name to filter by
 * @param {Object} params - Additional query parameters (iblock_id will be overridden)
 * @returns {Promise<Object>} Brand data with products or error object
 */
export const getBrandWithProducts = async (brandName, params = {}) => {
  try {
    if (!brandName) throw new Error('Brand name is required');
    
    const queryParams = {
      ...params,
      iblock_id: BRANDS_IBLOCK_ID,
      brand: brandName,
      with_products: 'Y',
      products_limit: params.products_limit || 10,
    };

    const response = await bitrixApi.get('/brands', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getBrandWithProducts');
  }
};

/**
 * About Slider Data - For homepage
 * This endpoint needs to be implemented on the backend
 */
export const getAboutSliderData = async (params = {}) => {
  try {
    const queryParams = {
      iblock_id: SLIDER_IBLOCK_ID,
      ...params, 
    };
    const response = await bitrixApi.get('/about/slider', { params: queryParams });
    return response.data;
  } catch (error) {
    // Provide mock data as fallback if API fails
    console.warn('About slider API failed, using fallback data', error.message);
    return {
      slides: [
        {
          id: 1,
          title: 'О нас',
          image: '/images/about/slide1.jpg',
          description: 'Магазин, созданный стрелками для стрелков',
        },
        {
          id: 2,
          title: 'Наши Бренды',
          image: '/images/about/slide2.jpg',
          description: 'Только проверенные производители',
        },
        {
          id: 3,
          title: 'Доставка по РФ',
          image: '/images/about/slide3.jpg',
          description: 'Быстрая и надежная доставка в любой регион',
        },
      ]
    };
  }
};

/**
 * Basket API Services
 * Based on the cart_order_doc.md documentation
 */

/**
 * Get current user's basket contents
 * @param {Object} params - Query parameters (format: 'full' or 'compact')
 * @returns {Promise<Object>} Basket data or error object
 */
export const getBasket = async (params = {}) => {
  try {
    const response = await bitrixApi.get('/basket', { params });
    console.log('Basket data retrieved:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getBasket');
  }
};

/**
 * Add product to basket
 * @param {Object} productData - Product data to add to basket
 * @param {number|string} productData.product_id - Product ID to add
 * @param {number} [productData.quantity=1] - Quantity to add (default: 1)
 * @param {Array} [productData.properties=[]] - Product properties (color, size, etc.)
 * @returns {Promise<Object>} Result of add operation or error object
 */
export const addToBasket = async (productData) => {
  try {
    if (!productData.product_id) throw new Error('Product ID is required');
    
    // Ensure quantity is at least 1
    const data = {
      product_id: productData.product_id,
      quantity: productData.quantity || 1,
      properties: productData.properties || []
    };
    
    const response = await bitrixApi.post('/basket', data);
    console.log('Product added to basket:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'addToBasket');
  }
};

/**
 * Update basket item quantity
 * @param {Object} updateData - Data for updating basket item
 * @param {number|string} updateData.basket_item_id - Basket item ID to update
 * @param {number} updateData.quantity - New quantity (0 to remove)
 * @returns {Promise<Object>} Result of update operation or error object
 */
export const updateBasketItemQuantity = async (updateData) => {
  try {
    if (!updateData.basket_item_id) throw new Error('Basket item ID is required');
    if (updateData.quantity === undefined) throw new Error('Quantity is required');
    
    const response = await bitrixApi.patch('/basket', updateData);
    console.log('Basket item updated:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'updateBasketItemQuantity');
  }
};

/**
 * Remove item from basket
 * @param {Object} removeData - Data for removing basket item
 * @param {number|string} removeData.basket_item_id - Basket item ID to remove
 * @returns {Promise<Object>} Result of remove operation or error object
 */
export const removeFromBasket = async (removeData) => {
  try {
    if (!removeData.basket_item_id) throw new Error('Basket item ID is required');
    
    const response = await bitrixApi.delete('/basket', { data: removeData });
    console.log('Basket item removed:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'removeFromBasket');
  }
};

/**
 * Clear entire basket
 * @returns {Promise<Object>} Result of clear operation or error object
 */
export const clearBasket = async () => {
  try {
    const response = await bitrixApi.delete('/basket', { 
      data: { clear_all: 'Y' } 
    });
    console.log('Basket cleared:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'clearBasket');
  }
};

/**
 * Create order from current basket
 * @param {Object} orderData - Order data
 * @param {string} orderData.name - Customer name (required)
 * @param {string} orderData.phone - Customer phone (required)
 * @param {string} orderData.email - Customer email (required)
 * @param {string} [orderData.surname] - Customer surname
 * @param {string} [orderData.patronymic] - Customer patronymic
 * @param {string} [orderData.comment] - Order comment
 * @param {number|string} [orderData.payment_method] - Payment method ID
 * @param {number|string} [orderData.delivery_method] - Delivery method ID
 * @param {string} [orderData.delivery_address] - Delivery address
 * @returns {Promise<Object>} Order creation result or error object
 */
export const createOrder = async (orderData) => {
  try {
    // Validate required fields
    if (!orderData.name) throw new Error('Customer name is required');
    if (!orderData.phone) throw new Error('Customer phone is required');
    if (!orderData.email) throw new Error('Customer email is required');
    
    const response = await bitrixApi.post('/order_create', orderData);
    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'createOrder');
  }
};

/**
 * Advanced catalog filtering utilities
 */

/**
 * Build complex catalog filter parameters
 * @param {Object} filterOptions - User-friendly filter options
 * @returns {Object} API-compatible filter parameters
 */
export const buildCatalogFilterParams = (filterOptions = {}) => {
  const {
    section,
    priceRange,
    brands,
    // categories, // Not used directly here, section_id is used for category filtering
    properties,
    sortBy,
    sortOrder,
    limit,
    page,
    searchQuery,
    inStock,
    newArrivals,
    bestsellers,
    iblock_id // Allow overriding iblock_id for specific cases if needed
  } = filterOptions;

  // Initialize params object with defaults
  const params = {
    iblock_id: iblock_id || CATALOG_IBLOCK_ID,
    limit: limit || 10,
    page: page || 1,
  };

  // Section filtering
  if (section) {
    params.section_id = section;
    params.include_subsections = 'Y';
  }

  // Price range
  if (priceRange?.from) params.price_from = priceRange.from;
  if (priceRange?.to) params.price_to = priceRange.to;

  // Brand filtering (multiple brands supported)
  // Note: Brand filtering is usually done by a specific property like 'BRAND'
  // This assumes `brands` is an array of brand values to filter by a property named 'BRAND'
  if (brands && brands.length) {
    // If filtering catalog items by brand property
    if (params.iblock_id === CATALOG_IBLOCK_ID) {
        brands.forEach((brand, index) => {
            params[`property[BRAND][${index}]`] = brand;
        });
    } 
    // If it's for the /brands endpoint, it might have a different structure
    // The /brands endpoint itself handles brand listing, specific brand filtering is by name via path or param
  }

  // Other properties filtering
  if (properties) {
    Object.entries(properties).forEach(([propName, propValue]) => {
      if (Array.isArray(propValue)) {
        // Handle array of values for a property
        propValue.forEach((value, index) => {
          params[`property[${propName.toUpperCase()}][${index}]`] = value;
        });
      } else {
        // Handle single value
        params[`property[${propName.toUpperCase()}]`] = propValue;
      }
    });
  }

  // Search query by name
  if (searchQuery) {
    params.name = searchQuery;
  }

  // In stock filter
  if (inStock !== undefined) {
    params.in_stock = inStock ? 'Y' : 'N';
  }

  // New arrivals filter (assuming there's a property ISNEW)
  if (newArrivals) {
    params['property[ISNEW]'] = 'Y';
  }

  // Bestsellers filter (assuming there's a property BESTSELLER)
  if (bestsellers) {
    params['property[BESTSELLER]'] = 'Y';
  }

  // Sorting
  if (sortBy) {
    const direction = sortOrder === 'desc' ? 'desc' : 'asc';
    params.sort = `${sortBy}:${direction}`;
  }
  
  // Clean up undefined params to avoid sending them
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  return params;
};

/**
 * Get catalog items from a subcategory by parent category code and subcategory code
 * @param {string} categoryCode - Parent category code
 * @param {string} subCategoryCode - Subcategory code 
 * @param {Object} params - Query parameters for pagination, sorting, etc.
 * @returns {Promise<Object>} Catalog items data or error object
 */
export const getCatalogItemsBySubCategoryCode = async (categoryCode, subCategoryCode, params = {}) => {
  try {
    if (!subCategoryCode) throw new Error('Subcategory code is required');
    
    // First get the subcategory ID by code
    const subCategoryResponse = await getCategoryByCode(subCategoryCode);
    
    if (subCategoryResponse.error || !subCategoryResponse.data || subCategoryResponse.data.length === 0) {
      throw new Error(`Subcategory with code ${subCategoryCode} not found`);
    }
    
    const subCategoryId = subCategoryResponse.data[0].id;
    
    // Then use the subcategory ID to get products
    const queryParams = {
      ...params,
      iblock_id: CATALOG_IBLOCK_ID,
      section_id: subCategoryId,
      limit: params.limit || 12,
      page: params.page || 1,
      sort: params.sort || 'date_create:desc',
    };

    const response = await bitrixApi.get('/catalog', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogItemsBySubCategoryCode');
  }
};

export default {
  getCatalogItems,
  getCatalogItemById,
  getCatalogSections,
  getCatalogSectionById,
  getBrands,
  getBrandWithProducts,
  getAboutSliderData,
  buildCatalogFilterParams,
  // New category-related methods
  getCategoryByCode,
  getSubcategories,
  getCategoryTree,
  getCatalogItemsByCategory,
  // Basket API methods
  getBasket,
  addToBasket,
  updateBasketItemQuantity,
  removeFromBasket,
  clearBasket,
  createOrder,
  getCatalogItemsBySubCategoryCode
}; 