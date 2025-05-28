import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import Footer from '../Footer';

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
`;

const Layout = ({ 
  children, 
  useMocksHeader = true, 
  mockBasketCount = 0,
  showMainFooter = true,
}) => {
  return (
    <Main>
      <Header useMocks={useMocksHeader} mockBasketCount={mockBasketCount} />
      <Content>{children}</Content>
      <Footer showMainSection={showMainFooter} />
    </Main>
  );
};

export default Layout; 