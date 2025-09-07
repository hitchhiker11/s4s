import React, { useState, useEffect } from 'react';
import CdekWidget from '../CdekWidget/CdekWidget';
import styles from './DeliveryInfoForm.module.css';
import { normalizePhoneNumber } from '../../lib/phone';

const DeliveryInfoForm = ({ 
  isActiveTab = false, 
  onDeliveryPriceChange, 
  onDeliverySelect,
  onUserDataChange,
  // CDEK Widget state props
  cdekWidgetReady,
  setCdekWidgetReady,
  cdekScriptLoaded,
  setCdekScriptLoaded,
  selectedDelivery,
  setSelectedDelivery
}) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    phoneNumber: '',
    email: '',
    comment: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneBlur = () => {
    setFormData(prev => ({ ...prev, phoneNumber: normalizePhoneNumber(prev.phoneNumber) }));
  };

  useEffect(() => {
    if (onUserDataChange) {
      onUserDataChange(formData);
    }
  }, [formData, onUserDataChange]);

  return (
    <>
    <p className={styles.infoText}>
    Доставка товара осуществляется по всей территории Российской Федерации через службы доставки СДЭК. Оплата доставки за счет получателя.

Передача товара в службы доставки осуществляется в течение 3-х рабочих дней с момента оформления заказа на сайте магазина.

Факт отправки товара подтверждается высланной на почту заказчику квитанцией приема товара курьерской службой.

Свой вопрос по доставке вы можете задать по почте: shop@weapon-culture.ru
  </p>
    <div className={styles.deliveryFormContainer}>
      <div className={styles.cdekSection}>
        <h2 className={styles.sectionTitle}>Доставка СДЕК</h2>
        <CdekWidget 
          isActiveTab={isActiveTab}
          // onDeliveryPriceChange={onDeliveryPriceChange}
          onDeliverySelect={onDeliverySelect}
          defaultLocation="Москва"
          // Pass CDEK widget state management props
          isWidgetReady={cdekWidgetReady}
          setIsWidgetReady={setCdekWidgetReady}
          isScriptLoaded={cdekScriptLoaded}
          setIsScriptLoaded={setCdekScriptLoaded}
          selectedDelivery={selectedDelivery}
          setSelectedDelivery={setSelectedDelivery}
        />
      </div>

      <div className={styles.recipientSection}>
        <h2 className={styles.sectionTitle}>Получатель</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="lastName" className={styles.label}>Фамилия</label> */}
            <input type="text" id="lastName" name="lastName" placeholder="* Фамилия" className={styles.inputField} value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="firstName" className={styles.label}>* Имя</label> */}
            <input type="text" id="firstName" name="firstName" placeholder="* Имя" className={styles.inputField} required value={formData.firstName} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="patronymic" className={styles.label}>Отчество</label> */}
            <input type="text" id="patronymic" name="patronymic" placeholder="* Отчество" className={styles.inputField} value={formData.patronymic} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="phoneNumber" className={styles.label}>Номер телефона</label> */}
            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="* Номер телефона" className={styles.inputField} value={formData.phoneNumber} onChange={handleChange} onBlur={handlePhoneBlur} required />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" id="email" name="email" placeholder="* Email" className={styles.inputField} value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <textarea id="comment" name="comment" placeholder="Комментарий" className={styles.inputField} value={formData.comment} onChange={handleChange} />
          </div>
        </div>
      </div>
      
      {/* Optional: Text from Figma - not sure if it is a description or instruction */}

    </div>
    </>
  );
};

export default DeliveryInfoForm; 