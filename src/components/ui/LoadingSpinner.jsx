'use client';

import React from 'react';

const variants = {
  small: "w-5 h-5",
  medium: "w-8 h-8",
  large: "w-12 h-12",
  fullscreen: "w-16 h-16",
};

const colors = {
  primary: "text-pink-500 border-pink-200",
  secondary: "text-purple-500 border-purple-200",
  neutral: "text-gray-500 border-gray-200",
  light: "text-white border-white/30",
};

/**
 * Componente de carga reutilizable que muestra una animación tipo "regalo girando"
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Tamaño del spinner: 'small', 'medium', 'large', 'fullscreen'
 * @param {string} props.color - Color del spinner: 'primary', 'secondary', 'neutral', 'light'
 * @param {string} props.label - Texto opcional que se muestra debajo del spinner
 * @param {boolean} props.overlay - Si debe mostrar un fondo oscurecido (para carga de página completa)
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ 
  variant = "medium", 
  color = "primary", 
  label,
  overlay = false,
  className = "",
}) => {
  const spinnerClasses = `
    ${variants[variant] || variants.medium} 
    ${colors[color] || colors.primary}
    rounded-full border-4 border-t-transparent animate-spin relative
  `;
  
  // Decoración como un "moño" de regalo en el centro del spinner
  const ribbonClasses = `
    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    ${variant === "small" ? "w-1.5 h-1.5" : variant === "large" || variant === "fullscreen" ? "w-3 h-3" : "w-2 h-2"}
    ${color === "primary" ? "bg-pink-500" : color === "secondary" ? "bg-purple-500" : color === "light" ? "bg-white" : "bg-gray-500"}
    rounded-full
  `;

  // Si es fullscreen, añade un overlay semi-transparente
  if (variant === "fullscreen" || overlay) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={spinnerClasses}></div>
            <div className={ribbonClasses}></div>
          </div>
          {label && <p className="mt-4 text-white font-medium">{label}</p>}
        </div>
      </div>
    );
  }

  // Para spinner inline
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <div className={spinnerClasses}></div>
        <div className={ribbonClasses}></div>
      </div>
      {label && <p className="mt-2 text-sm">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;