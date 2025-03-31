import React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createGlobalStyle } from 'styled-components';

import Header from '../components/Header';

// Глобальные стили
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9f9f9;
    color: #333;
    line-height: 1.5;
  }
  
  a {
    color: #4285f4;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
  }
  
  img {
    max-width: 100%;
  }
  
  ul, ol {
    list-style: none;
  }
  
  /* Скрываем прокрутку при открытом модальном окне */
  body.modal-open {
    overflow: hidden;
  }
`;

// Компонент футера
const Footer = () => (
  <footer style={{ 
    backgroundColor: '#333', 
    color: '#fff', 
    padding: '30px 0', 
    marginTop: '50px' 
  }}>
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 20px' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Интернет-магазин</h3>
          <p>&copy; {new Date().getFullYear()} Все права защищены</p>
        </div>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Контакты</h3>
          <p>Телефон: +7 (123) 456-78-90</p>
          <p>Email: info@example.com</p>
        </div>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Информация</h3>
          <ul>
            <li style={{ marginBottom: '8px' }}>
              <a href="/about" style={{ color: '#fff' }}>О компании</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="/delivery" style={{ color: '#fff' }}>Доставка и оплата</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="/contacts" style={{ color: '#fff' }}>Контакты</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

/**
 * Основной компонент приложения Next.js
 */
function MyApp({ Component, pageProps }) {
  // Создаем клиент React Query
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 минут кэширования по умолчанию
      },
    },
  }));
  
  // Проверяем, нужен ли Layout для текущей страницы
  const getLayout = Component.getLayout || ((page) => page);
  
  // Если у компонента есть собственная реализация getLayout, используем ее
  const hasCustomLayout = Component.getLayout !== undefined;
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <GlobalStyle />
        {!hasCustomLayout && <Header />}
        {getLayout(<Component {...pageProps} />)}
        {!hasCustomLayout && <Footer />}
        {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp; 