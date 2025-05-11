import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries } from '../../styles/tokens';
import { SearchIcon } from '../icons';
import SearchResults from './SearchResults';
// Import searchData utility
import { searchData } from '../../lib/searchUtils';
// Import ContactsModal
import ContactsModal from '../../components/modals/ContactsModal';

const SearchSection = styled.section`
  width: 100%;
  padding: 12px; /* Mobile padding */
  background-color: ${COLORS.white};
  position: relative; /* Needed for ResultsContainer positioning */

  ${mediaQueries.md} {
    padding: 29px 40px; /* Desktop padding */
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
  font-size: clamp(14px, 3vw, 30px); /* Responsive font size */
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
    font-size: 30px; /* Fixed desktop font size */
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

// Container for the link, displayed BELOW SearchSection on MOBILE only
const MobileLinkContainer = styled.div`
  display: flex; /* Use flex to center content */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically if needed */
  max-width: ${SIZES.containerMaxWidth};
  margin: ${SPACING.small} auto 0; /* Add some top margin */
  padding: 0 12px; /* Match SearchSection horizontal padding */

  ${mediaQueries.md} {
    display: none; // Hide on desktop
  }
`;

// Container for the link, displayed INSIDE SearchWrapper on DESKTOP only
const DesktopLinkContainer = styled.div`
  display: none; // Hide on mobile by default

  ${mediaQueries.md} {
    display: flex; // Show on desktop
    align-items: center; // Align vertically with search input
    flex-shrink: 0; // Prevent shrinking when input grows
    padding-left: ${SPACING.large}; // Space between search form and link
  }
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

  ${mediaQueries.md} {
    font-size: 16px; // Slightly larger font on desktop
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%; /* Position below the SearchSection */
  left: 0;
  right: 0;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto; /* Center it */
  z-index: 1000;
  /* Match SearchSection horizontal padding for alignment */
  padding: 0 12px; /* Mobile padding */

   ${mediaQueries.md} {
     padding: 0 40px; /* Desktop padding */
   }
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
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const inputRef = useRef(null);
  const componentRef = useRef(null); // Ref for the entire component including the mobile link

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
      path = `/product/${data.slug}`;
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

  // Handle clicks outside the search component (input + results + mobile link)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the entire component wrapper
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handler for opening ContactsModal
  const handleContactsLinkClick = (e) => {
    e.preventDefault();
    setIsContactsModalOpen(true);
  };

  // Handler for closing ContactsModal
  const handleContactsModalClose = () => {
    setIsContactsModalOpen(false);
  };

  return (
    // Use a wrapper div with the ref for outside click detection
    <div ref={componentRef}>
      <SearchSection>
        <SearchWrapper>
          <FormContainer onSubmit={handleSubmit}>
            <InputContainer>
              <StyledInput
                type="text"
                placeholder="Ищете что-нибудь конкретное?"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)} // Show results on focus if query is long enough
                ref={inputRef}
                aria-haspopup="listbox" // Indicate results dropdown
                aria-expanded={showResults} // State of the dropdown
                aria-controls="search-results-list" // ID of the results list
                autoComplete="off" // Prevent browser autocomplete interference
              />
              <IconWrapper>
                {/* Consider making the icon clickable to submit form */}
                <SearchIcon width="24px" height="24px" />
              </IconWrapper>
            </InputContainer>
          </FormContainer>

          {/* Link displayed INSIDE SearchWrapper on DESKTOP only */}
          <DesktopLinkContainer>
            <StyledLink href="#" onClick={handleContactsLinkClick}>Нет нужного товара?</StyledLink>
          </DesktopLinkContainer>

        </SearchWrapper>

        {/* Results container positioned absolutely relative to SearchSection */}
        {/* Conditionally render ResultsContainer only when needed */}
        {showResults && (
          <ResultsContainer>
            <SearchResults
              id="search-results-list" // Add ID for aria-controls
              isVisible={showResults} // Pass visibility (might be redundant now)
              query={searchQuery}
              results={searchResults}
              onResultClick={handleResultClick}
              isLoading={isLoading} // Pass loading state
            />
          </ResultsContainer>
        )}
      </SearchSection>

      {/* Link displayed BELOW SearchSection on MOBILE only */}
      <MobileLinkContainer>
        <StyledLink href="#" onClick={handleContactsLinkClick}>Нет нужного товара?</StyledLink>
      </MobileLinkContainer>

      {/* ContactsModal */}
      <ContactsModal isOpen={isContactsModalOpen} onClose={handleContactsModalClose} />
    </div>
  );
};

export default SearchBar;