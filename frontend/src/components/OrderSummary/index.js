import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ 
  subtotal, 
  packagingCost, 
  shippingCost, 
  total, 
  onCheckout, 
  buttonText = 'Продолжить',
  isCheckoutDisabled = false
}) => {
  const formatCurrency = (amount) => {
    return `₽${amount.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div>
    <div className={styles.orderSummary}>
      <h2 className={styles.title}>Детали оплаты</h2>
      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Сумма заказа</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Упаковка</span>
          {packagingCost === 0 ? (
            <span className={styles.freeShipping}>Бесплатно</span>
          ) : (
            <span>{formatCurrency(packagingCost)}</span>
          )}
        </div>
        <div className={styles.summaryRow}>
          <div>
            <p className={styles.shippingLabel}>Доставка</p>
            <p className={styles.shippingNote}>В пределах Москвы и МО - бесплатно</p> {/* This note is static in Figma */}
          </div>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        <hr className={styles.divider} />
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Итого</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={onCheckout} 
      className={styles.checkoutButton}
      disabled={isCheckoutDisabled}
    >
      {buttonText}
    </button>
    </div>
  );
};

OrderSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  packagingCost: PropTypes.number.isRequired,
  shippingCost: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  isCheckoutDisabled: PropTypes.bool
};

export default OrderSummary; 