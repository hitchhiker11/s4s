import { useQuery, useMutation, useQueryClient } from 'react-query';
import * as bitrixApi from '../api/bitrix';
import * as transformers from '../api/transformers';

/**
 * Hook for fetching catalog items with React Query
 * @param {Object} filterOptions - Options for filtering catalog items
 * @param {Object} queryOptions - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useCatalogItems = (filterOptions = {}, queryOptions = {}) => {
  // Convert user-friendly filter options to API params
  const apiParams = bitrixApi.buildCatalogFilterParams(filterOptions);
  
  return useQuery(
    ['catalog', apiParams], // Query key includes all params for proper caching
    async () => {
      const response = await bitrixApi.getCatalogItems(apiParams);
      
      // Check for API error response
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch catalog items');
      }
      
      // Transform API data to component format
      const items = transformers.transformCatalogItems(response.data || []);
      const metadata = transformers.extractMetadata(response);
      
      return { items, metadata };
    },
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      ...queryOptions,
    }
  );
};

/**
 * Hook for fetching a single catalog item with React Query
 * @param {string|number} itemId - ID of the item to fetch
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useCatalogItem = (itemId, options = {}) => {
  return useQuery(
    ['catalogItem', itemId],
    async () => {
      if (!itemId) throw new Error('Item ID is required');
      
      const response = await bitrixApi.getCatalogItemById(itemId);
      
      if (response.error) {
        throw new Error(response.message || `Failed to fetch item with ID ${itemId}`);
      }
      
      // Transform API data to component format
      return transformers.transformCatalogItem(response.data);
    },
    {
      enabled: !!itemId, // Only run query if itemId exists
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      ...options,
    }
  );
};

/**
 * Hook for fetching catalog sections/categories with React Query
 * @param {Object} params - Parameters for the sections API
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useCatalogSections = (params = {}, options = {}) => {
  return useQuery(
    ['catalogSections', params],
    async () => {
      const response = await bitrixApi.getCatalogSections(params);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch catalog sections');
      }
      
      // Transform API data to component format
      const sections = transformers.transformSections(response.data || []);
      const metadata = transformers.extractMetadata(response);
      
      return { sections, metadata };
    },
    {
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes (categories change less frequently)
      ...options,
    }
  );
};

/**
 * Hook for fetching a single section with React Query
 * @param {string|number} sectionId - ID of the section to fetch
 * @param {Object} params - Additional parameters for the API
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useCatalogSection = (sectionId, params = {}, options = {}) => {
  return useQuery(
    ['catalogSection', sectionId, params],
    async () => {
      if (!sectionId) throw new Error('Section ID is required');
      
      const response = await bitrixApi.getCatalogSectionById(sectionId, params);
      
      if (response.error) {
        throw new Error(response.message || `Failed to fetch section with ID ${sectionId}`);
      }
      
      // Usually the API returns an array with one item for a specific section
      const sectionData = Array.isArray(response.data) && response.data.length > 0
        ? response.data[0]
        : response.data;
      
      return transformers.transformSection(sectionData);
    },
    {
      enabled: !!sectionId, // Only run query if sectionId exists
      staleTime: 10 * 60 * 1000,
      ...options,
    }
  );
};

/**
 * Hook for fetching brands with React Query
 * @param {Object} params - Parameters for the brands API
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useBrands = (params = {}, options = {}) => {
  return useQuery(
    ['brands', params],
    async () => {
      const response = await bitrixApi.getBrands(params);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch brands');
      }
      
      // Transform API data to component format
      const brands = transformers.transformBrands(response.data || []);
      const metadata = transformers.extractMetadata(response);
      
      return { brands, metadata };
    },
    {
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
      ...options,
    }
  );
};

/**
 * Hook for fetching a single brand with products
 * @param {string} brandName - Name of the brand to fetch
 * @param {Object} params - Additional parameters for the API
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useBrandWithProducts = (brandName, params = {}, options = {}) => {
  return useQuery(
    ['brand', brandName, params],
    async () => {
      if (!brandName) throw new Error('Brand name is required');
      
      const response = await bitrixApi.getBrandWithProducts(brandName, params);
      
      if (response.error) {
        throw new Error(response.message || `Failed to fetch brand ${brandName}`);
      }
      
      // The API might return an array with one brand or a single brand object
      const brandData = Array.isArray(response.data) && response.data.length > 0
        ? response.data[0]
        : response.data;
      
      return transformers.transformBrand(brandData);
    },
    {
      enabled: !!brandName, // Only run query if brandName exists
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

/**
 * Hook for fetching about slider data with React Query
 * @param {Object} options - Additional options for React Query
 * @returns {Object} React Query result object
 */
export const useAboutSliderData = (options = {}) => {
  return useQuery(
    ['aboutSliderData'],
    async () => {
      const response = await bitrixApi.getAboutSliderData();
      
      // This API might fall back to mock data on error, so we don't check for errors
      return response;
    },
    {
      staleTime: 30 * 60 * 1000, // Consider data fresh for 30 minutes
      ...options,
    }
  );
};

export default {
  useCatalogItems,
  useCatalogItem,
  useCatalogSections,
  useCatalogSection,
  useBrands,
  useBrandWithProducts,
  useAboutSliderData,
}; 