import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
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
  min-width: 0;
  contain: paint;
  will-change: transform;
  ${props => props.additionalStyles && css(props.additionalStyles)};

  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  ${mediaQueries.lg} {
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

  /* Small screens (576-767) */
  @media (min-width: ${BREAKPOINTS.sm}) and (max-width: ${BREAKPOINTS.md - 1}px) {
    min-height: 140px;
  }

  /* Tablets (768-991) */
  @media (min-width: ${BREAKPOINTS.md}) and (max-width: ${BREAKPOINTS.lg - 1}px) {
    min-height: 170px;
  }
`;

const CardTitle = styled.h3`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(11px, 1.9vw, 15px); /* Slightly smaller for tighter height */
  color: ${COLORS.black};
  text-align: left;
  line-height: 1.2;
  padding: ${SPACING.xs} 0; 
  padding-bottom: 0;
  width: 100%;
  margin: 0;

  /* Very small screens - extra small font */
  @media (max-width: 320px) {
    font-size: clamp(10px, 3vw, 14px);
    margin-bottom: ${SPACING.sm};
  }

  /* Small screens */
  @media (min-width: 321px) and (max-width: ${BREAKPOINTS.sm - 1}px) {
    font-size: clamp(11px, 2.2vw, 15px);
    margin-bottom: ${SPACING.sm};
  }

  /* Small tablets */
  @media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px) {
    font-size: clamp(14px, 2.3vw, 18px);
    padding: ${SPACING.sm} ${SPACING.md};
    padding-bottom: 0;
  }

  /* Medium and larger screens */
  ${mediaQueries.md} {
    font-size: clamp(${TYPOGRAPHY.size.md}, 2vw, 28px);
    padding: ${SPACING.md};
    padding-bottom: 0;
  }

  /* Large screens - intelligent sizing based on container width */
  ${mediaQueries.lg} {
    font-size: clamp(18px, calc(1.2vw + 0.8rem), 32px);
  }

  /* Extra large screens */
  @media (min-width: 1600px) {
    font-size: clamp(20px, calc(1vw + 1rem), 36px);
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: hidden;
  flex: 0 0 auto;
  width: 100%; /* Ensure image container fills the full width */
  max-height: 125px; /* Slightly shorter for smaller screens */
  min-height: 0;
  padding: ${SPACING.xs} 0 0; /* Add small padding in mobile */
  
  ${mediaQueries.md} {
    flex-grow: 1;
    padding: ${SPACING.lg};
    max-height: 200px;
  }

  /* Edge positioning for category images (not logos) */
	${props => props.showTitle && !props.isBrandLogo && css`
		justify-content: flex-end; /* align to right */
		align-items: flex-end; /* align to bottom */
		margin-top: auto; /* push container to the bottom to eliminate bottom gap */
	`}
`;

// Helper to get random rotation value between -8 and 8 degrees
const getRandomRotation = () => Math.random() * 16 - 8;

const CardImage = styled.img`
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  transform: ${props => props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'};
  scale: 0.95;

  /* Specific styles for brand logos */
  ${props => props.isBrandLogo && `
    padding: ${SPACING.xs};
    
    ${mediaQueries.md} {
      scale: 1;
      padding: ${SPACING.lg};
    }
  `};

  /* Edge positioning and shifting for category images (not logos) */
  ${props => props.enableEdgePositioning && !props.isBrandLogo && css`
    /* Default/desktop behavior */
    max-width: 150% !important;
    max-height: 150% !important;
    object-fit: contain !important;
    position: relative !important;
    ${props.isSvg
      ? css`
          /* SVGs: move to top-left */
          transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(-45%) translateY(-20%) !important;
          object-position: top left !important;
        `
      : css`
          /* Raster images: move aggressively to bottom-right with clipping */
          transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(35%) translateY(35%) !important;
          object-position: bottom right !important;
        `}

    /* Mobile adjustments - move even further right and down for stronger out-of-frame effect */
      // max-width: 100% !important;
      // max-height: 100% !important;
      // transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} !important;
      // object-position: center center !important;
    @media (max-width: 575px) {
      max-width: 125% !important;
      max-height: 125% !important;
      ${props.isSvg
        ? css`
            /* SVGs: move further top-left (not typical, but for completeness) */
            transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(-35%) translateY(-15%) !important;
            object-position: top left !important;
          `
        : css`
            /* Raster: move much further bottom-right for strong out-of-frame effect */
            transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(30%) translateY(30%) !important;
            object-position: bottom right !important;
          `}
    }
          ///

    /* Tablet and below adjustments */
    // @media (max-width: ${BREAKPOINTS.lg - 1}px) {
    @media (min-width: 576px) and (max-width: ${BREAKPOINTS.lg - 1}px) {
      max-width: 140% !important;
      max-height: 140% !important;
      ${props.isSvg
        ? css`
            transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(-25%) translateY(-20%) !important;
          `
        : css`
            /* More aggressive positioning on mobile for clipping effect */
            transform: ${props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'} translateX(25%) translateY(25%) !important;
          `}
    }
  `}

  /* Upscale category images on very wide screens */
  ${props => !props.isBrandLogo && css`
    @media (min-width: 1550px) {
      scale: 1.2;
    }
  `}
`;

const CategoryCard = ({ title, imageUrl, link = '#', showTitle = true, rotation, additionalStyles, disableRotation = false, enableEdgeImagePositioning = true }) => {
  const isBrandLogo = !showTitle;

  const imageRotation = useMemo(() => {
    if (disableRotation) return 0;
    if (typeof rotation === 'number') return rotation;
    if (showTitle) return getRandomRotation();
    return 0;
  }, [rotation, showTitle, disableRotation]);

  const isSvg = useMemo(() => {
    if (typeof imageUrl !== 'string') return false;
    const src = imageUrl.split('?')[0].toLowerCase();
    return src.endsWith('.svg');
  }, [imageUrl]);

  return (
    <Link href={link} passHref legacyBehavior>
      <CardLink additionalStyles={additionalStyles}>
        {showTitle && <CardTitle>{title}</CardTitle>}
        <CardImageContainer showTitle={showTitle} isBrandLogo={isBrandLogo}>
          {imageUrl ? (
            <CardImage
              src={imageUrl}
              alt={title}
              isBrandLogo={isBrandLogo}
              $rotation={imageRotation}
              isSvg={isSvg}
              enableEdgePositioning={enableEdgeImagePositioning && showTitle}
            />
          ) : (
            // <span>Image Placeholder</span>
            <span></span>
          )}
        </CardImageContainer>
      </CardLink>
    </Link>
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
  enableEdgeImagePositioning: PropTypes.bool,
};

export default CategoryCard;