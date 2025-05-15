import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

const GridSection = styled.section`
  width: 100%;
  padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  background-color: ${COLORS.white};

  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.lg} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.lg} ${SPACING['2xl']};
  }

  ${mediaQueries.lg} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${SPACING.xl};

  ${mediaQueries.md} {
    margin-bottom: ${SPACING.xl};
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 2px solid ${COLORS.gray400};
  padding: 5px 0;
  max-height: 28px;

  ${mediaQueries.sm} {
    border-top-width: 2px;
    padding: ${SPACING.md} 0;
  }

  ${mediaQueries.md} {
    border-top-width: 4px;
    max-height: 45px;
  }
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 2px;
  background-color: ${COLORS.gray400};
  width: 100%;
  margin: 0;

  ${mediaQueries.md} {
    height: 4px;
  }
`;

const Title = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(1.25rem, 6vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${props => props.useGradient ? 'transparent' : COLORS.black};
  margin: 0;
  line-height: 1.16;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
  
  ${props => props.useGradient && `
    background: linear-gradient(91.3deg, #E7194A 1.11%, #FFAA00 138.8%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `}
`;

const SubtitleContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  max-height: 28px;
  align-items: center;

  ${mediaQueries.sm} {
    border-bottom-width: 2px;
    max-height: 45px;
    padding: ${SPACING.md} 0;
  }

  ${mediaQueries.md} {
    max-height: 45px;
    border-bottom-width: 4px;
  }
`;

const Subtitle = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: clamp(1rem, 5vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${COLORS.gray500};
  margin: 0;
  line-height: 1.16;

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: clamp(1rem, 5vw, ${TYPOGRAPHY.size["2xl"]});
  color: ${COLORS.black};
  text-decoration: none;
  white-space: nowrap;
  line-height: 0.68;

  &:hover {
    color: ${COLORS.primary};
    text-decoration: underline;
  }

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size["2xl"]};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
  gap: ${SPACING.md};
  width: 100%;

  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  justify-content: space-between;

  ${mediaQueries.sm} {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
    gap: ${SPACING.lg};
  }

  ${mediaQueries.md} {
    
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: ${SPACING.lg};
  }

  ${mediaQueries.lg} {
  
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
  }

  @media (max-width: ${BREAKPOINTS.lg - 1}px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: ${SPACING.md};
    gap: ${SPACING.md};

    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    grid-template-columns: unset;
    justify-content: flex-start;

    & > * {
      flex-shrink: 0;
      width: 80%;
      scroll-snap-align: start;

      ${mediaQueries.xs} {
         width: 85%;
      }
    }
  }
`;

const EmptyMessage = styled.div`
  padding: ${SPACING.xl};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.gray400};
  width: 100%;
`;

const ItemGrid = ({ 
  items = [],
  title = "Items",
  subtitle = "",
  viewAllLink = "#",
  viewAllText = "Смотреть все",
  useGradientTitle = false,
  renderItem,
  cardStyle
}) => {
  if (!items || items.length === 0) {
    return <EmptyMessage>Нет элементов для отображения.</EmptyMessage>;
  }

  return (
    <GridSection>
      {(title || viewAllLink) && (
        <HeaderContainer>
          <TitleRow>
            {title && <Title useGradient={useGradientTitle}>{title}</Title>}
            {viewAllLink && <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>}
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
      )}
      <GridContainer>
        {items.map(item => renderItem(item, cardStyle))}
      </GridContainer>
    </GridSection>
  );
};

ItemGrid.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  useGradientTitle: PropTypes.bool,
  renderItem: PropTypes.func.isRequired,
  cardStyle: PropTypes.object,
};

export default ItemGrid; 