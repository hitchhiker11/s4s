import { getCatalogItems, getCatalogSections, getCatalogSectionById } from './api/bitrix';

// Add Bitrix host constant near top after imports
const BITRIX_HOST = (process.env.NEXT_PUBLIC_BITRIX_HOST || 'https://shop4shoot.com').replace(/\/$/, '');

// Helper to safely extract slug from URL or code
const extractSlug = (urlOrCode = '') => {
  if (!urlOrCode) return '';
  // If we already have a code-like string without slashes, just return it
  if (!urlOrCode.includes('/')) return urlOrCode;
  // Otherwise treat as URL: split, filter empty parts and pick last segment
  const parts = urlOrCode.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
};

// Helper to extract full category path from URL (preserving hierarchy)
const extractCategoryPath = (urlOrCode = '') => {
  if (!urlOrCode) return '';
  
  // If it's a simple code without slashes, return as is
  if (!urlOrCode.includes('/')) return urlOrCode;
  
  // If it's a URL, extract the path after /catalog/
  if (urlOrCode.includes('/catalog/')) {
    const parts = urlOrCode.split('/catalog/');
    if (parts.length > 1) {
      // Return the path after /catalog/, removing any trailing slashes
      return parts[1].replace(/\/$/, '');
    }
  }
  
  // Fallback: treat as path, remove leading/trailing slashes
  return urlOrCode.replace(/^\/+|\/+$/g, '');
};

// Read brands iblock id from env (fallback to 22)
const BRANDS_IBLOCK_ID = process.env.NEXT_PUBLIC_BRANDS_IBLOCK_ID || '22';

// Add simple slugify utility for brand names (Russian letters -> remove spaces)
const simpleSlugify = (text = '') => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')          // spaces -> hyphen
    .replace(/[^a-z0-9а-яё\-]/g, '') // drop other symbols (keeps cyrillic)
    .replace(/\-+/g, '-');
};

// Build full category path by traversing up the hierarchy
const buildCategoryPath = async (categoryId, categoryCode) => {
  console.log('🔧 Building path for category:', { categoryId, categoryCode });
  
  if (!categoryId) {
    return categoryCode || '';
  }
  
  try {
    const pathSegments = [];
    const visited = new Set();
    let currentId = categoryId;
    
    // Traverse up the hierarchy (max 5 levels to prevent infinite loops)
    for (let i = 0; i < 5 && currentId && !visited.has(currentId); i++) {
      visited.add(currentId);
      
      const sectionResponse = await getCatalogSectionById(currentId);
      if (sectionResponse.error || !sectionResponse.data || sectionResponse.data.length === 0) {
        break;
      }
      
      const section = sectionResponse.data[0];
      const sectionCode = section.fields?.CODE || section.code;
      
      // Skip technical root sections
      if (sectionCode && sectionCode.toLowerCase() !== 'katalog_sayta') {
        pathSegments.unshift(sectionCode);
      }
      
      // Move to parent
      currentId = section.fields?.IBLOCK_SECTION_ID || section.fields?.PARENT_SECTION_ID || null;
    }
    
    const fullPath = pathSegments.join('/');
    console.log('✅ Built category path:', fullPath);
    return fullPath || categoryCode || '';
  } catch (error) {
    console.error('❌ Error building category path:', error);
    return categoryCode || '';
  }
};

// Map raw catalog item from API to SearchResults product shape
const mapProduct = (item) => {
  // Some API fields could be under different keys depending on format
  const fields = item.fields || {};
  const properties = item.properties || {};
  const images = item.images || {};

  // Determine image URL (preview > thumb > medium > large)
  let imageUrl = images?.preview?.standard_sizes?.thumb?.src || images?.preview?.src || '';

  // Fallbacks if preview missing
  if (!imageUrl && images?.detail?.standard_sizes?.thumb?.src) {
    imageUrl = images.detail.standard_sizes.thumb.src;
  }

  // If still no image, try gallery first item
  if (!imageUrl && Array.isArray(images.gallery) && images.gallery.length > 0) {
    imageUrl = images.gallery[0]?.standard_sizes?.thumb?.src || images.gallery[0]?.src || '';
  }

  // Ensure full URL (Bitrix host) for dev localhost
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `${BITRIX_HOST}${imageUrl}`;
  }

  return {
    id: item.id || fields.ID,
    name: item.name || fields.NAME,
    brand: properties.BREND?.VALUE || properties.BRAND?.VALUE || '',
    price: Array.isArray(item.prices) && item.prices.length > 0 ? item.prices[0].price : null,
    imageUrl,
    slug: extractSlug(fields.DETAIL_PAGE_URL || fields.CODE || item.slug),
    available: fields.CATALOG_AVAILABLE === 'Y',
  };
};

