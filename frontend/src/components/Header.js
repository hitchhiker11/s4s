import React, { useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { basketApi } from '../lib/api';
import { loadBitrixCore, isUserAuthenticated, getCurrentUserId } from '../lib/auth';

// Стили
const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
  
  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: #4285f4;
    }
    
    &.active {
      color: #4285f4;
    }
  }
`;

const CartIcon = styled.div`
  position: relative;
  margin-left: 20px;
  cursor: pointer;
`;

const CartCounter = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #4285f4;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const SearchBar = styled.div`
  display: flex;
  margin-right: 20px;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
  }
`;

const SearchButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const UserMenu = styled.div`
  margin-left: 25px;
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #333;
  
  &:hover {
    color: #4285f4;
  }
`;

const UserIcon = styled.span`
  margin-right: 8px;
`;

/**
 * Компонент шапки сайта
 */
const Header = () => {
  const router = useRouter();
  
  // Получаем количество товаров в корзине
  const { data: basketCount, isLoading: isBasketLoading } = useQuery(
    'basketCount',
    () => basketApi.getBasketCount(),
    {
      staleTime: 1000 * 60, // 1 минута
      refetchOnWindowFocus: true,
    }
  );
  
  // Состояние авторизации
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  
  // Загружаем скрипты Bitrix при монтировании компонента
  useEffect(() => {
    loadBitrixCore().then(() => {
      setIsAuthenticated(isUserAuthenticated());
      setUserId(getCurrentUserId());
    });
  }, []);
  
  // Обработчик поиска
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Переход в корзину
  const handleCartClick = () => {
    router.push('/cart');
  };
  
  // Переход в личный кабинет или на страницу авторизации
  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/personal');
    } else {
      router.push('/auth');
    }
  };
  
  // Определяем активную ссылку
  const isActiveLink = (path) => {
    return router.pathname === path;
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <Link href="/">
            Интернет-магазин
          </Link>
        </Logo>
        
        <Navigation>
          <NavLinks>
            <NavItem>
              <Link href="/catalog" className={isActiveLink('/catalog') ? 'active' : ''}>
                Каталог
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/about" className={isActiveLink('/about') ? 'active' : ''}>
                О компании
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/contacts" className={isActiveLink('/contacts') ? 'active' : ''}>
                Контакты
              </Link>
            </NavItem>
          </NavLinks>
          
          <SearchBar>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                Искать
              </SearchButton>
            </form>
          </SearchBar>
          
          <CartIcon onClick={handleCartClick}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 5.96C21.26 5.81 21.31 5.62 21.31 5.44C21.31 4.94 20.9 4.5 20.34 4.5H5.31L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z" 
                fill="#333333"
              />
            </svg>
            {!isBasketLoading && basketCount && basketCount.count > 0 && (
              <CartCounter>{basketCount.count}</CartCounter>
            )}
          </CartIcon>
          
          <UserMenu>
            <UserButton onClick={handleUserClick}>
              <UserIcon>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M10 10C12.2167 10 14 8.21667 14 6C14 3.78333 12.2167 2 10 2C7.78333 2 6 3.78333 6 6C6 8.21667 7.78333 10 10 10ZM10 11.5C7.33333 11.5 2 12.8333 2 15.5V16.75C2 17.4333 2.56667 18 3.25 18H16.75C17.4333 18 18 17.4333 18 16.75V15.5C18 12.8333 12.6667 11.5 10 11.5Z" 
                    fill="#333333"
                  />
                </svg>
              </UserIcon>
              {isAuthenticated ? 'Личный кабинет' : 'Войти'}
            </UserButton>
          </UserMenu>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 