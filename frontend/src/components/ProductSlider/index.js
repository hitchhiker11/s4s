import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const SliderSection = styled.section`
  width: 100%;
  padding: ${SPACING.lg} ${SPACING.md} ${SPACING.lg} ${SPACING.md};
  background-color: ${COLORS.white};
  
  ${mediaQueries.sm} {
    padding: ${SPACING.xl} ${SPACING.lg} ${SPACING.lg} ${SPACING.lg};
  }

  ${mediaQueries.md} {
    padding: ${SPACING.xl} ${SPACING['2xl']} ${SPACING.lg} ${SPACING['2xl']};
  }

  ${mediaQueries.lg} {
    padding: ${SPACING.xl} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
  
  /* Show navigation buttons on section hover */
  &:hover .swiper-button-prev,
  &:hover .swiper-button-next {
    opacity: ${props => props.showNavigation ? 1 : 0};
  }
  
  /* Custom styles override */
  ${props => props.customStyles && props.customStyles}
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto ${SPACING.lg};
  /* No horizontal padding since SliderSection now handles all padding */
`;

const HeaderDivider = styled.hr`
  border: none;
  height: 2px;
  background: none;
  border-top: 2px solid ${COLORS.gray400};
  width: 100%;
  margin: 0;
  @media (min-width: 992px) {
    border-top-width: 4px;
    height: 4px;
  }
`;
const SubtitleContainer = styled.div`
  display: none;
  width: 100%;
  border-bottom: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0;
  max-height: 28px;

  @media (min-width: 992px) {
    display: flex;
    border-bottom-width: 4px;
    max-height: 45px;
    align-items: center;
  }
`;

const Subtitle = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, ${TYPOGRAPHY.size.xl});
  color: ${COLORS.gray500};
  margin: 0;
  line-height: 1.16;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} 0; /* Only vertical padding, horizontal handled by SliderSection */

  max-height: 28px;
  ${mediaQueries.sm} {
    max-height: 45px;
    padding: ${SPACING.md} 0; /* Only vertical padding */
  }
  
  ${mediaQueries.lg} {
    border-top: 4px solid ${COLORS.gray400}; /* 4px border for desktop */
  }
`;

const Title = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: clamp(14px, 3vw, ${TYPOGRAPHY.size.xl});
  color: ${COLORS.black};
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${BREAKPOINTS.sm - 1}px) {
    font-size: 14px !important;
  }
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: clamp(0.9rem, 4vw, ${TYPOGRAPHY.size.lg});
  color: ${COLORS.black};
  text-decoration: none;
  white-space: nowrap;
  line-height: 1;

  &:hover {
    color: ${COLORS.primary};
    text-decoration: underline;
  }
`;

