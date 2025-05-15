import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';
import { mockCategories, mockNewArrivals, mockBrands, mockBestsellers } from '../../lib/mockData';

import { catalogApi } from '../../lib/api';
import { loadBitrixCore } from '../../lib/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import SubscriptionForm from '../../components/SubscriptionForm';
import ResponsiveProductSection from '../../components/ResponsiveProductSection';
import { SIZES, COLORS, mediaQueries } from '../../styles/tokens';
import productGridStyles from '../../styles/ProductGridResponsive.module.css';

// Стилизованные компоненты
const Container = styled.div`
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 12px; /* Add default padding for smaller screens */
  
  ${mediaQueries.sm} {
    padding: 0 16px;
  }
  
  ${mediaQueries.md} {
    padding: 0 20px;
  }
  
  ${mediaQueries.lg} {
    padding: 0 40px;
  }
`;

const Title = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 1em;
  color: #1C1C1C;
  margin-top: 24px;
  margin-bottom: 24px;
  
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  width: 100%;
  margin-bottom: 24px;
  
  /* Mobile layout with 3 columns and special handling for last items */
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px;
  
  ${mediaQueries.sm} { 
    gap: 16px;
    margin-bottom: 32px;
  }
  
  ${mediaQueries.xl} { 
    /* Simple 4-column grid for desktop with auto-fill */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
    
    /* Remove any special styling from mobile view */
    & > div {
      grid-column: auto !important;
    }
  }
  
  ${mediaQueries.lg} { 
    column-gap: 23px;
    row-gap: 23px;
  }
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
  display: grid;
  gap: 9px;
  width: 100%;
  padding: 12px;
  
  &.${productGridStyles.productGridContainer} {
    
  }
  
  ${mediaQueries.sm} {
    padding: 16px;
  }
  
  ${mediaQueries.md} {
    padding: 22px;
  }
`;

const SubscriptionSection = styled.div`
  width: 100%;
  margin-bottom: 40px;
  margin-top: 70px;

`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  max-width: 1680px;
  margin: 0 auto;
  gap: 35px;
  
  ${mediaQueries.sm} {
    /* Mobile styles based on the screenshot */
    padding: 0 20px;
  }
`;

const ContentWrapper = styled.div`
    /* Mobile styles based on the screenshot */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  
  ${mediaQueries.md} {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    gap: 300px;


  }
`;

const SubscriptionImage = styled.div`
  background: rgba(252, 252, 252, 0.1);
  /* Mobile styles based on the screenshot */
  display: flex;
  justify-content: center;
  max-height: 187px;
  max-width: 118px;

  ${mediaQueries.md} {
    margin-bottom: 10px;
    box-shadow: 4px 4px 0px 0px rgba(182, 182, 182, 1);
    max-height: 187px;
    max-width: 118px;
  }
`;

const SubscriptionText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  /* Mobile styles based on the screenshot */
  font-size: 18px;
  text-align: start;
  margin-bottom: 15px;
  
  ${mediaQueries.md} {
    font-size: 29px;
    line-height: 1.22em;
    color: #1C1C1C;
    text-align: right;
  }
