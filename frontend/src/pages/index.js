import React from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { getAboutSliderData } from '../lib/api/bitrix';
import { mockCategories, mockNewArrivals, mockBrands, mockBestsellers } from '../lib/mockData';

// Components
import AboutSlider from '../components/AboutSlider';
import SearchBar from '../components/SearchBar';
import ResponsiveCategorySection from '../components/ResponsiveCategorySection'; // Use responsive wrapper
import ResponsiveProductSection from '../components/ResponsiveProductSection'; // Use responsive wrapper
import CategoryCard from '../components/CategoryCard'; // Import card for rendering
import ProductCard from '../components/ProductCard'; // Import card for rendering
import BrandFeature from '../components/BrandFeature'; // Import brand feature component
import ClubSubscription from '../components/ClubSubscription'; // Import club subscription component
import Layout from '../components/Layout'; // Import Layout component

// Styles
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries, SIZES, BREAKPOINTS } from '../styles/tokens';

// Define a hardcoded version of the featured brand data
const hardcodedFeaturedBrandData = {
  id: 'eiger',
  name: 'Eiger',
  featureImage: '/images/brands/eiger_img_8048.jpg',
  logoImage: '/images/brands/eiger_tac_logo.jpg',
  description: `Компания EIGER основана в 1989 году индонезийцем Ронни Лукито и начала свое триумфальное шествие с производства бивачного снаряжения.

Всего через десять лет продукция компании завоевала уверенную нишу в сетях туристических магазинов Вьетнама, Китая, Тайваня, Гон Конга, Южной Кореи, Франции, Германии и США.

Eiger Adventure изначально ориентировалась на восхождения и горный туризм, однако с 2016 обратила свое внимание на хайкинг, треккинг и тропический климат, открыв линейку Tropical.

В 2020 применила свой многолетний опыт для входа на рынок тактического и спортивного снаряжения, создав линейки Eiger TAC и Eiger Practical – тем самым обеспечив потребности местных силовиков и практических стрелков.

Сегодня компания Eiger - это 35 лет экспертизы в проектировании одежды и снаряжения для различных климатических условий.`
};

// Стилизованные компоненты для главной страницы
const HomePageContainer = styled.div`
  width: 100%;
  overflow-x: hidden; // Предотвращение горизонтального скролла
`;

const HeroSection = styled.section`
  width: 100%;
  min-height: 150px;
  background-color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;

  ${mediaQueries.sm} {
    padding: 0 24px;
  }

  ${mediaQueries.md} {
    padding: 0 48px;
  }

  ${mediaQueries.lg} {
    padding: 0 40px;
  }

  ${mediaQueries.xl} {
    padding: 0 40px;
  }

  ${mediaQueries.xxl} {
    padding: 0 40px;
    max-width: 1493px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: var(--container-width, 1493px);
  margin: 0 auto;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${SPACING.md};
`;

const Highlight = styled.span`
  color: ${COLORS.primary};
  font-weight: 800;
  display: inline;
  
  ${mediaQueries.md} {
    display: block;
  }
`;

const HeroTitle = styled.h1`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.22;
  letter-spacing: -5%;
  color: ${COLORS.black};
  margin: 0;
  padding: 0;

  ${mediaQueries.sm} {
    font-size: clamp(60px, 8vw, 107px);
  }
  ${mediaQueries.lg} {
    font-size: clamp(40px, 8vw, 107px);
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(16px, 4vw, 24px);
  color: ${COLORS.gray700};
  margin: ${SPACING.md} 0 ${SPACING.xl};
  max-width: 800px;
  
  ${mediaQueries.md} {
    margin: ${SPACING.lg} 0 ${SPACING.xl};
  }
`;

const AboutSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 0;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  max-height: 434px;
    
  ${mediaQueries.md} {

    max-height: 850px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 700;
  text-align: center;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xl};
`;

// Компонент главной страницы
const HomePage = () => {

  // Placeholder add to cart handler
  const handleAddToCart = (productId) => {
    console.log(`Adding product ${productId} to cart (from HomePage)`);
    // Add actual cart logic here later
  };

  // Define render functions for cards
  const renderCategoryCard = (category) => (
    <CategoryCard 
      key={category.id} 
      {...category} // Spread category props (title, imageUrl, link, showTitle)
    />
  );

  const renderProductCard = (product) => (
    <ProductCard 
      key={product.id} 
      product={product} // Pass the whole product object
      onAddToCart={handleAddToCart} 
    />
  );

  return (
    <Layout mockBasketCount={5}>
      <HomePageContainer>
        <AboutSection>
          {/* <SectionTitle>О нас</SectionTitle> */}
          <AboutSlider />
        </AboutSection>
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              МАГАЗИН, СОЗДАННЫЙ<br />
              СТРЕЛКАМИ ДЛЯ<br />
              СТРЕЛКОВ - <Highlight>SHOP4SHOOT</Highlight>
            </HeroTitle>
          </HeroContent>
        </HeroSection>
        <SearchBar />
        
        {/* Categories Section using Responsive Wrapper */}
        <ResponsiveCategorySection 
          title="Каталог товаров" 
          viewAllLink="/catalog"
          items={mockCategories} // Use 'items' prop name
          renderItem={renderCategoryCard} // Pass the render function
        />

        {/* New Arrivals Section using Responsive Wrapper */}
         <ResponsiveProductSection 
          title="Новые поступления"
          subtitle="посмотрите наши новинки"
          viewAllLink="/catalog?filter=new"
          items={mockNewArrivals} // Use 'items' prop name
          renderItem={renderProductCard} // Pass the render function
          onAddToCart={handleAddToCart} // Still needed for ProductCard via renderItem
        />

        {/* Our Brands Section using Responsive Wrapper */}
        <ResponsiveCategorySection 
          title="Наши бренды"
          subtitle="если хотите пополнить коллекцию"
          viewAllLink="/brands"
          items={mockBrands.map(brand => ({ ...brand, showTitle: false }))} // Use 'items', ensure showTitle handled
          renderItem={renderCategoryCard} // Pass the render function
        />

        
        {/* Bestsellers Section (Top Sales) using Responsive Wrapper */}
        <ResponsiveProductSection 
          title="Хиты продаж 🔥"
          subtitle="посмотрите самые популярные продукты"
          viewAllLink="/catalog?filter=bestsellers"
          items={mockBestsellers} // Use 'items' prop name
          renderItem={renderProductCard} // Pass the render function
          useGradientTitle={true}
          onAddToCart={handleAddToCart} // Still needed for ProductCard via renderItem
        />

        {/* Featured Brand Section */}
        <BrandFeature brandData={hardcodedFeaturedBrandData} />

        {/* Club Subscription Section */}
        <ClubSubscription />
      </HomePageContainer>
    </Layout>
  );
};

// Предварительная загрузка данных на стороне сервера
export async function getServerSideProps() {
  const queryClient = new QueryClient();
  
  try {
    // Предварительная загрузка данных для слайдера
    // В продакшене раскомментировать, в режиме разработки исключить
    // await queryClient.prefetchQuery(['aboutSliderData'], getAboutSliderData);
  } catch (error) {
    console.error('Ошибка предзагрузки данных:', error);
    // В случае ошибки делаем fallback с пустыми данными
  }
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default HomePage; 