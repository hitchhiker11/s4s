import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, ANIMATION, mediaQueries } from '../../styles/tokens';

const CardLink = styled.a`
  display: block;
  text-decoration: none;
  background-color: ${COLORS.white};
  padding: ${SPACING.lg};
  transition: ${ANIMATION.transitionBase};
  overflow: hidden;
  border-right: 4px solid ${COLORS.gray400};
  border-bottom: 4px solid ${COLORS.gray400};
  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 8px 12px 0 rgba(0, 0, 0, 0.10);
  }
  box-shadow: none;
`;

const CardImageContainer = styled.div`
  width: 100%;
  height: ${props => props.isBrandLogo ? '100px' : '200px'};
  margin-bottom: ${props => props.showTitle ? SPACING.md : '0'};
  background-color: ${COLORS.white};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.isBrandLogo ? 'contain' : 'cover'};
  display: block;
`;

const CardTitle = styled.h3`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.lg};
  color: ${COLORS.black};
  margin: 0;
  text-align: center;
  line-height: 1.3;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.xl};
  }
`;

const CategoryCard = ({ title, imageUrl, link = '#', showTitle = true }) => {
  const isBrandLogo = !showTitle; // If not showing title, treat as brand logo
  
  return (
    <CardLink href={link}>
      <CardImageContainer showTitle={showTitle} isBrandLogo={isBrandLogo}>
        {imageUrl ? (
          <CardImage 
            src={imageUrl} 
            alt={title} 
            isBrandLogo={isBrandLogo}
          />
        ) : (
          <span>Image Placeholder</span>
        )}
      </CardImageContainer>
      {showTitle && <CardTitle>{title}</CardTitle>}
    </CardLink>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  showTitle: PropTypes.bool,
};

export default CategoryCard; 