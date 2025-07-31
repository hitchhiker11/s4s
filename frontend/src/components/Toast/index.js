import React from 'react';
import PropTypes from 'prop-types';
import styles from './Toast.module.css';

const Toast = ({ 
  message, 
  isVisible, 
  onClose, 
  type = 'error', 
  duration = 7000,
  autoClose = true 
}) => {
  React.useEffect(() => {
    if (isVisible && autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const toastClasses = [
    styles.toast,
    styles[type]
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.toastContainer}>
      <div className={toastClasses}>
        {message}
        <button 
          className={styles.toastCloseButton}
          onClick={onClose}
          aria-label="Закрыть уведомление"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  duration: PropTypes.number,
  autoClose: PropTypes.bool
};

export default Toast; 