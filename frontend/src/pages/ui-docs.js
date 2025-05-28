import React from 'react';
import styled from 'styled-components';
import { 
  COLORS, 
  TYPOGRAPHY, 
  SPACING, 
  SIZES, 
  ANIMATION,
  SHADOWS as TokenShadows
} from '../styles/tokens';
import Container from '../components/layout/Container';
import CategoryCard from '../components/CategoryCard';
import { SearchIcon, CartIcon, MenuBurgerIcon } from '../components/Header/icons';
import {
  HEADER_COLORS,
  HEADER_SIZES,
  HEADER_SPACING,
  SHADOWS,
  mediaQuery,
  ButtonStyles,
  HeaderIconStyles,
  NavLinkBaseStyles,
  badgeStyles,
  flexCenter,
  flexBetween,
  ANIMATION as HEADER_ANIMATION
} from '../components/Header/styles';

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

const DocsSubSectionTitle = styled.h3`
  font-size: ${TYPOGRAPHY.size.lg};
  margin-top: ${SPACING.xl};
  margin-bottom: ${SPACING.md};
  color: ${COLORS.gray800};
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${SPACING.lg};
  justify-content: space-between;
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
  justify-content: space-between;
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
  font-size: 14px;
  line-height: 1.5;
`;

const ComponentsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.xl};
  margin-bottom: ${SPACING.xl};
  justify-content: space-between;
  width: 100%;
`;

const ComponentCard = styled.div`
  border: 1px solid ${COLORS.gray200};
  border-radius: ${SIZES.borderRadius.md};
  padding: ${SPACING.lg};
  width: 100%;
  max-width: 350px;
  box-shadow: ${SHADOWS.sm};
  flex: 1 1 300px;
  margin: ${SPACING.sm};
`;

const ComponentTitle = styled.h4`
  font-size: ${TYPOGRAPHY.size.md};
  margin-bottom: ${SPACING.md};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
`;

const ResponsiveTable = styled.div`
  overflow-x: auto;
  margin-bottom: ${SPACING.xl};
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${SPACING.xl};
  
  th, td {
    border: 1px solid ${COLORS.gray200};
    padding: ${SPACING.md};
    text-align: left;
  }
  
  th {
    background-color: ${COLORS.gray100};
    font-weight: ${TYPOGRAPHY.weight.semiBold};
  }
  
  tr:nth-child(even) {
    background-color: ${COLORS.gray50};
  }
`;

const IconDisplay = styled.div`
  display: flex;
  gap: ${SPACING.lg};
  margin-bottom: ${SPACING.xl};
  justify-content: space-between;
  flex-wrap: wrap;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span {
    margin-top: ${SPACING.sm};
    font-size: ${TYPOGRAPHY.size.sm};
    color: ${COLORS.gray600};
  }
`;

const StyledIcon = styled.div`
  ${HeaderIconStyles};
  color: ${COLORS.black};
  margin-bottom: ${SPACING.sm};
`;

const AnimationExample = styled.div`
  margin-bottom: ${SPACING.xl};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AnimationBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${COLORS.primary};
  margin-bottom: ${SPACING.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  transition: all ${props => props.$duration || ANIMATION.duration} ${props => props.$timing || ANIMATION.timing};
  
  &:hover {
    transform: scale(1.1);
    background-color: ${COLORS.primaryHover};
  }
`;

const ButtonExample = styled.button`
  ${ButtonStyles};
  padding: ${SPACING.md} ${SPACING.lg};
  background-color: ${props => props.$primary ? COLORS.primary : 'transparent'};
  color: ${props => props.$primary ? COLORS.white : COLORS.black};
  border: ${props => props.$primary ? 'none' : `1px solid ${COLORS.gray300}`};
  border-radius: ${SIZES.borderRadius.sm};
  margin-right: ${SPACING.md};
  margin-bottom: ${SPACING.md};
  font-weight: ${TYPOGRAPHY.weight.medium};
  
  &:hover {
    background-color: ${props => props.$primary ? COLORS.primaryHover : COLORS.gray100};
  }
`;

const NavLinkExample = styled.a`
  ${NavLinkBaseStyles};
  margin-right: ${SPACING.lg};
`;

const BadgeExample = styled.span`
  ${badgeStyles};
  position: relative;
  display: inline-flex;
  top: 0;
  right: 0;
  margin-right: ${SPACING.md};
`;

const FlexExample = styled.div`
  ${props => props.$type === 'center' ? flexCenter : flexBetween};
  background-color: ${COLORS.gray100};
  padding: ${SPACING.md};
  margin-bottom: ${SPACING.md};
  height: 100px;
  
  > div {
    background-color: ${COLORS.primary};
    color: white;
    padding: ${SPACING.md};
    border-radius: ${SIZES.borderRadius.sm};
  }
`;

const MediaQueryExample = styled.div`
  padding: ${SPACING.md};
  background-color: ${COLORS.gray100};
  border-radius: ${SIZES.borderRadius.sm};
  margin-bottom: ${SPACING.md};
  
  ${mediaQuery.min.md} {
    background-color: ${COLORS.primary};
    color: white;
  }
`;

const ShadowExample = styled.div`
  width: 150px;
  height: 150px;
  background-color: white;
  margin: ${SPACING.md};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZES.borderRadius.sm};
