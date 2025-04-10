import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { css, keyframes } from 'styled-components';

import { TextLink, SocialLinks } from './common';
import { SearchIcon, CloseIcon, CartIcon } from './icons';
import {
  HEADER_COLORS,
  ButtonStyles,
  mediaQuery,
  overlayFadeIn,
  overlayFadeOut,
  slideInRight,
  slideOutRight,
  HEADER_SPACING,
  HEADER_SIZES,
  ANIMATION,
  flexColumn,
  LogoStyles,
  HeaderIconStyles,
} from './styles';
import {
  CONTACT_INFO,
  SOCIAL_LINKS,
  NAV_LINKS_MOBILE,
  AUTH_PATHS,
  AUTH_TEXTS,
  SocialLinkPropTypes,
  NavLinkPropTypes,
} from './config';
import { CONTACT_INFO as CONSTANT_CONTACT_INFO } from '../../config/constants';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../../styles/tokens';

const animationDuration = parseInt(ANIMATION.duration) * 1000;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(28, 28, 28, 0.5);
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  animation: ${props => (props.$isOpen ? overlayFadeIn : overlayFadeOut)} ${ANIMATION.duration} ${ANIMATION.timing} forwards;
`;

const MobileMenuContainer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 320px;
  height: 100dvh;
  background-color: ${COLORS.white};
  z-index: 1002;
  box-shadow: ${SHADOWS.lg};
  transform: translateX(100%);
  animation: ${props => (props.$isOpen ? slideInRight : slideOutRight)} ${ANIMATION.duration} ${ANIMATION.timing} forwards;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MobileMenuHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${HEADER_SPACING.regular};
  height: ${HEADER_SIZES.headerHeight};
  border-bottom: 1px solid ${COLORS.gray200};
  flex-shrink: 0;
`;

const MobileLogoLink = styled(Link)`
  ${LogoStyles}
  img {
    height: ${HEADER_SIZES.logoHeightScrolled};
  }
`;

const CloseButton = styled.button`
  ${ButtonStyles}
  padding: ${HEADER_SPACING.small};
  margin: -${HEADER_SPACING.small};
  color: ${HEADER_COLORS.dark};

  ${HeaderIconStyles} {
    width: ${HEADER_SIZES.iconSize};
    height: ${HEADER_SIZES.iconSize};
  }

  ${mediaQuery.hover} {
    &:hover {
      color: ${HEADER_COLORS.primary};
      background-color: ${HEADER_COLORS.gray};
      border-radius: 50%;
    }
  }

   &:focus-visible {
      color: ${HEADER_COLORS.primary};
      background-color: ${HEADER_COLORS.gray};
      border-radius: 50%;
      outline-offset: 1px;
  }
`;

const MobileMenuContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: ${HEADER_SPACING.regular};
  -webkit-overflow-scrolling: touch;
`;

const MobileMenuLink = styled(TextLink)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${HEADER_SPACING.medium} ${HEADER_SPACING.small};
  margin: 0 -${HEADER_SPACING.small};
  font-size: ${TYPOGRAPHY.size.md};
  font-weight: ${TYPOGRAPHY.weight.medium};
  color: ${COLORS.black};
  border-bottom: 1px solid ${COLORS.gray200};
  border-radius: ${HEADER_SIZES.borderRadius.sm};

  ${HeaderIconStyles} {
      width: ${HEADER_SIZES.iconSizeSmall};
      height: ${HEADER_SIZES.iconSizeSmall};
      margin-right: ${HEADER_SPACING.medium};
      color: ${COLORS.gray500};
  }

  text-decoration: none;
  &:hover { text-decoration: none; }

  ${mediaQuery.hover} {
    &:hover {
      color: ${COLORS.primary};
      background-color: ${COLORS.gray100};
      ${HeaderIconStyles} { color: ${COLORS.primary}; }
    }
  }

  &.active {
    color: ${COLORS.primary};
    font-weight: ${TYPOGRAPHY.weight.semiBold};
    ${HeaderIconStyles} { color: ${COLORS.primary}; }
    background-color: ${COLORS.gray100};
  }

   &:focus-visible {
      color: ${COLORS.primary};
      background-color: ${COLORS.gray100};
      outline-color: ${COLORS.primary};
      ${HeaderIconStyles} { color: ${COLORS.primary}; }
   }
`;

const MobileNavList = styled.ul`
  list-style: none;
  margin: ${HEADER_SPACING.medium} 0;
  padding: 0;
`;

const MobileNavItem = styled.li`
  margin: 0;
  &:last-child ${MobileMenuLink} {
      border-bottom: none;
  }
`;

const MobileMenuFooter = styled.footer`
  padding: ${HEADER_SPACING.regular};
  border-top: 1px solid ${HEADER_COLORS.lightGray};
  background-color: ${HEADER_COLORS.gray};
  flex-shrink: 0;
`;

const ContactWrapper = styled.address`
  font-style: normal;
  margin-bottom: ${HEADER_SPACING.large};
`;

const ContactLinkFooter = styled(TextLink)`
  display: flex;
  margin-bottom: ${HEADER_SPACING.medium};
  font-size: ${TYPOGRAPHY.size.sm};
  font-weight: ${TYPOGRAPHY.weight.regular};
  color: ${HEADER_COLORS.dark};

   ${HeaderIconStyles} {
      width: ${HEADER_SIZES.iconSizeSmall};
      height: ${HEADER_SIZES.iconSizeSmall};
      color: ${HEADER_COLORS.primary};
   }

   ${mediaQuery.hover} {
      &:hover {
         color: ${HEADER_COLORS.primary};
      }
   }

  &:last-child {
    margin-bottom: 0;
  }
`;

