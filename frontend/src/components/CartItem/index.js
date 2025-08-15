import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Image from 'next/image';
import QuantityControl from '../QuantityControl';
import styles from './CartItem.module.css';
// import { MinusIcon, PlusIcon } from '../icons'; // MinusIcon no longer needed for this version

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  if (!item) {
    return null;
  }

  const isLoading = item.isLoading || false; // Get loading state from item
  const router = useRouter();

  const navigateToProduct = () => {
    if (item.productLink) {
      router.push(item.productLink);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (!isLoading) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (!isLoading) {
      onRemove(item.id);
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer} onClick={navigateToProduct} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigateToProduct(); }}>
        <Image 
          src={item.imageUrl || '/images/placeholder.png'} 
          alt={item.name} 
          width={100} 
          height={100} 
          objectFit="contain"
        />
      </div>
      <div className={styles.detailsContainer} onClick={navigateToProduct} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigateToProduct(); }}>
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
      <div className={styles.quantityAndActions} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      {item.stock && <p className={styles.stockInfo}>{`${item.stock} шт. в наличии`}</p>}
        {/* Moved Price for mobile layout - will be visible due to CSS for .quantityAndActions .productPrice */}
        <p className={`${styles.productPrice} ${styles.mobilePrice}`}>{`₽${item.price.toLocaleString('ru-RU')}`}</p>
        
        <QuantityControl
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
          isLoading={isLoading}
          size="default"
          showRemoveOnOne={true}
          className={styles.quantityControlWrapper}
        />
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
    productLink: PropTypes.string,
    isLoading: PropTypes.bool // Add loading state prop
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem; 