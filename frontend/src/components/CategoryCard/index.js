import React, { useMemo } from 'react';
import styled from 'styled-components';
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
  max-width: 100%;
  
  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  ${mediaQueries.md} {
    max-height: 300px;
    max-width: 330px;
    border-right: 4px solid ${COLORS.gray400};
    border-bottom: 4px solid ${COLORS.gray400};
    
    &:hover {
      border-right-color: ${COLORS.gray500};
      border-bottom-color: ${COLORS.gray500};
    }
  }
`;

const CardTitle = styled.h3`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, 27.5px);
  color: ${COLORS.black};
  // margin: 0 0 ${SPACING.md} 0;
  text-align: left;
  line-height: 1.2;
  padding: ${SPACING.md};
  padding-bottom: 0;

  ${mediaQueries.md} {
    font-size: 27.5px;
  }

  /* Mobile specific font size - Force override */
  @media (max-width: ${BREAKPOINTS.sm - 1}px) {
    font-size: 14px !important;
    margin-bottom: ${SPACING.sm};
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
  background: transparent;
  overflow: hidden;
  flex-grow: 1;
  // padding: ${SPACING.md};
  max-height: 110px;
  ${mediaQueries.md} {
    padding: ${SPACING.lg};
    max-height: 250px;
  }
`;

// Helper to get random rotation value between -8 and 8 degrees
const getRandomRotation = () => Math.random() * 16 - 8;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 90%;
  object-fit: contain;
  transform: ${props => props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'};
  
  /* Specific styles for brand logos */
  ${props => props.isBrandLogo && `
    padding: ${SPACING.md};
    
    ${mediaQueries.md} {
      padding: ${SPACING.lg};
    }
  `};
`;

const CategoryCard = ({ title, imageUrl, link = '#', showTitle = true, rotation }) => {
  const isBrandLogo = !showTitle;

  const imageRotation = useMemo(() => {
    if (typeof rotation === 'number') return rotation;
    if (showTitle) return getRandomRotation();
    return 0;
  }, [rotation, showTitle]);

  return (
    <CardLink href={link}>
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
          <span>Image Placeholder</span>
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
};

export default CategoryCard;