/**
 * API Response Transformers
 * 
 * This file contains utility functions to transform API responses
 * into formats expected by our React components. This helps with 
 * the transition from mock data to API data.
 */

// Local image mapping for categories by CODE or NAME (if CODE is missing)
// This helps maintain existing local images for categories.
const categoryImageMap = {
  // Use category CODE as key if available and consistent
  'odezhda': '/images/categories/category-clothing.png',
  'obuv': '/images/categories/category-shoes.png',
  'snaryazhenie': '/images/categories/category-gear.png',
  'oruzhie': '/images/categories/category-weapons.png',
  'aksessuary': '/images/categories/category-accessories.png',
  'outdor': '/images/categories/category-outdoor.png',
  'podarki': '/images/categories/category-gifts.png',
  'tovary-dlya-sobak': '/images/categories/category-dogs.svg', // Example with SVG
  // Add more mappings as needed, based on your actual category codes/names and image paths
  // Fallback by Name (less reliable, try to use CODE)
  'Одежда': '/images/categories/category-clothing.png',
  'Обувь': '/images/categories/category-shoes.png',
  'Снаряжение': '/images/categories/category-gear.png',
  'Оружие и Тюнинг': '/images/categories/category-weapons.png', // Example with spaces in name
};

// Local image mapping for brands by NAME
// This is more of a best-effort, as brand images might not be consistently named locally.
const brandImageMap = {
  'Eiger': '/images/brands/eiger_tac_logo.jpg',
  '5.11 Tactical': '/images/brands/511_logo.png',
  'Mechanix Wear': '/images/brands/mechanix_logo.jpg',
  // Add more brand image mappings here
};

/**
 * Get full URL for an image
 * @param {string} imagePath - Relative or absolute image path
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imagePath) => {
  // Check if imagePath is null, undefined, or not a string
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn('🖼️ [Transformer] Invalid imagePath provided:', { imagePath, type: typeof imagePath });
    return '/images/placeholder.png';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shop4shoot.com/';
  
  // If path starts with /, add base URL
  if (imagePath.startsWith('/')) {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const fullUrl = `${cleanBaseUrl}${imagePath}`;
    console.log('🖼️ [Transformer] Image URL formed:', { imagePath, baseUrl, fullUrl });
    return fullUrl;
  }
  
  // For relative paths, add base URL with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const fullUrl = `${cleanBaseUrl}${imagePath}`;
  console.log('🖼️ [Transformer] Image URL formed:', { imagePath, baseUrl, fullUrl });
  return fullUrl;
};

/**
 * Transform catalog item from API format to component format
 * @param {Object} apiItem - Item data from the API
 * @returns {Object} Transformed item data for components
 */
