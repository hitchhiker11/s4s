import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';

import ProductCard from '../../components/ProductCard';
import { catalogApi } from '../../lib/api';
import { loadBitrixCore } from '../../lib/auth';

// Стилизованные компоненты
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const FiltersContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  min-width: 180px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#4285f4' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3367d6' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

/**
 * Страница каталога с SSR
 */
const CatalogPage = ({ initialData, sectionId, seo }) => {
  // Состояние для фильтров
  const [filters, setFilters] = useState({
    sort: 'default',
    priceRange: 'all',
  });
  
  // Получаем query-параметры из URL
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);
  
  // Получаем данные каталога с использованием react-query
  const { data, isLoading, error } = useQuery(
    ['catalog', sectionId, currentPage, filters],
    () => catalogApi.getProducts(sectionId, currentPage, filters),
    {
      initialData,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );
  
  // Обработчик изменения фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Сбрасываем страницу на первую при изменении фильтров
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1 },
    });
  };
  
  // Обработчик пагинации
  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  };
  
  // Загружаем скрипты Bitrix при монтировании компонента
  React.useEffect(() => {
    loadBitrixCore();
  }, []);
  
  // Если данные загружаются, показываем состояние загрузки
  if (isLoading && !data) {
    return (
      <Container>
        <LoadingState>Загрузка каталога...</LoadingState>
      </Container>
    );
  }
  
  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <Container>
        <EmptyState>
          Произошла ошибка при загрузке каталога. Пожалуйста, попробуйте позже.
        </EmptyState>
      </Container>
    );
  }
  
  // Если данные пусты, показываем сообщение о пустом каталоге
  if (!data || !data.ITEMS || data.ITEMS.length === 0) {
    return (
      <Container>
        <EmptyState>
          В данной категории нет товаров.
        </EmptyState>
      </Container>
    );
  }
  
  return (
    <>
      <Head>
        <title>{seo.TITLE || 'Каталог товаров'}</title>
        <meta name="description" content={seo.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta name="keywords" content={seo.KEYWORDS || 'каталог, товары, интернет-магазин'} />
        {/* Open Graph метатеги для соцсетей */}
        <meta property="og:title" content={seo.TITLE || 'Каталог товаров'} />
        <meta property="og:description" content={seo.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta property="og:type" content="website" />
        {data.SECTION.PICTURE_SRC && (
          <meta property="og:image" content={data.SECTION.PICTURE_SRC} />
        )}
      </Head>
      
      <Container>
        <Title>{data.SECTION.NAME || 'Каталог товаров'}</Title>
        
        {/* Фильтры и сортировка */}
        <FiltersContainer>
          <FilterRow>
            <FilterSelect
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="default">По умолчанию</option>
              <option value="price_asc">Цена (по возрастанию)</option>
              <option value="price_desc">Цена (по убыванию)</option>
              <option value="name_asc">Название (А-Я)</option>
              <option value="name_desc">Название (Я-А)</option>
            </FilterSelect>
            
            <FilterSelect
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="all">Все цены</option>
              <option value="0-1000">До 1000 ₽</option>
              <option value="1000-5000">От 1000 ₽ до 5000 ₽</option>
              <option value="5000-10000">От 5000 ₽ до 10000 ₽</option>
              <option value="10000+">От 10000 ₽</option>
            </FilterSelect>
          </FilterRow>
        </FiltersContainer>
        
        {/* Сетка товаров */}
        <ProductGrid>
          {data.ITEMS.map(product => (
            <ProductCard key={product.ID} product={product} />
          ))}
        </ProductGrid>
        
        {/* Пагинация */}
        {data.PAGINATION && data.PAGINATION.PAGES_COUNT > 1 && (
          <Pagination>
            <PageButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Назад
            </PageButton>
            
            {Array.from({ length: data.PAGINATION.PAGES_COUNT }, (_, i) => i + 1)
              .filter(p => 
                p === 1 || 
                p === data.PAGINATION.PAGES_COUNT || 
                (p >= currentPage - 2 && p <= currentPage + 2)
              )
              .map((p, i, arr) => {
                // Добавляем многоточие если есть разрывы
                if (i > 0 && p - arr[i - 1] > 1) {
                  return (
                    <React.Fragment key={`gap-${p}`}>
                      <span>...</span>
                      <PageButton
                        active={p === currentPage}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </PageButton>
                    </React.Fragment>
                  );
                }
                return (
                  <PageButton
                    key={p}
                    active={p === currentPage}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PageButton>
                );
              })}
            
            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.PAGINATION.PAGES_COUNT}
            >
              Вперед &raquo;
            </PageButton>
          </Pagination>
        )}
      </Container>
    </>
  );
};

// Функция для получения данных на стороне сервера (SSR)
export async function getServerSideProps(context) {
  const { query } = context;
  const sectionId = query.sectionId || 'root';
  const page = query.page ? parseInt(query.page) : 1;
  
  // Создаем клиент для react-query
  const queryClient = new QueryClient();
  
  // Фильтры по умолчанию
  const defaultFilters = {
    sort: 'default',
    priceRange: 'all',
  };
  
  try {
    // Предзагружаем данные каталога
    const data = await queryClient.fetchQuery(
      ['catalog', sectionId, page, defaultFilters],
      () => catalogApi.getProducts(sectionId, page, defaultFilters)
    );
    
    // Получаем SEO данные из результата
    const seo = data.SEO || {
      TITLE: data.SECTION?.NAME || 'Каталог товаров',
      DESCRIPTION: `Каталог товаров - ${data.SECTION?.NAME || ''}`,
      KEYWORDS: 'каталог, товары, интернет-магазин',
    };
    
    return {
      props: {
        initialData: data,
        sectionId,
        seo,
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    
    // В случае ошибки возвращаем пустые данные
    return {
      props: {
        initialData: null,
        sectionId,
        seo: {
          TITLE: 'Каталог товаров',
          DESCRIPTION: 'Каталог товаров нашего интернет-магазина',
          KEYWORDS: 'каталог, товары, интернет-магазин',
        },
      },
    };
  }
}

export default CatalogPage; 