const SocialLinksMobile = styled(SocialLinks)`
  justify-content: center;
  gap: ${HEADER_SPACING.large};

  a {
      color: ${HEADER_COLORS.textSecondary};
      &:hover {
          color: ${HEADER_COLORS.primary};
          background-color: transparent;
      }
      &:focus-visible {
         color: ${HEADER_COLORS.primary};
         background-color: transparent;
      }
  }
`;

const MobileMenu = ({ 
  isOpen = false, 
  onClose, 
  isAuthenticated = false, 
  basketCount = 0 
}) => {
  const router = useRouter();
  const menuRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleLinkClick = () => {
    onClose();
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    router.push('/search');
    onClose();
  };

  const isActiveLink = (path) => {
    if (!path) return false;
    return router.pathname === path || (path !== '/' && router.pathname.startsWith(path + '/'));
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      const timer = setTimeout(() => menuRef.current?.focus(), animationDuration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        previousFocusRef.current?.focus();
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const menuNode = menuRef.current;
    if (!menuNode) return;

    const focusableElements = menuNode.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKeyPress = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    menuNode.addEventListener('keydown', handleTabKeyPress);
    return () => {
      menuNode.removeEventListener('keydown', handleTabKeyPress);
    };
  }, [isOpen]);

  const profilePath = isAuthenticated ? AUTH_PATHS.profile : AUTH_PATHS.login;
  const profileText = isAuthenticated ? AUTH_TEXTS.profile : AUTH_TEXTS.loginRegister;

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

  return (
    <>
      <MobileMenuOverlay $isOpen={isOpen} onClick={onClose} aria-hidden="true" />
      <MobileMenuContainer
        ref={menuRef}
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню навигации"
        tabIndex={-1}
      >
        <MobileMenuHeader>
          <MobileLogoLink href="/" passHref legacyBehavior>
            <a onClick={handleLinkClick} aria-label="Shop4Shoot - Перейти на главную">
              <img src="/images/header/logo.svg" alt="Shop4Shoot" />
            </a>
          </MobileLogoLink>
          <CloseButton onClick={onClose} aria-label="Закрыть меню" title="Закрыть">
             <HeaderIconStyles><CloseIcon /></HeaderIconStyles>
          </CloseButton>
        </MobileMenuHeader>

        <MobileMenuContent>
          <MobileMenuLink
            href="/cart"
            className={isActiveLink('/cart') ? 'active' : ''}
            onClick={handleLinkClick}
            aria-label={getBasketAriaLabel()}
            icon={CartIcon}
          >
            Корзина {basketCount > 0 && <span style={{ marginLeft: 'auto', fontSize: '0.9em' }}>({basketCount})</span>}
          </MobileMenuLink>

          <MobileMenuLink
            href="/search"
            onClick={handleSearchClick}
            aria-label="Перейти на страницу поиска"
            icon={SearchIcon}
          >
            Поиск
          </MobileMenuLink>

          <MobileNavList aria-label="Основная навигация сайта">
            {NAV_LINKS_MOBILE.map((link) => (
              <MobileNavItem key={link.id}>
                <MobileMenuLink
                  href={link.path}
                  className={isActiveLink(link.path) ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </MobileMenuLink>
              </MobileNavItem>
            ))}

            <MobileNavItem>
              <MobileMenuLink
                href={profilePath}
                className={isActiveLink(profilePath) ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {profileText}
              </MobileMenuLink>
            </MobileNavItem>
          </MobileNavList>
        </MobileMenuContent>

        <MobileMenuFooter>
          <ContactWrapper itemScope itemType="http://schema.org/Organization">
            <meta itemProp="name" content="Shop4Shoot" />
            {CONSTANT_CONTACT_INFO.phone && (
              <ContactLinkFooter
                href={`tel:${CONSTANT_CONTACT_INFO.phone.link}`}
                icon={CONTACT_INFO.phone.icon}
                ariaLabel={CONTACT_INFO.phone.ariaLabel}
                itemProp={CONTACT_INFO.phone.itemprop}
              >
                {CONSTANT_CONTACT_INFO.phone.display}
              </ContactLinkFooter>
            )}
            {CONSTANT_CONTACT_INFO.email && (
               <ContactLinkFooter
                  href={`mailto:${CONSTANT_CONTACT_INFO.email.link}`}
                  icon={CONTACT_INFO.email.icon}
                  ariaLabel={CONTACT_INFO.email.ariaLabel}
                  itemProp={CONTACT_INFO.email.itemprop}
                >
                  {CONSTANT_CONTACT_INFO.email.display}
                </ContactLinkFooter>
            )}
          </ContactWrapper>

          {SOCIAL_LINKS && SOCIAL_LINKS.length > 0 && (
             <SocialLinksMobile
                links={SOCIAL_LINKS}
                $iconSize={HEADER_SIZES.iconSize}
             />
          )}
        </MobileMenuFooter>
      </MobileMenuContainer>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  basketCount: PropTypes.number,
};

export default MobileMenu;