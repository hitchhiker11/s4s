import { useState, useCallback } from 'react';

/**
 * Hook for managing toast notifications
 * @returns {Object} Toast state and functions
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Show a toast message (replaces any existing toast)
  const showToast = useCallback((message, type = 'error', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      isVisible: true,
      ...options
    };

    // Replace previous toasts to ensure only one is visible at a time
    setToasts([toast]);

    // Auto-remove toast after duration (default 7 seconds)
    const duration = options.duration ?? 7000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  // Show success toast (green)
  const showSuccessToast = useCallback((message, options = {}) => {
    return showToast(message, 'success', options);
  }, [showToast]);

  // Show error toast (red)
  const showErrorToast = useCallback((message, options = {}) => {
    return showToast(message, 'error', options);
  }, [showToast]);

  // Show warning toast (orange)
  const showWarningToast = useCallback((message, options = {}) => {
    return showToast(message, 'warning', options);
  }, [showToast]);

  // Show info toast (blue)
  const showInfoToast = useCallback((message, options = {}) => {
    return showToast(message, 'info', options);
  }, [showToast]);

  // Remove specific toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearToasts
  };
}; 