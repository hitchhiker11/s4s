import React, { useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useAboutSliderData } from '../../lib/hooks/useAbboutSliderData';
import styles from './slider.module.css'; // Импортируем стили как CSS Modules

// Инициализируем Swiper-модули
SwiperCore.use([Autoplay, Pagination, Navigation]);

// Стилизованные компоненты
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 60px;
  // min-height: 600px;
`;

const SlideImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 856px;
  overflow: hidden;
  background-color: #1C1C1C;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideTitle = styled.h2`
  position: absolute;
  top: 40px;
  right: 40px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 40px;
  line-height: 1.22em;
  color: #E7194A;
  text-transform: uppercase;
  z-index: 10;
  max-width: 300px;
  opacity: 0; /* Начальное состояние для анимации */
  transform: translateY(20px); /* Начальное состояние для анимации */
`;

const BrandLogo = styled.div`
  position: absolute;
  bottom: 80px;
  left: 40px;
  width: 180px;
  height: 60px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0; /* Начальное состояние для анимации */
  transform: translateY(20px); /* Начальное состояние для анимации */
`;

const CustomPagination = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const PaginationDot = styled.div`
  height: 4px;
  background-color: ${props => props.active ? '#FFFFFF' : 'rgba(252, 252, 252, 0.5)'};
  width: ${props => props.active ? '48px' : '21px'};
  border-radius: 145px;
  cursor: pointer;
  transition: all 0.3s ease;
  class-name: pagination-dot ${props => props.active ? 'active' : ''};
`;

// Компонент Loader для отображения в процессе загрузки данных
const Loader = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1C1C1C;
  font-size: 18px;
`;

// Основной компонент слайдера
const AboutSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading, error } = useAboutSliderData();
  
  const swiperRef = React.useRef(null);
  
  // Обработчик клика по пагинации
  const handlePaginationClick = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Если данные загружаются, показываем лоадер
  if (isLoading) {
    return <Loader>Загрузка слайдера...</Loader>;
  }

  // Если произошла ошибка, показываем сообщение
  if (error) {
    return <Loader>Ошибка при загрузке слайдера</Loader>;
  }

  // Если данные получены успешно
  const sliderData = data?.success ? data.data : [];

  // Если данных нет, не показываем компонент
  if (!sliderData || sliderData.length === 0) {
    return null;
  }

  return (
    <SliderContainer>
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className={styles.aboutSlider}
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <div className={activeIndex === slide.id - 1 ? styles.slideActive : ''}>
              <SlideImageContainer>
                <SlideImage src={slide.image} alt={slide.title} />
                <SlideTitle className={styles.slideTitle}>{slide.title}</SlideTitle>
                <BrandLogo className={styles.brandLogo}>
                  {slide.brandLogo.map((logo, index) => (
                    <img 
                      key={index} 
                      src={logo} 
                      alt={`${slide.brand} logo part ${index + 1}`} 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                    />
                  ))}
                </BrandLogo>
              </SlideImageContainer>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <CustomPagination className={styles.customPagination}>
        {sliderData.map((_, index) => (
          <PaginationDot 
            key={index} 
            className={`${styles.paginationDot} ${activeIndex === index ? styles.paginationDotActive : ''}`}
            onClick={() => handlePaginationClick(index)}
          />
        ))}
      </CustomPagination>
    </SliderContainer>
  );
};

export default AboutSlider; 