import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon } from '../icons';
import styles from './QuantityControl.module.css';

const QuantityControl = ({ 
  quantity, 
  onQuantityChange, 
  onRemove,
  isLoading = false,
  showRemoveOnOne = true,
  size = 'default', // 'default', 'compact', 'small'
  orientation = 'horizontal', // 'horizontal', 'vertical'
  className = '',
  disabled = false
}) => {
  const handleDecreaseQuantity = () => {
    if (quantity > 1 && !isLoading && !disabled) {
      onQuantityChange(quantity - 1);
    } else if (quantity === 1 && showRemoveOnOne && onRemove && !isLoading && !disabled) {
      onRemove();
    }
  };

  const handleIncreaseQuantity = () => {
    if (!isLoading && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleQuantityInputChange = (e) => {
    if (isLoading || disabled) return;
    
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onQuantityChange(newQuantity);
    } else if (e.target.value === '') {
      // Allow empty input temporarily
      onQuantityChange('');
    } else {
      onQuantityChange(1); // Fallback for invalid entries
    }
  };

  const handleQuantityInputBlur = (e) => {
    if (isLoading || disabled) return;
    
    const currentQuantity = e.target.value;
    if (currentQuantity === '' || parseInt(currentQuantity, 10) < 1) {
      onQuantityChange(1); // Default to 1 if empty or less than 1
    }
  };

  const containerClasses = [
    styles.quantityControl,
    styles[size],
    styles[orientation],
    className,
    isLoading ? styles.loading : '',
    disabled ? styles.disabled : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {quantity === 1 && showRemoveOnOne && onRemove ? (
        <button 
          onClick={handleDecreaseQuantity}
          className={`${styles.quantityButton} ${styles.removeIconButton}`}
          aria-label="Удалить товар"
          disabled={isLoading || disabled}
        >
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <TrashIcon />
          )}
        </button>
      ) : (
        <button 
          onClick={handleDecreaseQuantity}
          className={`${styles.quantityButton} ${styles.decreaseButton}`}
          aria-label="Уменьшить количество"
          disabled={isLoading || disabled}
        >
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <span>-</span>
          )}
        </button>
      )}
      
      <input 
        type="number"
        className={styles.quantityInput}
        value={quantity === '' ? '' : quantity}
        onChange={handleQuantityInputChange}
        onBlur={handleQuantityInputBlur}
        aria-label="Количество товара"
        min="1"
        disabled={isLoading || disabled}
      />
      
      <button 
        onClick={handleIncreaseQuantity} 
        className={`${styles.quantityButton} ${styles.increaseButton}`}
        aria-label="Увеличить количество"
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <div className={styles.spinner}></div>
        ) : (
          <span>+</span>
        )}
      </button>
    </div>
  );
};

QuantityControl.propTypes = {
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func, // Optional, if not provided, won't show remove on quantity = 1
  isLoading: PropTypes.bool,
  showRemoveOnOne: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'compact', 'small']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default QuantityControl; 