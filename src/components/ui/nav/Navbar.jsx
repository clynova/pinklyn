'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenuAlt3, HiX, HiSearch } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from './UserDropdown';
import Navigation from "./Navigation";

/**
 * Componente de barra de navegación principal
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();

  // Controlar montaje para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Ofertas", href: "/ofertas" },
    { name: "Categorías", href: "/categorias" },
    { name: "Productos", href: "/productos" },
  ];

  // Componente para el menú móvil
  const renderMobileMenu = () => (
    <div
      className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
      md:hidden fixed top-16 left-0 right-0 bottom-0 
      bg-slate-900 backdrop-blur-lg transition-transform duration-300 ease-in-out z-40`}
    >
      <div className="flex flex-col p-4 space-y-4 bg-slate-900">
        <div className="mb-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Navigation links={navLinks} onMobileClick={() => setIsMenuOpen(false)} />
        </div>
        <div className="border-t border-slate-800 pt-4">
          {!mounted || loading ? (
            // Placeholder durante la carga
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-slate-700 rounded-md"></div>
              <div className="h-10 bg-slate-700 rounded-md"></div>
            </div>
          ) : user ? (
            <>
              <Link
                href="/perfil"
                className="block w-full text-center text-slate-300 hover:text-white px-4 py-2 text-lg font-medium mb-3 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Ver mi perfil de usuario"
              >
                Mi Perfil
              </Link>
              {user.roles?.includes('admin') && (
                <Link
                  href="/admin"
                  className="block w-full text-center text-slate-300 hover:text-white px-4 py-2 text-lg font-medium mb-3 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Acceder al panel de administración"
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center bg-red-500 hover:bg-red-600
                text-white px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200"
                aria-label="Cerrar sesión en la cuenta actual"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="space-y-3 flex flex-col">
              <Link
                href="/auth/login"
                className="block text-center text-slate-300 hover:text-white px-4 py-2 text-lg font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                href="/auth/register"
                className="block text-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                text-white px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar placeholder para los botones de autenticación durante la carga
  const renderAuthPlaceholder = () => (
    <div className="animate-pulse flex items-center space-x-4">
      <div className="h-9 w-20 bg-slate-700 rounded-md"></div>
      <div className="h-9 w-24 bg-slate-700 rounded-lg"></div>
    </div>
  );

  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 md:w-1/4 flex items-center">
              <Link
                href="/"
                className="flex items-center"
                aria-label="Ir a la página principal"
              >
                <Image 
                  src="/images/logo.svg"
                  alt="Pinklyn Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 mr-2"
                />
                <span 
                  className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300"
                >
                  Pinklyn
                </span>
              </Link>
            </div>

            {/* Contenedor de navegación - Se ajusta según el tamaño de pantalla */}
            <div className="hidden md:flex w-2/4 justify-center">
              {!isSearchExpanded ? (
                <div className="flex space-x-8">
                  <Navigation links={navLinks} />
                </div>
              ) : (
                <div className="w-full max-w-xl px-4">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="Buscar..."
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        onClick={() => setIsSearchExpanded(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <HiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contenedor derecho */}
            <div className="flex-1 flex justify-end items-center md:w-1/4">
              {/* Botón de búsqueda */}
              <div className="hidden md:flex items-center space-x-2">
                {!isSearchExpanded && (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                    aria-label="Buscar productos"
                  >
                    <HiSearch className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Separador */}
              <div className="hidden md:block w-4"></div>

              <div className="hidden md:block">
                {/* Mostrar placeholder durante la carga inicial o si no se ha montado el componente */}
                {!mounted || loading ? (
                  renderAuthPlaceholder()
                ) : user ? (
                  <UserDropdown />
                ) : (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link
                      href="/auth/login"
                      className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                      text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>

              {/* Botón de menú móvil */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white p-2"
                  aria-label="Abrir menú"
                >
                  {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
      <div className="h-16">
        {/* Espacio para evitar que el contenido se oculte debajo de la barra de navegación fija */}
      </div>
    </>
  );
};

export default Navbar;