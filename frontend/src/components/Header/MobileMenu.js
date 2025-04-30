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
  HEADER_SPACING,
  HEADER_SIZES,
  ANIMATION,
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
import { COLORS, TYPOGRAPHY, SHADOWS } from '../../styles/tokens';

const animationDuration = parseInt(ANIMATION.duration) * 1000;

// New animation for sliding menu from top
const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutTop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const MobileMenuContainer = styled.div`
  position: fixed;
  top: ${HEADER_SIZES.headerHeight}; // Position right below the header
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.65);
  z-index: 1002;
  box-shadow: 0px 4px 4px 0px rgba(129, 129, 129, 0.25);
  transform: translateY(-100%);
  animation: ${props => (props.$isOpen ? slideInTop : slideOutTop)} ${ANIMATION.duration} ${ANIMATION.timing} forwards;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(25px);
`;

const MobileMenuHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${HEADER_SPACING.regular};
  height: ${HEADER_SIZES.headerHeight};
  flex-shrink: 0;
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

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 19px;
  padding: 10px 0 20px;
`;

const MobileNavItem = styled.li`
  margin: 0;
`;

const MobileNavLink = styled.a`
  font-family: Rubik;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.18em;
  color: #1C1C1C;
  text-decoration: none;
  
  &:hover, &:focus {
    color: ${COLORS.primary};
  }
  
  &.active {
    color: ${COLORS.primary};
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

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Store the element that had focus before the menu was opened
      previousFocusRef.current = document.activeElement;
      
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscapeKey);
      
      // Set focus to the menu container
      if (menuRef.current) {
        menuRef.current.focus();
      }
    } else {
      // Restore focus to the element that had it before the menu was opened
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      handleTabKeyPress(event);
    }
  };

  // This function helps manage focus trap within the mobile menu
  const handleTabKeyPress = (event) => {
    if (!menuRef.current) return;
    
    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // If shift+tab on first element, move to last element
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } 
    // If tab on last element, move to first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  // If menu is not open, don't render it at all
  if (!isOpen) {
    return null;
  }

  return (
    <MobileMenuContainer 
      $isOpen={isOpen}
      ref={menuRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      aria-hidden={!isOpen}
    >
      <MobileNavList>
        <MobileNavItem>
          <MobileNavLink 
            href="/catalog"
            className={router.pathname.startsWith('/catalog') ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Каталог
          </MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink 
            href="/brands"
            className={router.pathname.startsWith('/brands') ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Бренды
          </MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink 
            href="/about"
            className={router.pathname.startsWith('/about') ? 'active' : ''}
            onClick={handleLinkClick}
          >
            О нас
          </MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink 
            href="/contacts"
            className={router.pathname.startsWith('/contacts') ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Контакты
          </MobileNavLink>
        </MobileNavItem>
      </MobileNavList>
    </MobileMenuContainer>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  basketCount: PropTypes.number,
};

export default MobileMenu;