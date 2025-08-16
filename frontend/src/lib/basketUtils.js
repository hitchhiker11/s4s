/**
 * Utilities for managing basket fuser_id on the client side
 * Ensures persistent basket state across sessions
 */

const FUSER_ID_STORAGE_KEY = 'shop4shoot_fuser_id';
const FUSER_ID_EXPIRY_KEY = 'shop4shoot_fuser_id_expiry';

// Default expiry: 1 year from now
const DEFAULT_EXPIRY_DAYS = 365;

/**
 * Get the current fuser_id from localStorage
 * @returns {string|null} The stored fuser_id or null if not found/expired
 */
export const getStoredFuserId = () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side rendering, no localStorage available
      return null;
    }

    const fuserId = localStorage.getItem(FUSER_ID_STORAGE_KEY);
    const expiry = localStorage.getItem(FUSER_ID_EXPIRY_KEY);

    if (!fuserId) {
      return null;
    }

    // Check if fuser_id has expired
    if (expiry && new Date().getTime() > parseInt(expiry, 10)) {
      clearStoredFuserId();
      return null;
    }

    return fuserId;
  } catch (error) {
    console.warn('Failed to get stored fuser_id:', error);
    return null;
  }
};

/**
 * Store fuser_id in localStorage with expiry
 * @param {string|number} fuserId - The fuser_id to store
 * @param {number} expiryDays - Number of days until expiry (default: 365)
 */
export const storeFuserId = (fuserId, expiryDays = DEFAULT_EXPIRY_DAYS) => {
  try {
    if (typeof window === 'undefined') {
      // Server-side rendering, no localStorage available
      return;
    }

    if (!fuserId) {
      console.warn('Cannot store empty fuser_id');
      return;
    }

    const expiryTime = new Date().getTime() + (expiryDays * 24 * 60 * 60 * 1000);
    
    localStorage.setItem(FUSER_ID_STORAGE_KEY, String(fuserId));
    localStorage.setItem(FUSER_ID_EXPIRY_KEY, String(expiryTime));
    
    console.log(`Stored fuser_id: ${fuserId} with expiry: ${new Date(expiryTime).toISOString()}`);
  } catch (error) {
    console.warn('Failed to store fuser_id:', error);
  }
};

/**
 * Clear stored fuser_id from localStorage
 */
export const clearStoredFuserId = () => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(FUSER_ID_STORAGE_KEY);
    localStorage.removeItem(FUSER_ID_EXPIRY_KEY);
    
    console.log('Cleared stored fuser_id');
  } catch (error) {
    console.warn('Failed to clear stored fuser_id:', error);
  }
};

/**
 * Check if we have a valid fuser_id stored
 * @returns {boolean} True if we have a valid stored fuser_id
 */
export const hasValidFuserId = () => {
  return getStoredFuserId() !== null;
};

/**
 * Get or initialize fuser_id
 * This function will:
 * 1. Check if we have a stored fuser_id
 * 2. If not, make a GET request to /api/basket to get a new one
 * 3. Store the new fuser_id for future use
 * 
 * @param {Function} getBasketApi - Function to call the basket API
 * @returns {Promise<string|null>} The fuser_id or null if failed
 */
export const getOrInitializeFuserId = async (getBasketApi) => {
  try {
    // First check if we have a stored fuser_id
    const storedFuserId = getStoredFuserId();
    
    if (storedFuserId) {
      console.log('Using stored fuser_id:', storedFuserId);
      return storedFuserId;
    }

    console.log('No stored fuser_id found, initializing new basket...');
    
    // Make a GET request without fuser_id to initialize a new basket
    const response = await getBasketApi();
    
    if (response && response.meta && response.meta.fuser_id) {
      const newFuserId = String(response.meta.fuser_id);
      storeFuserId(newFuserId);
      
      console.log('Initialized new fuser_id:', newFuserId);
      return newFuserId;
    }

    console.warn('Failed to get fuser_id from basket API response:', response);
    return null;
    
  } catch (error) {
    console.error('Failed to get or initialize fuser_id:', error);
    return null;
  }
};

/**
 * Validate and refresh fuser_id if needed
 * This can be called periodically to ensure the fuser_id is still valid
 * 
 * @param {string} fuserId - The current fuser_id to validate
 * @param {Function} getBasketApi - Function to call the basket API
 * @returns {Promise<string|null>} The validated fuser_id or a new one
 */
export const validateAndRefreshFuserId = async (fuserId, getBasketApi) => {
  try {
    // Try to get basket with current fuser_id
    const response = await getBasketApi({ fuser_id: fuserId });
    
    if (response && response.meta && response.meta.fuser_id) {
      const responseFuserId = String(response.meta.fuser_id);
      
      // If the response contains a different fuser_id, update our stored one
      if (responseFuserId !== fuserId) {
        console.log(`Updating fuser_id from ${fuserId} to ${responseFuserId}`);
        storeFuserId(responseFuserId);
        return responseFuserId;
      }
      
      return fuserId;
    }

    // If validation failed, get a new fuser_id
    console.warn('fuser_id validation failed, getting new one...');
    return await getOrInitializeFuserId(getBasketApi);
    
  } catch (error) {
    console.error('Failed to validate fuser_id:', error);
    // If there's an error, try to get a new fuser_id
    return await getOrInitializeFuserId(getBasketApi);
  }
};

export default {
  getStoredFuserId,
  storeFuserId,
  clearStoredFuserId,
  hasValidFuserId,
  getOrInitializeFuserId,
  validateAndRefreshFuserId
}; 