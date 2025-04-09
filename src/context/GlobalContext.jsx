'use client';

import { createContext, useContext, useState } from 'react';

// Crear el contexto global
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [pageTitle, setPageTitle] = useState('Pinklyn');
  const [darkMode, setDarkMode] = useState(false);

  // Cambiar el título del documento cuando cambia el pageTitle
  useState(() => {
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

  return (
    <GlobalContext.Provider value={{ 
      pageTitle, 
      setPageTitle,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}