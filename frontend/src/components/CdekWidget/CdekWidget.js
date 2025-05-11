import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import PropTypes from 'prop-types';
import styles from './CdekWidget.module.css';

const CdekWidget = ({
  apiKey = 'f4e034c2-8c37-4168-8b97-99b6b3b268d7', // Default API key from example
  defaultLocation = 'Новосибирск', // Default location
  onChoosePoint, // Callback function for when a point is chosen
  goods = [], // Optional: [{ length: 10, width: 10, height: 10, weight: 1 }]
  debug = false, // Added debug prop, defaults to false
  // Add other CDEK widget options as props if needed
}) => {
  const widgetContainerRef = useRef(null);
  const cdekWidgetInstance = useRef(null); // To store the widget instance
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Ensure the CDEK script is loaded, the container is available, and widget is constructible
    if (scriptLoaded && typeof window !== 'undefined' && window.CDEKWidget && widgetContainerRef.current) {
      // If an old instance exists, destroy it first
      if (cdekWidgetInstance.current && typeof cdekWidgetInstance.current.destroy === 'function') {
        cdekWidgetInstance.current.destroy();
        cdekWidgetInstance.current = null;
        // console.log('Previous CDEK Widget instance destroyed');
      }
      
      // Initialize the widget only if it hasn't been initialized or after destroying old one
      if (!cdekWidgetInstance.current) {
        // console.log('Initializing CDEK Widget with params:', { apiKey, defaultLocation, goods, debug });
        try {
          cdekWidgetInstance.current = new window.CDEKWidget({
            apiKey: apiKey,
            defaultLocation: defaultLocation,
            root: widgetContainerRef.current, // Use root for v3
            onChoose: (chosenPointData) => {
              if (onChoosePoint) {
                onChoosePoint(chosenPointData);
              }
            },
            goods: goods, 
            debug: debug, // Pass debug flag to CDEK widget
            // Ensure other necessary V3 parameters are set if needed.
            // For example, `from` location for calculations:
            // from: defaultLocation, // or another specified city
            canChoose: true, // Explicitly set to allow choosing points
          });
          // console.log('CDEK Widget Initialized');
        } catch (error) {
          console.error('Error initializing CDEK Widget:', error);
          // If it's a CanceledError, it might be logged here too
        }
      }
    }

    // Cleanup function to destroy the widget instance when the component unmounts
    // or before the effect runs again due to dependency changes.
    return () => {
      if (cdekWidgetInstance.current && typeof cdekWidgetInstance.current.destroy === 'function') {
        // console.log('Destroying CDEK Widget instance on cleanup');
        cdekWidgetInstance.current.destroy();
        cdekWidgetInstance.current = null;
      }
    };
  }, [scriptLoaded, apiKey, defaultLocation, onChoosePoint, goods, debug]); // Added scriptLoaded and debug to dependencies

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"
        strategy="afterInteractive" // Load after the page becomes interactive
        onLoad={() => {
          // console.log('CDEK Widget script loaded successfully.');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load CDEK Widget script:', e);
          setScriptLoaded(false); // Ensure we don't try to init if script fails
        }}
      />
      {/* Container for the CDEK widget */}
      <div ref={widgetContainerRef} id="cdek-widget-container" className={styles.widgetContainer}>
        {!scriptLoaded && <p>Загрузка виджета СДЭК...</p>}
      </div>
    </>
  );
};

CdekWidget.propTypes = {
  apiKey: PropTypes.string,
  defaultLocation: PropTypes.string,
  onChoosePoint: PropTypes.func.isRequired,
  goods: PropTypes.arrayOf(PropTypes.shape({
    length: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
  })),
  debug: PropTypes.bool, // Added prop type for debug
};

export default CdekWidget; 