export const transformCatalogItem = (apiItem) => {
  if (!apiItem || typeof apiItem !== 'object') return null;
  
  const {
    id,
    name,
    fields = {},
    properties = {},
    prices = [],
    images = {},
    // Assuming API might provide `in_stock` directly at the top level or within fields/props
    in_stock: topLevelInStock,
  } = apiItem;
  
  const articleProp = properties.ARTICLE || properties.CML2_ARTICLE || {};
  const brandProp = properties.BRAND || {};
  
  // Process images from the new API structure
  let mainImage = '/images/placeholder.png';
  let imagesList = [];
  
  // Get the BASE_URL from environment variables
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shop4shoot.com';
  
  // Helper function to prepend the base URL if needed
  const getFullImageUrl = (path) => {
    // Check if path is null, undefined, or not a string
    if (!path || typeof path !== 'string') {
      // console.warn('🖼️ [Transformer-Local] Invalid path provided:', { path, type: typeof path });
      return '/images/placeholder.png';
    }
    
    // If already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If starts with /upload or any absolute path, prepend the BASE_URL
    if (path.startsWith('/')) {
      const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
      const fullUrl = `${cleanBaseUrl}${path}`;
      // console.log('🖼️ [Transformer-Local] Image URL formed:', { path, baseUrl: BASE_URL, fullUrl });
      return fullUrl;
    }
    
    // For relative paths, add base URL with /
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    const fullUrl = `${cleanBaseUrl}${path}`;
    // console.log('🖼️ [Transformer-Local] Image URL formed:', { path, baseUrl: BASE_URL, fullUrl });
    return fullUrl;
  };
  
  // Handle the new images structure first if available
  if (images && typeof images === 'object') {
    if (images.preview && images.preview.src) {
      // Use medium size for product cards if available
      mainImage = images.preview.standard_sizes?.medium?.src || images.preview.src;
      mainImage = getFullImageUrl(mainImage);
      imagesList.push(mainImage);
    }
    
    if (images.detail && images.detail.src && images.detail.src !== mainImage) {
      const detailImage = getFullImageUrl(images.detail.src);
      imagesList.push(detailImage);
    }
    
    // Add gallery images if available
    if (images.gallery && Array.isArray(images.gallery)) {
      imagesList = [...imagesList, ...images.gallery.map(img => img?.src && typeof img.src === 'string' ? getFullImageUrl(img.src) : null).filter(Boolean)];
    }
    
    // If all images are available in the 'all' array, use that
    if (images.all && Array.isArray(images.all) && images.all.length > 0) {
      // Add any additional images not already included
      images.all.forEach(img => {
        if (img?.src && typeof img.src === 'string') {
          const fullUrl = getFullImageUrl(img.src);
          if (!imagesList.includes(fullUrl)) {
            imagesList.push(fullUrl);
          }
        }
      });
    }
  }
  
  // Fallback to legacy image fields if new structure isn't available
  if (imagesList.length === 0) {
    // Image handling: Prioritize MORE_PHOTO, then DETAIL_PICTURE, then PREVIEW_PICTURE
    if (properties.MORE_PHOTO?.VALUE && Array.isArray(properties.MORE_PHOTO.VALUE) && properties.MORE_PHOTO.VALUE.length > 0) {
      imagesList = properties.MORE_PHOTO.VALUE.map(img => getFullImageUrl(img));
      mainImage = imagesList[0];
    } else if (properties.MORE_PHOTO?.VALUE && typeof properties.MORE_PHOTO.VALUE === 'string') {
      mainImage = getFullImageUrl(properties.MORE_PHOTO.VALUE);
      imagesList = [mainImage];
    } else if (fields.DETAIL_PICTURE) {
      mainImage = getFullImageUrl(`/upload/${fields.DETAIL_PICTURE}`);
      imagesList = [mainImage];
    } else if (fields.PREVIEW_PICTURE) {
      mainImage = getFullImageUrl(`/upload/${fields.PREVIEW_PICTURE}`);
      imagesList = [mainImage];
    }
  }
  
  const basePrice = prices.find(price => price.base) || prices[0] || {};
  
  // Determine stock status
  const stockStatus = fields.CATALOG_AVAILABLE === 'Y';
  const quantityAvailable = parseInt(fields.CATALOG_QUANTITY || 0, 10) > 0;

  return {
    id: String(id), // Ensure ID is a string
    name: name || 'Unnamed Product',
    article: articleProp.VALUE || '',
    brand: brandProp.VALUE || '',
    price: parseFloat(basePrice.price) || 0,
    currency: basePrice.currency || 'RUB',
    image: mainImage,
    images: imagesList.length > 0 ? imagesList : ['/images/placeholder.png'],
    description: fields.PREVIEW_TEXT || fields.DETAIL_TEXT || '',
    detailUrl: fields.DETAIL_PAGE_URL || `/detail/${fields.CODE || id}`,
    inStock: stockStatus,
    quantityAvailable: quantityAvailable,
    quantity: parseInt(fields.CATALOG_QUANTITY || 0, 10),
    isNew: properties.ISNEW?.VALUE === 'Y' || properties.NEWPRODUCT?.VALUE === 'Y', // common variations for new flag
    isBestseller: properties.BESTSELLER?.VALUE === 'Y' || properties.SALELEADER?.VALUE === 'Y', // common variations
    code: fields.CODE || '',
    // Add any additional fields needed by components
    raw: apiItem, // Optionally include raw API item for debugging or further use
  };
};

/**
 * Transform catalog items array from API format to component format
 * @param {Array} apiItems - Array of items from the API
 * @returns {Array} Transformed items for components
 */
export const transformCatalogItems = (apiItems = []) => {
  if (!Array.isArray(apiItems)) return [];
  return apiItems.map(transformCatalogItem).filter(item => item !== null);
};

/**
 * Transform section/category from API format to component format
 * @param {Object} apiSection - Section data from the API
 * @returns {Object} Transformed section data for components
 */
export const transformSection = (apiSection) => {
  if (!apiSection || typeof apiSection !== 'object') return null;
  
  // Поддержка нескольких возможных форматов API
  const fields = apiSection.fields || apiSection;
  
  // Extract key fields with fallbacks
  const sectionId = apiSection.id || apiSection.ID || fields.ID;
  const sectionCode = fields.CODE || apiSection.code || '';
  const sectionName = apiSection.name || fields.NAME || 'Unnamed Category';
  
  // Image handling: приоритет новым полям с прямыми ссылками
  let imageUrl = '/images/categories/placeholder.jpg';
  
  // 1. Проверяем новые поля с прямыми ссылками (приоритет)
  if (fields.PICTURE_SRC || fields.PICTURE_PREVIEW_SRC) {
    // Используем превью для карточек, оригинал как fallback
    const directImageUrl = fields.PICTURE_PREVIEW_SRC || fields.PICTURE_SRC;
    if (directImageUrl) {
      imageUrl = getFullImageUrl(directImageUrl);
    }
  }
  // 2. Fallback на локальные изображения по коду/названию
  else if (categoryImageMap[sectionCode] || categoryImageMap[sectionName]) {
    imageUrl = categoryImageMap[sectionCode] || categoryImageMap[sectionName];
  }
  // 3. Fallback на старое поле PICTURE (только если нет прямых ссылок)
  else if (fields.PICTURE || apiSection.picture) {
    const pictureId = fields.PICTURE || apiSection.picture;
    imageUrl = getFullImageUrl(`/upload/${pictureId}`);
  }
  
  // Construct URL correctly - prefer using symbolic code over ID
  const sectionUrl = fields.SECTION_PAGE_URL || apiSection.section_page_url;
  const url = sectionUrl || `/catalog/${sectionCode || sectionId}`;

  return {
    id: String(sectionId), // Ensure ID is string
    name: sectionName,
    code: sectionCode,
    image: imageUrl,
    imageUrl: imageUrl, // Добавляем для совместимости с компонентами
    count: parseInt(apiSection.element_count || fields.ELEMENT_CNT, 10) || 0,
    url: url,
    children: Array.isArray(apiSection.children) 
      ? apiSection.children.map(transformSection).filter(Boolean) 
      : [],
    raw: apiSection, // Include raw API data for access to all fields
  };
};

