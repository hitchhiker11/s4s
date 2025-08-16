'use client';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CdekWidget.module.css';

const CdekWidget = ({ 
  onDeliveryPriceChange, 
  onDeliverySelect, 
  isActiveTab = false, 
  defaultLocation = 'Москва',
  // External state management props
  isWidgetReady: externalIsWidgetReady,
  setIsWidgetReady: externalSetIsWidgetReady,
  isScriptLoaded: externalIsScriptLoaded,
  setIsScriptLoaded: externalSetIsScriptLoaded,
  selectedDelivery: externalSelectedDelivery,
  setSelectedDelivery: externalSetSelectedDelivery
}) => {
  // Create a ref to store the widget instance
  const widget = useRef(null);
  
  // Use external state if provided, otherwise use local state
  const [localIsWidgetReady, setLocalIsWidgetReady] = useState(false);
  const [localIsScriptLoaded, setLocalIsScriptLoaded] = useState(false);
  const [localSelectedDelivery, setLocalSelectedDelivery] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const isWidgetReady = externalIsWidgetReady !== undefined ? externalIsWidgetReady : localIsWidgetReady;
  const setIsWidgetReady = externalSetIsWidgetReady || setLocalIsWidgetReady;
  const isScriptLoaded = externalIsScriptLoaded !== undefined ? externalIsScriptLoaded : localIsScriptLoaded;
  const setIsScriptLoaded = externalSetIsScriptLoaded || setLocalIsScriptLoaded;
  const selectedDelivery = externalSelectedDelivery !== undefined ? externalSelectedDelivery : localSelectedDelivery;
  const setSelectedDelivery = externalSetSelectedDelivery || setLocalSelectedDelivery;

  // Function to log errors
  const logError = (message, error) => {
    // console.error(`[CdekWidget] ${message}`, error);
  };

  // Check if CDEK script is loaded
  const checkScriptLoaded = () => {
    return typeof window !== 'undefined' && window.CDEKWidget;
  };

  // Function to initialize the CDEK widget
  const initializeWidget = useCallback(() => {
    // Skip initialization if widget is already ready and instance exists
    if (isWidgetReady && widget.current) {
      // console.log('[CdekWidget] Widget already initialized, skipping re-initialization');
      return;
    }

    if (!checkScriptLoaded()) {
      logError('CDEK Widget script is not loaded', null);
      return;
    }

    try {
      widget.current = new window.CDEKWidget(getWidgetConfig());
      setIsWidgetReady(true);
      // console.log('[CdekWidget] Widget initialized successfully');
    } catch (error) {
      logError('Error initializing CDEK Widget:', error);
    }
  }, [isWidgetReady, setIsWidgetReady]);

  // Widget configuration
  const getWidgetConfig = () => ({
    apiKey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
    canChoose: true,
    servicePath: process.env.NEXT_PUBLIC_CDEK_SERVICE_URL,
    hideFilters: {
      have_cashless: false,
      have_cash: false,
      is_dressing_room: false,
      type: false,
    },
    debug: true,
    defaultLocation: defaultLocation,
    lang: 'rus',
    hideDeliveryOptions: {
      office: false,
      door: true, // Hide door delivery for now
    },
    popup: true,

    // Function called after the widget finishes loading
    onReady: () => {
      // console.log('[CdekWidget] Widget is ready');
      setIsWidgetReady(true);
    },

    // Function called after the customer selects a pickup point
    onChoose: (delivery, rate, address) => {
      // console.log('[CdekWidget] Delivery selected:', { delivery, rate, address });
      
      const deliveryData = {
        delivery,
        address,
        timestamp: Date.now()
        // rate: parseFloat(rate) || 0,
      };
      
      setSelectedDelivery(deliveryData);
      // setDeliveryPrice(deliveryData.rate);
      
      // Notify parent components
      // if (onDeliveryPriceChange) {
      //   onDeliveryPriceChange(deliveryData.rate);
      // }
      if (onDeliverySelect) {
        onDeliverySelect(deliveryData);
      }
    },
  });

  // Load CDEK script when tab becomes active
  useEffect(() => {
    if (!isActiveTab) return;

    // Check if script is already loaded
    if (checkScriptLoaded()) {
      setIsScriptLoaded(true);
      return;
    }

    // Skip loading if already marked as loaded externally
    if (isScriptLoaded) {
      return;
    }

    // Load script only if not already loaded
    if (!document.querySelector('script[src*="@cdek-it/widget"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3';
      script.async = true;
      
      script.onload = () => {
        // console.log('[CdekWidget] CDEK script loaded successfully');
        setIsScriptLoaded(true);
      };
      
      script.onerror = () => {
        logError('Failed to load CDEK script', null);
      };
      
      document.head.appendChild(script);
    }
  }, [isActiveTab, isScriptLoaded, setIsScriptLoaded]);

  // Initialize widget when script is loaded
  useEffect(() => {
    if (isScriptLoaded && isActiveTab && !isWidgetReady) {
      // Small delay to ensure script is fully initialized
      const timer = setTimeout(() => {
        initializeWidget();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isScriptLoaded, isActiveTab, isWidgetReady, initializeWidget]);

  // Open widget function
  const openWidget = () => {
    if (widget.current && isWidgetReady) {
      try {
        widget.current.open();
      } catch (error) {
        logError('Error opening CDEK Widget:', error);
      }
    } else {
      // console.warn('[CdekWidget] Widget is not ready yet');
    }
  };

  if (!isActiveTab) {
    return (
      <div className={styles.placeholderContainer}>
        <p className={styles.placeholderText}>
          Виджет CDEK будет загружен при переходе на вкладку "Информация о доставке"
        </p>
      </div>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>Выбор пункта выдачи</h3>
        {selectedDelivery && (
          <div className={styles.selectedDeliveryInfo}>
            <p className={styles.selectedAddress}>
              <strong>Выбран пункт:</strong> {`${selectedDelivery.address?.name || ''}, ${selectedDelivery.address?.address || ''}, ${selectedDelivery.address?.city || ''}`}
            </p>
            {/* <p className={styles.selectedPrice}>
              <strong>Стоимость доставки:</strong> {selectedDelivery.rate} ₽
            </p> */}
          </div>
        )}
      </div>
      
      <div className={styles.widgetContent}>
        {!isScriptLoaded && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Загрузка виджета CDEK...</p>
          </div>
        )}
        
        {isScriptLoaded && !isWidgetReady && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Инициализация виджета...</p>
          </div>
        )}
        
        {isWidgetReady && (
          <button
            className={styles.openWidgetButton}
            onClick={openWidget}
            type="button"
          >
            {selectedDelivery ? 'Изменить ПВЗ' : 'Выбрать ПВЗ'}
          </button>
        )}
      </div>
    </div>
  );
};

CdekWidget.propTypes = {
  onDeliveryPriceChange: PropTypes.func,
  onDeliverySelect: PropTypes.func,
  isActiveTab: PropTypes.bool,
  defaultLocation: PropTypes.string,
  // External state management props
  isWidgetReady: PropTypes.bool,
  setIsWidgetReady: PropTypes.func,
  isScriptLoaded: PropTypes.bool,
  setIsScriptLoaded: PropTypes.func,
  selectedDelivery: PropTypes.object,
  setSelectedDelivery: PropTypes.func,
};

export default CdekWidget; 