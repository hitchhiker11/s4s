import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) {
    return null;
  }

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

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <div className={styles.imageContainer} onClick={handleImageClick}>
        <Image 
          src={image.url} 
          alt={image.alt || 'Product image'}
          width={1200}
          height={1200}
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