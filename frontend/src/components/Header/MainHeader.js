import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { css } from 'styled-components';

import { TextLink } from './common';
import { SearchIcon, CartIcon, MenuBurgerIcon, CloseIcon } from './icons';
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
import { COLORS, TYPOGRAPHY, SIZES, mediaQueries, SPACING } from '../../styles/tokens';
import MobileSearchOverlay from '../SearchBar/MobileSearchOverlay';
import SearchResults from '../SearchBar/SearchResults';
import { searchData } from '../../lib/searchUtils';

// --- Стили ---

// Mixin for bottom underline hover effect
const navLinesMixin = css`
  position: relative; // Needed for absolute positioning of pseudo-elements

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${COLORS.black};
    opacity: 0;
    transition: opacity ${ANIMATION.duration} ${ANIMATION.timing};
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }

  // Ensure hover styles apply when link is active too, if desired
  // &.active::after {
  //   opacity: 1;
  // }
`;

const MainHeaderWrapper = styled.div`
  position: relative; /* Changed from sticky to ensure DesktopSearchOverlay is positioned correctly */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${HEADER_COLORS.lightGray};
  // box-shadow: ${SHADOWS.sm};
  min-height: ${HEADER_SIZES.headerHeight};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    min-height: 70px;
  }

  ${mediaQuery.min.lg} {
    height: 10vh;
    min-height: auto;
  }

  /* For screens less than 992px, set height to 1/9 of viewport height */
  ${mediaQuery.max.lg} {
    height: calc(100vh / 12);
    min-height: auto;
  }

  &.sticky {
    /* sticky управляется верхним контейнером HeaderContainer */
    background-color: ${COLORS.white};
    transition: background-color 0.2s ease, min-height 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  &.scrolled {
    /* sticky управляется верхним контейнером HeaderContainer */
    border-bottom: 2px solid ${HEADER_COLORS.lightGray};
    min-height: calc(${HEADER_SIZES.headerHeight} - 10px);
    
    ${mediaQuery.min.lg} {
      height: 10vh;
      min-height: auto;
    }
    
    /* For screens less than 992px, set height to 1/12 of viewport height even when scrolled */
    ${mediaQuery.max.lg} {
      height: calc(100vh / 12);
      min-height: auto;
    }
  }

  &.hidden {
    transform: translateY(-100%);
  }
`;

const MainHeaderContent = styled(Container)`
  position: relative; /* Added to ensure DesktopSearchOverlay is positioned correctly */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 100%;
  width: 100%;
  
  @media (max-width: 600px) {
    min-height: 50px;
  }
  
  ${mediaQuery.min.lg} {
    justify-content: center;
    gap: clamp(20px, 4vw, 70px); /* Responsive gap that scales with viewport width */
    padding: 0;
  }
`;

