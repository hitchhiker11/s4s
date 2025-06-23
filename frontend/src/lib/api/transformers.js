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
  
  // Get the OLD_BASE_URL from environment variables
  const OLD_BASE_URL = process.env.OLD_BASE_URL || 'https://shop4shoot.com';
  
  // Helper function to prepend the base URL if needed
  const getFullImageUrl = (path) => {
    if (!path) return '/images/placeholder.png';
    
    // If already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If starts with /upload, prepend the OLD_BASE_URL
    if (path.startsWith('/upload')) {
      return `${OLD_BASE_URL}${path}`;
    }
    
    // For local images that start with /images, return as is
    return path;
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
      imagesList = [...imagesList, ...images.gallery.map(img => getFullImageUrl(img.src))];
    }
    
    // If all images are available in the 'all' array, use that
    if (images.all && Array.isArray(images.all) && images.all.length > 0) {
      // Add any additional images not already included
      images.all.forEach(img => {
        if (img.src) {
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
    detailUrl: fields.DETAIL_PAGE_URL || `/catalog/${fields.CODE || id}`,
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
  
  // Image handling with local mappings
  const localImage = categoryImageMap[sectionCode] || categoryImageMap[sectionName];
  const apiImage = fields.PICTURE || apiSection.picture || null;
  
  // Construct URL correctly - prefer using symbolic code over ID
  const sectionUrl = fields.SECTION_PAGE_URL || apiSection.section_page_url;
  const url = sectionUrl || `/catalog/${sectionCode || sectionId}`;

  return {
    id: String(sectionId), // Ensure ID is string
    name: sectionName,
    code: sectionCode,
    image: localImage || (apiImage ? `/upload/${apiImage}` : '/images/categories/placeholder.jpg'),
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
 * @param {Object} apiBrand - Brand data from the API (structure from /brands endpoint)
 * @returns {Object} Transformed brand data for components
 */
export const transformBrand = (apiBrand) => {
  if (!apiBrand || typeof apiBrand !== 'object' || !apiBrand.brand) return null;
  
  const brandName = apiBrand.brand;
  const brandId = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Try to find local image, fallback to API logo, then construct a path, then placeholder
  const localImage = brandImageMap[brandName];
  const apiLogo = apiBrand.logo || apiBrand.UF_LOGO; // Assuming API might send `logo` or `UF_LOGO`
  const constructedImagePath = `/images/brands/${brandId}.png`; // Default assumption for brand image path

  return {
    id: brandId,
    name: brandName,
    image: localImage || apiLogo || constructedImagePath, // Fallback chain
    count: parseInt(apiBrand.product_count, 10) || 0,
    // URL for brands page, assuming a route like /brands/[brandIdOrName]
    url: `/brands/${brandId}`,
    description: apiBrand.description || '',
    // Products array from API should already be in catalog item format if fetched with products
    products: Array.isArray(apiBrand.products)
      ? transformCatalogItems(apiBrand.products) 
      : [],
    raw: apiBrand, // Optionally include raw API brand
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