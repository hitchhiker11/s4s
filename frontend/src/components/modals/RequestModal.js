import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { submitRequestForm } from '../../lib/api/bitrix';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';
import styles from './RequestModal.module.css';

const RequestModal = ({ 
  isOpen, 
  onClose, 
  initialValues = {} // New prop for prefilled values
}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    wishes: ''
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

  // Update form data when modal opens with initial values
  useEffect(() => {
    if (isOpen && initialValues) {
      setFormData(prevData => ({
        ...prevData,
        name: initialValues.name || '',
        surname: initialValues.surname || '',
        phone: initialValues.phone || '',
        email: initialValues.email || '',
        wishes: initialValues.wishes || ''
      }));
    }
  }, [isOpen, initialValues]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        surname: '',
        phone: '',
        email: '',
        wishes: ''
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Фамилия обязательна для заполнения';
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
      const requestData = {
        first_name: formData.name.trim(),
        last_name: formData.surname.trim(),
        phone_number: formData.phone.trim(),
        email: formData.email.trim(),
        comment: formData.wishes.trim()
      };
      
      const result = await submitRequestForm(requestData);
      
      if (result.success) {
        showSuccessToast('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        // Reset form and close modal after a delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (error) {
      // console.error('Error submitting request form:', error);
      showErrorToast(error.message || 'Произошла ошибка при отправке заявки');
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
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Ваше имя" 
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              
              <input 
                type="text" 
                name="surname"
                placeholder="Ваша фамилия" 
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
                name="wishes"
                placeholder="Ваши пожелания"
                className={`${styles.input} ${styles.textarea}`}
                value={formData.wishes}
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

export default RequestModal; 