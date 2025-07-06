import { getCatalogItems, getCatalogSections } from './api/bitrix';

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

// Map raw brand item to SearchResults brand shape
const mapBrand = (item) => {
  const fields = item.fields || {};
  const id = item.id || fields.ID;
  const name = item.name || fields.NAME || '';
  const codeOrUrl = fields.CODE || fields.DETAIL_PAGE_URL || '';
  let slug = extractSlug(codeOrUrl);

  // If slug is still empty, build from name or id
  if (!slug) {
    slug = name ? simpleSlugify(name) : String(id);
  }

  return {
    id,
    name,
    slug,
  };
};

// Map raw section/category item to SearchResults category shape
const mapCategory = (item) => {
  const fields = item.fields || {};
  return {
    id: item.id || fields.ID || fields.SECTION_ID,
    name: item.name || fields.NAME || item.section_name,
    slug: extractSlug(fields.CODE || fields.SECTION_CODE || fields.SECTION_PAGE_URL || item.slug),
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
      // Brands via catalog endpoint but with iblock 22
      getCatalogItems({ iblock_id: BRANDS_IBLOCK_ID, name: query, limit: 5, page: 1 }),
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
    const categories = rawCategories.map(mapCategory).slice(0, 5);

    const results = { brands, categories, products };

    console.debug(`[${source}] API search results:`, results);
    return results;
  } catch (error) {
    console.error(`[${source}] searchData failed:`, error);
    // Fallback to empty results on error
    return { brands: [], categories: [], products: [] };
  }
}; 