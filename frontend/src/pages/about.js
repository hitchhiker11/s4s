import React from 'react';
import styled from 'styled-components';
import AboutSlider from '../components/AboutSlider';
import { COLORS, SPACING } from '../styles/tokens';

const AboutPageContainer = styled.div`
  width: 100%;
  padding-top: 60px;
`;

const AboutHeading = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: ${SPACING.xl};
  text-align: center;
  color: ${COLORS.black};
`;

const AboutContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${SPACING.xl};
  margin-bottom: ${SPACING['3xl']};
  
  p {
    margin-bottom: ${SPACING.lg};
    font-size: 18px;
    line-height: 1.6;
    color: ${COLORS.gray700};
  }
`;

// Данные для страницы About
const aboutData = {
  title: 'О Компании',
  content: [
    'Наша компания специализируется на продаже высококачественного снаряжения для стрельбы и охоты. Мы работаем с ведущими мировыми производителями и предлагаем нашим клиентам только лучшие товары.',
    'Мы гордимся тем, что предоставляем широкий ассортимент продукции, отвечающей самым высоким стандартам качества и безопасности. Наша команда экспертов всегда готова помочь вам выбрать идеальное снаряжение, соответствующее вашим потребностям и предпочтениям.',
    'Более 10 лет мы поставляем на российский рынок продукцию ведущих мировых брендов. За это время мы накопили огромный опыт и знания, которыми с удовольствием делимся с нашими клиентами.',
  ],
};

const AboutPage = () => {
  return (
    <AboutPageContainer>
      <AboutHeading>{aboutData.title}</AboutHeading>
      
      <AboutSlider />
      
      <AboutContentSection>
        {aboutData.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </AboutContentSection>
    </AboutPageContainer>
  );
};

export default AboutPage; 