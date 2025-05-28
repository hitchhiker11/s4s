import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer from './ResponsiveContainer';
import ProductGrid from './ProductGrid';
import ProductSlider from './ProductSlider';
import productGridStyles from '../styles/ProductGridResponsive.module.css'; // Import CSS module

/**
 * ResponsiveProductSection - Renders either ProductGrid (desktop) or ProductSlider (mobile)
 * based on the current viewport size
 */
const ResponsiveProductSection = ({ items, renderItem, onAddToCart, ...props }) => {
  // Log the items for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`${props.title || 'Product Section'} - Mobile?: ${typeof window !== 'undefined' && window.innerWidth < 768} - Items:`, items?.length ?? 0, items);
  }

  // Props for ProductSlider (expects 'products' and 'onAddToCart')
  const productSliderProps = {
    ...props,
    products: items, // Pass items as products to the slider
    onAddToCart // Pass handler down
  };

  // Props for ProductGrid (expects 'products' and 'onAddToCart' directly)
  // NOTE: ProductGrid doesn't use renderItem, it maps internally using ProductCard
  const productGridProps = {
    ...props,
    products: items, // Pass items as products
    onAddToCart, // Pass handler directly
    gridContainerClassName: productGridStyles.productGridContainer, // Add responsive grid class
    preOrderWrapperProps: { className: productGridStyles.preOrderWrapper } // Add responsive wrapper class
  };

  // We need to check if ProductGrid actually uses renderItem or maps internally.
  // Assuming ProductGrid maps internally like its original ItemGrid counterpart might have:
  // If ProductGrid *does* require renderItem, we need to pass it:
  // const productGridProps = { ...props, products: items, renderItem, onAddToCart };

  return (
    <ResponsiveContainer
      DesktopComponent={ProductGrid}
      MobileComponent={ProductSlider}
      desktopProps={productGridProps} // Pass correctly named props for ProductGrid
      mobileProps={productSliderProps} // Pass correctly named props for ProductSlider
      debug={props.debug} 
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
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func,
  useGradientTitle: PropTypes.bool,
  debug: PropTypes.bool
};

ResponsiveProductSection.defaultProps = {
  items: [],
};

export default ResponsiveProductSection; 