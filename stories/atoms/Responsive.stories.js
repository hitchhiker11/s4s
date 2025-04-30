import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../frontend/src/styles/tokens';
import { mediaQuery } from '../../frontend/src/components/Header/styles';

export default {
  title: 'Atoms/Responsive',
  parameters: {
    componentSubtitle: 'Media queries and responsive behavior',
    docs: {
      description: {
        component: 'Examples of responsive layouts and breakpoints',
      },
    },
  },
};

const ResponsiveSection = styled.div`
  margin-bottom: 40px;
`;

const ResponsiveTitle = styled.h2`
  margin-bottom: 16px;
  font-family: sans-serif;
  color: ${COLORS.black};
`;

const ResponsiveDescription = styled.p`
  margin-bottom: 24px;
  font-family: sans-serif;
`;

const BreakpointsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  font-family: sans-serif;
  
  th, td {
    padding: 8px 16px;
    text-align: left;
    border-bottom: 1px solid ${COLORS.gray200};
  }
  
  th {
    background-color: ${COLORS.gray100};
    font-weight: 600;
  }
  
  code {
    font-family: monospace;
    background-color: ${COLORS.gray100};
    padding: 2px 4px;
    border-radius: 4px;
  }
`;

const ResponsiveBox = styled.div`
  background-color: ${COLORS.gray100};
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 4px;
  
  ${mediaQuery.min.sm} {
    background-color: ${COLORS.primary};
    color: ${COLORS.white};
  }
  
  ${mediaQuery.min.md} {
    background-color: ${COLORS.secondary};
    color: ${COLORS.white};
  }
  
  ${mediaQuery.min.lg} {
    background-color: ${COLORS.accent};
    color: ${COLORS.white};
  }
  
  ${mediaQuery.min.xl} {
    background-color: ${COLORS.success};
    color: ${COLORS.white};
  }
`;

const CodeExample = styled.pre`
  background-color: ${COLORS.gray100};
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
`;

export const Breakpoints = () => (
  <ResponsiveSection>
    <ResponsiveTitle>Breakpoints</ResponsiveTitle>
    <ResponsiveDescription>
      Our design system uses the following breakpoints for responsive design:
    </ResponsiveDescription>
    
    <BreakpointsTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Min Width</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>xs</td>
          <td>0px</td>
          <td>Mobile phones</td>
        </tr>
        <tr>
          <td>sm</td>
          <td>576px</td>
          <td>Small tablets and large phones</td>
        </tr>
        <tr>
          <td>md</td>
          <td>768px</td>
          <td>Tablets</td>
        </tr>
        <tr>
          <td>lg</td>
          <td>992px</td>
          <td>Laptops and small desktops</td>
        </tr>
        <tr>
          <td>xl</td>
          <td>1200px</td>
          <td>Large desktops</td>
        </tr>
        <tr>
          <td>xxl</td>
          <td>1400px</td>
          <td>Extra large desktops</td>
        </tr>
      </tbody>
    </BreakpointsTable>
  </ResponsiveSection>
);

export const MediaQueryExample = () => (
  <ResponsiveSection>
    <ResponsiveTitle>Media Query Example</ResponsiveTitle>
    <ResponsiveDescription>
      This box changes color at different breakpoints. Resize your browser window to see the effect.
    </ResponsiveDescription>
    
    <ResponsiveBox>
      <p>
        <strong>Current Breakpoint:</strong>
      </p>
      <div>xs: Gray (default)</div>
      <div>sm: Primary color</div>
      <div>md: Secondary color</div>
      <div>lg: Accent color</div>
      <div>xl: Success color</div>
    </ResponsiveBox>
    
    <CodeExample>{`
// Example of using media queries in styled-components
const ResponsiveComponent = styled.div\`
  // Default styles (mobile first)
  background-color: ${COLORS.gray100};
  
  // Small tablets and up
  ${mediaQuery.min.sm} {
    background-color: ${COLORS.primary};
  }
  
  // Tablets and up
  ${mediaQuery.min.md} {
    background-color: ${COLORS.secondary};
  }
  
  // Laptops and up
  ${mediaQuery.min.lg} {
    background-color: ${COLORS.accent};
  }
  
  // Desktops and up
  ${mediaQuery.min.xl} {
    background-color: ${COLORS.success};
  }
\`;`}</CodeExample>
  </ResponsiveSection>
);

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
  
  ${mediaQuery.min.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${mediaQuery.min.md} {
    grid-template-columns: repeat(3, 1fr);
  }
  
  ${mediaQuery.min.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const GridItem = styled.div`
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  font-family: sans-serif;
`;

export const ResponsiveGridExample = () => (
  <ResponsiveSection>
    <ResponsiveTitle>Responsive Grid Example</ResponsiveTitle>
    <ResponsiveDescription>
      This grid changes the number of columns at different breakpoints. Resize your browser window to see the effect.
    </ResponsiveDescription>
    
    <ResponsiveGrid>
      {Array.from({ length: 8 }).map((_, index) => (
        <GridItem key={index}>Item {index + 1}</GridItem>
      ))}
    </ResponsiveGrid>
    
    <CodeExample>{`
// Example of a responsive grid in styled-components
const ResponsiveGrid = styled.div\`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  ${mediaQuery.min.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${mediaQuery.min.md} {
    grid-template-columns: repeat(3, 1fr);
  }
  
  ${mediaQuery.min.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
\`;`}</CodeExample>
  </ResponsiveSection>
); 