import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { SearchIcon, CloseIcon } from '../Header/icons';
import { COLORS, TYPOGRAPHY } from '../../styles/tokens';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(25px);
  opacity: 0;
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 0.3s forwards;
  display: flex;
  flex-direction: column;
`;

const SearchContainer = styled.div`
  padding: 0 23px;
  margin-top: 20px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FCFCFC;
  padding: 7px 20px 7px 29px;
  box-shadow: 0px 0px 30px 0px rgba(129, 129, 129, 0.25);
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-family: Rubik;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.36em;
  color: ${COLORS.black};
  width: 100%;
  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.35);
  }
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: rgba(128, 128, 128, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:focus {
    outline: none;
  }
`;

const MobileSearchOverlay = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before opening the overlay
      previousFocusRef.current = document.activeElement;
      
      // Focus on the input after the component mounts
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
      // Prevent scrolling of background content
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} ref={overlayRef}>
      <CloseButtonWrapper>
        <CloseButton onClick={onClose} aria-label="Close search">
          <CloseIcon />
        </CloseButton>
      </CloseButtonWrapper>
      
      <SearchContainer>
        <SearchInputWrapper>
          <SearchInput
            ref={inputRef}
            type="text" 
            placeholder="Ищете что-нибудь конкретное?"
            aria-label="Search"
          />
          <SearchIcon />
        </SearchInputWrapper>
      </SearchContainer>
    </Overlay>
  );
};

MobileSearchOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSearchOverlay; 