import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries } from '../styles/tokens';

const ExampleContainer = styled.div`
  padding: ${SPACING["3xl"]} ${SPACING.xl};
  max-width: 1200px;
  margin: 0 auto;
  
  ${mediaQueries.md} {
    padding: ${SPACING["4xl"]} ${SPACING["2xl"]};
  }
  
  ${mediaQueries.lg} {
    padding: ${SPACING["4xl"]} 40px;
  }
`;

const ExampleTitle = styled.h1`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: 700;
  font-size: 36px;
  line-height: 1.2;
  color: ${COLORS.black};
  margin-bottom: ${SPACING["2xl"]};
`;

const ExampleContent = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.size.md};
  line-height: 1.6;
  color: ${COLORS.black};
  
  p {
    margin-bottom: ${SPACING.xl};
  }
`;

const ExamplePage = () => {
  return (
    <Layout showMainFooter={false}>
      <ExampleContainer>
        <ExampleTitle>Пример страницы с минимальным футером</ExampleTitle>
        <ExampleContent>
          <p>
            Это пример страницы, которая использует компонент Layout с параметром showMainFooter={false},
            что означает, что на этой странице отображается только нижняя часть футера.
          </p>
          <p>
            На таких страницах, как страницы категорий, страницы продуктов, корзина, и другие,
            может быть более уместно показывать только нижнюю часть футера для экономии пространства
            и фокусировки внимания пользователя на основном контенте.
          </p>
          <p>
            Главная страница, напротив, показывает полный футер, включая навигационные разделы
            и логотипы брендов, чтобы предоставить пользователю более полный обзор сайта.
          </p>
        </ExampleContent>
      </ExampleContainer>
    </Layout>
  );
};

export default ExamplePage; 