import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { submitCallbackForm } from '../../lib/api/bitrix';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';
import styles from './ContactsModal.module.css';

const ContactsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    patronymic: '',
    phone: ''
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
        name: '',
        patronymic: '',
        phone: ''
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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен для заполнения';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
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
      const callbackData = {
        first_name: formData.name.trim(),
        phone_number: formData.phone.trim()
      };
      
      const result = await submitCallbackForm(callbackData);
      
      if (result.success) {
        showSuccessToast('Заявка на звонок принята! Мы перезвоним вам в ближайшее время.');
        // Reset form and close modal after a delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Произошла ошибка при заказе звонка');
      }
    } catch (error) {
      console.error('Error submitting callback form:', error);
      showErrorToast(error.message || 'Произошла ошибка при заказе звонка');
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
                name="patronymic"
                placeholder="Ваше отчество" 
                className={styles.input}
                value={formData.patronymic}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              
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
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Заказать'}
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

export default ContactsModal; 