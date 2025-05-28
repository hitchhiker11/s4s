import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from './ProductDetailCard.module.css';
// Removed heroicons import which was causing the build error

const ProductDetailCard = ({ product, onAddToCart }) => {
  if (!product) {
    return <div>Товар не найден.</div>;
  }

  const [selectedImage, setSelectedImage] = useState(product.images[0] || { url: '/images/placeholder.png', alt: 'Placeholder' });
  const [quantity, setQuantity] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const mainImageRef = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
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

  return (
    <div className={styles.productDetailCard}>
      <div className={styles.galleryContainer}>
        <div 
          className={styles.mainImageContainer}
          ref={mainImageRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image 
            src={selectedImage.url} 
            alt={selectedImage.alt}
            width={500} // Adjust as per actual design requirement for largest view
            height={500} // Adjust as per actual design requirement for largest view
            className={styles.mainImage}
            priority // Prioritize loading of the main product image
          />
          {/* {product.recommended && <span className={styles.recommendedBadge}>Рекомендуем этот товар</span>} */}
        </div>
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
      </div>

      <div className={styles.detailsContainer}>
        <h1 className={styles.productName}>{product.name}</h1>
        
        <div className={styles.metaInfo}>
            <p className={styles.brand}>Бренд: {product.brand}</p>
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

        <div className={styles.descriptionContainer}>
            <p className={styles.description}>{product.description}</p>
        </div>

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

        <button 
            onClick={() => onAddToCart({ productId: product.id, quantity, price: currentPrice })} 
            className={styles.addToCartButton}
        >
          В корзину
        </button>

        {/* Placeholder for Wishlist button */}
        {/* <button className={styles.wishlistButton}>
          <HeartIcon className={styles.icon} />
          Добавить в избранное
        </button> */}
      </div>
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
};

export default ProductDetailCard; 