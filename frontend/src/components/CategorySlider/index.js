import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CategoryCard from '../CategoryCard';
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
    width: 80%;
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

const CategorySlider = ({ 
  categories, 
  title = "Категории", 
  viewAllLink = "#", 
  viewAllText = "Смотреть все"
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
        slidesPerView={1.5}
        centeredSlides={false}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000 }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id || index}>
            <CategoryCard
              title={category.title}
              imageUrl={category.imageUrl}
              link={category.link}
              showTitle={category.showTitle}
              rotation={category.rotation}
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </SliderContainer>
  );
};

CategorySlider.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      showTitle: PropTypes.bool,
      rotation: PropTypes.number
    })
  ).isRequired,
  title: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string
};

export default CategorySlider; 