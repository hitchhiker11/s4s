import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens';
import Link from 'next/link';

const FeatureContainer = styled.section`
  width: 100%;
  // padding-right: ${SPACING.lg};
  ${mediaQueries.md} {
    padding-top: ${SPACING['2xl']};
  }
  
  ${mediaQueries.xxl} {
    max-width: 1920px;
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
  align-items: stretch;
  ${mediaQueries.md} {
    flex-direction: row;
    align-items: stretch;
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
  position: relative;
  @media (min-width: 1264px) {
    display: ${props => props.$showFeatureImage ? 'block' : 'none'};
    width: 40%;
  }
  
  @media (min-width: 1200px) {
    width: ${props => props.$showFeatureImage ? '50%' : '0'};
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const TextContainer = styled.div`
  width: 100%;
  padding: ${SPACING.lg};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  
  @media (min-width: 1264px) {
    width: ${props => props.$showFeatureImage ? '60%' : '100%'};
    padding: ${SPACING["2xl"]};
  }
  
  @media (min-width: 1264px) {
    width: ${props => props.$showFeatureImage ? '50%' : '100%'};
    padding: ${SPACING["3xl"]};
  }
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 4px;
  background-color: ${COLORS.gray400};
  width: 100%;
  // margin: 0 0 22px 0;
`;

const BrandLogo = styled.img`
  height: 80px;
  object-fit: contain;
  align-self: flex-start;
  display: ${props => props.$showBrandLogo ? 'block' : 'none'};
  ${mediaQueries.xl} {
    height: 70px; /* Уменьшен для xl */
  }
  ${mediaQueries.xxl} {
    height: 60px; /* Компактный для xxl */
  }
  ${mediaQueries.xxxl} {
    height: 50px; /* Еще компактнее для 1920px+ */
  }
`;

const BrandDescription = styled.div`
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
  ${mediaQueries.xl} {
    font-size: 22px; /* Уменьшен для xl */
  }
  ${mediaQueries.xxl} {
    font-size: 20px; /* Компактный для xxl */
  }
  ${mediaQueries.xxxl} {
    font-size: 18px; /* Еще компактнее для 1920px+ */
  }
`;

const BrandFeature = ({ brandData, showFeatureImage = true, showBrandLogo = true }) => {
  if (!brandData) {
    console.error('BrandFeature: brandData is undefined');
    return null;
  }
  
  const {
    featureImage,
    logoImage,
    description
  } = brandData;
  
  // Convert description to a stable format regardless of environment
  const processedDescription = React.useMemo(() => {
    if (typeof description !== 'string') return [];
    
    // If it contains HTML, use dangerouslySetInnerHTML
    if (description.includes('<')) {
      return { __html: description };
    }
    
    // Split by newlines but preserve empty lines
    // This creates an array where empty strings represent blank lines
    return description.split('\n');
  }, [description]);
  
  return (
    <FeatureContainer>
      <FeatureContent>
        {showFeatureImage && (
          <ImageContainer $showFeatureImage={showFeatureImage}>
            <FeatureImage src={featureImage} alt="Brand feature" />
          </ImageContainer>
        )}
        <TextContainer $showFeatureImage={showFeatureImage}>
          {showBrandLogo && (
            <BrandLogo 
              src={logoImage} 
              alt="Brand logo" 
              $showBrandLogo={showBrandLogo}
            />
          )}
          <BrandDescription>
            {/* Render HTML content if that's what we have */}
            {typeof processedDescription === 'object' && '__html' in processedDescription ? (
              <div dangerouslySetInnerHTML={processedDescription} />
            ) : (
              /* Render each line with proper handling of empty lines */
              processedDescription.map((line, i) => 
                line.trim() ? <p key={i}>{line}</p> : <br key={i} />
              )
            )}
          </BrandDescription>
        </TextContainer>
      </FeatureContent>
    </FeatureContainer>
  );
};

export default BrandFeature;