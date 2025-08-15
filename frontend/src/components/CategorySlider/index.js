import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules
import { Navigation } from 'swiper/modules';
import CategoryCard from '../CategoryCard';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, mediaQueries, BREAKPOINTS } from '../../styles/tokens';
import Link from 'next/link';

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

const SwiperContainer = styled.div`
  position: relative; 
  width: 100%;

  max-width: ${SIZES.containerMaxWidth};
  margin: 0 auto;
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
    width: 70%; /* Mobile */
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

  /* Tablet uses mobile-like behavior */
  ${mediaQueries.md} {
    .swiper-slide {
      width: clamp(220px, 65%, 280px);
      min-width: 220px;
      max-width: 280px;
      flex-shrink: 0;
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

  /* Removed forced edge positioning; rely on CategoryCard props to control image alignment */
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
  showNavigation = false,
  subtitle = "",
  edgeImagePositioningMode = 'auto' // 'auto' | 'enabled' | 'disabled'
}) => {
  const displayCategories = Array.isArray(categories) ? categories : [];
  const spaceBetweenValue = 12; // Фиксированные отступы между карточками в слайдере // Use smaller spacing for mobile
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
    const onResize = () => measureOverflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(measureOverflow);
    return () => cancelAnimationFrame(id);
  }, [displayCategories.length]);

  const navigationEnabled = Boolean(showNavigation && hasOverflow);

  return (
    <SliderSection showNavigation={navigationEnabled}>
      <HeaderContainer>
        <TitleRow>
          <Title>{title}</Title>
          {viewAllLink && (
            <Link href={viewAllLink} passHref legacyBehavior>
              <ViewAllLink>{viewAllText}</ViewAllLink>
            </Link>
          )}
        </TitleRow>
        <HeaderDivider />
        {subtitle ? (
          <SubtitleContainer>
            <Subtitle>{subtitle}</Subtitle>
          </SubtitleContainer>
        ) : null}
      </HeaderContainer>

      {displayCategories.length > 0 ? (
        <SwiperContainer showNavigation={navigationEnabled}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={spaceBetweenValue} // Use dynamic smaller gap
            slidesPerView={'auto'} // Let CSS width/max-width control sizing
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
            {displayCategories.map((item) => {
              const isBrandAuto = item?.showTitle === false;
              const edgeEnabled = edgeImagePositioningMode === 'enabled' ? true
                : edgeImagePositioningMode === 'disabled' ? false
                : !isBrandAuto; // auto mode
              const disableRotationValue = edgeImagePositioningMode === 'disabled' || isBrandAuto ? true : false;
              
              return (
              <SwiperSlide key={item.id}>
                <CategoryCard 
                  {...item} 
                  disableRotation={disableRotationValue}
                  enableEdgeImagePositioning={edgeEnabled}
                  additionalStyles={{ height: '100%', width: '100%', overflow: 'hidden', ...cardStyle }}
                />
              </SwiperSlide>
              );
            })}
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
  subtitle: PropTypes.string,
};

export default CategorySlider; 