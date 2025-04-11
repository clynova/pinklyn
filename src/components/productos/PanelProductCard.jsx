import React from 'react';
import Link from 'next/link';
import { FaHeart, FaGift, FaShareAlt } from 'react-icons/fa';

/**
 * PanelProductCard - Componente de tarjeta de producto para el panel de administración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @returns {JSX.Element} - Componente de tarjeta de producto
 */
const PanelProductCard = ({ product }) => {
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
  const variantePredeterminada = product.variantes?.find(v => v.esPredeterminada) || product.variantes?.[0];
  
  // Obtener precio y descuento de la variante predeterminada si existe, sino usar los valores del producto directamente
  const price = variantePredeterminada?.precio || product.price;
  const originalPrice = variantePredeterminada?.precioOriginal || product.originalPrice;
  const stock = variantePredeterminada?.stock;
  
  // Verificar si hay descuento
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(100 - (price / originalPrice * 100)) 
    : 0;

  // Obtener imagen principal
  const imagenPrincipal = product.multimedia?.imagenes?.find(img => img.esPrincipal)?.url || 
                         product.multimedia?.imagenes?.[0]?.url ||
                         product.image;
  
  // Obtener nombre del producto
  const nombre = product.nombre || product.name;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link href={`/admin/productos/${product._id || product.id}`}>
          <div className="overflow-hidden">
            <img 
              src={imagenPrincipal}
              alt={nombre}
              className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
            {discountPercentage}% OFF
          </span>
        )}
        
        {(stock !== undefined && stock <= 0) && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            Agotado
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{nombre}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold">${price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Mostrar etiqueta de stock si está disponible */}
        {variantePredeterminada?.stock > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            Stock: {variantePredeterminada.stock} {variantePredeterminada.unidad || 'unidades'}
          </div>
        )}
        
        {/* Mostrar descripción corta si está disponible */}
        {product.descripcion?.corta && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.descripcion.corta}
          </p>
        )}
        
        <div className="flex justify-between mt-4">
          <Link 
            href={`/admin/productos/editar/${product._id || product.id}`}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Editar
          </Link>
          
          <div className="flex gap-2">
            {product.destacado && (
              <span className="p-2 rounded-full bg-yellow-100 text-yellow-800" title="Producto destacado">
                ⭐
              </span>
            )}
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <FaHeart className="text-red-400" size={16} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <FaShareAlt className="text-blue-500" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelProductCard;
