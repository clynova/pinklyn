'use client';

import React, { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';
import { FullscreenLoader } from '../loading';

/**
 * Componente que muestra un loader a pantalla completa cuando 
 * el estado de carga global está activo
 */
const GlobalLoading = () => {
  const { globalLoading, loadingMessage } = useContext(GlobalContext);
  
  if (!globalLoading) return null;
  
  return <FullscreenLoader message={loadingMessage || "Cargando..."} />;
};

export default GlobalLoading;