// Map raw brand item to SearchResults brand shape (for new brands API)
const mapBrand = (item) => {
  // New API returns fields directly, not in nested structure
  const id = item.id;
  const name = item.name || '';
  const code = item.code || '';
  
  // Use code as slug if available, otherwise create from name
  let slug = code;
  if (!slug) {
    slug = name ? simpleSlugify(name) : String(id);
  }

  console.log('🔍 [Search] Mapping brand:', { id, name, code, slug });

  return {
    id: String(id),
    name,
    slug,
  };
};

// Map raw section/category item to SearchResults category shape
const mapCategory = async (item) => {
  const fields = item.fields || {};
  
  // Debug: Let's see what API returns
  console.log('🔍 Search API category result:', {
    id: item.id || fields.ID || fields.SECTION_ID,
    name: item.name || fields.NAME || item.section_name,
    code: fields.CODE || fields.SECTION_CODE,
    sectionPageUrl: fields.SECTION_PAGE_URL || fields.section_page_url,
    parentId: fields.IBLOCK_SECTION_ID || fields.PARENT_SECTION_ID,
    fieldsKeys: Object.keys(fields),
    rawItem: item
  });
  
  // For categories, we need the full path to preserve hierarchy
  const sectionPageUrl = fields.SECTION_PAGE_URL || fields.section_page_url;
  const categoryCode = fields.CODE || fields.SECTION_CODE || item.slug;
  const categoryId = item.id || fields.ID || fields.SECTION_ID;
  
  let slug;
  if (sectionPageUrl) {
    // Use provided full URL
    slug = extractCategoryPath(sectionPageUrl);
  } else {
    // Build full path from hierarchy
    slug = await buildCategoryPath(categoryId, categoryCode);
  }
  
  return {
    id: categoryId,
    name: item.name || fields.NAME || item.section_name,
    slug: slug,
    // Add additional data to help with hierarchy detection
    parentId: fields.IBLOCK_SECTION_ID || fields.PARENT_SECTION_ID,
    code: categoryCode,
    fullUrl: sectionPageUrl,
  };
};

/**
 * Search utility function that queries real Bitrix API and returns formatted results.
 * 
 * @param {string} query - The search query string
 * @param {string} source - 'mobile' or 'desktop' for logging purposes
 * @returns {Object} Object containing brands, categories and products arrays
 */
export const searchData = async (query, source = 'unknown') => {
  console.log(`[${source}] searchData (API) called with query:`, query);

  // Return empty if query is too short
  if (!query || query.trim().length < 2) {
    return { brands: [], categories: [], products: [] };
  }

  try {
    // Perform API requests in parallel for max performance
    const [productsResp, brandsResp, categoriesResp] = await Promise.all([
      // Products from main catalog (iblock 21)
      getCatalogItems({ name: query, limit: 5, page: 1 }),
      // Brands using new brands API
      getCatalogItems({ 
        action: 'brands',
        iblock_id: process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21',
        brands_iblock_id: BRANDS_IBLOCK_ID,
        search: query, 
        limit: 5 
      }),
      // Categories / sections search: use flat mode for direct matches
      getCatalogSections({ name: query, tree_mode: 'flat', depth: 3, limit: 5, page: 1 }),
    ]);

    // Extract data arrays safely
    const rawProducts = productsResp?.data || [];
    const rawBrands = brandsResp?.data || [];
    const rawCategories = categoriesResp?.data || [];

    // Map to UI shape and slice to max 5 items
    const products = rawProducts.map(mapProduct).slice(0, 5);
    const brands = rawBrands.map(mapBrand).slice(0, 5);
    const categories = await Promise.all(rawCategories.slice(0, 5).map(mapCategory));

    const results = { brands, categories, products };

    console.debug(`[${source}] API search results:`, results);
    return results;
  } catch (error) {
    console.error(`[${source}] searchData failed:`, error);
    // Fallback to empty results on error
    return { brands: [], categories: [], products: [] };
  }
}; 