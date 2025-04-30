import React from 'react';
import styled from 'styled-components';
import { SPACING, COLORS } from '../../frontend/src/styles/tokens';
import { HEADER_SPACING } from '../../frontend/src/components/Header/styles';

export default {
  title: 'Atoms/Spacing',
  parameters: {
    componentSubtitle: 'Spacing values used throughout the application',
    docs: {
      description: {
        component: 'Consistent spacing values for margins, paddings, and gaps',
      },
    },
  },
};

const SpacingSection = styled.div`
  margin-bottom: 40px;
`;

const SpacingTitle = styled.h2`
  margin-bottom: 16px;
  font-family: sans-serif;
  color: ${COLORS.black};
`;

const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const SpacingExample = styled.div`
  margin-bottom: 16px;
`;

const SpacingLabel = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: ${COLORS.gray500};
  margin-bottom: 8px;
`;

const SpacingBox = styled.div`
  height: 40px;
  background-color: ${COLORS.gray200};
  width: ${props => props.width};
`;

const SpacingTemplate = ({ title, spacings }) => (
  <SpacingSection>
    <SpacingTitle>{title}</SpacingTitle>
    <SpacingGrid>
      {Object.entries(spacings).map(([name, value]) => (
        <SpacingExample key={`${title}-${name}`}>
          <SpacingLabel>
            {name} ({value})
          </SpacingLabel>
          <SpacingBox width={value} />
        </SpacingExample>
      ))}
    </SpacingGrid>
  </SpacingSection>
);

export const BaseSpacing = () => (
  <SpacingTemplate title="Base Spacing Values" spacings={SPACING} />
);

export const HeaderSpacing = () => (
  <SpacingTemplate title="Header Spacing Values" spacings={HEADER_SPACING} />
);

// Examples of applying spacing
const ExampleCard = styled.div`
  background-color: ${COLORS.white};
  border: 1px solid ${COLORS.gray200};
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ExampleCardHeader = styled.div`
  padding: ${SPACING.md};
  border-bottom: 1px solid ${COLORS.gray200};
  font-weight: 600;
`;

const ExampleCardBody = styled.div`
  padding: ${SPACING.md};
`;

const ExampleCardFooter = styled.div`
  padding: ${SPACING.md};
  border-top: 1px solid ${COLORS.gray200};
  display: flex;
  justify-content: flex-end;
  gap: ${SPACING.sm};
`;

const ExampleButton = styled.button`
  padding: ${SPACING.xs} ${SPACING.md};
  background-color: ${props => (props.primary ? COLORS.primary : 'transparent')};
  color: ${props => (props.primary ? COLORS.white : COLORS.black)};
  border: 1px solid ${props => (props.primary ? COLORS.primary : COLORS.gray300)};
  border-radius: 4px;
  cursor: pointer;
`;

export const SpacingUsageExample = () => (
  <SpacingSection>
    <SpacingTitle>Example Usage of Spacing</SpacingTitle>
    <ExampleCard>
      <ExampleCardHeader>Card Title</ExampleCardHeader>
      <ExampleCardBody>
        <p style={{ margin: `0 0 ${SPACING.md} 0` }}>
          This is an example of how spacing tokens are used in components.
        </p>
        <p style={{ margin: 0 }}>
          Consistent spacing creates visual harmony across the interface.
        </p>
      </ExampleCardBody>
      <ExampleCardFooter>
        <ExampleButton>Cancel</ExampleButton>
        <ExampleButton primary>Submit</ExampleButton>
      </ExampleCardFooter>
    </ExampleCard>
  </SpacingSection>
); 