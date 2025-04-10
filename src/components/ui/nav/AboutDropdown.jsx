'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Componente de menú desplegable para la sección "Acerca de"
 */
export const AboutDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Acerca de</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={closeDropdown} 
            aria-hidden="true"
          />
          <div
            className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1">
              <Link
                href="/nosotros"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeDropdown}
                role="menuitem"
              >
                Nuestra Historia
              </Link>
              <Link
                href="/equipo"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeDropdown}
                role="menuitem"
              >
                Nuestro Equipo
              </Link>
              <Link
                href="/contacto"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeDropdown}
                role="menuitem"
              >
                Contacto
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};