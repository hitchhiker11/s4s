import React from 'react';
import styles from './RequestModal.module.css';

const RequestModal = ({ isOpen, onClose }) => {
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
            <h2 className={styles.title}>
              Оформите <br />
              заявку
            </h2>
            <p className={styles.description}>
              Напишите нам о ваших пожеланиях. Мы найдем варианты закупки и
              доставки данного товара (группы товаров) и свяжемся в вами в
              ближайшее время
            </p>
          </div>
          <div className={styles.formSection}>
            <form>
              <input type="text" placeholder="Ваше имя" className={styles.input} />
              <input type="text" placeholder="Ваша фамилия" className={styles.input} />
              <input type="tel" placeholder="Номер телефона" className={styles.input} />
              <input type="email" placeholder="Почта" className={styles.input} />
              <textarea
                placeholder="Ваши пожелания"
                className={`${styles.input} ${styles.textarea}`}
              ></textarea>
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

export default RequestModal; 