import styled from 'styled-components';
import { SPACING, mediaQueries } from '../../styles/tokens';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns?.xs || 1}, 1fr);
  gap: ${props => props.$gap || SPACING.lg};
  
  ${mediaQueries.sm} {
    grid-template-columns: repeat(${props => props.$columns?.sm || 2}, 1fr);
  }
  
  ${mediaQueries.md} {
    grid-template-columns: repeat(${props => props.$columns?.md || 3}, 1fr);
  }
  
  ${mediaQueries.lg} {
    grid-template-columns: repeat(${props => props.$columns?.lg || 4}, 1fr);
  }
  
  ${mediaQueries.xl} {
    grid-template-columns: repeat(${props => props.$columns?.xl || 4}, 1fr);
  }
`;

export const GridItem = styled.div`
  grid-column: span ${props => props.$span?.xs || 1};
  
  ${mediaQueries.sm} {
    grid-column: span ${props => props.$span?.sm || 1};
  }
  
  ${mediaQueries.md} {
    grid-column: span ${props => props.$span?.md || 1};
  }
  
  ${mediaQueries.lg} {
    grid-column: span ${props => props.$span?.lg || 1};
  }
  
  ${mediaQueries.xl} {
    grid-column: span ${props => props.$span?.xl || 1};
  }
`;

export default Grid; 