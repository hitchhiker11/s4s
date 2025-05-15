import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens';

const FeatureContainer = styled.section`
  width: 100%;
  // padding-right: ${SPACING.lg};

  ${mediaQueries.md} {
  // padding: ${SPACING['2xl']};
  }
  
  ${mediaQueries.xxl} {
    max-width: 1493px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${SPACING.sm};
  font-size: 6px;

  ${mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    gap: ${SPACING["2xl"]};
    font-size: ${TYPOGRAPHY.size.md};
  }

  ${mediaQueries.lg} {
    gap: 52px;
  }
`;

const ImageContainer = styled.div`
  display: none;
  width: 100%;
  height: 300px;

  ${mediaQueries.md} {
    display: block;
    width: 40%;
    height: 600px;
  }
  
  ${mediaQueries.lg} {
    width: 50%;
    height: 800px;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  width: 100%;
  padding: ${SPACING.lg};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  
  ${mediaQueries.md} {
    width: 60%;
    padding: ${SPACING["2xl"]};
  }
  
  ${mediaQueries.lg} {
    width: 50%;
    padding: ${SPACING["3xl"]};
  }
`;

const BrandLogo = styled.img`
  height: 80px;
  object-fit: contain;
  align-self: flex-start;
`;

const BrandDescription = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 14px;
  line-height: 1.5;
  color: ${COLORS.black};
  margin: 0;
  
  ${mediaQueries.md} {
    font-size: 20px;
  }
  
  ${mediaQueries.lg} {
    font-size: 25px;
    line-height: 1.18;
  }
`;

const BrandFeature = ({ brandData }) => {
  if (!brandData) {
    console.error('BrandFeature: brandData is undefined');
    return null;
  }

  const {
    featureImage,
    logoImage,
    description
  } = brandData;

  return (
    <FeatureContainer>
      <FeatureContent>
        <ImageContainer>
          <FeatureImage src={featureImage} alt="Brand feature" />
        </ImageContainer>
        <TextContainer>
          <BrandLogo src={logoImage} alt="Brand logo" />
          <BrandDescription>
            {description}
          </BrandDescription>
        </TextContainer>
      </FeatureContent>
    </FeatureContainer>
  );
};

export default BrandFeature; 