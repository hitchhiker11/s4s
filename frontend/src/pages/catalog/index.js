import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';

import { catalogApi } from '../../lib/api';
import { loadBitrixCore } from '../../lib/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';

// Стилизованные компоненты
const Container = styled.div`
  max-width: 1392px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 36px;
  line-height: 1em;
  color: #1C1C1C;
  margin-bottom: 40px;
`;

const CategoriesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 23px;
  width: 100%;
  margin-bottom: 40px;
`;

const RecentlyViewedSection = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 4px solid #B6B6B6;
  margin-bottom: 22px;
`;

const SectionTitle = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 30px;
  line-height: 1.16em;
  color: #1C1C1C;
  padding: 15px 0;
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  width: 100%;
  padding: 22px;
`;

const SubscriptionSection = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const SubscriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  max-width: 1254px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const SubscriptionImage = styled.div`
  background: rgba(252, 252, 252, 0.1);
  box-shadow: 4px 4px 0px 0px rgba(182, 182, 182, 1);
`;

const SubscriptionText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 29px;
  line-height: 1.22em;
  color: #1C1C1C;
  text-align: right;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;
  gap: 42px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  font-family: 'Rubik', sans-serif;
  font-weight: 300;
  font-size: 27px;
  line-height: 1.5em;
  letter-spacing: 2%;
  color: rgba(0, 0, 0, 0.3);
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 40px;
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4em;
  text-transform: uppercase;
  color: #1C1C1C;
  background: transparent;
  border: none;
  cursor: pointer;
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
 * Страница каталога по дизайну из Figma
 */
const CatalogPage = ({ initialData, sectionId, seo }) => {
  // Получаем query-параметры из URL
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page);
  
  // Получаем данные каталога с использованием react-query
  const { data, isLoading, error } = useQuery(
    ['catalog', sectionId, currentPage],
    () => catalogApi.getProducts(sectionId, currentPage),
    {
      initialData,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 минут
    }
  );
  
  // Form inputs state
  const [formInputs, setFormInputs] = useState({
    phone: '',
    name: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formInputs);
  };
  
  // Загружаем скрипты Bitrix при монтировании компонента
  React.useEffect(() => {
    loadBitrixCore();
  }, []);
  
  // Если данные загружаются, показываем состояние загрузки
  if (isLoading && !data) {
    return (
      <>
        <Header />
        <Container>
          <LoadingState>Загрузка каталога...</LoadingState>
        </Container>
        <Footer />
      </>
    );
  }
  
  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <>
        <Header />
        <Container>
          <EmptyState>
            Произошла ошибка при загрузке каталога. Пожалуйста, попробуйте позже.
          </EmptyState>
        </Container>
        <Footer />
      </>
    );
  }

  // Определяем хлебные крошки
  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' }
  ];
  
  // Создаём массив категорий для отображения
  const categories = [
    { id: 1, title: 'Тюнинг оружия', imageUrl: '/images/categories/tuning.jpg', link: '/catalog/tuning' },
    { id: 2, title: 'Экипировка', imageUrl: '/images/categories/equipment.jpg', link: '/catalog/equipment' },
    { id: 3, title: 'Обслуживание', imageUrl: '/images/categories/maintenance.jpg', link: '/catalog/maintenance' },
    { id: 4, title: 'Релоадинг', imageUrl: '/images/categories/reloading.jpg', link: '/catalog/reloading' },
    { id: 5, title: 'Прочее', imageUrl: '/images/categories/other.jpg', link: '/catalog/other' },
    { id: 6, title: 'Новинки', imageUrl: '/images/categories/new.svg', link: '/catalog/new' },
    { id: 7, title: 'Хиты продаж', imageUrl: '/images/categories/hits.svg', link: '/catalog/hits' }
  ];
  
  // Предположим, что у нас есть массив недавно просмотренных товаров
  const recentlyViewed = data?.RECENTLY_VIEWED || [];
  
  return (
    <>
      <Head>
        <title>{seo?.TITLE || 'Каталог товаров'}</title>
        <meta name="description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta name="keywords" content={seo?.KEYWORDS || 'каталог, товары, интернет-магазин'} />
        <meta property="og:title" content={seo?.TITLE || 'Каталог товаров'} />
        <meta property="og:description" content={seo?.DESCRIPTION || 'Каталог товаров нашего интернет-магазина'} />
        <meta property="og:type" content="website" />
        {data?.SECTION?.PICTURE_SRC && (
          <meta property="og:image" content={data.SECTION.PICTURE_SRC} />
        )}
      </Head>
      
      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <Container>
        <Title>Каталог Shop4Shoot</Title>
        
        {/* Сетка категорий */}
        <CategoriesGrid>
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              title={category.title} 
              imageUrl={category.imageUrl} 
              link={category.link}
            />
          ))}
        </CategoriesGrid>
        
        {/* Недавно просмотренные товары */}
        {recentlyViewed.length > 0 && (
          <RecentlyViewedSection>
            <SectionHeader>
              <SectionTitle>Недавно просмотренные</SectionTitle>
            </SectionHeader>
            
            <ProductsGrid>
              {recentlyViewed.map(product => (
                <ProductCard key={product.ID} product={product} />
              ))}
            </ProductsGrid>
          </RecentlyViewedSection>
        )}
        
        {/* Секция подписки */}
        <SubscriptionSection>
          <SubscriptionContainer>
            <ContentWrapper>
              <SubscriptionImage>
                {/* Изображение из фигмы */}
                <img src="/images/subscription/subscription-image.jpg" alt="Subscription" />
              </SubscriptionImage>
              
              <div>
                <SubscriptionText>
                  Вступайте в закрытое сообщество,<br />
                  получайте эксклюзивные предложения и новости
                </SubscriptionText>
              </div>
            </ContentWrapper>
            
            <form onSubmit={handleSubmit}>
              <FormContainer>
                <InputGroup>
                  <Input 
                    type="tel" 
                    placeholder="Ваш номер телефона"
                    name="phone"
                    value={formInputs.phone}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                
                <InputGroup>
                  <Input 
                    type="text" 
                    placeholder="Ваше имя"
                    name="name"
                    value={formInputs.name}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                
                <InputGroup>
                  <Input 
                    type="email" 
                    placeholder="Ваша почта"
                    name="email"
                    value={formInputs.email}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                
                <SubmitButton type="submit">
                  подать заявку
                </SubmitButton>
              </FormContainer>
            </form>
          </SubscriptionContainer>
        </SubscriptionSection>
      </Container>
      
      <Footer />
    </>
  );
};

/**
 * Получение данных на сервере для SSR
 */
export async function getServerSideProps(context) {
  const { sectionId = 0 } = context.query;
  const page = context.query.page || 1;
  
  // Инициализируем QueryClient для SSR
  const queryClient = new QueryClient();
  
  try {
    // Предварительно загружаем данные на сервере
    await queryClient.prefetchQuery(['catalog', sectionId, page], () => 
      catalogApi.getProducts(sectionId, page)
    );
    
    // Получаем предварительно загруженные данные
    const dehydratedState = dehydrate(queryClient);
    
    // Получаем SEO-данные из загруженного результата
    const data = queryClient.getQueryData(['catalog', sectionId, page]);
    const seo = data?.SEO || {};
    
    return {
      props: {
        dehydratedState,
        sectionId,
        seo,
      },
    };
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    
    return {
      props: {
        sectionId,
        seo: {},
      },
    };
  }
}

export default CatalogPage; 