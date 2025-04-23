import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries } from '../../styles/tokens';
import { SearchIcon } from '../icons';

const reducePx = (value, factor = 3) => {
  if (typeof value === 'string' && value.endsWith('px')) {
    const num = parseFloat(value.replace('px', ''));
    return `${num / factor}px`;
  }
  return value;
};

const SearchSection = styled.section`
  width: 100%;
  padding: 12px 12px;
  background-color: ${COLORS.white};

  ${mediaQueries.md} {
    padding: ${reducePx(SPACING['4xl'])} ${(SPACING['2xl'])};
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  border-top: 4px solid ${COLORS.gray400};
  border-bottom: 4px solid ${COLORS.gray400};
  padding: ${reducePx(SPACING.lg)} 0;
  min-height: 64px;

  ${mediaQueries.md} {
    padding: ${reducePx(SPACING.xl)} 0;
    min-height: 64px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: ${reducePx(SPACING.md)};
  padding-right: ${reducePx(SPACING.lg)};
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  background: none;
  flex-grow: 1;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.regular};
  font-size: clamp(${TYPOGRAPHY.size.md}, 3vw, ${TYPOGRAPHY.size.xl});
  color: ${COLORS.black};
  padding: ${reducePx(SPACING.sm)} 0;

  &::placeholder {
    color: ${COLORS.gray400};
    font-weight: ${TYPOGRAPHY.weight.regular};
  }

  &:focus {
    font-weight: ${TYPOGRAPHY.weight.medium};
  }
`;

const IconWrapper = styled.span`
  color: ${COLORS.gray400};
  display: flex;
  align-items: center;
`;

const LinkContainer = styled.div`
  display: none;
  border-left: 3px solid ${COLORS.gray300};
  padding-left: ${reducePx(SPACING.xl)};
  flex-shrink: 0;

  ${mediaQueries.md} {
    display: block;
    padding-left: ${reducePx(SPACING['2xl'])};
  }
`;

const StyledLink = styled.a`
  color: ${COLORS.primary};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: clamp(${TYPOGRAPHY.size.sm}, 2vw, ${TYPOGRAPHY.size.lg});
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
            <SearchIcon width={SIZES.iconSizeSmall} height={SIZES.iconSizeSmall} />
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