import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to detect viewport size and determine if we're in mobile view
 */
export const useViewport = () => {
  // Default to desktop during SSR (if window is undefined)
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value immediately on mount
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());

    // Handle resize events
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(checkMobile());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Force a check on mount
    handleResize();
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Remove width dependency to prevent unnecessary re-renders

  return { width, isMobile };
};

/**
 * Debug component to show current viewport state during development
 */
const ViewportIndicator = ({ isMobile, width }) => {
  const style = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '5px 10px',
    background: isMobile ? '#ff5722' : '#4caf50',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 9999,
  };

  return (
    <div style={style}>
      {isMobile ? 'Mobile' : 'Desktop'} ({width}px)
    </div>
  );
};

/**
 * ResponsiveContainer - Renders either mobile or desktop component based on viewport size
 * 
 * @param {React.Component} DesktopComponent - Component to render on desktop viewports
 * @param {React.Component} MobileComponent - Component to render on mobile viewports
 * @param {Object} desktopProps - Props specifically for the DesktopComponent
 * @param {Object} mobileProps - Props specifically for the MobileComponent
 * @param {boolean} debug - Flag to show viewport indicator
 */
const ResponsiveContainer = ({ 
  DesktopComponent, 
  MobileComponent, 
  desktopProps = {}, // Default to empty objects
  mobileProps = {},
  debug = false,
}) => {
  const { isMobile, width } = useViewport();

  return (
    <>
      {/* Render the appropriate component based on viewport size, passing specific props */}
      {isMobile ? (
        <MobileComponent {...mobileProps} />
      ) : (
        <DesktopComponent {...desktopProps} />
      )}
      
      {/* Show debug indicator during development */}
      {debug && <ViewportIndicator isMobile={isMobile} width={width} />}
    </>
  );
};

ResponsiveContainer.propTypes = {
  DesktopComponent: PropTypes.elementType.isRequired,
  MobileComponent: PropTypes.elementType.isRequired,
  desktopProps: PropTypes.object, // Add prop types for specific props
  mobileProps: PropTypes.object,
  debug: PropTypes.bool
};

export default ResponsiveContainer; 