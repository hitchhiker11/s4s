import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer from './ResponsiveContainer';
import CategoryGrid from './CategoryGrid';
import CategorySlider from './CategorySlider';

/**
 * ResponsiveCategorySection - Renders either CategoryGrid (desktop) or CategorySlider (mobile)
 * based on the current viewport size
 */
const ResponsiveCategorySection = (props) => {
  return (
    <ResponsiveContainer
      DesktopComponent={CategoryGrid}
      MobileComponent={CategorySlider}
      {...props}
    />
  );
};

ResponsiveCategorySection.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      showTitle: PropTypes.bool,
      rotation: PropTypes.number
    })
  ).isRequired,
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string
};

export default ResponsiveCategorySection; 