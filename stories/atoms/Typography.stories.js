import React from 'react';
import styled from 'styled-components';
import { TYPOGRAPHY, COLORS } from '../../frontend/src/styles/tokens';

export default {
  title: 'Atoms/Typography',
  parameters: {
    componentSubtitle: 'Typography styles used throughout the application',
    docs: {
      description: {
        component: 'All available text styles in the design system',
      },
    },
  },
};

const TypeSection = styled.div`
  margin-bottom: 40px;
`;

const TypeTitle = styled.h2`
  margin-bottom: 16px;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.black};
`;

const TypeExample = styled.div`
  margin-bottom: 24px;
`;

const TypeLabel = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: ${COLORS.gray500};
  margin-bottom: 8px;
`;

const Sample = styled.div`
  font-family: ${props => props.fontFamily || TYPOGRAPHY.fontFamily};
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.lineHeight || 1.5};
  color: ${COLORS.black};
`;

export const FontSizes = () => (
  <TypeSection>
    <TypeTitle>Font Sizes</TypeTitle>
    {Object.entries(TYPOGRAPHY.size).map(([name, size]) => (
      <TypeExample key={name}>
        <TypeLabel>
          {name} ({size})
        </TypeLabel>
        <Sample fontSize={size}>
          The quick brown fox jumps over the lazy dog.
        </Sample>
      </TypeExample>
    ))}
  </TypeSection>
);

export const FontWeights = () => (
  <TypeSection>
    <TypeTitle>Font Weights</TypeTitle>
    {Object.entries(TYPOGRAPHY.weight).map(([name, weight]) => (
      <TypeExample key={name}>
        <TypeLabel>
          {name} ({weight})
        </TypeLabel>
        <Sample fontWeight={weight} fontSize={TYPOGRAPHY.size.md}>
          The quick brown fox jumps over the lazy dog.
        </Sample>
      </TypeExample>
    ))}
  </TypeSection>
);

export const Headings = () => (
  <TypeSection>
    <TypeTitle>Headings</TypeTitle>
    <TypeExample>
      <TypeLabel>Heading 1</TypeLabel>
      <h1 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 1
      </h1>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Heading 2</TypeLabel>
      <h2 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 2
      </h2>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Heading 3</TypeLabel>
      <h3 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 3
      </h3>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Heading 4</TypeLabel>
      <h4 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 4
      </h4>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Heading 5</TypeLabel>
      <h5 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 5
      </h5>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Heading 6</TypeLabel>
      <h6 style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Heading Level 6
      </h6>
    </TypeExample>
  </TypeSection>
);

export const Paragraphs = () => (
  <TypeSection>
    <TypeTitle>Paragraphs</TypeTitle>
    <TypeExample>
      <TypeLabel>Body Text</TypeLabel>
      <p style={{ fontFamily: TYPOGRAPHY.fontFamily, margin: 0 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </p>
    </TypeExample>
    <TypeExample>
      <TypeLabel>Small Text</TypeLabel>
      <p style={{ fontFamily: TYPOGRAPHY.fontFamily, fontSize: TYPOGRAPHY.size.sm, margin: 0 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </p>
    </TypeExample>
  </TypeSection>
); 