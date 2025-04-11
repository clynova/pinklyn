import React from 'react';
import Link from 'next/link';

/**
 * PanelProductCard - Componente de tarjeta de producto visualmente atractivo para el panel principal.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @param {string} props.productId - ID único del producto
 * @param {'standard' | 'wide' | 'tall' | 'large'} props.layout - Define el tamaño y forma de la card en el grid
 * @param {boolean} props.isDimmed - Indica si la tarjeta debe aparecer difuminada
 * @param {Function} props.onMouseEnter - Función a llamar cuando el mouse entra
 * @param {Function} props.onMouseLeave - Función a llamar cuando el mouse sale
 * @returns {JSX.Element} - Componente de tarjeta de producto
 */
const PanelProductCard = ({
  product,
  productId,
  layout = 'standard',
  isDimmed,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!product) {
    return null;
  }

  // --- Extracción de datos del producto (sin cambios) ---
  const variantePredeterminada = product.variantePredeterminada ||
                               product.variantes?.find(v => v.esPredeterminada) ||
                               product.variantes?.[0];

  const price = variantePredeterminada?.precio ?? product.precio ?? product.price ?? 0;
  const descuento = variantePredeterminada?.descuento ?? 0;
  let originalPrice;

  if (descuento > 0) {
    originalPrice = price / (1 - descuento / 100);
  } else {
    originalPrice = product.precioOriginal ?? product.originalPrice;
  }

  const hasDiscount = (descuento > 0) || (originalPrice != null && originalPrice > price);
  const discountPercentage = hasDiscount
    ? (descuento || Math.round(100 - (price / (originalPrice || price) * 100)))
    : 0;

  const imagenPrincipal = product.multimedia?.imagenes?.find(img => img.esPrincipal)?.url ||
                         product.multimedia?.imagenes?.[0]?.url ||
                         product.image ||
                         '/images/placeholder.svg';

  const nombre = product.nombre || product.name || 'Producto sin nombre';

  // --- Clases de Layout (sin cambios) ---
  const layoutClasses = {
    standard: 'col-span-1 row-span-1 aspect-square',
    wide: 'col-span-2 row-span-1 aspect-video',
    tall: 'col-span-1 row-span-2 aspect-[9/16]',
    large: 'col-span-2 row-span-2 aspect-square',
  };

  return (
    <Link
      href={`/productos/${productId}`}
      onMouseEnter={() => onMouseEnter(productId)} // Llama al handler del parent con el ID
      onMouseLeave={onMouseLeave} // Llama al handler del parent
      className={`
        group relative overflow-hidden rounded-none bg-gray-200
        transition-all duration-300 ease-in-out /* Transición para todo */
        ${layoutClasses[layout] || layoutClasses.standard}
        ${isDimmed
          ? 'filter blur-sm opacity-50 scale-95' // Estilos cuando está difuminado (blur, menos opacidad, ligero encogimiento)
          : 'filter-none opacity-100 scale-100 hover:scale-105' // Estilos normales + efecto hover scale solo si no está difuminado
        }
      `}
    >
      {/* Imagen de fondo (con su propio hover effect independiente) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${imagenPrincipal})` }}
        aria-label={nombre}
      />

      {/* Overlay Degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Contenido superpuesto */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
        <h3 className="text-lg md:text-xl font-medium mb-1 drop-shadow-md line-clamp-2">
          {nombre}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-bold drop-shadow-md">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && originalPrice && (
            <span className="text-sm md:text-base text-gray-300 line-through drop-shadow-md">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Badge de Descuento */}
      {hasDiscount && (
        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          -{discountPercentage}%
        </span>
      )}
    </Link>
  );
};

export default PanelProductCard;
