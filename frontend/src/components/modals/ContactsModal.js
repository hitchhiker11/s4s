import React from 'react';
import styles from './ContactsModal.module.css';

const ContactsModal = ({ isOpen, onClose }) => {
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
          <div className={styles.contactsSection}>
            <h2 className={styles.title}>Наши контакты</h2>
            <p>+7 (945) 000-00-00</p>
            <p>+7 (945) 111-11-11</p>
            <p>info@shop4shoot.ru</p>
            <p>Москва, улица Пушкина, дом Колотушкина, с1, помещение 2</p>
            <div className={styles.socialIcons}>
              {/* Add social icons here if needed, e.g., VK, Telegram */}
              <span>VK</span> <span>TG</span> {/* Placeholder icons */}
            </div>
          </div>
          <div className={styles.formSection}>
            <h2 className={styles.title}>Закажите звонок</h2>
            <form>
              <input type="text" placeholder="Ваше имя" className={styles.input} />
              <input type="text" placeholder="Ваше отчество" className={styles.input} />
              <input type="tel" placeholder="Номер телефона" className={styles.input} />
              <button type="submit" className={styles.submitButton}>
                Заказать
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsModal; 