const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  margin-top: ${SPACING.md};
  // ${mediaQueries.lg} {
  //   margin-top: ${SPACING.md}; 
  // }
  
  .swiper {
    /* No additional padding since SliderSection now handles all padding */
    padding-left: 0;
    padding-right: 0;
    will-change: transform;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .swiper-slide {
    width: 70%; /* Mobile behavior aligned with CategorySlider */
    max-width: 140px;
    height: auto;
    display: flex;
    flex-shrink: 0;
    
    /* Safari WebKit optimizations */
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }
  
  /* Mobile to tablet transition - smaller cards */
  @media (min-width: 500px) and (max-width: 767px) {
    .swiper-slide {
      width: clamp(180px, 60%, 240px);
      max-width: 240px;
    }
  }
  
  /* Tablet uses improved adaptive width */
  ${mediaQueries.md} {
    .swiper-slide {
      width: clamp(220px, 65%, 280px);
      min-width: 220px;
      max-width: 280px;
      flex-shrink: 0;
    }
  }
  
  /* For desktop - uniform width slides for consistency - match CategorySlider */
  ${mediaQueries.lg} {
    .swiper-slide {
      width: 280px; /* Fixed width for uniformity - same as CategorySlider */
      min-width: 280px; /* Prevent shrinking */
      max-width: 280px; /* Consistent maximum */
      flex-shrink: 0; /* Prevent flex shrinking */
    }
  }
  
  /* For extra large screens - slightly larger but still uniform */
  ${mediaQueries.xl} {
    .swiper-slide {
      width: 300px;
      min-width: 300px;
      max-width: 300px;
    }
  }

  /* For very large screens - compact sizing */
  ${mediaQueries.xxl} {
    .swiper-slide {
      width: 280px; /* Уменьшено с 300px */
      min-width: 280px;
      max-width: 280px;
    }
  }

  ${mediaQueries.xxxl} {
    .swiper-slide {
      width: 260px; /* Еще компактнее */
      min-width: 260px;
      max-width: 260px;
    }
  }

  /* Navigation arrows styling - conditional */
  .swiper-button-prev,
  .swiper-button-next {
    display: ${props => props.showNavigation ? 'flex' : 'none'};
    opacity: 0;
    transition: opacity 0.3s ease;
    background: ${COLORS.white};
    border: 2px solid ${COLORS.gray300};
    border-radius: 50%;
    width: 48px;
    height: 48px;
    margin-top: -24px;
    color: ${COLORS.black};

    &:after {
      font-size: 18px;
      font-weight: bold;
    }

    &:hover {
      background: ${COLORS.gray100};
      border-color: ${COLORS.gray400};
    }
  }

  /* Hide disabled arrows completely */
  .swiper-button-disabled {
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }

  ${mediaQueries.lg} {
    .swiper-button-prev,
    .swiper-button-next {
      border-width: 4px;
    }
  }

  .swiper-button-prev {
    left: 10px;
  }

  .swiper-button-next {
    right: 10px;
  }
`;

const ProductCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* Allow shrinking below content size */
  /* overflow: hidden; */ /* Remove this to allow toasts to be visible */
  
  /* Remove all auto height/flex behaviors causing the issue */
  display: block;
  height: auto;
`;

const EmptyMessage = styled.div`
  padding: ${SPACING.lg};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.gray400};
  width: 100%;
`;

const ProductSlider = ({
  products = [],
  title = "Products",
  viewAllLink = "#",
  showViewAllLink = true,
  viewAllText = "Смотреть все",
  showNavigation = false,
  sliderSectionStyles = "", // New prop for custom section styles
  gridSectionStyles = "",
  subtitle = ""
}) => {
  const displayProducts = Array.isArray(products) ? products : [];
  const spaceBetweenValue = 12; // Фиксированные отступы между карточками в слайдере
  const swiperRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const measureOverflow = () => {
    const swiper = swiperRef.current;
    if (!swiper || !swiper.el || !swiper.wrapperEl) {
      setHasOverflow(false);
      return;
    }
    const containerWidth = swiper.el.clientWidth || 0;
    const contentWidth = swiper.wrapperEl.scrollWidth || 0;
    setHasOverflow(contentWidth > containerWidth + 1);
  };

  useEffect(() => {
    // re-measure on window resize
    const onResize = () => measureOverflow();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    // re-measure when number of slides changes
    // next tick to ensure DOM is updated
    const id = requestAnimationFrame(measureOverflow);
    return () => cancelAnimationFrame(id);
  }, [displayProducts.length]);

  if (process.env.NODE_ENV === 'development') {
    console.log(`ProductSlider (${title}) rendering with:`, displayProducts.length);
  }

  // Use sliderSectionStyles if provided, otherwise fall back to gridSectionStyles for compatibility
  const customStyles = sliderSectionStyles || gridSectionStyles;

  const navigationEnabled = Boolean(showNavigation && hasOverflow);

  return (
    <SliderSection showNavigation={navigationEnabled} customStyles={customStyles}>
      <HeaderContainer>
        <TitleRow>
          <Title>{title}</Title>
          {showViewAllLink && viewAllLink && (
            <Link href={viewAllLink} passHref legacyBehavior>
              <ViewAllLink>{viewAllText}</ViewAllLink>
            </Link>
          )}
        </TitleRow>
        <HeaderDivider />
        {/* {subtitle ? (
          <SubtitleContainer>
            <Subtitle>{subtitle}</Subtitle>
          </SubtitleContainer>
        ) : null} */}
      </HeaderContainer>

      {displayProducts.length > 0 ? (
        <SwiperContainer showNavigation={navigationEnabled}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={spaceBetweenValue}
            slidesPerView={'auto'}
            navigation={navigationEnabled}
            grabCursor={true}
            speed={350}
            cssMode={true}
            touchStartPreventDefault={false}
            touchStartForcePreventDefault={false}
            simulateTouch={true}
            allowTouchMove={true}
            watchSlidesProgress={true}
            watchOverflow={true}
            preloadImages={false}
            lazy={true}
            observer={true}
            observeParents={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              measureOverflow();
              swiper.on('resize', measureOverflow);
              swiper.on('slidesLengthChange', measureOverflow);
              swiper.on('update', measureOverflow);
            }}
          >
            {displayProducts.map((product) => {
              // Handle "OTHER" brand - don't display it
              const productWithBrandHandling = {
                ...product,
                brand: product.brand === "OTHER" ? "" : product.brand
              };
              
              return (
                <SwiperSlide key={product.id}>
                  <ProductCardWrapper>
                    <ProductCard
                      product={productWithBrandHandling}
                    />
                  </ProductCardWrapper>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </SwiperContainer>
      ) : (
        <EmptyMessage>Нет доступных товаров</EmptyMessage>
      )}
    </SliderSection>
  );
};

ProductSlider.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string,
      brand: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      productLink: PropTypes.string,
      CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']),
      badge: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  showViewAllLink: PropTypes.bool,
  viewAllText: PropTypes.string,
  showNavigation: PropTypes.bool,
  sliderSectionStyles: PropTypes.string, // Add propType for custom styles
  gridSectionStyles: PropTypes.string, // Add propType for compatibility
  subtitle: PropTypes.string,
};

export default ProductSlider;
