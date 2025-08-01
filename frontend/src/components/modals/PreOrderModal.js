import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { submitPreOrderForm } from '../../lib/api/bitrix';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';
import styles from './PreOrderModal.module.css';

const PreOrderModal = ({ 
  isOpen, 
  onClose, 
  productName, 
  productDescription,
  productId,
  productArticle 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    surname: '',
    phone: '',
    email: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Toast system
  const { 
    toasts, 
    showSuccessToast, 
    showErrorToast, 
    removeToast 
  } = useToast();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        surname: '',
        phone: '',
        email: '',
        comment: ''
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    }
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Отчество обязательно для заполнения';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен для заполнения';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const preOrderData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        surname: formData.surname.trim(),
        phone_number: formData.phone.trim(),
        email: formData.email.trim(),
        comment: formData.comment.trim(),
        product_name: productName || '',
        product_article: productArticle || '',
        product_id: productId || ''
      };
      
      const result = await submitPreOrderForm(preOrderData);
      
      if (result.success) {
        showSuccessToast('Предзаказ оформлен! Мы сообщим вам, когда товар появится в наличии.');
        // Reset form and close modal after a delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Произошла ошибка при оформлении предзаказа');
      }
    } catch (error) {
      console.error('Error submitting pre-order form:', error);
      showErrorToast(error.message || 'Произошла ошибка при оформлении предзаказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Close modal only if clicked directly on overlay (not on modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    // Prevent event bubbling to overlay
    e.stopPropagation();
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className={styles.modal} onClick={handleModalClick}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
          &times;
        </button>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <h2 className={styles.title}>Оформите предзаказ</h2>
            {productName && <h3 className={styles.productName}>{productName}</h3>}
            {/* {productDescription && <p className={styles.productDescription}>{productDescription}</p>} */}
            <p className={styles.availabilityNote}>
              Мы рассмотрим вашу заявку и сообщим, когда товар появится в наличии
            </p>
          </div>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="firstName"
                placeholder="Ваше имя" 
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              
              <input 
                type="text" 
                name="lastName"
                placeholder="Ваша фамилия" 
                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              
              <input 
                type="text" 
                name="surname"
                placeholder="Ваше отчество" 
                className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                value={formData.surname}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.surname && <span className={styles.errorText}>{errors.surname}</span>}
              
              <input 
                type="tel" 
                name="phone"
                placeholder="Номер телефона" 
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              
              <input 
                type="email" 
                name="email"
                placeholder="Почта" 
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              
              <textarea 
                name="comment"
                placeholder="Комментарий" 
                className={`${styles.input} ${styles.textarea}`}
                value={formData.comment}
                onChange={handleInputChange}
                disabled={isSubmitting}
              ></textarea>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Оформить'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal content in a portal to document.body
  return createPortal(modalContent, document.body);
};

export default PreOrderModal; 