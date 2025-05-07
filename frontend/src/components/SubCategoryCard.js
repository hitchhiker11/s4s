import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, ANIMATION, mediaQueries } from '../styles/tokens';

const CardLink = styled.a`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: ${ANIMATION.transitionBase};
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};

  &:hover {
    transform: translateY(-5px);
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  ${mediaQueries.md} {
    border-right-width: 4px;
    border-bottom-width: 4px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px; // Adjust as needed, or make it responsive
  background-color: ${COLORS.gray100}; // Placeholder color
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ${mediaQueries.sm} {
    height: 150px;
  }
  ${mediaQueries.md} {
    height: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TitleContainer = styled.div`
  padding: ${SPACING.md};
  text-align: center;
  background-color: ${COLORS.white};
  border-top: 1px solid ${COLORS.gray200};
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: ${TYPOGRAPHY.size.lg};
  color: ${COLORS.black};
  margin: 0;
  line-height: 1.3;

  ${mediaQueries.sm} {
    font-size: ${TYPOGRAPHY.size.md};
  }
`;

const SubCategoryCard = ({ title, imageUrl, link }) => {
  return (
    <Link href={link} passHref legacyBehavior>
      <CardLink>
        <ImageContainer>
          {imageUrl ? (
            <Image src={imageUrl} alt={title} loading="lazy" />
          ) : (
            <span>No Image</span> // Placeholder if no image
          )}
        </ImageContainer>
        <TitleContainer>
          <Title>{title}</Title>
        </TitleContainer>
      </CardLink>
    </Link>
  );
};

export default SubCategoryCard; 