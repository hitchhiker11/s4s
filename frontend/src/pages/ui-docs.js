import React from 'react';
import styled from 'styled-components';
import { 
  COLORS, 
  TYPOGRAPHY, 
  SPACING, 
  SIZES, 
  ANIMATION 
} from '../styles/tokens';
import Container from '../components/layout/Container';

// Компоненты для документации
const DocsContainer = styled(Container)`
  padding: 40px 20px;
`;

const DocsTitle = styled.h1`
  font-size: ${TYPOGRAPHY.size['2xl']};
  margin-bottom: ${SPACING['2xl']};
  color: ${COLORS.black};
`;

const DocsSection = styled.section`
  margin-bottom: ${SPACING['3xl']};
`;

const DocsSectionTitle = styled.h2`
  font-size: ${TYPOGRAPHY.size.xl};
  margin-bottom: ${SPACING.xl};
  padding-bottom: ${SPACING.sm};
  border-bottom: 1px solid ${COLORS.gray200};
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${SPACING.lg};
`;

const ColorSwatch = styled.div`
  width: 100%;
  height: 80px;
  background-color: ${props => props.$color};
  border-radius: ${SIZES.borderRadius.sm};
  margin-bottom: ${SPACING.sm};
  border: 1px solid ${COLORS.gray200};
`;

const ColorInfo = styled.div`
  font-size: ${TYPOGRAPHY.size.sm};
`;

const ColorName = styled.div`
  font-weight: ${TYPOGRAPHY.weight.medium};
`;

const ColorValue = styled.div`
  font-family: monospace;
  color: ${COLORS.gray500};
`;

const TypographyExample = styled.div`
  margin-bottom: ${SPACING.xl};
`;

const FontSizeLabel = styled.div`
  font-size: ${TYPOGRAPHY.size.sm};
  color: ${COLORS.gray500};
  margin-bottom: ${SPACING.xs};
`;

const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${SPACING.lg};
`;

const SpacingExample = styled.div`
  margin-bottom: ${SPACING.md};
`;

const SpacingBox = styled.div`
  height: 40px;
  background-color: ${COLORS.gray200};
  width: ${props => props.$width || '100%'};
`;

const CodeBlock = styled.pre`
  background-color: ${COLORS.gray100};
  padding: ${SPACING.lg};
  border-radius: ${SIZES.borderRadius.sm};
  overflow: auto;
  font-family: monospace;
  margin-bottom: ${SPACING.xl};
`;

// Страница документации UI компонентов
const UIDocs = () => {
  return (
    <>
      <DocsContainer>
        <DocsTitle>UI-компоненты и стилевые токены</DocsTitle>
        
        <DocsSection>
          <DocsSectionTitle>Цветовая палитра</DocsSectionTitle>
          <ColorPalette>
            {Object.entries(COLORS).map(([name, value]) => (
              <div key={name}>
                <ColorSwatch $color={value} />
                <ColorInfo>
                  <ColorName>{name}</ColorName>
                  <ColorValue>{value}</ColorValue>
                </ColorInfo>
              </div>
            ))}
          </ColorPalette>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Типографика</DocsSectionTitle>
          <TypographyExample>
            <FontSizeLabel>Font Family: {TYPOGRAPHY.fontFamily}</FontSizeLabel>
          </TypographyExample>
          
          <h3>Размеры шрифтов</h3>
          {Object.entries(TYPOGRAPHY.size).map(([name, size]) => (
            <TypographyExample key={name}>
              <FontSizeLabel>
                {name} ({size})
              </FontSizeLabel>
              <div style={{ fontSize: size }}>
                Пример текста размера {name}
              </div>
            </TypographyExample>
          ))}
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Отступы</DocsSectionTitle>
          <SpacingGrid>
            {Object.entries(SPACING).map(([name, size]) => (
              <SpacingExample key={name}>
                <FontSizeLabel>
                  {name} ({size})
                </FontSizeLabel>
                <SpacingBox $width={size} />
              </SpacingExample>
            ))}
          </SpacingGrid>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Компоненты</DocsSectionTitle>
          <h3>Container</h3>
          <CodeBlock>{`
import Container from '../components/layout/Container';

// Обычный контейнер
<Container>Контент</Container>

// Fluid контейнер (100% ширины)
<Container fluid>Контент</Container>

// Контейнер с другим HTML-элементом
<Container as="section">Контент</Container>
          `}</CodeBlock>
          
          <h3>Grid</h3>
          <CodeBlock>{`
import { Grid, GridItem } from '../components/layout/Grid';

// Основная сетка (responsive)
<Grid $columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} $gap="20px">
  <GridItem>Элемент 1</GridItem>
  <GridItem>Элемент 2</GridItem>
  <GridItem $span={{ md: 2 }}>Элемент на 2 колонки</GridItem>
</Grid>
          `}</CodeBlock>
        </DocsSection>
      </DocsContainer>
    </>
  );
};

export default UIDocs; 