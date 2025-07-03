import React from 'react';
import PropTypes from 'prop-types';
import Toast from './index';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
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
    </>
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