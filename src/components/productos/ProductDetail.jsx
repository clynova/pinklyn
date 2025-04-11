import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Gift, Share2 } from 'lucide-react';
import styles from './PanelProductCard.module.css';
import { FaHeart, FaGift, FaShareAlt, FaArrowLeft } from 'react-icons/fa';

/**
 * ProductDetail - Componente de detalle de producto para la visualización completa
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @returns {JSX.Element} - Componente de detalle de producto
 */
const ProductDetail = ({ product }) => {
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/admin/productos" className="text-primary hover:underline">
          Volver a la galería
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
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Link href="/admin/productos" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Volver a la galería
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden bg-accent/30">
          <img 
            src={imagenPrincipal} 
            alt={nombre} 
            className="w-full h-auto object-cover aspect-square md:aspect-auto md:h-[500px]"
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{nombre}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-primary">${price.toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {discountPercentage}% de descuento
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Mostrar descripción corta si está disponible */}
          <p className="text-muted-foreground mb-8">
            {product.descripcion?.corta || "Detalle del producto estará disponible pronto."}
          </p>
          
          {/* Mostrar etiqueta de stock si está disponible */}
          {variantePredeterminada?.stock > 0 && (
            <div className="text-sm text-gray-600 mb-3">
              Stock: {variantePredeterminada.stock} {variantePredeterminada.unidad || 'unidades'}
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-auto">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
              <FaGift className="mr-2 h-5 w-5" />
              Agregar al carrito
            </button>
            <button className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center">
              <FaHeart className="mr-2 h-5 w-5 text-red-400" />
              Guardar
            </button>
            <button className="p-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
              <FaShareAlt className="h-5 w-5 text-blue-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