`;


const FormContainer = styled.div`
  flex-direction: column;
  gap: 15px;

  ${mediaQueries.md} {
    flex-direction: row;
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    width: 100%;
    gap: 42px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  
  ${mediaQueries.sm} {
    /* Mobile styles based on the screenshot */
    gap: 10px;
  }
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
  
  ${mediaQueries.sm} {
    /* Mobile styles based on the screenshot */
    font-size: 16px;
    padding: 8px 0;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 40px;
  min-width: 160px;
  border-right: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4em;
  text-transform: uppercase;
  color: #1C1C1C;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    border-right-color: ${COLORS.gray500};
    border-bottom-color: ${COLORS.gray500};
  }

  ${mediaQueries.sm} {
    /* Mobile styles based on the screenshot */
    width: 100%;
    height: 50px;
    font-size: 16px;
    background-color: ${COLORS.transparent};
    color: #1C1C1C; 
    border: none;
    text-transform: uppercase;
    border-radius: 0;
  }

  ${mediaQueries.md} {
  min-width: 270px;
  border-right: 4px solid ${COLORS.gray400};
  border-bottom: 4px solid ${COLORS.gray400};
    &:hover {
      border-right-color: ${COLORS.gray500};
      border-bottom-color: ${COLORS.gray500};
    }
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

const mockRecentlyViewedProducts = [
  // Populate with product data similar to ProductGrid's expected format
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv1',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv2',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv3',
    imageUrl: '/images/new-products/aim3.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv3',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv4',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖE ДЛИННЫМ',
    price: 2100,
    productLink: '/product/rv4',
    CATALOG_AVAILABLE: 'Y'
  },
];

/**
 * Страница брендов по дизайну из Figma
 */
const BrandsPage = ({ seo }) => {
  // Получаем query-параметры из URL
  const router = useRouter();

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
  
  // Определяем хлебные крошки
  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/brands', label: 'Бренды' }
  ];
  
  // Массив брендов для отображения
  const brands = mockBrands;

  // Недавно просмотренные товары
  const recentlyViewed = mockRecentlyViewedProducts;

  // Placeholder add to cart handler
  const handleAddToCartRecentlyViewed = (productId) => {
    console.log(`Adding product ${productId} to cart (from HomePage)`);
    // Add actual cart logic here later
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product} // Pass the whole product object
      onAddToCart={handleAddToCartRecentlyViewed} 
    />
  );

  return (
    <>
      <Head>
        <title>{seo?.TITLE || 'Бренды Shop4Shoot'}</title>
        <meta name="description" content={seo?.DESCRIPTION || 'Бренды, представленные в нашем интернет-магазине'} />
        <meta name="keywords" content={seo?.KEYWORDS || 'бренды, shop4shoot, производители'} />
        <meta property="og:title" content={seo?.TITLE || 'Бренды Shop4Shoot'} />
        <meta property="og:description" content={seo?.DESCRIPTION || 'Бренды, представленные в нашем интернет-магазине'} />
        <meta property="og:type" content="website" />
      </Head>
      
      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <Container>
        <Title>Бренды Shop4Shoot</Title>
        
        {/* Сетка брендов - всегда максимум 4 колонки */}
        <CategoriesGrid>
          {brands.map(brand => (
            <CategoryCard 
              key={brand.id}
              imageUrl={brand.imageUrl} 
              link={brand.link}
              disableRotation={true}
            />
          ))}
        </CategoriesGrid>
        
        {/* Недавно просмотренные товары */}
        {/* {recentlyViewed.length > 0 && (
          <RecentlyViewedSection>
            <SectionHeader>
              <SectionTitle>Недавно просмотренные</SectionTitle>
            </SectionHeader>
            
            <ProductsGrid className={productGridStyles.productGridContainer}>
              {recentlyViewed.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductsGrid>
          </RecentlyViewedSection>
        )} */}
        
        <ResponsiveProductSection 
          title="Недавно просмотренные"
          subtitle=""
          viewAllLink="/catalog?filter=new"
          showViewAllLink={false}
          items={mockRecentlyViewedProducts} // Use 'items' prop name
          gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;" // Styles for the outer section
        />

        <SubscriptionForm />
          {/* Секция подписки */}
          {/* <SubscriptionSection>
          <SubscriptionContainer>
            <ContentWrapper>
              <SubscriptionImage>

                <img src="/images/footer/culture_logo.jpg" alt="Subscription" style={{filter: 'invert(1)', padding: '22px'}}/>
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
        </SubscriptionSection> */}
      </Container>
      
      <Footer />
    </>
  );
};

/**
 * Получение данных на сервере для SSR
 */
export async function getServerSideProps(context) {
  // Для страницы брендов нет необходимости в загрузке каталога, только SEO
  // Можно добавить SEO-данные здесь, если нужно
  return {
    props: {
      seo: {},
    },
  };
}

export default BrandsPage; 