import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries } from '../../styles/tokens';
import { SearchIcon } from '../icons';

const SearchSection = styled.section`
  width: 100%;
  padding: 12px;
  background-color: ${COLORS.white};

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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 3px;
  padding-right: 5px;

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
  font-size: clamp(14px, 3vw, 30px);
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

const SearchBar = () => {
  return (
    <SearchSection>
      <SearchWrapper>
        <InputContainer>
          <StyledInput type="text" placeholder="Ищете что-нибудь конкретное?" />
          <IconWrapper>
            <SearchIcon width="24px" height="24px" />
          </IconWrapper>
        </InputContainer>
        <LinkContainer>
          <StyledLink href="#">Нет нужного товара?</StyledLink>
        </LinkContainer>
      </SearchWrapper>
    </SearchSection>
  );
};

export default SearchBar; 