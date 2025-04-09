'use client';

import React from 'react';

/**
 * Componente de carga tipo esqueleto (skeleton) que muestra placeholders
 * mientras se cargan los elementos reales
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Tipo de esqueleto: 'card', 'text', 'image', 'product', 'profile'
 * @param {number} props.count - Número de elementos para mostrar
 * @param {string} props.className - Clases adicionales para el contenedor
 * @returns {JSX.Element}
 */
const SkeletonLoader = ({ 
  variant = 'text', 
  count = 1, 
  className = '' 
}) => {
  // Clase base para el efecto de pulso
  const pulseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  // Función para renderizar diferentes tipos de skeletons
  const renderSkeleton = (type, index) => {
    switch (type) {
      case 'text':
        return (
          <div key={index} className="w-full">
            <div className={`${pulseClass} h-4 w-full mb-2`}></div>
            <div className={`${pulseClass} h-4 w-3/4 mb-2`}></div>
          </div>
        );
        
      case 'image':
        return (
          <div key={index} className={`${pulseClass} w-full h-48`}></div>
        );
        
      case 'profile':
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className={`${pulseClass} rounded-full h-12 w-12`}></div>
            <div className="space-y-2 flex-1">
              <div className={`${pulseClass} h-4 w-1/3`}></div>
              <div className={`${pulseClass} h-3 w-2/3`}></div>
            </div>
          </div>
        );
        
      case 'product':
        return (
          <div key={index} className="flex flex-col space-y-3">
            <div className={`${pulseClass} h-48 w-full`}></div>
            <div className="space-y-2">
              <div className={`${pulseClass} h-4 w-2/3`}></div>
              <div className={`${pulseClass} h-4 w-1/3`}></div>
              <div className={`${pulseClass} h-4 w-1/4 mt-4`}></div>
            </div>
          </div>
        );
        
      case 'card':
      default:
        return (
          <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className={`${pulseClass} h-32 w-full`}></div>
            <div className="mt-3 space-y-2">
              <div className={`${pulseClass} h-5 w-3/4`}></div>
              <div className={`${pulseClass} h-4 w-1/2`}></div>
              <div className={`${pulseClass} h-4 w-1/4 mt-3`}></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => renderSkeleton(variant, i))}
    </div>
  );
};

export default SkeletonLoader;