import { mockBrands, mockCategories, mockNewArrivals, mockBestsellers } from './mockData';

/**
 * Search utility function that processes mock data and returns formatted results.
 * 
 * @param {string} query - The search query string
 * @param {string} source - 'mobile' or 'desktop' for logging purposes
 * @returns {Object} Object containing brands, categories and products arrays
 */
export const searchData = async (query, source = 'unknown') => {
  console.log(`[${source}] searchData called with query:`, query);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return empty if query is too short
  if (!query || query.length < 2) {
    console.log(`[${source}] Query too short, returning empty results`);
    return { brands: [], categories: [], products: [] };
  }
  
  // Use the imported mock data
  const lowerQuery = query.toLowerCase();
  
  // Map mockBrands to expected structure (id, name, slug)
  const brands = mockBrands
    .filter(b => b.title.toLowerCase().includes(lowerQuery))
    .map(b => ({
      id: b.id,
      name: b.title,
      slug: b.link.split('/').pop() // Extract slug from link
    }));
  
  // Map mockCategories to expected structure
  const categories = mockCategories
    .filter(c => c.title.toLowerCase().includes(lowerQuery))
    .map(c => ({
      id: c.id,
      name: c.title,
      slug: c.link.split('/').pop() // Extract slug from link
    }));
  
  // Combine mockNewArrivals and mockBestsellers for products
  const allProducts = [...mockNewArrivals, ...mockBestsellers];
  
  // Map products to expected structure with more comprehensive search
  const products = allProducts
    .filter(p => {
      const nameMatch = p.name.toLowerCase().includes(lowerQuery);
      const brandMatch = p.brand.toLowerCase().includes(lowerQuery);
      // Combine main product info with brand for full text search
      const fullTextMatch = `${p.name} ${p.brand}`.toLowerCase().includes(lowerQuery);
      
      return nameMatch || brandMatch || fullTextMatch;
    })
    .map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand, // Include brand name for display
      price: p.price, // Include price for potential display
      imageUrl: p.imageUrl, // Include image URL for potential display
      slug: p.productLink.split('/').pop(), // Extract slug from productLink
      available: p.CATALOG_AVAILABLE === 'Y' // Availability flag
    }))
    // Limit to max 5 product results in dropdown
    .slice(0, 5);
  
  const results = { brands, categories, products };
  
  console.log(`[${source}] Search results:`, {
    brands: brands.length > 0 ? brands.map(b => b.name) : 'none',
    categories: categories.length > 0 ? categories.map(c => c.name) : 'none',
    products: products.length > 0 ? products.map(p => p.name) : 'none'
  });
  
  console.log(`[${source}] Results count:`, {
    brands: brands.length,
    categories: categories.length,
    products: products.length
  });
  
  return results;
}; 