import React from 'react';
import Link from 'next/link';

/**
 * PanelProductCard - Componente de tarjeta de producto visualmente atractivo para el panel principal.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @param {'standard' | 'wide' | 'tall' | 'large'} props.layout - Define el tamaño y forma de la card en el grid
 * @returns {JSX.Element} - Componente de tarjeta de producto
 */
const PanelProductCard = ({ product, layout = 'standard' }) => {
  if (!product) {
    // Fallback en caso de que no haya producto, aunque PanelCards debería manejar esto.
    return null;
  }

  // --- Extracción de datos del producto ---
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
                         product.image || // Fallback a image si existe
                         '/images/placeholder.svg'; // Placeholder si no hay imagen

  const nombre = product.nombre || product.name || 'Producto sin nombre';
  const productId = product._id || product.id;

  // --- Clases de Layout ---
  // Define cómo se expande la card en el grid de PanelCards
  const layoutClasses = {
    standard: 'col-span-1 row-span-1 aspect-square', // Cuadrada
    wide: 'col-span-2 row-span-1 aspect-video',    // Rectangular ancha
    tall: 'col-span-1 row-span-2 aspect-[9/16]',  // Rectangular alta
    large: 'col-span-2 row-span-2 aspect-square', // Cuadrada grande
  };

  return (
    <Link
      href={`/productos/${productId}`} // Redirige a la página de detalles del producto
      className={`
        group relative overflow-hidden rounded-none bg-gray-200  /* Sin bordes redondeados y sin gap */
        transition-transform duration-500 ease-in-out transform hover:scale-105 /* Efecto sutil al hacer hover */
        ${layoutClasses[layout] || layoutClasses.standard} /* Aplica clases de tamaño */
      `}
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" // Efecto de zoom suave en la imagen
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

      {/* Badge de Descuento (opcional) */}
      {hasDiscount && (
        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          -{discountPercentage}%
        </span>
      )}
    </Link>
  );
};

export default PanelProductCard;
