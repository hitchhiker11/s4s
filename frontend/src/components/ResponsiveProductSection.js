import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer, { useViewport } from './ResponsiveContainer';
import ProductGrid from './ProductGrid';
import ProductSlider from './ProductSlider';
import productGridStyles from '../styles/ProductGridResponsive.module.css'; // Import CSS module

/**
 * ResponsiveProductSection - Renders either ProductGrid (desktop) or ProductSlider (mobile)
 * based on the current viewport size. Can be forced to use slider on desktop.
 */
const ResponsiveProductSection = ({ 
  items, 
  renderItem, 
  useSliderOnDesktop = false,
  showNavigationOnDesktop = true,
  alwaysSlider = false, // Force slider regardless of screen width
  ...props 
}) => {
  const { width, isMobile } = useViewport();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // Log the items for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`${props.title || 'Product Section'} - Mobile?: ${isMobile} - Items:`, items?.length ?? 0, items);
  }

  // Props for ProductSlider (expects 'products')
  const productSliderProps = {
    ...props,
    products: items, // Pass items as products to the slider
    showNavigation: (useSliderOnDesktop || alwaysSlider) ? showNavigationOnDesktop : false, // Show navigation when using slider on desktop or when always slider
    sliderSectionStyles: props.sliderSectionStyles || props.gridSectionStyles, // Pass sliderSectionStyles if provided, otherwise use gridSectionStyles for compatibility
  };

  // Props for ProductGrid (expects 'products' directly)
  // NOTE: ProductGrid doesn't use renderItem, it maps internally using ProductCard
  const productGridProps = {
    ...props,
    products: items, // Pass items as products
    gridContainerClassName: productGridStyles.productGridContainer, // Add responsive grid class
    preOrderWrapperProps: { className: productGridStyles.preOrderWrapper } // Add responsive wrapper class
  };

  // If forced to use slider on desktop, use ProductSlider for both desktop and mobile
  // but only up to 1550px width. Above 1550px, always use grid
  // Exception: if alwaysSlider is true, use slider regardless of width
  // During hydration, always render desktop version to prevent mismatch
  if (useSliderOnDesktop && (alwaysSlider || (hasMounted && width <= 1550))) {
    return (
      <ProductSlider {...productSliderProps} />
    );
  }

  // Default behavior: ProductGrid for desktop, ProductSlider for mobile
  return (
    <ResponsiveContainer
      DesktopComponent={ProductGrid}
      MobileComponent={ProductSlider}
      desktopProps={productGridProps} // Pass correctly named props for ProductGrid
      mobileProps={productSliderProps} // Pass correctly named props for ProductSlider
      debug={props.debug} 
      suppressHydrationWarning={true}
    />
  );
};

ResponsiveProductSection.propTypes = {
  items: PropTypes.arrayOf( // Still accept as 'items' from HomePage
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string,
      brand: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      productLink: PropTypes.string,
      CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']),
      badge: PropTypes.string,
      preOrder: PropTypes.bool // Make sure ProductCard handles this if needed
    })
  ).isRequired,
  // renderItem is only needed if ProductGrid requires it, otherwise optional/removed
  // renderItem: PropTypes.func.isRequired, 
  title: PropTypes.string,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  showViewAllLink: PropTypes.bool,
  viewAllText: PropTypes.string,
  useGradientTitle: PropTypes.bool,
  useSliderOnDesktop: PropTypes.bool,
  showNavigationOnDesktop: PropTypes.bool,
  alwaysSlider: PropTypes.bool,
  gridSectionStyles: PropTypes.string, // For ProductGrid styling (also used as fallback for ProductSlider)
  sliderSectionStyles: PropTypes.string, // For ProductSlider styling (takes priority over gridSectionStyles)
  debug: PropTypes.bool
};

ResponsiveProductSection.defaultProps = {
  items: [],
  showViewAllLink: true, // Default to true for backward compatibility
};

export default ResponsiveProductSection; 