const NavGroup = styled.div`
  display: none;
  
  ${mediaQuery.min.lg} {
    display: flex;
    align-items: center;
    gap: clamp(20px, 3vw, 70px); /* Responsive gap between nav items */
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary};
  width: 300px; /* Fixed width to avoid clamp issues */
  height: 168.75px; /* Fixed height for 16:9 aspect ratio (300px * 9/16) */
  min-width: 120px;
  min-height: 50px;
  max-width: 420px;
  max-height: 220px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color ${ANIMATION.duration} ${ANIMATION.timing};
  box-shadow: 0 1px 1px #E7194A;
  

  ${mediaQuery.min.lg} {
    height: 100%;
    max-height: 10vh;
    width: 300px;
  }

  ${mediaQueries.xxl} {
    height: 100%;
    max-height: 10vh;
    width: 300px;
  }

  ${mediaQueries.xxxl} {
    height: 100%;
    max-height: 10vh;
    width: 300px;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  img, svg {
    width: auto;
    height: auto;
    max-width: 83.33%; /* Reduced by 1.2 times (100% / 1.2 = 83.33%) */
    max-height: 83.33%; /* Reduced by 1.2 times */
    min-width: 80px;
    min-height: 40px;
    transition: transform ${ANIMATION.duration} ${ANIMATION.timing};
    display: block;
    object-fit: contain;
  }

  &:hover {
    background-color: ${COLORS.primaryHover};

    img, svg {
      transform: scale(1.08);
    }
  }

  ${mediaQuery.max.xl} {
    width: 220px;
    height: 123.75px; /* 16:9 aspect ratio */

    img, svg {
      max-width: 200px;
      max-height: 100px;
    }
  }

  ${mediaQueries.xxl} {
    width: 300px;
    height: 168.75px; /* 16:9 aspect ratio */

    img, svg {
      max-width: 210px;
      max-height: 95%;
    }
  }

  ${mediaQueries.xxxl} {
    width: 300px;
    height: 168.75px; /* 16:9 aspect ratio */

    img, svg {
      max-width: 220px;
      max-height: 95%;
    }
  }

  @media (max-width: 900px) {
    width: 200px;
    height: 123.75px; /* 16:9 aspect ratio */

    img, svg {
      max-width: 160px;
      max-height: 80px;
      min-width: 48px;
      min-height: 24px;
    }
  }

  ${mediaQuery.max.lg} {
    order: 2;
    height: 100%;
    aspect-ratio: 16 / 9;

    img, svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

const HeaderNavItem = styled.span`
  position: relative;
  font-size: clamp(16px, 1.5vw, 20px); /* Responsive font size */
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  color: ${COLORS.black};
  cursor: pointer;
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};
  padding: 1.28em 0.5em; /* Reduced horizontal padding */
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  white-space: nowrap; /* Prevent text wrapping */

  ${navLinesMixin} // Apply the shared line mixin

  &::after {
    bottom: 1.28em;
  }

  ${mediaQuery.max.xl} {
    font-size: clamp(14px, 1.2vw, 20px);
    padding: 1.2em 0.4em;

    &::after {
      bottom: 1.2em;
    }
  }

    @media (max-width: 1200px) {
    font-size: 18px;
    padding: 1em 0.3em;

    &::after {
      bottom: 1em;
    }
  }

  @media (max-width: 900px) {
    font-size: 18px;
    padding: 1em 0.3em;

    &::after {
      bottom: 1em;
    }
  }

  @media (max-width: 600px) {
    font-size: 15px;
    padding: 0.7em 0.3em;

    &::after {
      bottom: 0.7em;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${HEADER_SPACING.regular};

  ${mediaQuery.max.xl} {
    gap: ${HEADER_SPACING.small};
  }

  ${mediaQuery.max.sm} {
    gap: ${HEADER_SPACING.medium};
  }

  ${mediaQuery.max.lg} {
    order: 3;
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

  ${mediaQuery.max.xl} {
    padding: 1em 0.5em;
    ${HeaderIconStyles} {
      width: 22px;
      height: 22px;
    }
  }

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

const MobileCartButton = styled(ActionButton)`
`;

const CartBadge = styled.span`
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
    display: inline-flex; /* Visible on mobile */
  }

  ${mediaQuery.min.lg} {
    display: none; /* Hidden on desktop */
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

const DesktopSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative; /* Anchor for absolute input */
  z-index: 1001; /* Ensure the search components appear above all other header elements */
`;

const DesktopSearchInputContainer = styled.div`
  position: relative;
`;

const DesktopSearchInputWrapper = styled.div`
  position: absolute;
  left: calc(100% + 10px); /* Position it right after the search icon with some spacing */
  right: auto;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  overflow: hidden;
  width: ${props => props.$isOpen ? `${Math.max(0, props.$width || 0)}px` : '0'}; /* Calculated width */
  max-width: min(600px, 35vw);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  z-index: 1001;
  background-color: ${COLORS.white};
  transition: 
    width 0.3s ease-in-out,
    opacity 0.2s ease-in-out;
`;

const DesktopSearchInput = styled.input`
  border: none;
  background: transparent;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: 400;
  font-size: clamp(16px, 1.5vw, 24px); /* Responsive font size */
  line-height: 1.185em;
  color: ${COLORS.black};
  width: 100%;
  outline: none;
  padding: 5px 0;

  &::placeholder {
    color: #1C1C1C;
  }
`;

const DesktopResultsContainer = styled.div`
  position: absolute;
  top: calc(100% + 25px); /* Position below the header, accounting for search button height */
  left: calc(100% + 10px); /* Align with search input */
  width: clamp(250px, 25vw, 300px); /* Responsive width */
  z-index: 1001;
  background-color: #FFFFFF;
  box-shadow: 0px 3px 3px 0px #B6B6B6;
`;

// --- Компонент ---

const MainHeader = ({
  basketCount = 0,
  isBasketLoading = false,
  toggleMobileMenu,
  onOpenContactsModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [desktopSearchWidth, setDesktopSearchWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    brands: [],
    categories: [],
    products: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const headerRef = useRef(null);
  const rightNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = Date.now();
      const deltaY = currentY - lastScrollYRef.current;
      const deltaTime = Math.max(1, now - lastTimeRef.current);
      const velocity = deltaY / deltaTime; // px per ms

      setIsScrolled(currentY > 5);

      lastScrollYRef.current = currentY;
      lastTimeRef.current = now;
    };
    lastScrollYRef.current = window.scrollY;
    lastTimeRef.current = Date.now();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    if (window.innerWidth <= 768) {
      // For mobile, open the mobile search overlay
      setIsSearchOpen(true);
    } else {
      // For desktop, toggle the inline search field
      const computeWidth = () => {
        const safeGap = 16;
        const headerEl = headerRef.current;
        const searchEl = searchWrapperRef.current;
        const rightEl = rightNavRef.current;
        if (!headerEl || !searchEl) return 0;
        const headerRect = headerEl.getBoundingClientRect();
        const searchRect = searchEl.getBoundingClientRect();
        const rightWidth = rightEl ? rightEl.getBoundingClientRect().width : 0;
        const buttonRight = searchRect.right - headerRect.left;
        const available = headerRect.width - buttonRight - rightWidth - safeGap;
        return Math.max(0, Math.min(available, 600));
      };

      if (!isDesktopSearchOpen) {
        const w = computeWidth();
        if (w <= 0) {
          setDesktopSearchWidth(0);
          return; // do not open when no space
        }
        setDesktopSearchWidth(w);
        setIsDesktopSearchOpen(true);
      } else {
        setIsDesktopSearchOpen(false);
        setSearchQuery('');
        setShowResults(false);
        setDesktopSearchWidth(0);
      }
    }
  };

  // Focus search input when opened
  useEffect(() => {
    if (isDesktopSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300); // Wait for animation to complete
    }
  }, [isDesktopSearchOpen]);

  // Recompute width on resize when open
  useEffect(() => {
    if (!isDesktopSearchOpen) return;
    const onResize = () => {
      const safeGap = 16;
      const headerEl = headerRef.current;
      const searchEl = searchWrapperRef.current;
      const rightEl = rightNavRef.current;
      if (!headerEl || !searchEl) return;
      const headerRect = headerEl.getBoundingClientRect();
      const searchRect = searchEl.getBoundingClientRect();
      const rightWidth = rightEl ? rightEl.getBoundingClientRect().width : 0;
      const buttonRight = searchRect.right - headerRect.left;
      const available = headerRect.width - buttonRight - rightWidth - safeGap;
      const w = Math.max(0, Math.min(available, 600));
      setDesktopSearchWidth(w);
      if (w <= 0) {
        setIsDesktopSearchOpen(false);
        setShowResults(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isDesktopSearchOpen]);

  // Handle click outside to close desktop search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && 
          !searchWrapperRef.current.contains(event.target) && 
          isDesktopSearchOpen) {
        setIsDesktopSearchOpen(false);
        setSearchQuery('');
        setShowResults(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isDesktopSearchOpen) {
        setIsDesktopSearchOpen(false);
        setSearchQuery('');
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktopSearchOpen]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.length < 2) {
      setShowResults(false);
      setIsLoading(false);
      return;
    }

    setShowResults(true);
    setIsLoading(true);

    const handler = setTimeout(async () => {
      try {
        const results = await searchData(searchQuery, 'desktop');
        setSearchResults(results);
      } catch (error) {
        console.error("Search API error:", error);
        setSearchResults({ brands: [], categories: [], products: [] });
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsDesktopSearchOpen(false);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (type, item) => {
    setIsDesktopSearchOpen(false);
    setSearchQuery('');
    setShowResults(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const handleNavItemClick = (item, e) => {
    if (item.id === 'contacts') {
      e.preventDefault();
      onOpenContactsModal();
    }
    // For other links, let the default Link behavior work
  };

  const isActive = (path) => {
    return router.pathname === path || (path !== '/' && router.pathname.startsWith(path + '/'));
  };

  const getBasketAriaLabel = () => {
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

  // Split the navigation links for desktop layout according to Figma design
  const leftNavLinks = NAV_LINKS_DESKTOP.slice(0, 2); // First 2 links (Каталог, Бренды)
  const rightNavLinks = NAV_LINKS_DESKTOP.slice(2); // Last 2 links (О нас, Контакты)

  return (
    <>
      <MainHeaderWrapper ref={headerRef} className={`${isScrolled ? 'scrolled' : 'sticky'}`}>
        <MainHeaderContent>
          {/* Mobile Menu Button (only visible on mobile) */}
          <MobileMenuButton 
            onClick={toggleMobileMenu}
            aria-label="Показать меню"
            aria-expanded="false"
          >
            <HeaderIconStyles>
              <MenuBurgerIcon />
            </HeaderIconStyles>
          </MobileMenuButton>

          {/* Left Navigation Group (only visible on desktop) */}
          <NavGroup>
            <DesktopSearchWrapper ref={searchWrapperRef}>
              <DesktopSearchButton 
                onClick={handleSearchClick}
                aria-label={isDesktopSearchOpen ? "Закрыть поиск" : "Поиск"}
                aria-expanded={isDesktopSearchOpen}
              >
                <HeaderIconStyles>
                  <SearchIcon />
                </HeaderIconStyles>
              </DesktopSearchButton>
              
              <DesktopSearchInputWrapper $isOpen={isDesktopSearchOpen} $width={desktopSearchWidth}>
                <form onSubmit={handleSubmit}>
                  <DesktopSearchInput
                    type="text"
                    placeholder="Поисковой запрос"
                    value={searchQuery}
                    onChange={handleInputChange}
                    ref={searchInputRef}
                    autoComplete="off"
                  />
                </form>
              </DesktopSearchInputWrapper>
              
              {isDesktopSearchOpen && showResults && (
                <DesktopResultsContainer>
                  <SearchResults
                    isVisible={true}
                    query={searchQuery}
                    results={searchResults}
                    onResultClick={handleResultClick}
                  />
                </DesktopResultsContainer>
              )}
            </DesktopSearchWrapper>
            
            {leftNavLinks.map((item) => (
              <HeaderNavItem 
                key={item.id}
                as={Link}
                href={item.path}
                onClick={(e) => handleNavItemClick(item, e)}
              >
                {item.name}
              </HeaderNavItem>
            ))}
          </NavGroup>

          {/* Logo (centered on desktop, positioned according to mobile layout on mobile) */}
          <LogoWrapper>
            <Link href="/" legacyBehavior>
              <a aria-label="Shop4Shoot - Перейти на главную">
                <img src="/images/header/logo.svg" alt="Shop4Shoot" />
              </a>
            </Link>
          </LogoWrapper>

          {/* Right Navigation Group (only visible on desktop) */}
          <NavGroup ref={rightNavRef}>
            {rightNavLinks.map((item) => (
              <HeaderNavItem 
                key={item.id}
                as={Link}
                href={item.path}
                onClick={(e) => handleNavItemClick(item, e)}
              >
                {item.name}
              </HeaderNavItem>
            ))}
            
            {/* <ActionButton 
              aria-label={getBasketAriaLabel()}
              as={Link} 
              href="/cart" 
              className="cart-button"
              style={{ padding: "0" }}
            > */}
              {/* <HeaderIconStyles>
                <CartIcon />
              </HeaderIconStyles>
              {basketCount > 0 && (
                <CartBadge 
                  $isLoading={isBasketLoading}
                  aria-hidden="true"
                >
                  {basketCount}
                </CartBadge>
              )}
            </ActionButton> */}
          </NavGroup>

          {/* Mobile Actions (only visible on mobile) */}
          <HeaderActions>
            <MobileSearchButton 
              onClick={handleSearchClick}
              aria-label="Поиск"
            >
              <HeaderIconStyles>
                <SearchIcon />
              </HeaderIconStyles>
            </MobileSearchButton>

            <MobileCartButton 
              aria-label={getBasketAriaLabel()}
              as={Link} 
              href="/cart" 
              className="cart-button"
            >
              <HeaderIconStyles>
                <CartIcon />
              </HeaderIconStyles>
              {basketCount > 0 && (
                <CartBadge 
                  $isLoading={isBasketLoading}
                  aria-hidden="true"
                >
                  {basketCount}
                </CartBadge>
              )}
            </MobileCartButton>
          </HeaderActions>
        </MainHeaderContent>
      </MainHeaderWrapper>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay 
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  );
};

MainHeader.propTypes = {
  basketCount: PropTypes.number,
  isBasketLoading: PropTypes.bool,
  toggleMobileMenu: PropTypes.func.isRequired,
  onOpenContactsModal: PropTypes.func.isRequired,
};

export default MainHeader;
