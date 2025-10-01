import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';
import { SearchIcon } from '../icons';
import SearchResults from './SearchResults';
// Import searchData utility
import { searchData } from '../../lib/searchUtils';
// Import RequestModal instead of ContactsModal
import RequestModal from '../../components/modals/RequestModal';

const SearchTitle = styled.h1`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.22;
  letter-spacing: -5%;
  color: ${COLORS.black};
  margin: 0 0 ${SPACING.lg} 0;

  ${mediaQueries.lg} {
    /* Scale font from 18px at 992px to 28px at 1920px */
    font-size: clamp(26px, calc(7.32px + 1.077vw), 32px);
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  position: relative;
  background-color: #f2f2f2;
  padding: ${SPACING['3xl']};
  
  @media (min-width: 100px) and (max-width: 992px) {
    background-color:  #f2f2f2;
    padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  }

  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.lg} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.lg} ${SPACING['2xl']};
  }

  ${mediaQueries.lg} {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
`;

const SearchElementsContainer = styled.div`
  ${mediaQueries.lg} {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
`;

const SearchLabel = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 14px;
  color: ${COLORS.gray400};
  margin: 0 0 ${SPACING.sm} 0;

  ${mediaQueries.lg} {
    /* Scale from 14px at 992px to 18px at 1920px */
    font-size: clamp(14px, calc(11.73px + 0.431vw), 22px);
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // border-top: 2px solid ${COLORS.gray400};
  // border-bottom: 2px solid ${COLORS.gray400};
  background-color: ${COLORS.white};
  padding: 5px 0;
  min-height: 45px;
  ${mediaQueries.lg} {
    padding: 7px 0;
    min-height: 45px;
    background-color: ${COLORS.white};
    // border-top: 4px solid ${COLORS.gray400};
    // border-bottom: 4px solid ${COLORS.gray400};
  }

  @media (min-width: 100px) and (max-width: 992px) {
    background-color: ${COLORS.white};
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-grow: 1; /* Allow form to grow but leave space for link */
  /* Removed width: 100% */
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
  font-size: 14px;
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

  ${mediaQueries.lg} {
    /* Scale from 14px at 992px to 18px at 1920px */
    font-size: clamp(14px, calc(9.73px + 0.431vw), 18px);
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
  margin-top: ${SPACING.sm};
  text-align: left;
`;

// Common style for the link itself
const StyledLink = styled.a`
  color: ${COLORS.primary};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  display: block; // Ensure it behaves predictably

  &:hover {
    color: ${COLORS.primaryHover};
    text-decoration: underline;
  }

  ${mediaQueries.lg} {
    /* Scale from 12px at 992px to 16px at 1920px */
    // font-size: clamp(12px, calc(7.73px + 0.431vw), 16px);
    font-size: clamp(14px, calc(11.73px + 0.431vw), 22px);

  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0;
`;

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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // Changed from isContactsModalOpen
  const inputRef = useRef(null);
  const componentRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.length < 2) {
      setShowResults(false);
      // Don't clear results immediately, maybe keep stale results briefly?
      // setSearchResults({ brands: [], categories: [], products: [] });
      setIsLoading(false);
      return; // No API call needed
    }

    // Show results container immediately (can show loading state within SearchResults)
    setShowResults(true);
    setIsLoading(true);

    const handler = setTimeout(async () => {
      console.log('Calling search API after debounce for:', searchQuery);
      try {
        // Pass 'desktop' context regardless of view, as results format is likely the same
        const results = await searchData(searchQuery, 'desktop');
        setSearchResults(results);
      } catch (error) {
        console.error("Search API error:", error);
        setSearchResults({ brands: [], categories: [], products: [] }); // Clear results on error
      } finally {
        setIsLoading(false);
        console.log('Search results updated');
      }
    }, 300);

    // Cleanup function to cancel the timeout if query changes before 300ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Re-run effect when searchQuery changes

  // Handle input changes - just updates the state
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log('Search input changed:', query);
  };

  // Handle search result click
  const handleResultClick = (type, data) => {
    setShowResults(false);
    setSearchQuery(''); // Clear input after selection

    // Navigate based on result type
    let path = '';
    if (type === 'brand') {
      path = `/brands/${data.slug}`;
    } else if (type === 'category') {
      path = `/catalog/${data.slug}`;
    } else if (type === 'product') {
      path = `/detail/${data.slug}`;
    } else if (type === 'search') {
      // This case might be for a "see all results for 'query'" link
      path = `/search?q=${encodeURIComponent(data.query)}`;
    }
    if (path) {
      router.push(path);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowResults(false);
      setSearchQuery(''); // Clear input after submit
      inputRef.current?.blur(); // Remove focus from input
    }
  };

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for opening RequestModal (changed from ContactsModal)
  const handleRequestLinkClick = (e) => {
    e.preventDefault();
    setIsRequestModalOpen(true);
  };

  // Handler for closing RequestModal (changed from ContactsModal)
  const handleRequestModalClose = () => {
    setIsRequestModalOpen(false);
  };

  return (
    <SearchWrapper ref={componentRef}>
      <SearchTitle>
        МАГАЗИН, СОЗДАННЫЙ<br />
        СТРЕЛКАМИ ДЛЯ<br />
        СТРЕЛКОВ
      </SearchTitle>
      <SearchElementsContainer>
        <SearchLabel>Ищете что-нибудь конкретное?</SearchLabel>
        <SearchInputWrapper>
          <FormContainer onSubmit={handleSubmit}>
            <InputContainer>
              <StyledInput
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                ref={inputRef}
                aria-haspopup="listbox"
                aria-expanded={showResults}
                aria-controls="search-results-list"
                autoComplete="off"
              />
              <IconWrapper>
                <SearchIcon width="24px" height="24px" />
              </IconWrapper>
            </InputContainer>
          </FormContainer>
        </SearchInputWrapper>

        <LinkContainer>
          <StyledLink href="#" onClick={handleRequestLinkClick}>
            Нет нужного товара?
          </StyledLink>
        </LinkContainer>
      </SearchElementsContainer>

      {showResults && (
        <ResultsContainer>
          <SearchResults
            id="search-results-list"
            isVisible={showResults}
            query={searchQuery}
            results={searchResults}
            onResultClick={handleResultClick}
            isLoading={isLoading}
          />
        </ResultsContainer>
      )}

      <RequestModal isOpen={isRequestModalOpen} onClose={handleRequestModalClose} />
    </SearchWrapper>
  );
};

export default SearchBar;
