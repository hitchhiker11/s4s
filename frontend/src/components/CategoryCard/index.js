import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

const CardLink = styled.a`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background-color: ${COLORS.white};
  transition: ${ANIMATION.transitionBase};
  overflow: hidden;
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  position: relative;
  min-height: 120px;
  width: 100%; /* Always fill parent width */
  max-width: 100%;
  ${props => props.additionalStyles && css(props.additionalStyles)};

  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  ${mediaQueries.md} {
    /* Унификация размеров карточек на десктопе */
    width: 100%; /* Fill parent width */
    height: 300px;
    min-width: 0; /* Remove min-width constraint to allow full width */
    max-width: 100%; /* Allow card to fill full width of parent */
    min-height: 300px;
    max-height: 300px;
    border-right: 4px solid ${COLORS.gray400};
    border-bottom: 4px solid ${COLORS.gray400};

    /* Для выравнивания содержимого по высоте */
    justify-content: flex-start;
  }
`;

const CardTitle = styled.h3`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, 27.5px);
  color: ${COLORS.black};
  text-align: left;
  line-height: 1.2;
  padding: ${SPACING.sm} ${SPACING.sm}; 
  padding-bottom: 0;
  width: 100%;
  margin: 0;

  ${mediaQueries.md} {
    font-size: 27.5px;
    padding: ${SPACING.md};
    padding-bottom: 0;
  }

  /* Mobile specific font size - Force override */
  @media (max-width: ${BREAKPOINTS.sm - 1}px) {
    font-size: 14px !important;
    margin-bottom: ${SPACING.sm};
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: hidden;
  flex-grow: 1;
  width: 100%; /* Ensure image container fills the full width */
  max-height: 90px; /* Slightly shorter for smaller screens */
  padding: ${SPACING.xs} 0 0; /* Add small padding in mobile */
  
  ${mediaQueries.md} {
    padding: ${SPACING.lg};
    max-height: 250px;
  }
`;

// Helper to get random rotation value between -8 and 8 degrees
const getRandomRotation = () => Math.random() * 16 - 8;

const CardImage = styled.img`
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 90%;
  object-fit: contain;
  transform: ${props => props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'};
  
  /* Specific styles for brand logos */
  ${props => props.isBrandLogo && `
    padding: ${SPACING.xs};
    
    ${mediaQueries.md} {
      padding: ${SPACING.lg};
    }
  `};
`;

const CategoryCard = ({ title, imageUrl, link = '#', showTitle = true, rotation, additionalStyles, disableRotation = false }) => {
  const isBrandLogo = !showTitle;

  const imageRotation = useMemo(() => {
    if (disableRotation) return 0;
    if (typeof rotation === 'number') return rotation;
    if (showTitle) return getRandomRotation();
    return 0;
  }, [rotation, showTitle, disableRotation]);

  return (
    <CardLink href={link} additionalStyles={additionalStyles}>
      {showTitle && <CardTitle>{title}</CardTitle>}
      <CardImageContainer showTitle={showTitle} isBrandLogo={isBrandLogo}>
        {imageUrl ? (
          <CardImage
            src={imageUrl}
            alt={title}
            isBrandLogo={isBrandLogo}
            $rotation={imageRotation}
          />
        ) : (
          // <span>Image Placeholder</span>
          <span></span>
        )}
      </CardImageContainer>
    </CardLink>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string, 
  link: PropTypes.string,
  showTitle: PropTypes.bool,
  rotation: PropTypes.number,
  additionalStyles: PropTypes.object,
  disableRotation: PropTypes.bool,
};

export default CategoryCard;