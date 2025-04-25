import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer from './ResponsiveContainer';
import ProductGrid from './ProductGrid';
import ProductSlider from './ProductSlider';

/**
 * ResponsiveProductSection - Renders either ProductGrid (desktop) or ProductSlider (mobile)
 * based on the current viewport size
 */
const ResponsiveProductSection = (props) => {
  return (
    <ResponsiveContainer
      DesktopComponent={ProductGrid}
      MobileComponent={ProductSlider}
      {...props}
    />
  );
};

ResponsiveProductSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string,
      brand: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      productLink: PropTypes.string,
      CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']).isRequired,
      badge: PropTypes.string,
      preOrder: PropTypes.bool
    })
  ).isRequired,
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func
};

export default ResponsiveProductSection; 