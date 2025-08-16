import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getCatalogSections, getBrands, getCatalogItems, getAboutSliderData, getBasket } from '../lib/api/bitrix';
import { transformSections, transformBrands, transformCatalogItems } from '../lib/api/transformers';

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
import { useBasket } from '../hooks/useBasket'; // Import useBasket hook

// Styles
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries, SIZES, BREAKPOINTS } from '../styles/tokens';

// Define a hardcoded version of the featured brand data
const hardcodedFeaturedBrandData = {
  id: 'eiger',
  name: 'Eiger',
  featureImage: '/images/brands/eiger_img_8048.jpg',
  logoImage: '/images/brands/eiger_tac_logo.jpg',
  description: "Компания EIGER основана в 1989 году индонезийцем Ронни Лукито и начала свое триумфальное шествие с производства бивачного снаряжения.\n\nВсего через десять лет продукция компании завоевала уверенную нишу в сетях туристических магазинов Вьетнама, Китая, Тайваня, Гонконга, Южной Кореи, Франции, Германии и США.\n\nEiger Adventure изначально ориентировалась на восхождения и горный туризм, однако с 2016 обратила свое внимание на хайкинг, треккинг и тропический климат, открыв линейку Tropical.\n\nВ 2020 применила свой многолетний опыт для входа на рынок тактического и спортивного снаряжения, создав линейки Eiger TAC и Eiger Practical – тем самым обеспечив потребности местных силовиков и практических стрелков.\n\nСегодня компания Eiger - это 35 лет экспертизы в проектировании одежды и снаряжения для различных климатических условий."
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
    padding: 0px;
  }

  ${mediaQueries.md} {
    padding: 0px;
  }

  ${mediaQueries.lg} {
    padding: 0px;
  }

  ${mediaQueries.xl} {
    padding: 0px;
  }

  ${mediaQueries.xxl} {
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: var(--container-width, 1920px);
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
  padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};

  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.lg} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.lg} ${SPACING['2xl']};
  }

  ${mediaQueries.lg} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
  ${mediaQueries.xl} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
  ${mediaQueries.xxxl} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} 0;
  }

  /* Restore padding between 1920px and 2000px */
  @media (min-width: 1920px) and (max-width: 2000px) {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }

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
const HomePage = ({ initialCategories, initialNewArrivals, initialBrands, initialBestsellers }) => {
  // Initialize basket data when the page loads
  const { refetchBasket, basketCount, isFuserIdInitialized } = useBasket({
    initialFetch: true,
    autoInitialize: true,
    staleTime: 60000 // 1 minute
  });
  
  const catalogIblockId = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
  
  // Fetch basket data on component mount, but only after fuser_id is initialized
  useEffect(() => {
    if (isFuserIdInitialized) {
      console.log('fuser_id initialized, fetching basket data on homepage load');
      refetchBasket();
    }
  }, [refetchBasket, isFuserIdInitialized]);

  // Use data from SSR via hydration, fallback to mock data if needed
  const { data: categoriesData, isError: categoriesIsError } = useQuery('homeCategories', 
    () => getCatalogSections({ iblock_id: catalogIblockId, tree_mode: 'flat', depth: 3  }),
    {
      initialData: initialCategories && initialCategories.length > 0 ? { data: initialCategories } : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  ); 
  const { data: newArrivalsData, isError: newArrivalsIsError } = useQuery('homeNewArrivals', 
    () => getCatalogItems({ 
      iblock_id: catalogIblockId, 
      limit: 8, 
      sort: 'date_create:desc',
      active: 'Y',
      in_stock: 'Y',
      has_price: 'Y'
    }),
    {
      initialData: initialNewArrivals && initialNewArrivals.length > 0 ? { data: initialNewArrivals } : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  const { data: brandsData, isError: brandsIsError } = useQuery('homeBrands', 
    () => getBrands({ with_products_count: 'Y', limit: 8, image_resize: '150x150', with_products: 'Y' }),
    {
      initialData: initialBrands && initialBrands.length > 0 ? { data: initialBrands } : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  const { data: bestsellersData, isError: bestsellersIsError } = useQuery('homeBestsellers', 
    () => getCatalogItems({ iblock_id: catalogIblockId, 'property[BESTSELLER]': 'Y', limit: 8, sort: 'sort:asc' }),
    {
      initialData: initialBestsellers && initialBestsellers.length > 0 ? { data: initialBestsellers } : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const displayCategories = useMemo(() => {
    let dataToUse = [];
    if (!categoriesIsError && categoriesData?.data) {
      dataToUse = categoriesData.data;
    } else if (Array.isArray(initialCategories) && initialCategories.length > 0) {
      dataToUse = initialCategories;
    }
    
    // Transform sections from API format
    const allSections = transformSections(Array.isArray(dataToUse) ? dataToUse : []);
    
    // Find the ID of "Каталог сайта" section
    const catalogSectionId = allSections.find(section => 
      section.raw?.fields?.CODE === "katalog_sayta" || section.raw?.fields?.NAME === "Каталог сайта"
    )?.id || "572"; // Default to "572" if not found
    
    console.log('Found "Каталог сайта" with ID:', catalogSectionId);
    
    // Filter sections that are direct children of "Каталог сайта" (level 2 categories)
    const mainCategories = allSections.filter(section => {
      if (section.raw && section.raw.fields) {
        // Include only sections with IBLOCK_SECTION_ID equal to catalogSectionId (direct children)
        return section.raw.fields.IBLOCK_SECTION_ID === catalogSectionId;
      }
      return false;
    });
    
    console.log('Found main categories count:', mainCategories.length);
    
    // Map to match expected props for ResponsiveCategorySection
    const mappedCategories = mainCategories.map(section => {
      // Используем CODE для URL вместо ID, если доступен
      const categoryCode = section.raw?.fields?.CODE || section.id;
      
      return {
        ...section,
        title: section.name, // Add 'title' field from 'name'
        imageUrl: section.image, // Ensure imageUrl is set from image
        link: `/catalog/${categoryCode}`, // Use code instead of ID for better SEO
      };
    });
    
    console.log('Main categories for display:', mappedCategories);
    
    return mappedCategories.length > 0 ? mappedCategories : mockCategories;
  }, [categoriesData, categoriesIsError, initialCategories]);

  const displayNewArrivals = useMemo(() => {
    let dataToUse = [];
    if (!newArrivalsIsError && newArrivalsData?.data) {
      dataToUse = newArrivalsData.data;
    } else if (Array.isArray(initialNewArrivals) && initialNewArrivals.length > 0) {
      dataToUse = initialNewArrivals;
    }
    
    // Transform products from API format
    const transformedProducts = transformCatalogItems(Array.isArray(dataToUse) ? dataToUse : []);
    
    // Map to match expected props for ProductGrid
    const mappedProducts = transformedProducts.map(product => ({
      ...product,
      imageUrl: product.image, // Ensure imageUrl is set from image
      productLink: product.detailUrl, // Ensure productLink is set from detailUrl
      CATALOG_AVAILABLE: product.inStock ? 'Y' : 'N', // Add required CATALOG_AVAILABLE field
    }));
    
    console.log('New arrivals for display:', mappedProducts);
    
    return mappedProducts;
  }, [newArrivalsData, newArrivalsIsError, initialNewArrivals]);

  const displayBrands = useMemo(() => {
    let dataToUse = [];
    if (!brandsIsError && brandsData?.data) {
      dataToUse = brandsData.data;
    } else if (Array.isArray(initialBrands) && initialBrands.length > 0) {
      dataToUse = initialBrands;
    }
    
    // Transform brands using updated transformer for new API
    const transformedBrands = transformBrands(Array.isArray(dataToUse) ? dataToUse : []);
    
    console.log('🏷️ [HomePage] Brands for display:', transformedBrands);
    
    // No more fallback to mockBrands - using real API data only
    return transformedBrands.map(brand => ({
      ...brand,
      showTitle: false,
      disableRotation: true,
      rotation: 0 // Убираем случайный поворот на главной
    }));
  }, [brandsData, brandsIsError, initialBrands]);

  const displayBestsellers = useMemo(() => {
    let dataToUse = [];
    if (!bestsellersIsError && bestsellersData?.data) {
      dataToUse = bestsellersData.data;
    } else if (Array.isArray(initialBestsellers) && initialBestsellers.length > 0) {
      dataToUse = initialBestsellers;
    }
    
    // Transform products from API format
    const transformedProducts = transformCatalogItems(Array.isArray(dataToUse) ? dataToUse : []);
    
    // Map to match expected props for ProductGrid
    const mappedProducts = transformedProducts.map(product => ({
      ...product,
      imageUrl: product.image, // Ensure imageUrl is set from image
      productLink: product.detailUrl, // Ensure productLink is set from detailUrl
      CATALOG_AVAILABLE: product.inStock ? 'Y' : 'N', // Add required CATALOG_AVAILABLE field
    }));
    
    console.log('Bestsellers for display:', mappedProducts);
    
    return mappedProducts;
  }, [bestsellersData, bestsellersIsError, initialBestsellers]);

  // Updated add to cart handler with stock check
  const handleAddToCart = (productId) => {
    console.log(`Adding product ${productId} to cart from HomePage - ProductCard will handle stock check`);
    // Note: Stock check is now handled directly in ProductCard component via addToBasketWithStockCheck
    // This function is kept for backwards compatibility but actual logic is in ProductCard
  };

  // Define render functions for cards
  const renderCategoryCard = (category, cardStyle) => {
    const isBrandAuto = category?.showTitle === false;
    const edgeEnabled = (category?.enableEdgeImagePositioning !== undefined)
      ? category.enableEdgeImagePositioning
      : !isBrandAuto; // enable for product categories only
    const disableRotationValue = (category?.disableRotation !== undefined)
      ? category.disableRotation
      : isBrandAuto;

    return (
      <CategoryCard 
        key={category.id} 
        title={category.title || category.name}
        imageUrl={category.imageUrl || category.image}
        link={category.link || category.url}
        showTitle={category.showTitle !== undefined ? category.showTitle : true}
        rotation={category.rotation || 0}
        disableRotation={disableRotationValue}
        enableEdgeImagePositioning={edgeEnabled}
        additionalStyles={cardStyle}
      />
    );
  };

  const renderProductCard = (product, cardStyle) => (
    <ProductCard 
      key={product.id} 
      product={{
        ...product,
        imageUrl: product.imageUrl || product.image, // Ensure imageUrl exists
        productLink: product.productLink || product.detailUrl, // Ensure productLink exists
        CATALOG_AVAILABLE: product.CATALOG_AVAILABLE || (product.inStock ? 'Y' : 'N'), // Ensure CATALOG_AVAILABLE exists
      }}
      // Remove onAddToCart to let ProductCard handle it with toasts
      // onAddToCart={handleAddToCart}
      additionalStyles={cardStyle} // Pass cardStyle as additionalStyles
    />
  );

  return (
    <Layout mockBasketCount={basketCount || 0} showDashedBorderFooter={false}>
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
          items={displayCategories.map(category => ({...category, disableRotation: true}))} // Disable rotation
          renderItem={renderCategoryCard} // Pass the render function
          useSliderOnDesktop={true} // Use slider instead of grid on desktop
          showNavigationOnDesktop={true} // Show navigation arrows on hover
          edgeImagePositioningMode="enabled"
          sectionStyle={`              overflow: hidden;
          `}
          cardStyle={{ 
            overflow: 'hidden',
          }}
        />
        {/* New Arrivals Section using Responsive Wrapper */}
        <ResponsiveProductSection 
          title="Новые поступления"
          subtitle="посмотрите наши новинки"
          viewAllLink="/catalog?filter=new"
          items={displayNewArrivals} // Use 'items' prop name
          renderItem={renderProductCard} // Pass the render function
          useSliderOnDesktop={true} // Use slider instead of grid on desktop
          showNavigationOnDesktop={true} // Show navigation arrows on hover
          alwaysSlider={true} // Always use slider regardless of screen width
          // Remove onAddToCart to let ProductCard handle it with toasts
          // onAddToCart={handleAddToCart} // Still needed for ProductCard via renderItem
        />
        {/* Our Brands Section using Responsive Wrapper with Slider on Desktop */}
        <ResponsiveCategorySection 
          title="Наши бренды"
          subtitle="если хотите пополнить коллекцию"
          viewAllLink="/brands"
          items={displayBrands} // showTitle and disableRotation already applied in useMemo
          renderItem={renderCategoryCard} // Pass the render function
          useSliderOnDesktop={true} // Use slider instead of grid on desktop
          showNavigationOnDesktop={true} // Show navigation arrows on hover
          alwaysSlider={true} // Always use slider for brands regardless of screen width
          // cardStyle={{ maxWidth: '280px' }}
          edgeImagePositioningMode="disabled"
        />
        
        {/* Bestsellers Section (Top Sales) using Responsive Wrapper */}
        <ResponsiveProductSection 
          title="Хиты продаж 🔥"
          subtitle="посмотрите самые популярные продукты"
          viewAllLink="/catalog?filter=bestsellers"
          items={displayBestsellers} // Use 'items' prop name
          renderItem={renderProductCard} // Pass the render function
          useGradientTitle={true}
          useSliderOnDesktop={true} // Use slider instead of grid on desktop
          showNavigationOnDesktop={true} // Show navigation arrows on hover
          alwaysSlider={true} // Always use slider regardless of screen width
          // Remove onAddToCart to let ProductCard handle it with toasts
          // onAddToCart={handleAddToCart} // Still needed for ProductCard via renderItem
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
  
  const catalogIblockId = process.env.NEXT_PUBLIC_CATALOG_IBLOCK_ID || '21';
  const brandsIblockId = process.env.NEXT_PUBLIC_BRANDS_IBLOCK_ID || '21';
  const sliderIblockId = process.env.NEXT_PUBLIC_SLIDER_IBLOCK_ID || '27';

  console.log('[SSR] Initializing getServerSideProps...');
  console.log(`[SSR] Using catalogIblockId: ${catalogIblockId}, brandsIblockId: ${brandsIblockId}, sliderIblockId: ${sliderIblockId}`);

  try {
    console.log('[SSR] Prefetching homeCategories...');
    await queryClient.prefetchQuery('homeCategories', () => {
      console.log('[SSR] Executing getCatalogSections query function with simplified params');
      return getCatalogSections({ iblock_id: catalogIblockId, tree_mode: 'flat', depth: 3 });
    });
    const categoriesResult = queryClient.getQueryData('homeCategories');
    console.log('[SSR] homeCategories prefetched. Result:', JSON.stringify(categoriesResult, null, 2));

    console.log('[SSR] Prefetching homeNewArrivals...');
    await queryClient.prefetchQuery('homeNewArrivals', () => {
      console.log('[SSR] Executing getCatalogItems (New Arrivals) query function');
      return getCatalogItems({ 
        iblock_id: catalogIblockId, 
        limit: 8, 
        sort: 'date_create:desc',
        active: 'Y',
        in_stock: 'Y',
        has_price: 'Y'
      });
    });
    const newArrivalsResult = queryClient.getQueryData('homeNewArrivals');
    console.log('[SSR] homeNewArrivals prefetched. Result:', JSON.stringify(newArrivalsResult, null, 2));

    console.log('[SSR] Prefetching homeBrands...');
    await queryClient.prefetchQuery('homeBrands', () => {
      console.log('[SSR] Executing getBrands query function with new API');
      return getBrands({ 
        with_products_count: 'Y', 
        limit: 8,
        image_resize: '150x150',
        with_products: 'Y'
      });
    });
    const brandsResult = queryClient.getQueryData('homeBrands');
    console.log('[SSR] homeBrands prefetched. Result:', JSON.stringify(brandsResult, null, 2));
    
    console.log('[SSR] Prefetching homeBestsellers...');
    await queryClient.prefetchQuery('homeBestsellers', () => {
      console.log('[SSR] Executing getCatalogItems (Bestsellers) query function');
      return getCatalogItems({ iblock_id: catalogIblockId, 'property[BESTSELLER]': 'Y', limit: 8, sort: 'sort:asc' });
    });
    const bestsellersResult = queryClient.getQueryData('homeBestsellers');
    console.log('[SSR] homeBestsellers prefetched. Result:', JSON.stringify(bestsellersResult, null, 2));

    console.log('[SSR] Prefetching aboutSliderData...');
    await queryClient.prefetchQuery(['aboutSliderData'], () => {
      console.log('[SSR] Executing getAboutSliderData query function');
      return getAboutSliderData({ iblock_id: sliderIblockId });
    });
    const sliderDataResult = queryClient.getQueryData(['aboutSliderData']);
    console.log('[SSR] aboutSliderData prefetched. Result:', JSON.stringify(sliderDataResult, null, 2));
    
    // Prefetch basket data on server side
    console.log('[SSR] Prefetching basket data...');
    await queryClient.prefetchQuery(['basket', 'full'], () => {
      console.log('[SSR] Executing getBasket query function');
      return getBasket();
    });
    const basketResult = queryClient.getQueryData(['basket', 'full']);
    console.log('[SSR] basket data prefetched. Result:', JSON.stringify(basketResult, null, 2));
    
    const initialCategoriesVal = (categoriesResult && !categoriesResult.error && categoriesResult.data) ? categoriesResult.data : [];
    const initialNewArrivalsVal = (newArrivalsResult && !newArrivalsResult.error && newArrivalsResult.data) ? newArrivalsResult.data : [];
    const initialBrandsVal = (brandsResult && !brandsResult.error && brandsResult.data) ? brandsResult.data : [];
    const initialBestsellersVal = (bestsellersResult && !bestsellersResult.error && bestsellersResult.data) ? bestsellersResult.data : [];

    console.log('[SSR] initialCategories to be passed as props:', JSON.stringify(initialCategoriesVal, null, 2));
    console.log('[SSR] initialBrands to be passed as props:', JSON.stringify(initialBrandsVal, null, 2));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialCategories: initialCategoriesVal,
        initialNewArrivals: initialNewArrivalsVal,
        initialBrands: initialBrandsVal,
        initialBestsellers: initialBestsellersVal,
      },
    };
  } catch (error) {
    console.error('[SSR] Error prefetching homepage data:', error);
    // Fallback to empty arrays for initial props in case of a major error during prefetch setup
    return {
      props: {
        dehydratedState: dehydrate(queryClient), // Still pass dehydrated state, may contain partial/error states
        initialCategories: [],
        initialNewArrivals: [],
        initialBrands: [],
        initialBestsellers: []
      },
    };
  }
}

export default HomePage; 
