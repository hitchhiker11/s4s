import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../frontend/src/styles/tokens';
import { HEADER_COLORS } from '../../frontend/src/components/Header/styles';

export default {
  title: 'Atoms/Colors',
  parameters: {
    componentSubtitle: 'Color palette used throughout the application',
    docs: {
      description: {
        component: 'All available colors in the design system',
      },
    },
  },
};

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const ColorSwatch = styled.div`
  width: 100%;
  background-color: ${props => props.color};
  height: 80px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
`;

const ColorInfo = styled.div`
  font-family: sans-serif;
`;

const ColorName = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const ColorValue = styled.div`
  font-family: monospace;
  color: #666;
  font-size: 12px;
`;

const ColorTemplate = ({ title, colors }) => (
  <div>
    <h2>{title}</h2>
    <ColorGrid>
      {Object.entries(colors).map(([name, value]) => (
        <div key={`${title}-${name}`}>
          <ColorSwatch color={value} />
          <ColorInfo>
            <ColorName>{name}</ColorName>
            <ColorValue>{value}</ColorValue>
          </ColorInfo>
        </div>
      ))}
    </ColorGrid>
  </div>
);

export const PrimaryColors = () => <ColorTemplate title="Primary Colors" colors={COLORS} />;

export const HeaderColors = () => <ColorTemplate title="Header Colors" colors={HEADER_COLORS} />; 