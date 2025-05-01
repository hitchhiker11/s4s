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
  padding: ${SPACING.lg} 0; /* Adjust padding for mobile */
  background-color: ${COLORS.white};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto ${SPACING.lg};
  padding: 0 ${SPACING.md}; /* Add horizontal padding */

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
    padding-left: ${SPACING.md};
    padding-right: ${SPACING.md};

    ${mediaQueries.sm} {
      padding-left: ${SPACING.lg};
      padding-right: ${SPACING.lg};
    }
  }

  .swiper-slide {
    width: 70%; /* Match Figma design width for mobile */
    max-width: 140px; /* Based on Figma design */
    height: auto;
    display: flex;
  }

  /* Hide navigation arrows */
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
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
  viewAllText = "Смотреть все"
}) => {
  const displayCategories = Array.isArray(categories) ? categories : [];
  const spaceBetweenValue = parseInt(SPACING.sm.replace('px', ''), 10); // Use smaller spacing for mobile

  return (
    <SliderSection>
      <HeaderContainer>
        <TitleRow>
          <Title>{title}</Title>
          {viewAllLink && <ViewAllLink href={viewAllLink}>{viewAllText}</ViewAllLink>}
        </TitleRow>
        {/* No subtitle in slider view for simplicity, can be added if needed */}
      </HeaderContainer>

      {displayCategories.length > 0 ? (
        <SwiperContainer>
          <Swiper
            modules={[Navigation]}
            spaceBetween={spaceBetweenValue} // Use dynamic smaller gap
            slidesPerView={'auto'} // Let CSS width/max-width control sizing
            navigation
            grabCursor={true}
          >
            {displayCategories.map((category) => (
              <SwiperSlide key={category.id}>
                <CategoryCard {...category} style={{ height: '100%', width: '100%' }} />
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
};

export default CategorySlider; 