import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries } from '../../styles/tokens';
import { SearchIcon } from '../icons';
import SearchResults from './SearchResults';

const SearchSection = styled.section`
  width: 100%;
  padding: 12px;
  background-color: ${COLORS.white};
  position: relative;

  ${mediaQueries.md} {
    padding: 29px 40px;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  border-top: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  padding: 5px 0;
  min-height: 48px;

  ${mediaQueries.md} {
    padding: 7px 0;
    min-height: 66px;
    border-top: 4px solid ${COLORS.gray400};
    border-bottom: 4px solid ${COLORS.gray400};
  }
`;

const FormContainer = styled.form`
  display: flex;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 3px;
  padding-right: 5px;
  position: relative;

  ${mediaQueries.md} {
    gap: 5px;
    padding-right: 10px;
  }
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  background: none;
  flex-grow: 1;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: clamp(18px, 5vw, 30px);
  color: ${COLORS.black};
  padding: 5px 0;
  width: 100%;

  &::placeholder {
    color: ${COLORS.gray400};
    font-weight: ${TYPOGRAPHY.weight.medium};
  }

  &:focus {
    font-weight: ${TYPOGRAPHY.weight.medium};
  }

  ${mediaQueries.md} {
    font-size: 30px;
    padding: 7px 0;
  }
`;

const IconWrapper = styled.span`
  color: ${COLORS.gray400};
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 3px;
  }

  ${mediaQueries.md} {
    svg {
      width: 24px;
      height: 24px;
      stroke-width: 4px;
    }
  }
`;

const LinkContainer = styled.div`
  display: none;
  border-left: 4px solid ${COLORS.gray400};
  padding-left: 30px;
  flex-shrink: 0;

  ${mediaQueries.md} {
    display: block;
  }
`;

const StyledLink = styled.a`
  color: ${COLORS.primary};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 30px;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: ${COLORS.primaryHover};
    text-decoration: underline;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  z-index: 1000;
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

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    brands: [],
    categories: [],
    products: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);

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
    setShowResults(false);
    setSearchQuery('');
    
    // Navigate based on result type
    if (type === 'brand') {
      router.push(`/brands/${data.slug}`);
    } else if (type === 'category') {
      router.push(`/catalog/${data.slug}`);
    } else if (type === 'search') {
      router.push(`/search?q=${encodeURIComponent(data.query)}`);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SearchSection ref={searchRef}>
      <SearchWrapper>
        <FormContainer onSubmit={handleSubmit}>
          <InputContainer>
            <StyledInput 
              type="text" 
              placeholder="Ищете что-нибудь конкретное?" 
              value={searchQuery}
              onChange={handleInputChange}
              ref={inputRef}
            />
            <IconWrapper>
              <SearchIcon width="24px" height="24px" />
            </IconWrapper>
          </InputContainer>
        </FormContainer>
        <LinkContainer>
          <StyledLink href="#">Нет нужного товара?</StyledLink>
        </LinkContainer>
      </SearchWrapper>
      
      <ResultsContainer>
        <SearchResults 
          isVisible={showResults}
          query={searchQuery}
          results={searchResults}
          onResultClick={handleResultClick}
        />
      </ResultsContainer>
    </SearchSection>
  );
};

export default SearchBar; 