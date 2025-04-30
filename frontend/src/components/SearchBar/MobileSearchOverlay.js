import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { SearchIcon, CloseIcon } from '../Header/icons';
import { COLORS, TYPOGRAPHY } from '../../styles/tokens';
import SearchResults from './SearchResults';
import { useRouter } from 'next/router';

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
  width: 100%;
  position: relative;
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

// Mock API call function (replace with actual API call in production)
const searchAPI = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock results based on query
  if (!query || query.length < 2) return { brands: [], categories: [], products: [] };
  
  const mockData = {
    brands: [
      { id: 1, name: 'Canon', slug: 'canon' },
      { id: 2, name: 'Nikon', slug: 'nikon' },
      { id: 3, name: 'Sony', slug: 'sony' },
    ],
    categories: [
      { id: 1, name: 'Камеры', slug: 'cameras' },
      { id: 2, name: 'Объективы', slug: 'lenses' },
      { id: 3, name: 'Аксессуары', slug: 'accessories' },
    ],
    products: [
      { id: 1, name: 'Canon EOS R5', slug: 'canon-eos-r5' },
      { id: 2, name: 'Nikon Z9', slug: 'nikon-z9' },
      { id: 3, name: 'Sony Alpha A7 IV', slug: 'sony-alpha-a7-iv' },
    ]
  };
  
  // Filter results based on query
  const lowerQuery = query.toLowerCase();
  return {
    brands: mockData.brands.filter(b => b.name.toLowerCase().includes(lowerQuery)),
    categories: mockData.categories.filter(c => c.name.toLowerCase().includes(lowerQuery)),
    products: mockData.products.filter(p => p.name.toLowerCase().includes(lowerQuery))
  };
};

const MobileSearchOverlay = ({ isOpen, onClose }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    brands: [],
    categories: [],
    products: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsLoading(true);
      setShowResults(true);
      
      // Debounce the API call
      const timeoutId = setTimeout(async () => {
        const results = await searchAPI(query);
        setSearchResults(results);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowResults(false);
      setSearchResults({ brands: [], categories: [], products: [] });
    }
  };

  // Handle search result click
  const handleResultClick = (type, data) => {
    onClose();
    
    // Navigate based on result type
    if (type === 'brand') {
      router.push(`/brands/${data.slug}`);
    } else if (type === 'category') {
      router.push(`/catalog/${data.slug}`);
    } else if (type === 'search') {
      router.push(`/search?q=${encodeURIComponent(data.query)}`);
    }
  };

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
      // Reset search when closing
      setSearchQuery('');
      setShowResults(false);
      
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

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

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
        <form onSubmit={handleSubmit}>
          <SearchInputWrapper>
            <SearchInput
              ref={inputRef}
              type="text" 
              placeholder="Ищете что-нибудь конкретное?"
              aria-label="Search"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <SearchIcon />
          </SearchInputWrapper>
        </form>
        
        <SearchResults 
          isVisible={showResults}
          query={searchQuery}
          results={searchResults}
          onResultClick={handleResultClick}
        />
      </SearchContainer>
    </Overlay>
  );
};

MobileSearchOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSearchOverlay; 