/**
 * Transform sections array from API format to component format
 * @param {Array} apiSections - Array of sections from the API
 * @returns {Array} Transformed sections for components
 */
export const transformSections = (apiSections = []) => {
  if (!Array.isArray(apiSections)) return [];
  return apiSections.map(transformSection).filter(Boolean);
};

/**
 * Transform brand from API format to component format
 * @param {Object} apiBrand - Brand data from the new brands API
 * @returns {Object} Transformed brand data for components
 */
export const transformBrand = (apiBrand) => {
  if (!apiBrand || typeof apiBrand !== 'object' || !apiBrand.name) return null;
  
  const {
    id,
    name,
    code,
    sort,
    preview_text,
    detail_text,
    preview_picture,
    products_count
  } = apiBrand;

  // Handle new image structure with resized versions
  let imageUrl = null;
  if (preview_picture) {
    // Prefer resized image if available, fallback to original
    if (preview_picture.resized?.src) {
      imageUrl = preview_picture.resized.src;
    } else if (preview_picture.src) {
      imageUrl = preview_picture.src;
    }
    
    // Ensure full URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shop4shoot.com';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      imageUrl = imageUrl.startsWith('/') ? `${cleanBaseUrl}${imageUrl}` : `${cleanBaseUrl}/${imageUrl}`;
    }
  }

  // Use code as slug, fallback to transformed name
  const slug = code || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё-]/g, '');
  
  // Try to find local image, fallback to API image, then placeholder
  const localImage = brandImageMap[name];

  return {
    id: String(id), // Ensure ID is string
    name: name,
    code: code || slug,
    slug: slug, // For URL generation
    title: name, // For compatibility with existing components
    image: localImage || imageUrl || '/images/brands/placeholder.png',
    imageUrl: localImage || imageUrl || '/images/brands/placeholder.png',
    url: `/brands/${slug}`,
    link: `/brands/${slug}`, // For compatibility with existing components
    previewText: preview_text || '',
    detailText: detail_text || '',
    description: preview_text || detail_text || '', // For compatibility
    productsCount: parseInt(products_count, 10) || 0,
    count: parseInt(products_count, 10) || 0, // For compatibility
    sort: parseInt(sort, 10) || 500,
    showTitle: false, // For compatibility with existing components (brands show logos, not titles)
    disableRotation: true, // Brands don't need rotation effects
    rotation: 0, // No rotation for brands
    // Products array from API should already be in catalog item format if fetched with products
    products: Array.isArray(apiBrand.products)
      ? transformCatalogItems(apiBrand.products) 
      : [],
    raw: apiBrand, // Include raw API brand for debugging
  };
};

/**
 * Transform brands array from API format to component format
 * @param {Array} apiBrands - Array of brands from the API
 * @returns {Array} Transformed brands for components
 */
export const transformBrands = (apiBrands = []) => {
  if (!Array.isArray(apiBrands)) return [];
  return apiBrands.map(transformBrand).filter(Boolean);
};

/**
 * Extract and format metadata from API response
 * @param {Object} apiResponse - Full API response with meta section
 * @returns {Object} Formatted metadata
 */
export const extractMetadata = (apiResponse = {}) => {
  if (!apiResponse || typeof apiResponse !== 'object') return { totalItems: 0, totalPages: 1, currentPage: 1, itemsPerPage: 10 };
  const meta = apiResponse.meta || {};
  
  return {
    totalItems: parseInt(meta.total_count, 10) || 0,
    totalPages: parseInt(meta.total_pages, 10) || 1,
    currentPage: parseInt(meta.page, 10) || 1,
    itemsPerPage: parseInt(meta.limit, 10) || 10,
    timestamp: meta.request_time || new Date().toISOString(),
  };
};

export default {
  transformCatalogItem,
  transformCatalogItems,
  transformSection,
  transformSections,
  transformBrand,
  transformBrands,
  extractMetadata,
}; 