import React from 'react';
import styles from './DeliveryInfoForm.module.css';

const DeliveryInfoForm = () => {
  return (
    <>
    <p className={styles.infoText}>
    Lorem ipsum odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; 
    molestie ultricies vel.ipsum odor amet, consectetuer adipiscing elit. 
    Nisi montes netus habitant; molestie ultricies vel.ipsum odor amet, 
    consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.ipsum 
    odor amet, consectetuer adipiscing elit. Nisi montes netus habitant; molestie ultricies vel.
  </p>
    <div className={styles.deliveryFormContainer}>
      <div className={styles.cdekSection}>
        <h2 className={styles.sectionTitle}>Доставка СДЕК</h2>
        <div className={styles.cdekWidgetPlaceholder}>
          <p>Здесь будет виджет выбора пункта выдачи СДЕК.</p>
        </div>
      </div>

      <div className={styles.recipientSection}>
        <h2 className={styles.sectionTitle}>Получатель</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="lastName" className={styles.label}>Фамилия</label> */}
            <input type="text" id="lastName" name="lastName" placeholder="Фамилия" className={styles.inputField} />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="firstName" className={styles.label}>* Имя</label> */}
            <input type="text" id="firstName" name="firstName" placeholder="* Имя" className={styles.inputField} required />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="patronymic" className={styles.label}>Отчество</label> */}
            <input type="text" id="patronymic" name="patronymic" placeholder="Отчество" className={styles.inputField} />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="phoneNumber" className={styles.label}>Номер телефона</label> */}
            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Номер телефона" className={styles.inputField} />
          </div>
        </div>
      </div>
      
      {/* Optional: Text from Figma - not sure if it is a description or instruction */}

    </div>
    </>
  );
};

export default DeliveryInfoForm; 