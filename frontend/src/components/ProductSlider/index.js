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
  padding: ${SPACING.lg} 0 0 0; /* убираем нижний отступ */
  background-color: ${COLORS.white};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto ${SPACING.lg};
  padding: 0 ${SPACING.md};

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
  padding: ${SPACING.sm} 0;
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

const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;

  .swiper {
    padding-left: ${SPACING.md};
    padding-right: ${SPACING.md};

    ${mediaQueries.sm} {
      padding-left: ${SPACING.lg};
      padding-right: ${SPACING.lg};
    }
  }

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    min-width: 173px;
    max-width: 173px;
    flex-basis: 173px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-self: stretch;
    height: auto;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Восстанавливаем отступ между карточками */
  .swiper-slide:not(:last-child) {
    margin-right: ${SPACING.sm};
  }

  /* Убираем отступ справа у последнего слайда */
  .swiper-slide:last-child {
    margin-right: 0 !important;
  }

  /* Hide navigation arrows */
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
`;

// Обертка для ProductCard с усиленной чисткой отступов
const ProductCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  
  /* Убираем нижний отступ у карточки и всех вложенных элементов */
  & > * {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  
  /* Усиленная специфичность для кнопки корзины и её контейнера */
  & div:last-child,
  & button {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  
  /* Скрываем любые оставшиеся переполнения */
  overflow: hidden;
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
            style={{overflow: 'visible'}}
          >
            {displayProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCardWrapper>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: 0,
                      paddingBottom: 0,
                    }}
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
