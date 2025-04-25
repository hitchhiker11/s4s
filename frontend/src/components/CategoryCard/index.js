import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries } from '../../styles/tokens';

const CardLink = styled.a`
  display: block;
  text-decoration: none;
  background-color: ${COLORS.white};
  padding: ${SPACING.md};
  transition: ${ANIMATION.transitionBase};
  overflow: hidden;
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  position: relative;
  min-height: 220px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 8px 12px 0 rgba(0, 0, 0, 0.10);
  }

  ${mediaQueries.md} {
    padding: ${SPACING.lg};
    min-height: 240px;
    border-right: 4px solid ${COLORS.gray400};
    border-bottom: 4px solid ${COLORS.gray400};
  }
`;

const CardTitle = styled.h3`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(18px, 6vw, 27.5px);
  color: ${COLORS.black};
  margin: 0 0 ${SPACING.md} 0;
  text-align: center;
  line-height: 1.2;
  z-index: 2;

  ${mediaQueries.md} {
    font-size: 27.5px;
  }
`;

const CardImageContainer = styled.div`
  position: absolute;
  right: ${SPACING.md};
  bottom: ${SPACING.md};
  width: 140px;
  height: 140px;
  background-color: ${COLORS.white};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.md} {
    width: 160px;
    height: 160px;
    right: ${SPACING.lg};
    bottom: ${SPACING.lg};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.isBrandLogo ? 'contain' : 'cover'};
  display: block;
  transform: ${props => props.$rotation ? `rotate(${props.$rotation}deg)` : 'none'};
  transition: ${ANIMATION.transitionBase};
`;

function getRandomRotation() {
  // Возвращает случайное целое число от -15 до 15 включительно
  return Math.floor(Math.random() * 31) - 15;
}

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