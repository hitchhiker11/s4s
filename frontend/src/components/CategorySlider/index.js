import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules
import { Navigation } from 'swiper/modules';
import CategoryCard from '../CategoryCard';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';

// Import Swiper styles (make sure these paths are correct)
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
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto ${SPACING.lg};
  /* No horizontal padding since SliderSection now handles all padding */
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

  
  /* Mobile specific font size - Force override */
  @media (max-width: ${BREAKPOINTS.sm - 1}px) {
    font-size: 14px !important;
  }
`;

const ViewAllLink = styled.a`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.semiBold};
  font-size: clamp(0.9rem, 4vw, ${TYPOGRAPHY.size.lg}); /* Adjusted size */
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
    /* No additional padding since SliderSection now handles all padding */
    padding-left: 0;
    padding-right: 0;
  }

  .swiper-slide {
    width: 70%; /* Match Figma design width for mobile */
    max-width: 140px; /* Based on Figma design */
    height: auto;
    display: flex;
    
    /* Safari WebKit optimizations */
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
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

  .swiper-button-prev {
    left: 10px;
  }

  .swiper-button-next {
    right: 10px;
  }

  /* For desktop - uniform width slides for consistency */
  ${mediaQueries.lg} {
    .swiper-slide {
      width: 280px; /* Fixed width for uniformity */
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
`;

const EmptyMessage = styled.div`
  padding: ${SPACING.lg};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.gray400};
  width: 100%;
`;

const CategorySlider = ({ 
  categories = [],
  title = "Categories",
  viewAllLink = "#",
  viewAllText = "Смотреть все",
  cardStyle,
  showNavigation = false
}) => {
  const displayCategories = Array.isArray(categories) ? categories : [];
  const spaceBetweenValue = 12; // Фиксированные отступы между карточками в слайдере // Use smaller spacing for mobile

  return (
    <SliderSection showNavigation={showNavigation}>
      <HeaderContainer>
        <TitleRow>
          <Title>{title}</Title>
          {viewAllLink && <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>}
        </TitleRow>
        {/* No subtitle in slider view for simplicity, can be added if needed */}
      </HeaderContainer>

      {displayCategories.length > 0 ? (
        <SwiperContainer showNavigation={showNavigation}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={spaceBetweenValue} // Use dynamic smaller gap
            slidesPerView={'auto'} // Let CSS width/max-width control sizing
            navigation={showNavigation}
            grabCursor={true}
            speed={400}
            touchStartPreventDefault={false}
            touchStartForcePreventDefault={false}
            simulateTouch={true}
            allowTouchMove={true}
            watchSlidesProgress={true}
            preloadImages={false}
            lazy={true}
            observer={true}
            observeParents={true}
          >
            {displayCategories.map((category) => (
              <SwiperSlide key={category.id}>
                <CategoryCard 
                  {...category} 
                  additionalStyles={{ height: '100%', width: '100%', ...cardStyle }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperContainer>
      ) : (
        <EmptyMessage>Нет доступных категорий</EmptyMessage>
      )}
    </SliderSection>
  );
};

CategorySlider.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Include other props expected by CategoryCard
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      showTitle: PropTypes.bool,
      rotation: PropTypes.number,
    })
  ),
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string,
  cardStyle: PropTypes.object,
  showNavigation: PropTypes.bool,
};

export default CategorySlider; 