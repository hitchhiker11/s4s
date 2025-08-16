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

  @media (min-width: 1264px) {
    display: block;
    width: 40%;
    height: 600px;
  }
  
  @media (min-width: 1200px) {
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
  
  @media (min-width: 1264px) {
    width: 60%;
    padding: ${SPACING["2xl"]};
  }
  
  @media (min-width: 1200px) {
    width: 50%;
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
`;

const BrandFeature = ({ brandData }) => {
  if (!brandData) {
    // console.error('BrandFeature: brandData is undefined');
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
        <ImageContainer>
          <FeatureImage src={featureImage} alt="Brand feature" />
        </ImageContainer>
        <TextContainer>
          <BrandLogo src={logoImage} alt="Brand logo" />
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