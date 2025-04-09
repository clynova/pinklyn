'use client';

import React from 'react';

/**
 * Componente de carga para botones
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Color del spinner: 'white', 'primary', 'black'
 * @returns {JSX.Element}
 */
const ButtonLoader = ({ size = 'md', color = 'white' }) => {
  // Determinar clases basadas en tamaño y color
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'text-white',
    primary: 'text-pink-500',
    black: 'text-gray-900'
  };

  return (
    <svg 
      className={`animate-spin -ml-1 mr-2 ${sizeClasses[size]} ${colorClasses[color]}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default ButtonLoader;