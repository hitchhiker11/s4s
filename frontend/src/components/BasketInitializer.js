import { useEffect } from 'react';
import { useBasket } from '../hooks/useBasket';

/**
 * BasketInitializer component
 * This component automatically initializes the basket system with fuser_id
 * when the app loads. It should be included in the main layout or App component.
 * 
 * It runs silently in the background and ensures that:
 * 1. fuser_id is retrieved from localStorage or initialized from the server
 * 2. The basket state is ready for use throughout the application
 * 3. No visual UI is rendered - this is purely for initialization
 */
const BasketInitializer = () => {
  const { isFuserIdInitialized, fuserId } = useBasket({
    initialFetch: false, // Don't fetch basket data immediately
    autoInitialize: true, // But do initialize fuser_id
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  useEffect(() => {
    if (isFuserIdInitialized) {
      if (fuserId) {
        // console.log('BasketInitializer: Basket system initialized with fuser_id:', fuserId);
      } else {
        // console.log('BasketInitializer: Basket system initialized, fuser_id will be obtained on first basket operation');
      }
    }
  }, [isFuserIdInitialized, fuserId]);

  // This component doesn't render anything visible
  return null;
};

export default BasketInitializer; 