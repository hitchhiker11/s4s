import React from 'react';
import styled from 'styled-components';
import { COLORS, ANIMATION } from '../../frontend/src/styles/tokens';
import { SHADOWS, ANIMATION as HEADER_ANIMATION } from '../../frontend/src/components/Header/styles';

export default {
  title: 'Atoms/Effects',
  parameters: {
    componentSubtitle: 'Shadows and animations used throughout the application',
    docs: {
      description: {
        component: 'Visual effects that create depth and movement',
      },
    },
  },
};

const EffectsSection = styled.div`
  margin-bottom: 40px;
`;

const EffectsTitle = styled.h2`
  margin-bottom: 16px;
  font-family: sans-serif;
  color: ${COLORS.black};
`;

const EffectsDescription = styled.p`
  margin-bottom: 24px;
  font-family: sans-serif;
`;

// SHADOWS
const ShadowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const ShadowBox = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${COLORS.white};
  border-radius: 4px;
  box-shadow: ${props => props.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 14px;
  color: ${COLORS.gray500};
`;

export const Shadows = () => (
  <EffectsSection>
    <EffectsTitle>Shadows</EffectsTitle>
    <EffectsDescription>
      Shadows provide depth and elevation to the interface. They indicate different levels of importance and interactivity.
    </EffectsDescription>
    <ShadowsGrid>
      {Object.entries(SHADOWS).map(([name, value]) => (
        <ShadowBox key={name} shadow={value}>
          {name}
        </ShadowBox>
      ))}
    </ShadowsGrid>
  </EffectsSection>
);

// ANIMATIONS
const AnimationsContainer = styled.div`
  margin-bottom: 40px;
`;

const AnimationExample = styled.div`
  margin-bottom: 24px;
`;

const AnimationLabel = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: ${COLORS.gray500};
  margin-bottom: 8px;
`;

const AnimationBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.white};
  font-weight: 600;
  transition: transform ${props => props.duration || ANIMATION.duration} ${props => props.timing || ANIMATION.timing};
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const Animations = () => (
  <EffectsSection>
    <EffectsTitle>Animations</EffectsTitle>
    <EffectsDescription>
      Animations provide feedback and improve the user experience by making interactions feel more natural and responsive.
    </EffectsDescription>
    
    <AnimationsContainer>
      <AnimationExample>
        <AnimationLabel>Base Animation (Hover me)</AnimationLabel>
        <AnimationBox>Hover</AnimationBox>
        <pre style={{ marginTop: '16px', fontSize: '14px' }}>
          {`duration: ${ANIMATION.duration}
timing: ${ANIMATION.timing}`}
        </pre>
      </AnimationExample>
      
      <AnimationExample>
        <AnimationLabel>Slow Animation (Hover me)</AnimationLabel>
        <AnimationBox duration="0.5s" timing="ease-in-out">Hover</AnimationBox>
        <pre style={{ marginTop: '16px', fontSize: '14px' }}>
          {`duration: 0.5s
timing: ease-in-out`}
        </pre>
      </AnimationExample>
    </AnimationsContainer>
  </EffectsSection>
);

// COMBINED
export const AllEffects = () => (
  <>
    <Shadows />
    <Animations />
  </>
); 