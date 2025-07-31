import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SPACING } from '../styles/tokens';

/**
 * NoSSR wrapper component to prevent hydration issues
 * Only renders children after component has mounted on client
 */
const NoSSR = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
};

/**
 * Custom hook to detect viewport size and determine if we're in mobile view
 * SSR-safe with hydration protection
 */
export const useViewport = () => {
  // Default to desktop during SSR (if window is undefined)
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setHasMounted(true);
    
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

  return { 
    width: hasMounted ? width : 1200, // Always return 1200 during SSR/hydration
    isMobile: hasMounted ? isMobile : false 
  };
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

const ResponsiveWrapper = styled.div`
  display: block;
  margin: 0;
  // padding: 0 ${SPACING.md};
  box-sizing: border-box;
  overflow: visible;
  height: auto;
`;

/**
 * ResponsiveContainer - Renders either mobile or desktop component based on viewport size
 * SSR-safe with hydration protection
 * 
 * @param {React.Component} DesktopComponent - Component to render on desktop viewports
 * @param {React.Component} MobileComponent - Component to render on mobile viewports
 * @param {Object} desktopProps - Props specifically for the DesktopComponent
 * @param {Object} mobileProps - Props specifically for the MobileComponent
 * @param {boolean} debug - Flag to show viewport indicator
 * @param {boolean} suppressHydrationWarning - Flag to suppress hydration warnings during dev
 */
const ResponsiveContainer = ({ 
  DesktopComponent, 
  MobileComponent, 
  desktopProps = {}, // Default to empty objects
  mobileProps = {},
  debug = false,
  suppressHydrationWarning = true, // Enable by default to fix hydration issues
}) => {
  const { isMobile, width } = useViewport();

  if (suppressHydrationWarning) {
    return (
      <ResponsiveWrapper suppressHydrationWarning={true}>
        <NoSSR fallback={<DesktopComponent {...desktopProps} />}>
          {/* Render the appropriate component based on viewport size, passing specific props */}
          {isMobile ? (
            <MobileComponent {...mobileProps} />
          ) : (
            <DesktopComponent {...desktopProps} />
          )}
        </NoSSR>
        
        {/* Show debug indicator during development */}
        {debug && <ViewportIndicator isMobile={isMobile} width={width} />}
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      {/* Render the appropriate component based on viewport size, passing specific props */}
      {isMobile ? (
        <MobileComponent {...mobileProps} />
      ) : (
        <DesktopComponent {...desktopProps} />
      )}
      
      {/* Show debug indicator during development */}
      {debug && <ViewportIndicator isMobile={isMobile} width={width} />}
    </ResponsiveWrapper>
  );
};

ResponsiveContainer.propTypes = {
  DesktopComponent: PropTypes.elementType.isRequired,
  MobileComponent: PropTypes.elementType.isRequired,
  desktopProps: PropTypes.object, // Add prop types for specific props
  mobileProps: PropTypes.object,
  debug: PropTypes.bool,
  suppressHydrationWarning: PropTypes.bool
};

export default ResponsiveContainer; 