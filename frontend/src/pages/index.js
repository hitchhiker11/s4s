import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getCatalogSections, getBrands, getCatalogItems, getAboutSliderData, getBasket } from '../lib/api/bitrix';
import { transformSections, transformBrands, transformCatalogItems } from '../lib/api/transformers';
// Import mock data for fallback
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
  padding: 0;

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
  const { refetchBasket, basketCount, addToBasket } = useBasket();
  
  // Fetch basket data on component mount
  useEffect(() => {
    console.log('Fetching basket data on homepage load');
    refetchBasket();
  }, [refetchBasket]);

  // Use data from SSR via hydration, fallback to mock data if needed
  const { data: categoriesData, isError: categoriesIsError } = useQuery('homeCategories', 
    () => getCatalogSections({ tree_mode: 'flat', depth: 3  })
    // Removed initialData, rely on hydration
  ); 
  const { data: newArrivalsData, isError: newArrivalsIsError } = useQuery('homeNewArrivals', 
    () => getCatalogItems({ 'property[ISNEW]': 'Y', limit: 10, sort: 'date_create:asc' })
    // Removed initialData
  );
  const { data: brandsData, isError: brandsIsError } = useQuery('homeBrands', 
    () => getBrands({ with_product_count: 'Y', limit: 8 })
    // Removed initialData
  );
  const { data: bestsellersData, isError: bestsellersIsError } = useQuery('homeBestsellers', 
    () => getCatalogItems({ 'property[BESTSELLER]': 'Y', limit: 5, sort: 'sort:asc' })
    // Removed initialData
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
      CATALOG_QUANTITY: product.quantity ? String(product.quantity) : "0", // Add CATALOG_QUANTITY field
      CODE: product.code // Add CODE field
    }));
    
    console.log('New arrivals for display:', mappedProducts);
    
    return mappedProducts.length > 0 ? mappedProducts : mockNewArrivals;
  }, [newArrivalsData, newArrivalsIsError, initialNewArrivals]);

  const displayBrands = useMemo(() => {
    let dataToUse = [];
    if (!brandsIsError && brandsData?.data) {
      dataToUse = brandsData.data;
    } else if (Array.isArray(initialBrands) && initialBrands.length > 0) {
      dataToUse = initialBrands;
    }
    
    // Transform brands and add required fields for ResponsiveCategorySection
    const transformedBrands = transformBrands(Array.isArray(dataToUse) ? dataToUse : []);
    
    // Map to match expected props for ResponsiveCategorySection
    const mappedBrands = transformedBrands.map(brand => ({
      ...brand,
      title: brand.name, // Add 'title' field from 'name'
      imageUrl: brand.image, // Ensure imageUrl is set from image
      link: brand.url, // Ensure link is set from url
    }));
    
    console.log('Brands for display:', mappedBrands);
    
    return mappedBrands.length > 0 ? mappedBrands : mockBrands;
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
      CATALOG_QUANTITY: product.quantity ? String(product.quantity) : "0", // Add CATALOG_QUANTITY field
      CODE: product.code // Add CODE field
    }));
    
    console.log('Bestsellers for display:', mappedProducts);
    
    return mappedProducts.length > 0 ? mappedProducts : mockBestsellers;
  }, [bestsellersData, bestsellersIsError, initialBestsellers]);

  // Update the handleAddToCart function to use addToBasket
  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10); // Convert ID to number
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
      console.log('Product added to cart:', productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Define render functions for cards
  const renderCategoryCard = (category, cardStyle) => (
    <CategoryCard 
      key={category.id} 
      title={category.title || category.name} // Use title or fallback to name
      imageUrl={category.imageUrl || category.image} // Use imageUrl or fallback to image
      link={category.link || category.url} // Use link or fallback to url
      showTitle={category.showTitle !== undefined ? category.showTitle : true}
      rotation={category.rotation || 0}
      disableRotation={category.disableRotation || false}
      additionalStyles={cardStyle} // Pass cardStyle as additionalStyles
    />
  );

  const renderProductCard = (product, cardStyle) => (
    <ProductCard 
      key={product.id} 
      product={{
        ...product,
        imageUrl: product.imageUrl || product.image, // Ensure imageUrl exists
        productLink: product.productLink || product.detailUrl, // Ensure productLink exists
        CATALOG_AVAILABLE: product.CATALOG_AVAILABLE || (product.inStock ? 'Y' : 'N'), // Ensure CATALOG_AVAILABLE exists
      }}
      onAddToCart={handleAddToCart}
      additionalStyles={cardStyle} // Pass cardStyle as additionalStyles
    />
  );

  return (
    <Layout mockBasketCount={basketCount || 0}>
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
        <div style={{ padding: `0 0 0 ${SPACING.md}` }}>
          <ResponsiveCategorySection 
            title="Каталог товаров" 
            viewAllLink="/catalog"
            items={displayCategories.map(category => ({...category, disableRotation: true}))} // Disable rotation
            renderItem={renderCategoryCard} // Pass the render function
            containerStyle={`
              /* Styling for image positioning */
              & > a [class^="CategoryCard__CardImageContainer"] {
                justify-content: flex-end !important;  /* Align to right */
                align-items: flex-end !important;  /* Align to bottom */
                overflow: hidden;  /* Ensure overflow is hidden */
              }

              & > a [class^="CategoryCard__CardImage"]:not([src$=".svg"]) {
                max-width: 130% !important;  /* Make images larger to allow partial overflow */
                max-height: 130% !important;
                transform: translateX(17%) translateY(20%) !important;  
                object-fit: contain !important;
                object-position: bottom right !important;
              }

              & > a [class^="CategoryCard__CardImage"][src$=".svg"] {
                max-width: 130% !important;
                max-height: 130% !important;
                transform: translateX(-45%) translateY(-20%) !important;  
                object-fit: contain !important;
                object-position: top left !important;
              }

              @media (max-width: ${BREAKPOINTS.lg - 1}px) {
                & > a [class^="CategoryCard__CardImage"]:not([src$=".svg"]) {
                  max-width: 120% !important;
                  transform: translateX(-10%) translateY(10%) !important;
                }
                
                & > a [class^="CategoryCard__CardImage"][src$=".svg"] {
                  max-width: 120% !important;
                  transform: translateX(-25%) translateY(-20%) !important;
                }
              }
            `}
            sectionStyle={`