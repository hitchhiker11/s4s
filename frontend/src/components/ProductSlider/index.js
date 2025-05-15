import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const SliderSection = styled.section`
  width: 100%;
  padding: ${SPACING.lg} 0 0 0;
  background-color: ${COLORS.white};
  position: relative; /* Add position context */
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto ${SPACING.lg};
  // padding: 0 ${SPACING.md};

  ${mediaQueries.sm} {
    padding: 0 ${SPACING.lg};
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 2px solid ${COLORS.gray400};
  padding: ${SPACING.sm} ${SPACING.sm};
  max-height: 28px;
  ${mediaQueries.sm} {
  max-height: 45px;
    padding: 0 ${SPACING.lg};
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

// Completely restructured SwiperContainer to ensure proper height handling
const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
  padding-bottom: ${SPACING.md};
  
  /* Override Swiper's default height calculation */
  .swiper {
    position: relative;
    // padding-left: ${SPACING.md};
    // padding-right: ${SPACING.md};
    overflow: visible;
    
    ${mediaQueries.sm} {
      padding-left: ${SPACING.lg};
      padding-right: ${SPACING.lg};
    }
  }

  /* Fix the wrapper height calculation issue */
  .swiper-wrapper {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  /* Fix individual slide height */
  .swiper-slide {
    min-width: 173px;
    max-width: 173px;
    width: 173px;
    
    /* Override Swiper's default height calculation */
    height: auto !important;
    
    /* Fix flexbox alignment */
    display: block !important;
    
    /* Use consistent spacing between cards */
    &:not(:last-child) {
      margin-right: ${SPACING.sm};
    }
  }

  /* Hide navigation arrows */
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
`;

// Completely restructured ProductCardWrapper
const ProductCardWrapper = styled.div`
  position: relative;
  width: 100%;
  
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
  viewAllText = "Смотреть все",
  onAddToCart
}) => {
  const displayProducts = Array.isArray(products) ? products : [];
  const spaceBetweenValue = 0; // убираем spaceBetween, теперь отступы только через margin

  if (process.env.NODE_ENV === 'development') {
    console.log(`ProductSlider (${title}) rendering with:`, displayProducts.length);
  }

  return (
    <SliderSection>
      <HeaderContainer>
        <TitleRow>
          <Title>{title}</Title>
          {viewAllLink && <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>}
        </TitleRow>
      </HeaderContainer>

      {displayProducts.length > 0 ? (
        <SwiperContainer>
          <Swiper
            modules={[Navigation]}
            spaceBetween={spaceBetweenValue}
            slidesPerView={'auto'}
            navigation
            grabCursor={true}
            // Remove inline overflow style
          >
            {displayProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCardWrapper>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                </ProductCardWrapper>
              </SwiperSlide>
            ))}
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
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func,
};

export default ProductSlider;
