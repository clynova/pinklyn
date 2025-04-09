'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto global
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [pageTitle, setPageTitle] = useState('Pinklyn');
  const [darkMode, setDarkMode] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Verificar modo oscuro al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar preferencia guardada
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      
      // Verificar preferencia del sistema si no hay preferencia guardada
      const prefersDarkMode = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const shouldEnableDarkMode = savedDarkMode !== null ? savedDarkMode : prefersDarkMode;
      
      setDarkMode(shouldEnableDarkMode);
      
      if (shouldEnableDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Cambiar el título del documento cuando cambia el pageTitle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = pageTitle;
    }
  }, [pageTitle]);

  // Toggle para el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', !darkMode ? 'true' : 'false');
    }
  };
  
  // Mostrar el loader global
  const showLoading = (message = '') => {
    setLoadingMessage(message);
    setGlobalLoading(true);
  };
  
  // Ocultar el loader global
  const hideLoading = () => {
    setGlobalLoading(false);
    setLoadingMessage('');
  };

  return (
    <GlobalContext.Provider value={{ 
      pageTitle, 
      setPageTitle,
      darkMode,
      toggleDarkMode,
      globalLoading,
      loadingMessage,
      showLoading,
      hideLoading
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}

export { GlobalContext };