'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Componente de carga a pantalla completa con temática de regalo
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje opcional para mostrar durante la carga
 * @returns {JSX.Element}
 */
const FullscreenLoader = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-400/90 to-purple-600/90 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="relative">
          {/* Spinner principal */}
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          
          {/* Elemento decorativo: moño */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10">
              {/* Centro del moño */}
              <div className="w-4 h-4 bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Arcos del moño */}
              <div className="w-10 h-3 bg-white absolute top-1/2 transform -translate-y-1/2 rounded-full"></div>
              <div className="w-3 h-10 bg-white absolute left-1/2 transform -translate-x-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {message && (
          <p className="mt-6 text-white font-medium text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default FullscreenLoader;