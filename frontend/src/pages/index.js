import React from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { getAboutSliderData } from '../lib/api/bitrix';
import AboutSlider from '../components/AboutSlider';
import Header from '../components/Header';
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries, BREAKPOINTS } from '../styles/tokens';

// Стилизованные компоненты для главной страницы
const HomePageContainer = styled.div`
  width: 100%;
  overflow-x: hidden; // Предотвращение горизонтального скролла
`;

const HeroSection = styled.section`
  width: 100%;
  padding: 0 24px;
  background-color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${mediaQueries.md} {
    padding: min(10vh, 120px) 48px;
  }
  
  ${mediaQueries.lg} {
    padding: min(12vh, 150px) 64px;
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: var(--container-width, 1494px);
  margin: 0 auto;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${SPACING.md};
`;

const Highlight = styled.span`
  color: ${COLORS.primary};
  font-weight: 800;
  display: inline;
  
  ${mediaQueries.md} {
    display: block;
  }
`;

// Используем clamp для плавного масштабирования размера шрифта
// min: минимальный размер на маленьких экранах
// max: максимальный размер на больших экранах
// preferred: предпочтительный размер, основанный на vw
const HeroTitle = styled.h1`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-style: normal;
  font-weight: 700;
  font-size: clamp(40px, 8vw, 107px);
  line-height: 1.2;
  letter-spacing: -0.05em;
  color: ${COLORS.black};
  margin: 0;
  padding: 0;
  
  ${mediaQueries.sm} {
    line-height: 1.25;
  }
  
  ${mediaQueries.md} {
    letter-spacing: -0.04em;
    line-height: 1.3;
  }
  
  ${mediaQueries.lg} {
    line-height: 1.22;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(16px, 4vw, 24px);
  color: ${COLORS.gray700};
  margin: ${SPACING.md} 0 ${SPACING.xl};
  max-width: 800px;
  
  ${mediaQueries.md} {
    margin: ${SPACING.lg} 0 ${SPACING.xl};
  }
`;

const AboutSection = styled.section`
  padding: 0 0;
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 700;
  text-align: center;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xl};
`;

// Компонент главной страницы
const HomePage = () => {
  return (
    <HomePageContainer>
      <Header useMocks={true} mockBasketCount={5} />
      <AboutSection>
        {/* <SectionTitle>О нас</SectionTitle> */}
        <AboutSlider />
      </AboutSection>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            МАГАЗИН, СОЗДАННЫЙ<br />
            СТРЕЛКАМИ ДЛЯ<br />
            СТРЕЛКОВ - <Highlight>SHOP4SHOOT</Highlight>
          </HeroTitle>
        </HeroContent>
      </HeroSection>
    </HomePageContainer>
  );
};

// Предварительная загрузка данных на стороне сервера
export async function getServerSideProps() {
  const queryClient = new QueryClient();
  
  try {
    // Предварительная загрузка данных для слайдера
    // В продакшене раскомментировать, в режиме разработки исключить
    // await queryClient.prefetchQuery(['aboutSliderData'], getAboutSliderData);
  } catch (error) {
    console.error('Ошибка предзагрузки данных:', error);
    // В случае ошибки делаем fallback с пустыми данными
  }
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default HomePage; 