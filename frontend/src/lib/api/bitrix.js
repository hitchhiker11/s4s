import axios from 'axios';

// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BITRIX_URL || 'https://old.shop4shoot.com/api';
console.log('SHOP4SHOOT DEBUG: API_BASE_URL in bitrix.js initialized to:', API_BASE_URL);
const CATALOG_IBLOCK_ID = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
const BRANDS_IBLOCK_ID = process.env.NEXT_PUBLIC_BRANDS_IBLOCK_ID || '22'; // Assuming brands might be in the same iblock or a different one
const SLIDER_IBLOCK_ID = process.env.NEXT_PUBLIC_SLIDER_IBLOCK_ID || '27'; // ID инфоблока со слайдерами

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
  
  // Prefer nested error message when present
  const serverMessage = error.response?.data?.error?.message || error.response?.data?.message;
  
  // Return structured error object
  return {
    error: true,
    message: serverMessage || error.message || 'Unknown API error',
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
 * Get single catalog item by ID or Code
 * @param {Object} params - { id, code, with_offers, with_related, ... }
 */
export const getCatalogItem = async (params = {}) => {
  try {
    const queryParams = {
      iblock_id: CATALOG_IBLOCK_ID,
      ...params,
    };

    // require id or code
    if (!queryParams.id && !queryParams.code) {
      throw new Error('id or code parameter is required');
    }

    const response = await bitrixApi.get('/catalog_item', { params: queryParams });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getCatalogItem');
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
    const queryParams = {
      action: 'brands',
      iblock_id: CATALOG_IBLOCK_ID, // 21
      brands_iblock_id: BRANDS_IBLOCK_ID, // 22
      with_products_count: params.with_products_count || 'Y',
      ...params,
    };
    
    console.log('🏷️ [API] Getting brands with params:', queryParams);
    const response = await bitrixApi.get('/catalog', { params: queryParams });
    console.log('✅ [API] Brands retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to get brands:', error);
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
 * Get catalog items for a specific brand using brand_id
 * @param {number|string} brandId - Brand ID (required)
 * @param {Object} params - Additional query parameters
 * @param {number} [params.limit] - Limit results (default: 12)
 * @param {number} [params.page] - Page number (default: 1)
 * @param {string} [params.sort] - Sorting (e.g. "date_create:desc")
 * @param {string} [params.include_subbrands] - Include first-level subbrands ("Y"/"N")
 * @param {string} [params.deep_subbrands] - Deep search through all subbrands ("Y"/"N")
 * @param {number|string} [params.section_id] - Filter by section (can combine with brand)
 * @param {string} [params.include_subsections] - Include subsections when filtering by section ("Y"/"N")
 * @returns {Promise<Object>} Catalog items data or error object
 */
export const getCatalogItemsByBrand = async (brandId, params = {}) => {
  try {
    if (!brandId) throw new Error('Brand ID is required');
    
    const queryParams = {
      iblock_id: CATALOG_IBLOCK_ID,
      brand_id: brandId,
      limit: params.limit || 12,
      page: params.page || 1,
      sort: params.sort || 'date_create:desc',
      ...params,
    };
    
    console.log('🏷️ [API] Getting catalog items by brand:', { brandId, params: queryParams });
    const response = await bitrixApi.get('/catalog', { params: queryParams });
    console.log('✅ [API] Brand catalog items retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to get catalog items by brand:', error);
    return handleApiError(error, 'getCatalogItemsByBrand');
  }
};

/**
 * Get brand details by code (uses search to find exact match)
 * @param {string} brandCode - Brand code (required)
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Brand data or error object
 */
export const getBrandByCode = async (brandCode, params = {}) => {
  try {
    if (!brandCode) throw new Error('Brand code is required');
    
    console.log('🏷️ [API] Getting brand by code:', brandCode);
    
    // Strategy 1: Try with search parameter first
    let brandsResponse = await getBrands({ 
      search: brandCode, 
      limit: 50,
      ...params 
    });
    
    // Find exact code match (case-insensitive)
    let exactMatch = null;
    if (!brandsResponse.error && brandsResponse.data?.length) {
      exactMatch = brandsResponse.data.find(brand => 
        brand.code && brand.code.toLowerCase() === brandCode.toLowerCase()
      );
    }
    
    // Strategy 2: If not found with search, get all brands and search manually
    if (!exactMatch) {
      console.log('🔍 [API] Brand not found with search, trying to get all brands...');
      brandsResponse = await getBrands({ 
        limit: 200, // Get more brands
        ...params 
      });
      
      if (!brandsResponse.error && brandsResponse.data?.length) {
        exactMatch = brandsResponse.data.find(brand => 
          brand.code && brand.code.toLowerCase() === brandCode.toLowerCase()
        );
      }
    }
    
    // Strategy 3: Try with name search if code search failed
    if (!exactMatch) {
      console.log('🔍 [API] Brand not found by code, trying name search...');
      brandsResponse = await getBrands({ 
        search: brandCode.replace(/-/g, ' '), // Replace dashes with spaces
        limit: 50,
        ...params 
      });
      
      if (!brandsResponse.error && brandsResponse.data?.length) {
        exactMatch = brandsResponse.data.find(brand => 
          (brand.code && brand.code.toLowerCase() === brandCode.toLowerCase()) ||
          (brand.name && brand.name.toLowerCase().replace(/\s+/g, '-') === brandCode.toLowerCase())
        );
      }
    }
    
    if (!exactMatch) {
      throw new Error(`Brand with code "${brandCode}" not found`);
    }
    
    console.log('✅ [API] Brand found by code:', exactMatch);
    return exactMatch;
  } catch (error) {
    console.error('❌ [API] Failed to get brand by code:', error);
    return handleApiError(error, 'getBrandByCode');
  }
};

/**
 * About Slider Data - For homepage
 * This endpoint needs to be implemented on the backend
 */
export const getAboutSliderData = async (params = {}) => {
  try {
    // Запрашиваем элементы инфоблока 27 (слайдер) в минимальном формате
    const queryParams = {
      iblock_id: SLIDER_IBLOCK_ID,
      format: 'minimal',
      ...params,
    };

    const response = await bitrixApi.get('/catalog', { params: queryParams });
    return response.data;
  } catch (error) {
    // В случае ошибки возвращаем структурированную ошибку
    return handleApiError(error, 'getAboutSliderData');
  }
};

/**
 * Basket API Services
 * Based on the basket_api_documentation.md
 * All basket operations now properly handle fuser_id for persistent basket state
 */

/**
 * Get current user's basket contents
 * @param {Object} params - Query parameters
 * @param {string|number} [params.fuser_id] - Basket user identifier 
 * @param {string} [params.format] - Response format: 'full', 'compact', 'minimal'
 * @returns {Promise<Object>} Basket data or error object
 */
export const getBasket = async (params = {}) => {
  try {
    console.log('🛒 [API] Getting basket with params:', params);
    const response = await bitrixApi.get('/basket', { params });
    console.log('✅ [API] Basket retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to get basket:', error);
    return handleApiError(error, 'getBasket');
  }
};

/**
 * Add product to basket
 * @param {Object} productData - Product data to add to basket
 * @param {string|number} productData.fuser_id - Basket user identifier (required)
 * @param {number|string} productData.product_id - Product ID to add (required)
 * @param {number} [productData.quantity=1] - Quantity to add (default: 1)
 * @param {Object} [productData.properties={}] - Product properties (color, size, etc.)
 * @returns {Promise<Object>} Result of add operation or error object
 */
export const addToBasket = async (productData) => {
  try {
    if (!productData.fuser_id) throw new Error('fuser_id is required');
    if (!productData.product_id) throw new Error('Product ID is required');
    
    // Ensure quantity is at least 1
    const data = {
      fuser_id: productData.fuser_id,
      product_id: productData.product_id,
      quantity: productData.quantity || 1,
      properties: productData.properties || {}
    };
    
    console.log('🛒 [API] Adding product to basket:', data);
    const response = await bitrixApi.post('/basket', data);
    console.log('✅ [API] Product added to basket successfully:', response.data);
    
    // Check if the API returned an error in the response data
    if (response.data && response.data.success === false) {
      throw new Error(response.data.error || 'Add to basket failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to add product to basket:', error);
    
    // If it's an API error with error field, throw it
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // If it's already our custom error, re-throw it
    if (error.message !== 'Network Error' && error.message !== 'Request failed with status code 400') {
      throw error;
    }
    
    // For other errors, use handleApiError but throw the result
    const errorResult = handleApiError(error, 'addToBasket');
    throw new Error(errorResult.message);
  }
};

/**
 * Update basket item quantity
 * @param {Object} updateData - Data for updating basket item
 * @param {string|number} updateData.fuser_id - Basket user identifier (required)
 * @param {number|string} updateData.basket_item_id - Basket item ID to update (required)
 * @param {number} updateData.quantity - New quantity (required)
 * @param {Object} [updateData.properties] - Updated product properties
 * @returns {Promise<Object>} Result of update operation or error object
 */
export const updateBasketItemQuantity = async (updateData) => {
  try {
    if (!updateData.fuser_id) throw new Error('fuser_id is required');
    if (!updateData.basket_item_id) throw new Error('Basket item ID is required');
    if (updateData.quantity === undefined) throw new Error('Quantity is required');
    
    console.log('🛒 [API] Updating basket item quantity:', updateData);
    const response = await bitrixApi.patch('/basket', updateData);
    console.log('✅ [API] Basket item quantity updated successfully:', response.data);
    
    // Check if the API returned an error in the response data
    if (response.data && response.data.success === false) {
      throw new Error(response.data.error || 'Update failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to update basket item quantity:', error);
    
    // If it's an API error with error field, throw it
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // If it's already our custom error, re-throw it
    if (error.message !== 'Network Error' && error.message !== 'Request failed with status code 400') {
      throw error;
    }
    
    // For other errors, use handleApiError but throw the result
    const errorResult = handleApiError(error, 'updateBasketItemQuantity');
    throw new Error(errorResult.message);
  }
};

/**
 * Remove item from basket
 * @param {Object} removeData - Data for removing basket item
 * @param {string|number} removeData.fuser_id - Basket user identifier (required)
 * @param {number|string} removeData.basket_item_id - Basket item ID to remove (required)
 * @returns {Promise<Object>} Result of remove operation or error object
 */
export const removeFromBasket = async (removeData) => {
  try {
    if (!removeData.fuser_id) throw new Error('fuser_id is required');
    if (!removeData.basket_item_id) throw new Error('Basket item ID is required');
    
    console.log('🛒 [API] Removing item from basket:', removeData);
    const response = await bitrixApi.delete('/basket', { data: removeData });
    console.log('✅ [API] Item removed from basket successfully:', response.data);
    
    // Check if the API returned an error in the response data
    if (response.data && response.data.success === false) {
      throw new Error(response.data.error || 'Remove failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to remove item from basket:', error);
    
    // If it's an API error with error field, throw it
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // If it's already our custom error, re-throw it
    if (error.message !== 'Network Error' && error.message !== 'Request failed with status code 400') {
      throw error;
    }
    
    // For other errors, use handleApiError but throw the result
    const errorResult = handleApiError(error, 'removeFromBasket');
    throw new Error(errorResult.message);
  }
};

/**
 * Clear entire basket
 * @param {string|number} fuserId - Basket user identifier (required)
 * @returns {Promise<Object>} Result of clear operation or error object
 */
export const clearBasket = async (fuserId) => {
  try {
    if (!fuserId) throw new Error('fuser_id is required');
    
    const response = await bitrixApi.delete('/basket', { 
      data: { 
        fuser_id: fuserId,
        clear_all: 'Y' 
      } 
    });
    console.log('Basket cleared:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'clearBasket');
  }
};

/**
 * Check if a product is available in the requested quantity
 * @param {Object} stockData - Data for stock validation
 * @param {number|string} stockData.product_id - Product ID to check (required)
 * @param {number} stockData.quantity - Quantity to validate (required)
 * @returns {Promise<Object>} Stock validation result or error object
 */
export const checkStock = async (stockData) => {
  try {
    if (!stockData.product_id) throw new Error('Product ID is required');
    if (!stockData.quantity) throw new Error('Quantity is required');
    
    const response = await bitrixApi.get('/basket', { 
      params: {
        action: 'check_stock',
        product_id: stockData.product_id,
        quantity: stockData.quantity
      }
    });
    console.log('Stock check result:', response.data);
    
    // For stock check, we don't throw an error if stock is insufficient
    // We return the response data which contains available/unavailable info
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to check stock:', error);
    
    // For stock check, throw only on actual API errors, not stock unavailability
    if (error.response?.status === 400 && error.response?.data?.error) {
      // If it's a 400 error, it might be insufficient stock - return the error data
      return error.response.data;
    }
    
    // For other errors, use handleApiError but throw the result
    const errorResult = handleApiError(error, 'checkStock');
    throw new Error(errorResult.message);
  }
};

/**
 * Create order from current basket
 * @param {Object} orderData - Order data
 * @param {string|number} orderData.fuser_id - Basket user identifier (required)
 * @param {string} orderData.customer_name - Customer name (required)
 * @param {string} orderData.customer_lastname - Customer lastname (required)
 * @param {string} orderData.customer_phone - Customer phone (required)
 * @param {string} orderData.customer_email - Customer email (required)
 * @param {string} [orderData.customer_middlename] - Customer middlename
 * @param {string} orderData.cdek_code - CDEK pickup point code (required)
 * @param {string} orderData.delivery_address - Delivery address (required)
 * @param {number} [orderData.payment_system_id] - Payment system ID (default: 3 - Robokassa)
 * @param {string} [orderData.comment] - Order comment
 * @param {string} [orderData.clear_basket] - Clear basket after order (Y/N, default: Y)
 * @returns {Promise<Object>} Order creation result or error object
 */
export const createOrder = async (orderData) => {
  try {
    // Validate required fields
    if (!orderData.fuser_id) throw new Error('fuser_id is required');
    if (!orderData.customer_name) throw new Error('Customer name is required');
    if (!orderData.customer_lastname) throw new Error('Customer lastname is required');
    if (!orderData.customer_phone) throw new Error('Customer phone is required');
    if (!orderData.customer_email) throw new Error('Customer email is required');
    if (!orderData.cdek_code) throw new Error('CDEK code is required');
    if (!orderData.delivery_address) throw new Error('Delivery address is required');
    
    const response = await bitrixApi.post('/order', orderData);
    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'createOrder');
  }
};

/**
 * Get order status
 * @param {number|string} orderId - Order ID (required)
 * @returns {Promise<Object>} Order status data or error object
 */
export const getOrderStatus = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const trimmedId = String(orderId).trim();
    console.log('🧾 [API] getOrderStatus for order_id:', trimmedId);
    const response = await bitrixApi.get('/order', {
      params: { action: 'get_status', order_id: trimmedId }
    });
    let data = response?.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // Fallback: try to extract minimal fields if server returns text
        console.warn('⚠️ [API] Non-JSON order status response, returning raw text');
        return { success: false, error: { message: 'Invalid response format' }, raw: data };
      }
    }
    console.log('✅ [API] Order status retrieved:', data);
    return data;
  } catch (error) {
    console.error('❌ [API] Error getting order status:', error);
    return handleApiError(error, 'getOrderStatus');
  }
};

/**
 * Get payment form for order
 * @param {number|string} orderId - Order ID (required)
 * @returns {Promise<Object>} Payment form data or error object
 */
export const getPaymentForm = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const trimmedId = String(orderId).trim();
    console.log('💳 [API] getPaymentForm for order_id:', trimmedId);
    const response = await bitrixApi.get('/order', {
      params: { action: 'get_payment_form', order_id: trimmedId }
    });
    let data = response?.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.warn('⚠️ [API] Non-JSON payment form response, returning raw text');
        return { success: false, error: { message: 'Invalid response format' }, raw: data };
      }
    }
    console.log('✅ [API] Payment form retrieved:', data);
    return data;
  } catch (error) {
    console.error('❌ [API] Error getting payment form:', error);
    return handleApiError(error, 'getPaymentForm');
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

/**
 * Forms API Services
 * For handling form submissions to different info blocks
 */

/**
 * Submit form data to a specific info block
 * @param {Object} formData - Form submission data
 * @param {number} formData.iblock_id - Info block ID (required)
 * @param {Object} formData.fields - Form fields data (required)
 * @returns {Promise<Object>} Form submission result or error object
 */
export const submitForm = async (formData) => {
  try {
    if (!formData.iblock_id) throw new Error('Info block ID is required');
    if (!formData.fields) throw new Error('Form fields are required');
    
    console.log('📝 [API] Submitting form:', formData);
    const response = await bitrixApi.post(`/form/?iblock_id=${formData.iblock_id}`, formData);
    console.log('✅ [API] Form submitted successfully:', response.data);
    
    // Check if the API returned an error in the response data
    if (response.data && response.data.success === false) {
      const message = response.data?.error?.message || response.data?.message || 'Form submission failed';
      throw new Error(message);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ [API] Failed to submit form:', error);
    const errorResult = handleApiError(error, 'submitForm');
    throw new Error(errorResult.message);
  }
};

/**
 * Submit request form (Info block ID: 24)
 * @param {Object} requestData - Request form data
 * @param {string} requestData.first_name - Customer first name (required)
 * @param {string} requestData.last_name - Customer last name (required)
 * @param {string} requestData.phone_number - Customer phone number (required)
 * @param {string} requestData.email - Customer email (required)
 * @param {string} [requestData.comment] - Customer comment
 * @returns {Promise<Object>} Request submission result or error object
 */
export const submitRequestForm = async (requestData) => {
  try {
    const formData = {
      iblock_id: 24,
      fields: {
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        phone_number: requestData.phone_number,
        email: requestData.email,
        comment: requestData.comment || ''
      }
    };
    
    return await submitForm(formData);
  } catch (error) {
    throw new Error(`Ошибка при отправке заявки: ${error.message}`);
  }
};

/**
 * Submit callback form (Info block ID: 23)
 * @param {Object} callbackData - Callback form data
 * @param {string} callbackData.first_name - Customer first name (required)
 * @param {string} callbackData.phone_number - Customer phone number (required)
 * @returns {Promise<Object>} Callback submission result or error object
 */
export const submitCallbackForm = async (callbackData) => {
  try {
    const formData = {
      iblock_id: 23,
      fields: {
        first_name: callbackData.first_name,
        phone_number: callbackData.phone_number
      }
    };
    
    return await submitForm(formData);
  } catch (error) {
    throw new Error(`Ошибка при заказе звонка: ${error.message}`);
  }
};

/**
 * Submit pre-order form (Info block ID: 25)
 * @param {Object} preOrderData - Pre-order form data
 * @param {string} preOrderData.first_name - Customer first name (required)
 * @param {string} preOrderData.last_name - Customer last name (required)
 * @param {string} preOrderData.surname - Customer surname (required)
 * @param {string} preOrderData.phone_number - Customer phone number (required)
 * @param {string} preOrderData.email - Customer email (required)
 * @param {string} [preOrderData.comment] - Customer comment
 * @param {string} [preOrderData.product_name] - Product name
 * @param {string} [preOrderData.product_article] - Product article
 * @param {string} [preOrderData.product_id] - Product ID
 * @returns {Promise<Object>} Pre-order submission result or error object
 */
export const submitPreOrderForm = async (preOrderData) => {
  try {
    const formData = {
      iblock_id: 25,
      fields: {
        first_name: preOrderData.first_name,
        last_name: preOrderData.last_name,
        surname: preOrderData.surname,
        phone_number: preOrderData.phone_number,
        email: preOrderData.email,
        comment: preOrderData.comment || '',
        product_name: preOrderData.product_name || '',
        product_article: preOrderData.product_article || '',
        product_id: preOrderData.product_id || ''
      }
    };
    
    return await submitForm(formData);
  } catch (error) {
    throw new Error(`Ошибка при оформлении предзаказа: ${error.message}`);
  }
};

/**
 * Subscription API
 */
export const subscribeToNews = async ({ phone, name, email }) => {
  try {
    const formData = {
      iblock_id: 28,
      fields: {
        first_name: name || '',
        phone_number: phone,
        email: email || ''
      }
    };
    return await submitForm(formData);
  } catch (error) {
    const err = handleApiError(error, 'subscribeToNews');
    return { success: false, error: { message: err.message }, data: err.data };
  }
};

export default {
  getCatalogItems,
  getCatalogItemById,
  getCatalogItem,
  getCatalogSections,
  getCatalogSectionById,
  getBrands,
  getBrandWithProducts,
  getCatalogItemsByBrand,
  getBrandByCode,
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
  checkStock,
  // Order API methods
  createOrder,
  getOrderStatus,
  getPaymentForm,
  getCatalogItemsBySubCategoryCode,
  // Forms API methods
  submitForm,
  submitRequestForm,
  submitCallbackForm,
  submitPreOrderForm,
  subscribeToNews
};
