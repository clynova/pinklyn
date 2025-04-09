import { useState, useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';

/**
 * Hook personalizado para gestionar estados de carga de manera más eficiente
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.useGlobal - Si debe usar el loader global o local
 * @param {string} options.defaultMessage - Mensaje predeterminado para mostrar
 * @param {function} options.onStart - Callback a ejecutar cuando inicia la carga
 * @param {function} options.onFinish - Callback a ejecutar cuando termina la carga
 * @returns {Object} - Objeto con estado y funciones para controlar la carga
 */
const useLoading = (options = {}) => {
  const {
    useGlobal = false,
    defaultMessage = '',
    onStart = null,
    onFinish = null
  } = options;

  // Estado local para carga (si no se usa global)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  // Contexto global para carga global
  const { showLoading, hideLoading } = useContext(GlobalContext);

  // Iniciar carga
  const startLoading = (customMessage = defaultMessage) => {
    if (onStart) onStart();
    
    if (useGlobal) {
      showLoading(customMessage);
    } else {
      setMessage(customMessage);
      setIsLoading(true);
    }
  };

  // Detener carga
  const stopLoading = () => {
    if (onFinish) onFinish();
    
    if (useGlobal) {
      hideLoading();
    } else {
      setIsLoading(false);
      setMessage(defaultMessage);
    }
  };

  // Función para envolver una promesa con estado de carga
  const wrapPromise = async (promise, loadingMessage = defaultMessage) => {
    startLoading(loadingMessage);
    try {
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    wrapPromise
  };
};

export default useLoading;