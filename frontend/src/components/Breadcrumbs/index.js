import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { COLORS, mediaQueries } from '../../styles/tokens';

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: stretch;
  padding: 0;
  width: 100%;
  border-top: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  height: 40px;

  ${mediaQueries.md} {
    border-top: 4px solid ${COLORS.gray400};
    border-bottom: 4px solid ${COLORS.gray400};
    height: 50px;
  }
`;

const BreadcrumbsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  max-width: 1840px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  height: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  ${mediaQueries.md} {
    overflow-x: visible;
  }
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 0 16px;
  z-index: 1;
  position: relative;
  height: 100%;
  flex-shrink: 0;

  ${mediaQueries.md} {
    padding: 0 21px;
  }
`;

const ArrowIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
`;

const BackText = styled.span`
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3em;
  letter-spacing: 2%;
  color: #E7194A;

  ${mediaQueries.md} {
    font-size: 20px;
  }
`;

const ChevronSeparator = styled.div`
  position: relative;
  width: 20px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 100%;
  flex-shrink: 0;
  
  svg {
    height: 100%;
    width: 12px;
    display: block;
  }
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  height: 100%;
  background-color: transparent;
  flex-shrink: 0;
`;

const BreadcrumbTextContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  
  ${mediaQueries.md} {
    padding: 0 21px;
  }
`;

const BreadcrumbText = styled.span`
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3em;
  letter-spacing: 2%;
  color: ${props => props.isActive ? '#E7194A' : '#1C1C1C'};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 2;

  ${mediaQueries.md} {
    font-size: 20px;
  }
`;

const Breadcrumbs = ({ items }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <BreadcrumbsContainer>
      <BreadcrumbsWrapper>
        <BackButton onClick={handleBack}>
          <ArrowIcon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13L5 8L10 3" stroke="#E7194A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ArrowIcon>
          <BackText>назад</BackText>
        </BackButton>
        
        {items && items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronSeparator>
              <svg viewBox="0 0 6 50" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 25L1 49" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ChevronSeparator>
            <BreadcrumbItem>
              <Link href={item.href}>
                <BreadcrumbTextContainer style={{ cursor: 'pointer' }}>
                  <BreadcrumbText isActive={index === items.length - 1}>{item.label}</BreadcrumbText>
                </BreadcrumbTextContainer>
              </Link>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbsWrapper>
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs; 