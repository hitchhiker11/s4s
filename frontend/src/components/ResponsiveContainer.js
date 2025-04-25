import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to detect viewport size and determine if we're in mobile view
 */
export const useViewport = () => {
  // Default to desktop during SSR (if window is undefined)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value
    setIsMobile(width < 768);

    // Handle resize events
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return { width, isMobile };
};

/**
 * ResponsiveContainer - Renders either mobile or desktop component based on viewport size
 * 
 * @param {React.Component} DesktopComponent - Component to render on desktop viewports
 * @param {React.Component} MobileComponent - Component to render on mobile viewports
 * @param {Object} props - Props to pass to the rendered component
 */
const ResponsiveContainer = ({ 
  DesktopComponent, 
  MobileComponent, 
  ...props 
}) => {
  const { isMobile } = useViewport();

  // Render the appropriate component based on viewport size
  return isMobile ? (
    <MobileComponent {...props} />
  ) : (
    <DesktopComponent {...props} />
  );
};

ResponsiveContainer.propTypes = {
  DesktopComponent: PropTypes.elementType.isRequired,
  MobileComponent: PropTypes.elementType.isRequired
};

export default ResponsiveContainer; 