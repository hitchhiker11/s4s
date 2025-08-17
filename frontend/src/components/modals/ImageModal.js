import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './ImageModal.module.css';

const MIN_SWIPE_DISTANCE_PX = 50;

const ImageModal = ({
  isOpen,
  onClose,
  image, // backward compatibility: single image
  images = [],
  initialIndex = 0,
  onIndexChange,
}) => {
  // Normalize input: support legacy 'image' prop
  const normalizedImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (image) return [image];
    return [];
  }, [images, image]);

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex || 0);
  const touchStartRef = React.useRef(null);
  const touchEndRef = React.useRef(null);
  const navigationLockRef = React.useRef(false);

  // Do not early-return before hooks; guard rendering later

  const handleOverlayClick = (e) => {
    // Close modal only if clicked directly on overlay (not on image)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (e) => {
    // Prevent event bubbling to overlay
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    // Ignore auto-repeat to prevent runaway navigation
    if (e.repeat) return;
    if (e.key === 'ArrowRight') {
      goNext();
      return;
    }
    if (e.key === 'ArrowLeft') {
      goPrev();
      return;
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Sync current index when modal opens or dependencies change
  React.useEffect(() => {
    if (!isOpen) return;
    const clampedIndex = Math.max(0, Math.min(initialIndex || 0, normalizedImages.length - 1));
    // Avoid redundant state updates to prevent feedback loops
    setCurrentIndex((prev) => (prev !== clampedIndex ? clampedIndex : prev));
  }, [isOpen, initialIndex, normalizedImages.length]);

  // Emit index changes to parent if requested
  React.useEffect(() => {
    if (!isOpen) return;
    if (typeof onIndexChange === 'function') {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, isOpen, onIndexChange]);

  if (!isOpen || normalizedImages.length === 0) {
    return null;
  }

  const goPrev = () => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
    // Release lock shortly after to avoid runaway loops
    setTimeout(() => {
      navigationLockRef.current = false;
    }, 250);
  };

  const goNext = () => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
    // Release lock shortly after to avoid runaway loops
    setTimeout(() => {
      navigationLockRef.current = false;
    }, 250);
  };

  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    const touchStartX = touchStartRef.current;
    const touchEndX = touchEndRef.current;
    if (touchStartX == null || touchEndX == null) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE_PX;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE_PX;
    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
    // Reset refs to avoid stale values on subsequent taps
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const modalContent = (
    <div 
      className={`${styles.overlay} ${normalizedImages.length === 1 ? styles.singleImage : ''}`} 
      onClick={handleOverlayClick}
    >
      {/* Top bar with counter and close button */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          {normalizedImages.length > 1 && (
            <div className={styles.counter}>
              {currentIndex + 1} / {normalizedImages.length}
            </div>
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>

      {/* Navigation buttons */}
      {normalizedImages.length > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Предыдущее фото"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            ‹
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Следующее фото"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            ›
          </button>
        </>
      )}

      {/* Main image container */}
      <div
        className={styles.imageContainer}
        onClick={handleImageClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={normalizedImages[currentIndex]?.url}
          alt={normalizedImages[currentIndex]?.alt || 'Product image'}
          width={1600}
          height={1600}
          className={styles.image}
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );

  // Render modal content in a portal to document.body
  return createPortal(modalContent, document.body);
};

export default ImageModal; 