'use client';

import Link from 'next/link';

/**
 * Componente Navigation extraído para mejor organización
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.links - Array de objetos {name, href} para los enlaces
 * @param {Function} props.onMobileClick - Función opcional a ejecutar al hacer clic (para menú móvil)
 */
const Navigation = ({ links, onMobileClick = null }) => {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
          onClick={onMobileClick}
          aria-label={`Ir a la sección ${link.name}`}
        >
          {link.name}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" aria-hidden="true"></span>
        </Link>
      ))}
    </>
  );
};

export default Navigation;