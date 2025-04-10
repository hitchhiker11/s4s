import React from 'react';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/tokens';

const HeroSection = styled.section`
  padding: ${SPACING['4xl']} 0;
  background-color: ${COLORS.gray100};
  margin-bottom: ${SPACING['3xl']};
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: ${TYPOGRAPHY.size['4xl']};
  font-weight: ${TYPOGRAPHY.weight.bold};
  margin-bottom: ${SPACING.xl};
  color: ${COLORS.black};
`;

const HeroSubtitle = styled.p`
  font-size: ${TYPOGRAPHY.size.lg};
  color: ${COLORS.gray500};
  margin-bottom: ${SPACING['2xl']};
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${SPACING.md};
  margin-top: ${SPACING.lg};
`;

const HomePage = () => {
  return (
    <MainLayout title="Shop4Shoot - Главная страница">
      <HeroSection>
        <Container>
          <HeroContent>
            <HeroTitle>Добро пожаловать в Shop4Shoot</HeroTitle>
            <HeroSubtitle>
              Магазин для настоящих ценителей оружия и снаряжения
            </HeroSubtitle>
            <ButtonGroup>
              <Button as="a" href="/catalog">
                Перейти в каталог
              </Button>
              <Button as="a" href="/about" variant="secondary">
                О магазине
              </Button>
            </ButtonGroup>
          </HeroContent>
        </Container>
      </HeroSection>
      
      <Container>
        {/* Здесь будет содержимое главной страницы */}
        <p>Содержимое главной страницы</p>
      </Container>
    </MainLayout>
  );
};

export default HomePage; 