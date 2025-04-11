import React from 'react';
import Link from 'next/link';
import { FaHeart, FaGift, FaShareAlt } from 'react-icons/fa';

/**
 * PanelProductCard - Componente de tarjeta de producto para el panel de administración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @param {number} props.index - Índice del producto en la lista para animación
 * @returns {JSX.Element} - Componente de tarjeta de producto
 */
const PanelProductCard = ({ product, index = 0 }) => {
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/admin/productos" className="text-primary hover:underline">
          Volver a la lista de productos
        </Link>
      </div>
    );
  }

  // Obtener la variante predeterminada o la primera disponible
  const variantePredeterminada = product.variantePredeterminada || 
                               product.variantes?.find(v => v.esPredeterminada) || 
                               product.variantes?.[0];
  
  // Obtener precio y descuento
  const price = variantePredeterminada?.precio || product.precio || product.price || 0;
  
  // Calcular el precio original basado en el descuento
  // Si hay descuento en la variante, calculamos el precio original
  let originalPrice;
  const descuento = variantePredeterminada?.descuento || 0;
  
  if (descuento > 0) {
    // Si hay descuento, calculamos el precio original
    originalPrice = price / (1 - descuento/100);
  } else {
    originalPrice = product.precioOriginal || product.originalPrice;
  }
  
  // Usar stockDisponible en lugar de stock ya que es el nombre correcto de la propiedad
  const stock = variantePredeterminada?.stockDisponible;
  
  // Verificar si hay descuento (cualquier descuento mayor a 0 o si hay un precio original explícito)
  const hasDiscount = (descuento > 0) || (originalPrice !== undefined && originalPrice > price);
  const discountPercentage = descuento || 
                            (hasDiscount && originalPrice ? Math.round(100 - (price / originalPrice * 100)) : 0);

  // Obtener imagen principal
  const imagenPrincipal = product.multimedia?.imagenes?.find(img => img.esPrincipal)?.url || 
                         product.multimedia?.imagenes?.[0]?.url ||
                         product.image;
  
  // Obtener nombre del producto
  const nombre = product.nombre || product.name;

  // Determinar el tamaño basado en las propiedades del producto o usar 'standard' por defecto
  const size = product.size || 'standard';

  // Clases para diferentes tamaños de tarjeta
  const sizeClasses = {
    standard: '',
    wide: 'product-wide',
    tall: 'product-tall',
    large: 'product-large',
  };

  return (
    <Link 
      href={`/admin/productos/${product._id || product.id}`} 
      className={`
        group relative overflow-hidden rounded-xl bg-background shadow-md transition-all duration-300 hover:shadow-lg
        animate-fadeIn ${sizeClasses[size] || ''}
      `}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div 
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imagenPrincipal})` }}
      >
        {console.log(hasDiscount)}
        {hasDiscount && (
          <span className="absolute right-3 top-3 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
            -{discountPercentage}%
          </span>
        )}
        
        {(stock !== undefined && stock <= 0) && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            Agotado
          </span>
        )}
        
        <div className="absolute bottom-0 w-full p-4 text-left transition-transform duration-300 group-hover:translate-y-[-4px]">
          <h3 className="text-lg font-medium text-white drop-shadow-md mb-1 line-clamp-2">{nombre}</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white drop-shadow-md">
              ${price.toFixed(2)}
            </span>
            
            {hasDiscount && (
              <span className="text-sm text-white/70 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.destacado && (
            <div className="absolute top-3 right-3 p-2 rounded-full bg-yellow-100 text-yellow-800" title="Producto destacado">
              ⭐
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PanelProductCard;
