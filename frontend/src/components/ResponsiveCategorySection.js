import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResponsiveContainer, { useViewport } from './ResponsiveContainer';
import ItemGrid from './ItemGrid';
import CategorySlider from './CategorySlider';

/**
 * ResponsiveCategorySection - Renders either ItemGrid (desktop) or CategorySlider (mobile)
 * based on the current viewport size. Can be forced to use slider on desktop up to 1550px.
 */
const ResponsiveCategorySection = ({ 
  items, 
  renderItem, 
  cardStyle, 
  containerStyle, 
  sectionStyle,
  useSliderOnDesktop = false,
  showNavigationOnDesktop = true,
  alwaysSlider = false, // Force slider regardless of screen width
  edgeImagePositioningMode = 'auto',
  ...props 
}) => {
  const { width } = useViewport();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const baseCardStyle = { width: '100%', height: '100%', maxWidth: 'none' };

  const categorySliderProps = {
    ...props,
    categories: items,
    renderItem,
    cardStyle, // Slider merges its own base styles internally
    showNavigation: useSliderOnDesktop ? showNavigationOnDesktop : false, // Show navigation only when forced to use slider on desktop
    edgeImagePositioningMode,
  };

  const itemGridProps = { 
    ...props, 
    items,
    renderItem,
    cardStyle: { ...baseCardStyle, ...cardStyle },
    containerStyle,
    sectionStyle,
  };

  // If forced to use slider on desktop, use CategorySlider for both desktop and mobile
  // but only up to 1550px width. Above 1550px, always use grid
  // Exception: if alwaysSlider is true, use slider regardless of width
  // During hydration, always render desktop version to prevent mismatch
  if (useSliderOnDesktop && (alwaysSlider || (hasMounted && width <= 1550))) {
    return (
      <CategorySlider {...categorySliderProps} />
    );
  }

  // Default behavior: ItemGrid for desktop, CategorySlider for mobile
  return (
    <ResponsiveContainer
      DesktopComponent={ItemGrid}
      MobileComponent={CategorySlider}
      desktopProps={{ ...itemGridProps, useCategoryGridWrapper: true }}
      mobileProps={categorySliderProps}
      suppressHydrationWarning={true}
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
  cardStyle: PropTypes.object,
  containerStyle: PropTypes.string,
  sectionStyle: PropTypes.string,
  useSliderOnDesktop: PropTypes.bool,
  showNavigationOnDesktop: PropTypes.bool,
  alwaysSlider: PropTypes.bool,
  edgeImagePositioningMode: PropTypes.oneOf(['auto','enabled','disabled']),
};

ResponsiveCategorySection.defaultProps = {
  items: [],
  edgeImagePositioningMode: 'auto',
};

export default ResponsiveCategorySection; 