`;

const ShadowBox = styled(ShadowExample)`
  box-shadow: ${props => props.$shadow};
`;

const ShadowsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${SPACING.xl};
  justify-content: space-between;
  gap: ${SPACING.md};
`;

// Add a grid container for multiple component examples
const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${SPACING.xl};
  justify-content: space-between;
  width: 100%;
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
          
          <DocsSubSectionTitle>Основные цвета</DocsSubSectionTitle>
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
          
          <DocsSubSectionTitle>Цвета для шапки (Header)</DocsSubSectionTitle>
          <ColorPalette>
            {Object.entries(HEADER_COLORS).map(([name, value]) => (
              <div key={`header-${name}`}>
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
          
          <DocsSubSectionTitle>Размеры шрифтов</DocsSubSectionTitle>
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
          
          <DocsSubSectionTitle>Насыщенность шрифтов</DocsSubSectionTitle>
          {Object.entries(TYPOGRAPHY.weight).map(([name, weight]) => (
            <TypographyExample key={name}>
              <FontSizeLabel>
                {name} ({weight})
              </FontSizeLabel>
              <div style={{ fontWeight: weight }}>
                Пример текста с насыщенностью {name}
              </div>
            </TypographyExample>
          ))}
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Отступы</DocsSectionTitle>
          
          <DocsSubSectionTitle>Основные отступы</DocsSubSectionTitle>
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
          
          <DocsSubSectionTitle>Отступы для шапки (Header)</DocsSubSectionTitle>
          <SpacingGrid>
            {Object.entries(HEADER_SPACING).map(([name, size]) => (
              <SpacingExample key={`header-${name}`}>
                <FontSizeLabel>
                  {name} ({size})
                </FontSizeLabel>
                <SpacingBox $width={size} />
              </SpacingExample>
            ))}
          </SpacingGrid>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Размеры</DocsSectionTitle>
          
          <DocsSubSectionTitle>Основные размеры</DocsSubSectionTitle>
          <ResponsiveTable>
            <Table>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Значение</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(SIZES).map(([category, values]) => {
                  if (typeof values === 'object') {
                    return Object.entries(values).map(([name, value]) => (
                      <tr key={`${category}-${name}`}>
                        <td>{category}.{name}</td>
                        <td>{value}</td>
                        <td>-</td>
                      </tr>
                    ));
                  } else {
                    return (
                      <tr key={category}>
                        <td>{category}</td>
                        <td>{values}</td>
                        <td>-</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
          </ResponsiveTable>
          
          <DocsSubSectionTitle>Размеры для шапки (Header)</DocsSubSectionTitle>
          <ResponsiveTable>
            <Table>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Значение</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(HEADER_SIZES).map(([name, value]) => (
                  <tr key={`header-size-${name}`}>
                    <td>{name}</td>
                    <td>{value}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ResponsiveTable>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Тени</DocsSectionTitle>
          <ShadowsContainer>
            {Object.entries(SHADOWS).map(([name, value]) => (
              <ShadowBox key={`shadow-${name}`} $shadow={value}>
                <div>
                  <FontSizeLabel>{name}</FontSizeLabel>
                </div>
              </ShadowBox>
            ))}
          </ShadowsContainer>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Анимация</DocsSectionTitle>
          
          <DocsSubSectionTitle>Параметры анимации</DocsSubSectionTitle>
          <ResponsiveTable>
            <Table>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Значение</th>
                  <th>Пример</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ANIMATION).map(([name, value]) => (
                  <tr key={`animation-${name}`}>
                    <td>{name}</td>
                    <td>{value}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ResponsiveTable>
          
          <DocsSubSectionTitle>Примеры анимаций</DocsSubSectionTitle>
          <AnimationExample>
            <FontSizeLabel>Базовая анимация (наведите)</FontSizeLabel>
            <AnimationBox>Hover Me</AnimationBox>
          </AnimationExample>
          
          <AnimationExample>
            <FontSizeLabel>Анимация с другими параметрами</FontSizeLabel>
            <AnimationBox $duration="0.5s" $timing="ease-in-out">Hover Me</AnimationBox>
          </AnimationExample>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Media Queries</DocsSectionTitle>
          <ResponsiveTable>
            <Table>
              <thead>
                <tr>
                  <th>Breakpoint</th>
                  <th>Значение</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mediaQuery.min).map(([name, value]) => (
                  <tr key={`mq-min-${name}`}>
                    <td>min.{name}</td>
                    <td>{value.replace('@media ', '')}</td>
                    <td>Стили для экранов шире указанного значения</td>
                  </tr>
                ))}
                {Object.entries(mediaQuery.max).map(([name, value]) => (
                  <tr key={`mq-max-${name}`}>
                    <td>max.{name}</td>
                    <td>{value.replace('@media ', '')}</td>
                    <td>Стили для экранов уже указанного значения</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ResponsiveTable>
          
          <DocsSubSectionTitle>Пример использования Media Query</DocsSubSectionTitle>
          <MediaQueryExample>
            Этот блок меняет цвет на больших экранах (md и выше)
          </MediaQueryExample>
          <CodeBlock>{`
// Пример использования в styled-components
const ResponsiveComponent = styled.div\`
  // Стили для мобильных устройств
  padding: ${SPACING.sm};
  
  // Стили для планшетов и больше
  ${mediaQuery.min.md} {
    padding: ${SPACING.lg};
  }
  
  // Стили только для десктопов
  ${mediaQuery.min.lg} {
    padding: ${SPACING.xl};
  }
\`;`}</CodeBlock>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Иконки</DocsSectionTitle>
          <IconDisplay>
            <IconWrapper>
              <StyledIcon>
                <SearchIcon />
              </StyledIcon>
              <span>SearchIcon</span>
            </IconWrapper>
            <IconWrapper>
              <StyledIcon>
                <CartIcon />
              </StyledIcon>
              <span>CartIcon</span>
            </IconWrapper>
            <IconWrapper>
              <StyledIcon>
                <MenuBurgerIcon />
              </StyledIcon>
              <span>MenuBurgerIcon</span>
            </IconWrapper>
          </IconDisplay>
          
          <CodeBlock>{`
// Пример использования иконок
import { SearchIcon, CartIcon, MenuBurgerIcon } from './icons';

// В компоненте:
<HeaderIconStyles>
  <SearchIcon />
</HeaderIconStyles>
          `}</CodeBlock>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Компоненты</DocsSectionTitle>
          
          <DocsSubSectionTitle>Container</DocsSubSectionTitle>
          <CodeBlock>{`
import Container from '../components/layout/Container';

// Обычный контейнер
<Container>Контент</Container>

// Fluid контейнер (100% ширины)
<Container fluid>Контент</Container>

// Контейнер с другим HTML-элементом
<Container as="section">Контент</Container>
          `}</CodeBlock>
          
          <DocsSubSectionTitle>CategoryCard</DocsSubSectionTitle>
          <ComponentGrid>
            <CategoryCard 
              title="Пример категории" 
              imageUrl="/images/placeholder.jpg"
              link="#"
            />
          </ComponentGrid>
          <CodeBlock>{`
import CategoryCard from '../components/CategoryCard';

// Использование:
<CategoryCard 
  title="Название категории" 
  imageUrl="/path/to/image.jpg"
  link="/catalog/category-slug"
/>

// Использование без заголовка (для брендов):
<CategoryCard 
  title="Название бренда" 
  imageUrl="/path/to/brand-logo.jpg"
  link="/brands/brand-slug"
  showTitle={false}
/>
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Grid</DocsSubSectionTitle>
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
        
        <DocsSection>
          <DocsSectionTitle>Grid Layout Examples</DocsSectionTitle>
          
          <DocsSubSectionTitle>Grid с автоматическими колонками</DocsSubSectionTitle>
          <CodeBlock>{`
// auto-fill: добавляет столько колонок, сколько может вместиться
const AutoFillGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-content: space-between;
\`;

// auto-fit: растягивает существующие колонки на всю ширину
const AutoFitGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
\`;
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Grid с выравниванием элементов</DocsSubSectionTitle>
          <CodeBlock>{`
const GridWithAlignment = styled.div\`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  // Выравнивание всех элементов в гриде
  justify-items: center; // start, end, center, stretch
  align-items: center; // start, end, center, stretch
  
  // Выравнивание содержимого всего грида
  justify-content: space-between; // start, end, center, space-between, space-around, space-evenly
  align-content: space-between; // start, end, center, space-between, space-around, space-evenly
\`;

// Индивидуальное выравнивание элемента
const GridItem = styled.div\`
  justify-self: center; // start, end, center, stretch
  align-self: center; // start, end, center, stretch
\`;
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Card Grid Example</DocsSubSectionTitle>
          
          {/* Create a visual example of cards in a grid */}
          <ComponentGrid>
            {[1, 2, 3, 4, 5].map(item => (
              <ComponentCard key={item}>
                <ComponentTitle>Card Example {item}</ComponentTitle>
                <div>Content for card {item}</div>
              </ComponentCard>
            ))}
          </ComponentGrid>
          
          <CodeBlock>{`
const CardGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  justify-content: space-between;
  width: 100%;
\`;

// Затем используйте для отображения карточек
<CardGrid>
  {cards.map(card => (
    <CardComponent key={card.id} {...card} />
  ))}
</CardGrid>
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Использование CSS Grid Areas</DocsSubSectionTitle>
          <CodeBlock>{`
const LayoutGrid = styled.div\`
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
  }
\`;

const Header = styled.header\`
  grid-area: header;
\`;

const Main = styled.main\`
  grid-area: main;
\`;

const Sidebar = styled.aside\`
  grid-area: sidebar;
\`;

const Aside = styled.aside\`
  grid-area: aside;
\`;

const Footer = styled.footer\`
  grid-area: footer;
\`;
          `}</CodeBlock>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Стилевые утилиты</DocsSectionTitle>
          
          <DocsSubSectionTitle>Кнопки (ButtonStyles)</DocsSubSectionTitle>
          <div>
            <ButtonExample $primary>Primary Button</ButtonExample>
            <ButtonExample>Secondary Button</ButtonExample>
          </div>
          <CodeBlock>{`
import { ButtonStyles } from '../components/Header/styles';

// Использование в styled-components:
const MyButton = styled.button\`
  ${ButtonStyles}
  padding: ${SPACING.md} ${SPACING.lg};
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  border-radius: ${SIZES.borderRadius.sm};
  
  &:hover {
    background-color: ${COLORS.primaryHover};
  }
\`;
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Бейджи (badgeStyles)</DocsSubSectionTitle>
          <div>
            <BadgeExample>1</BadgeExample>
            <BadgeExample>99+</BadgeExample>
          </div>
          <CodeBlock>{`
import { badgeStyles } from '../components/Header/styles';

// Использование в styled-components:
const Badge = styled.span\`
  ${badgeStyles}
  // Дополнительные стили или переопределения
\`;
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Навигационные ссылки (NavLinkBaseStyles)</DocsSubSectionTitle>
          <div>
            <NavLinkExample href="#">Обычная ссылка</NavLinkExample>
            <NavLinkExample href="#" className="active">Активная ссылка</NavLinkExample>
          </div>
          <CodeBlock>{`
import { NavLinkBaseStyles } from '../components/Header/styles';

// Использование в styled-components:
const NavLink = styled.a\`
  ${NavLinkBaseStyles}
  // Дополнительные стили или переопределения
\`;
          `}</CodeBlock>
          
          <DocsSubSectionTitle>Flex утилиты</DocsSubSectionTitle>
          <FlexExample $type="center">
            <div>Центрированный элемент</div>
          </FlexExample>
          <FlexExample>
            <div>Элемент слева</div>
            <div>Элемент справа</div>
          </FlexExample>
          <CodeBlock>{`
import { flexCenter, flexBetween } from '../components/Header/styles';

// Использование flexCenter в styled-components:
const CenteredContainer = styled.div\`
  ${flexCenter}
  // Дополнительные стили
\`;

// Использование flexBetween в styled-components:
const SpaceBetweenContainer = styled.div\`
  ${flexBetween}
  // Дополнительные стили
\`;
          `}</CodeBlock>
        </DocsSection>
        
        <DocsSection>
          <DocsSectionTitle>Внедрение в Bitrix (интеграция)</DocsSectionTitle>
          <CodeBlock>{`
// Пример интеграции React компонента с Bitrix через JSON

// PHP (компонент Bitrix):
<?php
// В шаблоне компонента Bitrix (component.php):
$arResult = [
  'ITEMS' => [...], // данные из Bitrix
  'PAGINATION' => [...],
  // другие данные
];

// Вместо прямого вывода, сериализуем в JSON:
echo json_encode($arResult);
?>

// JavaScript (React компонент):
import axios from 'axios';

// Пример запроса к API:
const fetchCatalog = async (sectionId) => {
  try {
    const { data } = await axios.post('/ajax/catalog/loadItems.php', { 
      sectionId: sectionId,
      sessid: window.BX.bitrix_sessid() // Передаем сессионный токен
    });
    
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке каталога:', error);
    return null;
  }
};

// В компоненте Next.js (SSR):
export async function getServerSideProps(context) {
  const data = await fetchCatalog(123);
  
  return {
    props: { 
      initialData: data 
    },
  };
}
          `}</CodeBlock>
        </DocsSection>
      </DocsContainer>
    </>
  );
};

export default UIDocs; 