import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './CartItem.module.css';
import { TrashIcon } from '../icons'; // Uncommented TrashIcon
// import { MinusIcon, PlusIcon } from '../icons'; // MinusIcon no longer needed for this version

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  if (!item) {
    return null;
  }

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleQuantityInputChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
    } else if (e.target.value === '') {
      // Allow empty input temporarily, handle onBlur
      onQuantityChange(item.id, ''); // Or some placeholder to indicate it's being edited
    } else {
        onQuantityChange(item.id, 1); // Fallback for invalid entries like 0 or negative
    }
  };

  const handleQuantityInputBlur = (e) => {
    const currentQuantity = e.target.value;
    if (currentQuantity === '' || parseInt(currentQuantity, 10) < 1) {
      onQuantityChange(item.id, 1); // Default to 1 if empty or less than 1
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <Image 
          src={item.imageUrl || '/images/product-placeholder.png'} 
          alt={item.name} 
          width={100} 
          height={100} 
          objectFit="contain"
        />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{item.name}</h3>
          <p className={styles.productBrand}>{item.brand}</p>
          <p className={styles.productDescription}>{item.description}</p>
        </div>
        {/* Price is now moved to quantityAndActions for mobile, 
            but might be wanted here for desktop. 
            Current CSS hides .detailsContainer .priceAndStock on mobile. 
            For a pure mobile-first redesign of this component part, 
            this desktop version might be removed or handled with different CSS.*/}
        <div className={styles.priceAndStock}>
          <p className={styles.productPrice}>{`₽${item.price.toLocaleString('ru-RU')}`}</p>
          {/* {item.stock && <p className={styles.stockInfo}>{`${item.stock} шт. в наличии`}</p>} */}
        </div>
      </div>
      <div className={styles.quantityAndActions}>
      {item.stock && <p className={styles.stockInfo}>{`${item.stock} шт. в наличии`}</p>}
        {/* Moved Price for mobile layout - will be visible due to CSS for .quantityAndActions .productPrice */}
        <p className={`${styles.productPrice} ${styles.mobilePrice}`}>{`₽${item.price.toLocaleString('ru-RU')}`}</p>
        
        <div className={styles.quantityControl}>
          {item.quantity === 1 ? (
            <button 
              onClick={() => onRemove(item.id)}
              className={`${styles.quantityButton} ${styles.removeIconButton}`}
              aria-label="Удалить товар"
            >
              <TrashIcon />
            </button>
          ) : (
            <button 
              onClick={handleDecreaseQuantity}
              className={`${styles.quantityButton} ${styles.decreaseButton}`}
              aria-label="Уменьшить количество"
            >
              <span>-</span>
            </button>
          )}
          <input 
            type="number"
            className={styles.quantityInput}
            value={item.quantity === '' ? '' : item.quantity} // Handle empty string state for editing
            onChange={handleQuantityInputChange}
            onBlur={handleQuantityInputBlur}
            aria-label="Количество товара"
            min="1"
          />
          <button 
            onClick={handleIncreaseQuantity} 
            className={`${styles.quantityButton} ${styles.increaseButton}`}
            aria-label="Увеличить количество"
            // disabled={item.quantity >= item.stock} // Optional: disable if quantity reaches stock
          >
            <span>+</span>
          </button>
        </div>
        {/* Original remove button is hidden by CSS on mobile, so it won't appear there. 
            If this was a desktop-only button, it can remain. 
            For consistency, the new icon button serves as the primary remove action on mobile.*/}
        {/* <button onClick={() => onRemove(item.id)} className={styles.removeButton} aria-label="Удалить товар">
          <span>Удалить</span> 
        </button> */}
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // Allow string for empty input state
    stock: PropTypes.number, 
    productLink: PropTypes.string
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem; 