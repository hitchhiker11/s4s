import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

const GridSection = styled.section`
  width: 100%;
  padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  background-color: ${COLORS.white};

  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.xl} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.xl} ${SPACING['2xl']};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${SPACING.lg};

  ${mediaQueries.md} {
    margin-bottom: ${SPACING.xl};
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 4px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  min-height: 40px;

  ${mediaQueries.sm} {
    padding: ${SPACING.md} 0;
    min-height: 45px;
  }
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 3px;
  background-color: ${COLORS.gray400};
  width: 100%;
  margin: 0;
`;

const Title = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(${TYPOGRAPHY.size.lg}, 5vw, ${TYPOGRAPHY.size['2xl']}); /* Responsive: 20px to 30px */
  color: ${props => props.useGradient ? 'transparent' : COLORS.black};
  margin: 0;
  line-height: 1.2;
  
  ${props => props.useGradient && `
    background: linear-gradient(91.3deg, #E7194A 1.11%, #FFAA00 138.8%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `}

  ${mediaQueries.md} {
    line-height: 1.16;
  }
`;

const SubtitleContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 4px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  min-height: 40px;

  ${mediaQueries.sm} {
    padding: ${SPACING.md} 0;
    min-height: 45px;
  }
`;

const Subtitle = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: clamp(${TYPOGRAPHY.size.md}, 4vw, ${TYPOGRAPHY.size['2xl']}); /* Responsive: 16px to 30px */
  color: ${COLORS.gray500};
  margin: 0;
  line-height: 1.2;

  ${mediaQueries.md} {
    line-height: 1.16;
  }
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: clamp(${TYPOGRAPHY.size.md}, 4vw, ${TYPOGRAPHY.size['2xl']}); /* Responsive: 16px to 30px */
  color: ${COLORS.black};
  text-decoration: none;
  white-space: nowrap;
  line-height: 1;

  ${mediaQueries.md} {
    line-height: 0.68;
  }

  &:hover {
    color: ${COLORS.primary};
    text-decoration: underline;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: ${SPACING.md};
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;

  ${mediaQueries.sm} {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: ${SPACING.lg};
  }

  ${mediaQueries.md} {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: ${SPACING.xl};
  }

  ${mediaQueries.lg} {
    gap: ${SPACING['2xl']};
  }
`;

const ItemGrid = ({ title, subtitle, viewAllLink, items = [], renderItem, useGradientTitle = false }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <GridSection>
      <HeaderContainer>
        <TitleRow>
          <Title useGradient={useGradientTitle}>{title}</Title>
          {viewAllLink && <ViewAllLink href={viewAllLink}>Смотреть все</ViewAllLink>}
        </TitleRow>
        {subtitle && (
          <>
            <HeaderDivider />
            <SubtitleContainer>
              <Subtitle>{subtitle}</Subtitle>
            </SubtitleContainer>
          </>
        )}
      </HeaderContainer>
      <GridContainer>
        {items.map((item) => renderItem(item))}
      </GridContainer>
    </GridSection>
  );
};

ItemGrid.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  useGradientTitle: PropTypes.bool,
};

export default ItemGrid; 