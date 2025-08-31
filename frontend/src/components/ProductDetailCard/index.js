import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './ProductDetailCard.module.css';
import QuantityControl from '../QuantityControl';
import ImageModal from '../modals/ImageModal';
// Removed heroicons import which was causing the build error
import { COLORS } from '../../styles/tokens';

const ProductDetailCard = ({
  product,
  onAddToCart,
  onPreOrder,
  isInBasket = false,
  basketQuantity = 1,
  onQuantityChange,
  onRemove,
  quantityLoading = false,
}) => {
  if (!product) {
    return <div>Товар не найден.</div>;
  }

  const [selectedImage, setSelectedImage] = useState(product.images[0] || { url: '/images/placeholder.png', alt: 'Placeholder', id: 'placeholder' });
  const [quantity, setQuantity] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mainImageRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Responsive check for mobile viewport to adjust QuantityControl size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    updateIsMobile(); // initial
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // Reset selected image when product changes (SPA navigation from recently viewed)
  useEffect(() => {
    if (!product || !Array.isArray(product.images) || product.images.length === 0) return;
    setSelectedImage(product.images[0]);
  }, [product?.id]);

  // Предзаказ отображается, если товар недоступен ИЛИ явно указан нулевой остаток.
  // В некоторых ответах API количество может быть не передано — в таком случае ориентируемся
  // только на флаг наличия. Также поддерживаем поле `quantityAvailable`, которое может
  // приходить как boolean-признак остатка (transformCatalogItem выставляет его на основе
  // CATALOG_QUANTITY).
  const isPreOrder = (() => {
    // 1. Флаг доступности — boolean (inStock) или строка ('Y'/'N')
    const availabilityFlag = product?.inStock ?? product?.CATALOG_AVAILABLE;
    const availableByFlag = availabilityFlag === true || availabilityFlag === 'Y';

    // 2. Некоторые реализации Битрикса возвращают количество = 0, даже если товар
    //    доступен для заказа (фактический остаток ведётся в SKU, складских модулях и т.д.).
    //    Поэтому для отображения кнопки "В корзину" достаточно флага `inStock | CATALOG_AVAILABLE`.
    return !availableByFlag;
  })();

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount)); // Ensure quantity doesn't go below 1
  };

  const handleDirectQuantityInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
        setQuantity(value);
    } else if (e.target.value === '') {
        setQuantity(''); // Allow empty input temporarily
    }
  };

  const handleBlurQuantityInput = (e) => {
    if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
        setQuantity(1); // Reset to 1 if empty or less than 1
    }
  };

  // Touch event handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = product.images.findIndex(img => img.id === selectedImage.id);
      if (currentIndex !== -1) {
        let newIndex;
        if (isLeftSwipe) {
          // Next image (swipe left)
          newIndex = (currentIndex + 1) % product.images.length;
        } else {
          // Previous image (swipe right)
          newIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        }
        setSelectedImage(product.images[newIndex]);
      }
    }
  };

  const currentPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : null;

  // Prefer brand code resolved on the server; fallback to slugified brand name
  const brandSlug = product.brandCode
    ? String(product.brandCode)
    : (product.brand || '')
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9а-яё-]/gi, '');

  return (
    <div className={styles.productDetailCard}>
      <div className={styles.galleryContainer}>
        <div 
          className={styles.mainImageContainer}
          ref={mainImageRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        >
          <Image 
            key={selectedImage.id}
            src={selectedImage.url} 
            alt={selectedImage.alt}
            width={500}
            height={500}
            className={styles.mainImage}
            priority
          />
          {/* {product.recommended && <span className={styles.recommendedBadge}>Рекомендуем этот товар</span>} */}
        </div>
        {product.images.length > 1 && (
          <div className={styles.thumbnailContainer}>
            {product.images.map((image) => (
              <button 
                key={image.id} 
                className={`${styles.thumbnailButton} ${selectedImage.id === image.id ? styles.activeThumbnail : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <Image src={image.url} alt={image.alt} width={80} height={80} className={styles.thumbnailImage} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <h1 className={styles.productName}>{product.name}</h1>
        
        <div className={styles.metaInfo}>
            <p className={styles.brand}>
              Бренд: {' '}
              {brandSlug ? (
                <Link href={`/brands/${brandSlug}?page=1`} prefetch>
                  <span
                    className={styles.brandLink}
                    style={{ color: COLORS.primary, textDecoration: 'underline' }}
                  >
                    {product.brand}
                  </span>
                </Link>
              ) : (
                <span>{product.brand}</span>
              )}
            </p>
            <p className={styles.article}>Артикул: {product.article}</p>
            <p className={styles.availability}>{product.availability}</p>
        </div>

        {/* Placeholder for Rating and Reviews - to be implemented if needed */}
        {/* <div className={styles.ratingSection}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={i < Math.round(product.rating || 0) ? styles.starFilled : styles.starEmpty} />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviewCount || 0} отзывов)</span>
        </div> */}

        {/* <div className={styles.descriptionContainer}>
            <p className={styles.description}>{product.description}</p>
        </div> */}

        <div className={styles.priceSection}>
          <p className={styles.currentPrice}>₽{currentPrice.toLocaleString('ru-RU')}</p>
          {oldPrice && <p className={styles.oldPrice}>₽{oldPrice.toLocaleString('ru-RU')}</p>}
        </div>

        {/* Quantity Selector - to be styled according to Figma */}
        {/* <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)} className={styles.quantityButton} disabled={quantity <= 1}> 
            <MinusIcon className={styles.icon} />
          </button>
          <input 
            type="number" 
            value={quantity} 
            onChange={handleDirectQuantityInput}
            onBlur={handleBlurQuantityInput}
            className={styles.quantityInput}
            min="1"
           />
          <button onClick={() => handleQuantityChange(1)} className={styles.quantityButton}>
            <PlusIcon className={styles.icon} />
          </button>
        </div> */}

        {/* Интегрируем QuantityControl, если товар уже в корзине */}
        {isInBasket && !isPreOrder ? (
          <QuantityControl
            quantity={basketQuantity}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            isLoading={quantityLoading}
            removeButtonStyle={{
              paddingLeft: '0',
              marginLeft: '0',
            }}
            size={isMobile ? 'compact' : 'large'}
          />
        ) : (
          <button
            onClick={() => {
              if (isPreOrder && typeof onPreOrder === 'function') {
                onPreOrder(product);
              } else if (typeof onAddToCart === 'function') {
                onAddToCart({ productId: product.id, quantity, price: currentPrice });
              }
            }}
            className={styles.addToCartButton}
          >
            {isPreOrder ? 'Предзаказ' : 'В корзину'}
          </button>
        )}

        {/* Placeholder for Wishlist button */}
        {/* <button className={styles.wishlistButton}>
          <HeartIcon className={styles.icon} />
          Добавить в избранное
        </button> */}
      </div>

      {/* Image Modal for fullscreen viewing */}
      {isMounted && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={handleCloseImageModal}
          images={product.images}
          initialIndex={product.images.findIndex((img) => img.id === selectedImage.id) || 0}
          onIndexChange={(idx) => {
            const next = product.images[idx];
            if (next && next.id !== selectedImage.id) {
              setSelectedImage(next);
            }
          }}
        />
      )}
    </div>
  );
};

ProductDetailCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    article: PropTypes.string,
    availability: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    discountPrice: PropTypes.number, // Optional
    images: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })).isRequired,
    recommended: PropTypes.bool,
    rating: PropTypes.number, // Optional
    reviewCount: PropTypes.number, // Optional
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onPreOrder: PropTypes.func,
  isInBasket: PropTypes.bool,
  basketQuantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onQuantityChange: PropTypes.func,
  onRemove: PropTypes.func,
  quantityLoading: PropTypes.bool,
};

export default ProductDetailCard; 