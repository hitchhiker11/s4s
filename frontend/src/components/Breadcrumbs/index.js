import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  width: 100%;
  border-bottom: 4px solid #B6B6B6;
`;

const BreadcrumbsWrapper = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  gap: 21px;
  max-width: 1392px;
  margin: 0 auto;
  width: 100%;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
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
  font-size: 20px;
  line-height: 1.3em;
  letter-spacing: 2%;
  color: #E7194A;
`;

const Separator = styled.span`
  font-family: 'Arimo', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.3em;
  letter-spacing: 2%;
  color: #E7194A;
  opacity: 0.8;
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BreadcrumbText = styled.span`
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.3em;
  letter-spacing: 2%;
  color: #1C1C1C;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
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
        <Separator>|</Separator>
        {items && items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <Link href={item.href} passHref>
              <BreadcrumbText>{item.label}</BreadcrumbText>
            </Link>
          </BreadcrumbItem>
        ))}
      </BreadcrumbsWrapper>
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs; 