import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { css } from 'styled-components';

import { TextLink } from './common';
import { SearchIcon, CartIcon, MenuBurgerIcon } from './icons';
import {
  HEADER_COLORS,
  Container,
  ButtonStyles,
  badgeStyles,
  LogoStyles,
  HeaderIconStyles,
  mediaQuery,
  HEADER_SIZES,
  HEADER_SPACING,
  ANIMATION,
  SHADOWS
} from './styles';
import { NAV_LINKS_DESKTOP, NavLinkPropTypes } from './config';
import { COLORS, TYPOGRAPHY } from '../../styles/tokens';

// --- Стили ---

// Mixin for bottom/right line hover effect
const navLinesMixin = css`
  position: relative; // Needed for absolute positioning of pseudo-elements

  &::after {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 0;
    width: 100%;
    height: 3px;
    background: ${COLORS.gray400};
    opacity: 0;
    transition: opacity ${ANIMATION.duration} ${ANIMATION.timing};
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 0;
    width: 3px;
    height: 80%; // Adjust height as needed, maybe base on line-height or font-size?
    background: ${COLORS.gray400};
    opacity: 0;
    transition: opacity ${ANIMATION.duration} ${ANIMATION.timing};
  }

  &:hover::before,
  &:hover::after,
  &:focus-visible::before, // Apply on focus too
  &:focus-visible::after {
    opacity: 1;
  }

  // Ensure hover styles apply when link is active too, if desired
  // &.active::before,
  // &.active::after {
  //   opacity: 1;
  // }
`;

const MainHeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${HEADER_COLORS.lightGray};
  box-shadow: ${SHADOWS.sm};
  min-height: ${HEADER_SIZES.headerHeight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainHeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 100%;
  width: 100%;

  ${mediaQuery.min.lg} {
    justify-content: center;
    gap: 55px;
    padding: 0;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary};
  width: clamp(180px, 32vw, 390px);
  height: clamp(80px, 16vw, 200px);
  min-width: 120px;
  min-height: 60px;
  max-width: 420px;
  max-height: 220px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color ${ANIMATION.duration} ${ANIMATION.timing};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  img, svg {
    width: 90%;
    height: 90%;
    max-width: 350px;
    max-height: 180px;
    min-width: 80px;
    min-height: 40px;
    transition: transform ${ANIMATION.duration} ${ANIMATION.timing};
    display: block;
  }

  &:hover {
    background-color: ${COLORS.primaryHover};

    img, svg {
      transform: scale(1.08);
    }
  }

  @media (max-width: 900px) {
    width: clamp(120px, 40vw, 220px);
    height: clamp(48px, 12vw, 90px);

    img, svg {
      max-width: 180px;
      max-height: 80px;
      min-width: 48px;
      min-height: 24px;
    }
  }

  @media (max-width: 600px) {
    width: 147px;
    height: 67px;
    position: absolute;
    left: 50%;
    transform: translateX(-80%);
    margin: 0 auto;

    img, svg {
      width: 80%;
      height: 60%;
      max-width: 118px;
      max-height: 40px;
    }
  }

  ${mediaQuery.max.lg} {
    order: 3; /* Mobile order: [Menu(1)][Search(2)][Logo(3)][Cart(4)] */
  }
`;

const HeaderNavItem = styled.span`
  position: relative;
  font-size: 24px;
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  color: ${COLORS.black};
  cursor: pointer;
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};
  padding: 1.28em 0.7em;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;

  ${navLinesMixin} // Apply the shared line mixin

  @media (max-width: 900px) {
    font-size: 18px;
    padding: 1em 0.5em;
  }

  @media (max-width: 600px) {
    font-size: 15px;
    padding: 0.7em 0.3em;
  }

  ${mediaQuery.max.lg} {
    display: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${HEADER_SPACING.regular};

  ${mediaQuery.max.sm} {
    gap: ${HEADER_SPACING.medium};
  }

  ${mediaQuery.max.lg} {
    order: 4; /* Mobile order: [Menu(1)][Search(2)][Logo(3)][Cart(4)] */
  }

  @media (max-width: 600px) {
    gap: 15px;
    margin-right: 10px;
  }
`;

const ActionButton = styled.button`
  ${ButtonStyles}
  position: relative;
  padding: 1.2em 0.6em;
  margin: 0;
  color: ${HEADER_COLORS.dark};
  background: none;
  border: none;
  outline: none;

  ${HeaderIconStyles} {
    width: 24px;
    height: 24px;
  }

  ${mediaQuery.hover} {
    &:hover:not(:disabled) {
      color: ${HEADER_COLORS.primary};
    }
  }

  &:focus-visible {
    color: ${HEADER_COLORS.primary};
    outline-offset: 1px;
  }

  ${navLinesMixin}

  @media (max-width: 900px) {
    padding: 12px 7px;
    ${HeaderIconStyles} {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 600px) {
    padding: 14px 10px;
    ${HeaderIconStyles} {
      width: 22px;
      height: 22px;
    }
  }
`;

const SearchActionButton = styled(ActionButton)`
  /* Styles specific to search if needed */
`;

const CartLink = styled(ActionButton).attrs({ as: 'a' })`
  ${navLinesMixin}
  
  @media (max-width: 600px) {
    padding: 14px 10px;
    border-radius: 29px;
  }
`;

const CartCounter = styled.span`
  ${badgeStyles}
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    min-width: 16px;
    height: 16px;
    font-size: 10px;
    top: -6px;
    right: -6px;
  }

  @media (max-width: 600px) {
    min-width: 14px;
    height: 14px;
    font-size: 9px;
    top: -5px;
    right: -5px;
  }
`;

const MobileMenuButton = styled(ActionButton)`
  display: none;

  ${mediaQuery.max.lg} {
    display: inline-flex;
    order: 1;
    margin-left: 0;
    padding-left: 16px;
  }

  @media (max-width: 600px) {
    margin-left: 0;
    padding-left: 0px;
    ${HeaderIconStyles} {
      width: 26px;
      height: 18px;
    }
  }
`;

const MobileSearchButton = styled(SearchActionButton)`
  display: none; /* Hidden by default (on desktop) */

  ${mediaQuery.max.lg} {
    display: none; /* Not needed anymore as search is in HeaderActions */
  }
`;

const DesktopSearchButton = styled(SearchActionButton)`
  display: inline-flex; /* Visible by default (on desktop) */

  ${mediaQuery.max.lg} {
    display: none; /* Hidden on mobile */
  }
`;

const LoadingIndicator = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  width: 8px;
  height: 8px;
  background-color: ${HEADER_COLORS.info};
  border-radius: 50%;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(25, 118, 210, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
    }
  }

  @media (max-width: 900px) {
    width: 6px;
    height: 6px;
    top: -4px;
    right: -6px;
  }

  @media (max-width: 600px) {
    width: 4px;
    height: 4px;
    top: -2px;
    right: -4px;
  }
`;

// --- Компонент ---

const MainHeader = ({
  basketCount = 0,
  isBasketLoading = false,
  toggleMobileMenu
}) => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  const isActive = (path) => {
    return router.pathname === path || (path !== '/' && router.pathname.startsWith(path));
  };

  const getBasketAriaLabel = () => {
    if (isBasketLoading) {
      return "Корзина, загрузка";
    }
    let label = "Корзина";
    if (basketCount > 0) {
      label += `, ${basketCount} товар`;
      if (basketCount % 10 >= 2 && basketCount % 10 <= 4 && (basketCount % 100 < 10 || basketCount % 100 >= 20)) {
        label += 'а';
      } else if (basketCount !== 1 && basketCount % 10 !== 1) {
        label += 'ов';
      }
    }
    return label;
  };

  return (
    <MainHeaderWrapper>
      <MainHeaderContent>
        {/* --- Desktop Search (far left) --- */}
        <DesktopSearchButton onClick={handleSearchClick} aria-label="Открыть поиск" title="Поиск">
          <HeaderIconStyles>
            <SearchIcon />
          </HeaderIconStyles>
        </DesktopSearchButton>

        {/* --- Mobile View Elements (order handled by styled-components) --- */}
        <MobileMenuButton
          onClick={toggleMobileMenu}
          aria-label="Открыть меню навигации"
          title="Меню"
        >
          <HeaderIconStyles>
            <MenuBurgerIcon />
          </HeaderIconStyles>
        </MobileMenuButton>

        {/* --- Desktop Navigation Items (hidden on mobile) --- */}
        <HeaderNavItem
          className={isActive('/catalog') ? 'active' : ''}
          onClick={() => router.push('/catalog')}
        >
          Каталог
        </HeaderNavItem>

        <HeaderNavItem
          className={isActive('/brands') ? 'active' : ''}
          onClick={() => router.push('/brands')}
        >
          Бренды
        </HeaderNavItem>

        {/* --- Logo (order handled by styled-components) --- */}
        <LogoWrapper>
          <Link href="/" passHref legacyBehavior>
            <a aria-label="Shop4Shoot - Перейти на главную">
              <img src="/images/header/logo-icon.svg" alt="Shop4Shoot"/>
            </a>
          </Link>
        </LogoWrapper>

        {/* --- Desktop Navigation Items (hidden on mobile) --- */}
        <HeaderNavItem
          className={isActive('/about') ? 'active' : ''}
          onClick={() => router.push('/about')}
        >
          О нас
        </HeaderNavItem>

        <HeaderNavItem
          className={isActive('/contacts') ? 'active' : ''}
          onClick={() => router.push('/contacts')}
        >
          Контакты
        </HeaderNavItem>

        {/* --- Action Icons (Search for Desktop + Cart) --- */}
        {/* HeaderActions container handles order for mobile view */}
        <HeaderActions>
          {/* Mobile Search Button - now inside HeaderActions to be next to cart */}
          {mediaQuery.max.lg && (
            <SearchActionButton 
              onClick={handleSearchClick} 
              aria-label="Открыть поиск" 
              title="Поиск"
              css={`
                display: none;
                ${mediaQuery.max.lg} {
                  display: inline-flex;
                }
              `}
            >
              <HeaderIconStyles>
                <SearchIcon />
              </HeaderIconStyles>
            </SearchActionButton>
          )}
          
          {/* Cart Link - always visible */}
          <Link href="/cart" passHref legacyBehavior>
            <CartLink aria-label={getBasketAriaLabel()} title="Корзина">
              <HeaderIconStyles>
                <CartIcon />
              </HeaderIconStyles>
              {isBasketLoading ? (
                <LoadingIndicator aria-hidden="true" />
              ) : basketCount > 0 ? (
                <CartCounter aria-hidden="true">
                  {basketCount > 99 ? '99+' : basketCount}
                </CartCounter>
              ) : null}
            </CartLink>
          </Link>
        </HeaderActions>

      </MainHeaderContent>
    </MainHeaderWrapper>
  );
};

MainHeader.propTypes = {
  basketCount: PropTypes.number,
  isBasketLoading: PropTypes.bool,
  toggleMobileMenu: PropTypes.func.isRequired,
};

export default MainHeader;