import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer from './ResponsiveContainer';
import ItemGrid from './ItemGrid';
import CategorySlider from './CategorySlider';

/**
 * ResponsiveCategorySection - Renders either ItemGrid (desktop) or CategorySlider (mobile)
 * based on the current viewport size
 */
const ResponsiveCategorySection = ({ items, renderItem, ...props }) => {
  const categorySliderProps = {
    ...props,
    categories: items
  };

  const itemGridProps = { 
    ...props, 
    items,
    renderItem 
  };

  return (
    <ResponsiveContainer
      DesktopComponent={ItemGrid}
      MobileComponent={CategorySlider}
      desktopProps={itemGridProps}
      mobileProps={categorySliderProps}
    />
  );
};

ResponsiveCategorySection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      showTitle: PropTypes.bool,
      rotation: PropTypes.number
    })
  ).isRequired,
  renderItem: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  useGradientTitle: PropTypes.bool,
};

ResponsiveCategorySection.defaultProps = {
  items: [],
};

export default ResponsiveCategorySection; 