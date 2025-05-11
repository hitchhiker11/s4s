import React from 'react';
import styles from './PreOrderModal.module.css';

const PreOrderModal = ({ isOpen, onClose, productName, productDescription }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <h2 className={styles.title}>Оформите предзаказ</h2>
            {productName && <h3 className={styles.productName}>{productName}</h3>}
            {productDescription && <p className={styles.productDescription}>{productDescription}</p>}
            <p className={styles.availabilityNote}>
              Мы рассмотрим вашу заявку и сообщим, когда товар появится в наличии
            </p>
          </div>
          <div className={styles.formSection}>
            <form>
              <input type="text" placeholder="Ваше имя" className={styles.input} />
              <input type="text" placeholder="Ваша фамилия" className={styles.input} />
              <input type="text" placeholder="Ваше отчество" className={styles.input} />
              <input type="tel" placeholder="Номер телефона" className={styles.input} />
              <input type="email" placeholder="Почта" className={styles.input} />
              <textarea placeholder="Комментарий" className={`${styles.input} ${styles.textarea}`}></textarea>
              <button type="submit" className={styles.submitButton}>
                Оформить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderModal; 