import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Container from '../layout/Container';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, ANIMATION } from '../../styles/tokens';

const FooterWrapper = styled.footer`
  background-color: ${COLORS.black};
  color: ${COLORS.white};
  padding: ${SPACING['3xl']} 0;
  margin-top: ${SPACING['4xl']};
`;

const FooterContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${SPACING['2xl']};
  
  ${mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
  
  ${mediaQueries.lg} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h4`
  font-size: ${TYPOGRAPHY.size.lg};
  font-weight: ${TYPOGRAPHY.weight.bold};
  margin-bottom: ${SPACING.xl};
  color: ${COLORS.white};
`;

const FooterLink = styled.a`
  color: ${COLORS.gray400};
  margin-bottom: ${SPACING.md};
  font-size: ${TYPOGRAPHY.size.md};
  transition: ${ANIMATION.transitionBase};
  
  &:hover {
    color: ${COLORS.white};
    text-decoration: none;
  }
`;

const FooterText = styled.p`
  color: ${COLORS.gray400};
  margin-bottom: ${SPACING.md};
  font-size: ${TYPOGRAPHY.size.md};
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterColumn>
          <FooterTitle>О магазине</FooterTitle>
          <Link href="/about" passHref legacyBehavior>
            <FooterLink>О нас</FooterLink>
          </Link>
          <Link href="/delivery" passHref legacyBehavior>
            <FooterLink>О нас</FooterLink>
          </Link>
          <Link href="/contacts" passHref legacyBehavior>
            <FooterLink>Контакты</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Каталог</FooterTitle>
          <Link href="/catalog/oruzhie" passHref legacyBehavior>
            <FooterLink>Оружие</FooterLink>
          </Link>
          <Link href="/catalog/patrony" passHref legacyBehavior>
            <FooterLink>Патроны</FooterLink>
          </Link>
          <Link href="/catalog/optika" passHref legacyBehavior>
            <FooterLink>Оптика</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Помощь</FooterTitle>
          <Link href="/faq" passHref legacyBehavior>
            <FooterLink>Вопросы и ответы</FooterLink>
          </Link>
          <Link href="/return" passHref legacyBehavior>
            <FooterLink>Возврат товара</FooterLink>
          </Link>
          <Link href="/rules" passHref legacyBehavior>
            <FooterLink>Правила магазина</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Контакты</FooterTitle>
          <FooterLink href="tel:+74952551234">+7 (495) 255-12-34</FooterLink>
          <FooterLink href="mailto:info@shop4shoot.ru">info@shop4shoot.ru</FooterLink>
          <FooterText>Москва, ул. Примерная, д. 123</FooterText>
        </FooterColumn>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer; 