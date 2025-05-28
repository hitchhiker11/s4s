import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Container from '../components/layout/Container';
import { SearchIcon } from '../components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/tokens';

const SearchWrapper = styled.div`
  padding: ${SPACING['3xl']} 0;
`;

const SearchHeader = styled.h1`
  font-size: ${TYPOGRAPHY.size.xl};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  margin-bottom: ${SPACING.xl};
  color: ${COLORS.black};
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: ${SPACING.xl};
  max-width: 600px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: ${SPACING.md};
  font-size: ${TYPOGRAPHY.size.md};
  border: 1px solid ${COLORS.gray300};
  border-radius: 4px 0 0 4px;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.md} ${SPACING.lg};
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${COLORS.primaryHover};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchResults = styled.div`
  margin-top: ${SPACING.xl};
`;

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState(q || '');
  const [results, setResults] = useState([]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // In a real app, we would fetch search results here
      // For now, just update the URL to include the search term
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`, undefined, { shallow: true });
      
      // Mock some results
      setResults([
        { id: 1, name: 'Результат поиска 1', price: '1500 ₽' },
        { id: 2, name: 'Результат поиска 2', price: '2800 ₽' },
        { id: 3, name: 'Результат поиска 3', price: '990 ₽' },
      ]);
    }
  };
  
  return (
    <Container>
      <SearchWrapper>
        <SearchHeader>Поиск по сайту</SearchHeader>
        
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Что вы ищете?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Поисковый запрос"
          />
          <SearchButton type="submit" aria-label="Искать">
            <SearchIcon />
          </SearchButton>
        </SearchForm>
        
        {searchTerm && results.length > 0 ? (
          <SearchResults>
            <h2>Результаты поиска для "{searchTerm}":</h2>
            <ul>
              {results.map(result => (
                <li key={result.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee' }}>
                  <h3>{result.name}</h3>
                  <p>Цена: {result.price}</p>
                </li>
              ))}
            </ul>
          </SearchResults>
        ) : searchTerm ? (
          <p>По вашему запросу "{searchTerm}" ничего не найдено.</p>
        ) : null}
      </SearchWrapper>
    </Container>
  );
};

export default SearchPage; 