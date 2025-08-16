import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';
import { getBrands } from '../../lib/api/bitrix';
import { transformBrands } from '../../lib/api/transformers';


import { loadBitrixCore } from '../../lib/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import SubscriptionForm from '../../components/SubscriptionForm';
import dynamic from 'next/dynamic';
const ResponsiveProductSection = dynamic(() => import('../../components/ResponsiveProductSection'), { ssr: false });
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
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
  border-bottom: 2px solid ${COLORS.gray400};
  ${mediaQueries.lg} { border-bottom-width: 4px; }
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
    border: 2px solid ${COLORS.gray400};
    text-transform: uppercase;
    border-radius: 0;
  }

  ${mediaQueries.lg} {
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

// Mock data removed - now using real recently viewed data from useRecentlyViewed hook

/**
 * Страница брендов по дизайну из Figma
 */
const BrandsPage = ({ seo, initialBrands }) => {
  // Получаем query-параметры из URL
  const router = useRouter();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const BRANDS_PER_PAGE = 12;

  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();

  // First, try to get brands with pagination
  const { data: brandsData, isLoading: brandsLoading, isError: brandsIsError } = useQuery(
    ['allBrands', currentPage],
    () => {
      // console.log('🏷️ [BrandsPage] Fetching brands for page:', currentPage, 'with limit:', BRANDS_PER_PAGE);
      return getBrands({ 
        limit: BRANDS_PER_PAGE,
        page: currentPage,
        with_products_count: 'Y',
        image_resize: '150x150',
        with_products: 'Y'
      });
    },
    {
      initialData: (currentPage === 1 && initialBrands) ? { data: initialBrands } : undefined,
      keepPreviousData: true, // Keep previous data while loading new page
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        // console.log('🏷️ [BrandsPage] Brands data received for page', currentPage, ':', data);
      },
      onError: (error) => {
        // console.error('🏷️ [BrandsPage] Error fetching brands for page', currentPage, ':', error);
      }
    }
  );

  // Fallback: if pagination doesn't work, get all brands for client-side pagination
  const { data: allBrandsData } = useQuery(
    ['allBrands', 'all'],
    () => {
      // console.log('🏷️ [BrandsPage] Fetching ALL brands for client-side pagination');
      return getBrands({ 
        limit: 200, // Get many brands
        with_products_count: 'Y',
        image_resize: '150x150',
        with_products: 'Y'
      });
    },
    {
      enabled: brandsData && !brandsData.meta?.total_pages, // Only if main query doesn't support pagination
      staleTime: 10 * 60 * 1000, // 10 minutes
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
    // console.log('Form submitted:', formInputs);
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
  
  // Prepare brands for display using real API data
  const { brands, isClientPagination } = React.useMemo(() => {
    let dataToUse = [];
    
    // Use allBrandsData for client pagination if available
    if (allBrandsData?.data && (!brandsData?.meta?.total_pages)) {
      dataToUse = allBrandsData.data;
      // console.log('🏷️ [BrandsPage] Using allBrandsData for client pagination');
    } else if (!brandsIsError && brandsData?.data) {
      dataToUse = brandsData.data;
    } else if (Array.isArray(initialBrands) && initialBrands.length > 0) {
      dataToUse = initialBrands;
    }
    
    const transformedBrands = transformBrands(Array.isArray(dataToUse) ? dataToUse : []);
    
    // console.log('🏷️ [BrandsPage] Raw dataToUse:', dataToUse);
    // console.log('🏷️ [BrandsPage] Transformed brands count:', transformedBrands.length);
    // console.log('🏷️ [BrandsPage] Current page:', currentPage);
    
    const brandsWithStyles = transformedBrands.map(brand => ({
      ...brand,
      disableRotation: true,
      rotation: 0 // Убираем случайный поворот
    }));
    
    // Check if we need client-side pagination (if API doesn't provide meta or always returns all brands)
    const hasServerPagination = brandsData?.meta?.total_pages && brandsData.meta.total_pages > 1;
    const needsClientPagination = !hasServerPagination && brandsWithStyles.length > BRANDS_PER_PAGE;
    
    if (needsClientPagination) {
      // console.log('🏷️ [BrandsPage] Using client-side pagination');
      const startIndex = (currentPage - 1) * BRANDS_PER_PAGE;
      const endIndex = startIndex + BRANDS_PER_PAGE;
      return {
        brands: brandsWithStyles.slice(startIndex, endIndex),
        isClientPagination: true
      };
    }
    
    return {
      brands: brandsWithStyles,
      isClientPagination: false
    };
  }, [brandsData, allBrandsData, brandsIsError, initialBrands, currentPage, BRANDS_PER_PAGE]);

  // Pagination logic (after brands is defined)
  const totalPages = React.useMemo(() => {
    if (isClientPagination) {
      // For client pagination, calculate based on all transformed brands
      const dataForCount = allBrandsData?.data || brandsData?.data;
      const allBrandsCount = dataForCount ? transformBrands(dataForCount).length : 0;
      return Math.ceil(allBrandsCount / BRANDS_PER_PAGE) || 1;
    }
    return brandsData?.meta?.total_pages || Math.ceil((brands.length || 0) / BRANDS_PER_PAGE) || 1;
  }, [brandsData, allBrandsData, brands.length, isClientPagination, BRANDS_PER_PAGE]);
  
  const totalBrands = React.useMemo(() => {
    if (isClientPagination) {
      // For client pagination, count all transformed brands
      const dataForCount = allBrandsData?.data || brandsData?.data;
      return dataForCount ? transformBrands(dataForCount).length : 0;
    }
    return brandsData?.meta?.total_count || brands.length || 0;
  }, [brandsData, allBrandsData, brands.length, isClientPagination]);
  
  // Debug pagination
  // console.log('🏷️ [BrandsPage] Pagination debug:', {
    currentPage,
    totalPages,
    totalBrands,
    brandsLength: brands.length,
    isClientPagination,
    meta: brandsData?.meta
  });

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage }
    });
  };

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
        {brandsLoading ? (
          <CategoriesGrid>
            {/* Loading skeleton */}
            {Array.from({ length: 8 }, (_, index) => (
              <CategoryCard 
                key={`loading-${index}`}
                imageUrl="/images/placeholder.png"
                link="#"
                disableRotation={true}
                 showTitle={false}
                 enableEdgeImagePositioning={false}
                style={{ opacity: 0.6 }}
              />
            ))}
          </CategoriesGrid>
        ) : brandsIsError ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>Ошибка загрузки брендов. Показаны тестовые данные.</p>
          </div>
        ) : null}
        
        <CategoriesGrid>
          {brands.map(brand => (
            <CategoryCard 
              key={brand.id}
              imageUrl={brand.imageUrl} 
              link={brand.link}
              disableRotation={brand.disableRotation}
              rotation={brand.rotation}
                showTitle={false}
                enableEdgeImagePositioning={false}
            />
          ))}
        </CategoriesGrid>

        {/* Pagination */}
        {(totalPages > 1 || totalBrands > BRANDS_PER_PAGE) && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(totalPages, Math.ceil(totalBrands / BRANDS_PER_PAGE))}
            totalItems={totalBrands}
            onPageChange={handlePageChange}
          />
        )}
        
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
        
        {hasRecentlyViewed && (
          <ResponsiveProductSection 
            suppressHydrationWarning={true}
            title="Недавно просмотренные"
            subtitle=""
            viewAllLink="/catalog?filter=new"
            showViewAllLink={false}
            items={recentlyViewed}
            useSliderOnDesktop={true} // Use slider instead of grid on desktop
            showNavigationOnDesktop={true} // Show navigation arrows on hover
            alwaysSlider={true} // Always use slider regardless of screen width
            gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
          />
        )}

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
  const { page = 1 } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const BRANDS_PER_PAGE = 12;
  
  const queryClient = new QueryClient();
  
  try {
    // Prefetch brands data for SSR using new API with pagination
    await queryClient.prefetchQuery(['allBrands', currentPage], () => {
      // console.log('[SSR] Prefetching brands for brands page with new API, page:', currentPage);
      return getBrands({ 
        limit: BRANDS_PER_PAGE,
        page: currentPage,
        with_products_count: 'Y',
        image_resize: '150x150',
        with_products: 'Y'
      });
    });
    
    const brandsResult = queryClient.getQueryData(['allBrands', currentPage]);
    // console.log('[SSR] Brands prefetched for brands page. Result:', brandsResult ? 'Success' : 'Failed');
    
    const initialBrandsVal = (brandsResult && !brandsResult.error && brandsResult.data) ? brandsResult.data : [];
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        seo: {
          TITLE: 'Бренды Shop4Shoot - Ведущие производители',
          DESCRIPTION: 'Широкий выбор брендов в нашем интернет-магазине. Качественная продукция от проверенных производителей.',
          KEYWORDS: 'бренды, производители, shop4shoot, качество, оригинал'
        },
        initialBrands: initialBrandsVal,
      },
    };
  } catch (error) {
    // console.error('[SSR] Error prefetching brands:', error);
    
    return {
      props: {
        seo: {
          TITLE: 'Бренды Shop4Shoot',
          DESCRIPTION: 'Бренды, представленные в нашем интернет-магазине',
          KEYWORDS: 'бренды, shop4shoot, производители'
        },
        initialBrands: [],
      },
    };
  }
}

export default BrandsPage; 