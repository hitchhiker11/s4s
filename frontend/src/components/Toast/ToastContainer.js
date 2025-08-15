import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Toast from './index';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  // Render toasts into body to avoid being affected by CSS transforms/overflow in parents (e.g., sliders)
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => onRemoveToast(toast.id)}
          duration={toast.duration}
          autoClose={toast.autoClose}
        />
      ))}
    </>,
    document.body
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string,
      isVisible: PropTypes.bool,
      duration: PropTypes.number,
      autoClose: PropTypes.bool
    })
  ),
  onRemoveToast: PropTypes.func.isRequired
};

export default ToastContainer; 