import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${COLORS.white};
  
  ${mediaQueries.xxl} {
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const MainFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${SPACING["2xl"]};
  padding: ${SPACING.xl} ${SPACING.xl} 0 0;
  
  ${mediaQueries.md} {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: ${SPACING["2xl"]} ${SPACING["3xl"]} 0 0;
    gap: ${SPACING["3xl"]};
  }
  
  ${mediaQueries.lg} {
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 40px 0 0;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
  max-width: 320px;
  display: none;
  position: relative;
  height: 100%;

  ${mediaQueries.md} {
    width: 25%;
    display: block;
  }
  
  ${mediaQueries.lg} {
    width: 20%;
    display: block;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const MobileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "catalog info"
    "media brands";
  gap: ${SPACING["2xl"]};
  padding: 12px 12px;

  ${mediaQueries.md} {
    display: flex;
    flex-direction: row;
    padding: 0;
    width: 70%;
    grid-template-areas: none;
  }

  ${mediaQueries.lg} {
    width: 80%;
    padding: 37px 40px 0 0;
    justify-content: space-between;
  }
`;

const NavSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING["2xl"]};

  ${mediaQueries.md} {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    gap: ${SPACING["3xl"]};
  }

  ${mediaQueries.lg} {
    flex-wrap: nowrap;
    gap: ${SPACING["4xl"]};
    width: 65%;
  }
`;

const NavSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  ${mediaQueries.md} {
    display: flex;
    flex-direction: column;
    width: calc(50% - ${SPACING["2xl"]});
  }
  
  ${mediaQueries.lg} {
    width: auto;
  }
`;

const CatalogSection = styled(NavSection)`
  grid-area: catalog;
`;

const InfoSection = styled(NavSection)`
  grid-area: info;
`;

const MediaSection = styled(NavSection)`
  grid-area: media;
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
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  
  ${mediaQueries.md} {
    display: flex;
    flex-direction: column;
  }
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
  grid-area: brands;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
  align-self: start;
  justify-self: start;
  
  ${mediaQueries.md} {
    grid-area: none;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
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
  max-width: 130px;
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
  padding: 12px 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${SPACING.md};
  
  ${mediaQueries.md} {
    display: flex;
    padding: 16px 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const LegalLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${SPACING.sm};
  
  ${mediaQueries.md} {
    display: flex;
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
          
          <MobileGrid>
            <CatalogSection>
              <SectionTitle>Каталог</SectionTitle>
              <NavLinks>
                <NavLink href="/catalog">Все товары</NavLink>
                <NavLink href="/catalog?filter=new">Новые поступления</NavLink>
                <NavLink href="/catalog?filter=sale">Большие скидки</NavLink>
              </NavLinks>
            </CatalogSection>
            
            <InfoSection>
              <SectionTitle>Информация</SectionTitle>
              <NavLinks>
                <NavLink href="/delivery">Доставка</NavLink>
                <NavLink href="/offer">Договор-оферта</NavLink>
                <NavLink href="/contacts">Контакты</NavLink>
              </NavLinks>
            </InfoSection>
            
            <MediaSection>
              <SectionTitle>Медиа</SectionTitle>
              <NavLinks>
                <NavLink href="https://t.me/shop4shoot" target="_blank" rel="noopener noreferrer">Наш телеграм канал</NavLink>
                <NavLink href="/blog">Блог</NavLink>
                <NavLink href="/partnership">Сотрудничество</NavLink>
              </NavLinks>
            </MediaSection>
            
            <BrandsContainer>
              <BrandLogo
                src="/images/footer/culture_logo.jpg"
                alt="Культура оружия"
                style={{ filter: 'invert(1)' }}
              />
              <BrandLogo src="/images/footer/eiger_tac_text.jpg" alt="Eiger TAC" />
            </BrandsContainer>
          </MobileGrid>
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