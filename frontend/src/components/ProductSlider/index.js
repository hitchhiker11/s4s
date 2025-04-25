import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '../ProductCard';
import { COLORS, SPACING, TYPOGRAPHY, mediaQueries } from '../../styles/tokens';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderContainer = styled.div`
  margin: ${SPACING.lg} 0;
  position: relative;
  width: 100%;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.md};
  padding: 0 ${SPACING.md};
`;

const SectionTitle = styled.h2`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.xl};
  color: ${COLORS.black};
  margin: 0;
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: ${TYPOGRAPHY.size.sm};
  color: ${COLORS.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  padding: 0 ${SPACING.md};
  
  .swiper-slide {
    width: 85%;
    height: auto;
  }
  
  .swiper-pagination-bullet {
    background-color: ${COLORS.primary};
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: ${COLORS.primary};
    
    &:after {
      font-size: 24px;
    }
  }
`;

const PreOrderBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  padding: ${SPACING.xs} 0;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  text-transform: uppercase;
  font-size: ${TYPOGRAPHY.size.xs};
  z-index: 10;
`;

const ProductSlider = ({ 
  products, 
  title = "Товары", 
  viewAllLink = "#", 
  viewAllText = "Смотреть все",
  onAddToCart
}) => {
  return (
    <SliderContainer>
      <SliderHeader>
        <SectionTitle>{title}</SectionTitle>
        <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>
      </SliderHeader>
      
      <StyledSwiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1.2}
        centeredSlides={false}
        pagination={{ clickable: true }}
        navigation
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id || index}>
            <div style={{ position: 'relative' }}>
              {product.preOrder && (
                <PreOrderBadge>ПРЕДЗАКАЗ</PreOrderBadge>
              )}
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </SliderContainer>
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
      CATALOG_AVAILABLE: PropTypes.oneOf(['Y', 'N']).isRequired,
      badge: PropTypes.string,
      preOrder: PropTypes.bool
    })
  ).isRequired,
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  onAddToCart: PropTypes.func
};

export default ProductSlider; 