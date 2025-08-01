import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useAboutSliderData } from '../../lib/hooks/useAboutSliderData';
import { COLORS, TYPOGRAPHY, mediaQueries } from '../../styles/tokens';

// Инициализируем Swiper-модули
SwiperCore.use([Autoplay, Pagination, Navigation]);

// Стилизованные компоненты
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 40px;
  // min-height: 600px;
  
  ${mediaQueries.md} {
    margin-bottom: 60px;
  }
`;

// Используем aspect-ratio для поддержания пропорций слайдера на всех устройствах
const SlideImageContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 434px;
  aspect-ratio: 16 / 9; // Стандартное соотношение сторон
  overflow: hidden;
  background-color: ${COLORS.black};
  
  ${mediaQueries.md} {
    aspect-ratio: 2 / 1; // Более широкое соотношение для планшетов
  }
  
  ${mediaQueries.lg} {
    height: auto;
    aspect-ratio: 21 / 9; // Широкоформатное соотношение для десктопов
    max-height: 856px; // Точное значение из Figma
  }
`;

const SlideImage = styled.img`
  background-color: ${COLORS.white};
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  object-position: center;
`;

const SlideTitle = styled.h2`
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-weight: 900;
  font-size: 40px;
  line-height: 1.22;
  color: ${COLORS.primary};
  text-transform: uppercase;
  z-index: 10;
  max-width: 250px;
  opacity: 0;
  transform: translateY(20px);

  ${mediaQueries.md} {
    top: 30px;
    left: 30px;
    max-width: 280px;
  }

  ${mediaQueries.lg} {
    top: 40px;
    left: 40px;
    max-width: 300px;
  }
`;

const BrandLogo = styled.div`
  position: absolute;
  bottom: 60px;
  left: 20px;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transform: translateY(20px);
  
  ${mediaQueries.md} {
    bottom: 70px;
    left: 30px;
    width: 160px;
    height: 55px;
  }
  
  ${mediaQueries.lg} {
    bottom: 80px;
    left: 40px;
    width: 180px;
    height: 60px;
  }
`;

const CustomPagination = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
  
  ${mediaQueries.md} {
    bottom: 20px;
    gap: 8px;
  }
  
  ${mediaQueries.lg} {
    bottom: 30px;
  }
`;

const PaginationDot = styled.div`
  height: 12px;
  background-color: ${props => props.$active ? '#000000' : 'rgba(0, 0, 0, 0.5)'};
  width: ${props => props.$active ? '48px' : '21px'};
  border-radius: 145px; // Из Figma
  cursor: pointer;
  transition: all 0.3s ease;
  class-name: pagination-dot ${props => props.$active ? 'active' : ''};
`;

// Основной компонент слайдера
const AboutSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  
  // Получаем данные слайдера из API
  const { data, isLoading, error } = useAboutSliderData();
  
  // Преобразуем данные API в массив с id и image
  const sliderData = React.useMemo(() => {
    if (!data || data.error) return [];
    if (!Array.isArray(data.data)) return [];

    return data.data
      .filter((item) => item?.images?.detail?.src)
      .map((item) => {
        const relativeSrc = item.images.detail.src;
        // Если путь относительный, добавляем домен сайта
        const fullSrc = relativeSrc.startsWith('http') ? relativeSrc : `https://shop4shoot.com${relativeSrc}`;

        return {
          id: item.id || item.ID,
          image: fullSrc,
        };
      });
  }, [data]);

  const handlePaginationClick = (index) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  // Обработка изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (swiperInstance) {
        swiperInstance.update();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [swiperInstance]);

  // Пока данные загружаются, ничего не отображаем (можно добавить лоадер при необходимости)
  if (isLoading) {
    return null;
  }

  // Если произошла ошибка или данных нет, не показываем компонент
  if (error || !sliderData || sliderData.length === 0) {
    return null;
  }

  return (
    <SliderContainer>
      <Swiper
        onSwiper={setSwiperInstance}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="about-slider"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <SlideImageContainer>
              <SlideImage src={slide.image} alt={`slide-${slide.id}`} />
              {/* <SlideTitle className="slide-title">{slide.title}</SlideTitle> */}
              {/* <BrandLogo className="brand-logo">
                {slide.brandLogo.map((logo, index) => (
                  <img 
                    key={index} 
                    src={logo} 
                    alt={`${slide.brand} logo part ${index + 1}`} 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                ))}
              </BrandLogo> */}
            </SlideImageContainer>
          </SwiperSlide>
        ))}
      </Swiper>

      <CustomPagination className="custom-pagination">
        {sliderData.map((_, index) => (
          <PaginationDot 
            key={index} 
            $active={activeIndex === index}
            className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handlePaginationClick(index)}
          />
        ))}
      </CustomPagination>
    </SliderContainer>
  );
};

export default AboutSlider; 