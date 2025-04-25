import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${COLORS.white};
  
  ${mediaQueries.xxl} {
    max-width: 2000px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const MainFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${SPACING.xl};
  gap: ${SPACING["2xl"]};
  
  ${mediaQueries.md} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: ${SPACING["2xl"]} ${SPACING["3xl"]};
    gap: ${SPACING["3xl"]};
  }
  
  ${mediaQueries.lg} {
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: ${SPACING["3xl"]} 40px;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
  max-width: 240px;
  
  ${mediaQueries.md} {
    width: 25%;
  }
  
  ${mediaQueries.lg} {
    width: 20%;
  }
`;

const Logo = styled.a`
  display: block;
  
  img {
    max-width: 172px;
    margin-bottom: ${SPACING.lg};
  }
`;

const NavSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING["2xl"]};
  
  ${mediaQueries.md} {
    flex-direction: row;
    flex-wrap: wrap;
    width: 70%;
    gap: ${SPACING["3xl"]};
  }
  
  ${mediaQueries.lg} {
    flex-wrap: nowrap;
    gap: ${SPACING["4xl"]};
    width: 50%;
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  ${mediaQueries.md} {
    width: calc(50% - ${SPACING["2xl"]});
  }
  
  ${mediaQueries.lg} {
    width: auto;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 20px;
  line-height: 1.2;
  color: ${COLORS.black};
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavLink = styled.a`
  font-family: 'Arimo', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: ${COLORS.black};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${COLORS.primary};
  }
`;

const BrandsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
  
  ${mediaQueries.md} {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: ${SPACING.xl};
  }
  
  ${mediaQueries.lg} {
    width: 25%;
    margin-top: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
  }
`;

const BrandLogo = styled.img`
  max-width: 160px;
  height: auto;
  margin-bottom: ${SPACING.sm};
  
  ${mediaQueries.md} {
    max-width: 120px;
    margin-right: ${SPACING.xl};
    margin-bottom: 0;
  }
  
  ${mediaQueries.lg} {
    max-width: 160px;
    margin-right: 0;
    margin-bottom: ${SPACING.sm};
  }
`;

const BottomFooter = styled.div`
  background-color: ${COLORS.gray300};
  padding: 16px 60px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
  
  ${mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  
  ${mediaQueries.md} {
    flex-direction: row;
    gap: 37px;
  }
`;

const LegalLink = styled.a`
  font-family: 'Arimo', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: ${COLORS.black};
  text-decoration: none;
  opacity: 0.8;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${COLORS.primary};
  }
`;

const Copyright = styled.div`
  font-family: 'Arimo', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: ${COLORS.black};
  opacity: 0.8;
`;

const Footer = ({ showMainSection = true }) => {
  return (
    <FooterContainer>
      {showMainSection && (
        <MainFooter>
          <LogoContainer>
            <Link href="/" passHref legacyBehavior>
              <Logo>
                <img src="/images/footer/logo.svg" alt="Shop4Shoot" />
              </Logo>
            </Link>
          </LogoContainer>
          
          <NavSections>
            <NavSection>
              <SectionTitle>Каталог</SectionTitle>
              <NavLinks>
                <NavLink href="/catalog">Все товары</NavLink>
                <NavLink href="/catalog?filter=new">Новые поступления</NavLink>
                <NavLink href="/catalog?filter=sale">Большие скидки</NavLink>
              </NavLinks>
            </NavSection>
            
            <NavSection>
              <SectionTitle>Информация</SectionTitle>
              <NavLinks>
                <NavLink href="/delivery">Доставка</NavLink>
                <NavLink href="/offer">Договор-оферта</NavLink>
                <NavLink href="/contacts">Контакты</NavLink>
              </NavLinks>
            </NavSection>
            
            <NavSection>
              <SectionTitle>Медиа</SectionTitle>
              <NavLinks>
                <NavLink href="https://t.me/shop4shoot" target="_blank" rel="noopener noreferrer">Наш телеграм канал</NavLink>
                <NavLink href="/blog">Блог</NavLink>
                <NavLink href="/partnership">Сотрудничество</NavLink>
              </NavLinks>
            </NavSection>
          </NavSections>
          
          <BrandsContainer>
            <BrandLogo src="/images/footer/culture_logo.jpg" alt="Культура оружия" />
            <BrandLogo src="/images/footer/eiger_tac_text.jpg" alt="Eiger TAC" />
          </BrandsContainer>
        </MainFooter>
      )}
      
      <BottomFooter>
        <LegalLinks>
          <LegalLink href="/terms">Пользовательское соглашение</LegalLink>
          <LegalLink href="/copyright">Информация о правообладателе</LegalLink>
          <LegalLink href="/privacy">Политика конфиденциальности</LegalLink>
        </LegalLinks>
        
        <Copyright>
          shop4shoot.com 2025<br />
          Все права защищены
        </Copyright>
      </BottomFooter>
    </FooterContainer>
  );
};

export default Footer; 