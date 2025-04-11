'use client';

import { useState, useEffect } from 'react';
import PanelProductCard from './PanelProductCard';
import { getProductsByTags } from '../../services/productService';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * PanelCards - Componente de cuadrícula de productos que muestra una lista de productos destacados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.products - Lista inicial de productos (opcional)
 * @param {number} props.limit - Cantidad máxima de productos a mostrar (opcional)
 * @returns {JSX.Element} - Componente de cuadrícula de productos
 */
const PanelCards = ({ products: initialProducts, limit = 8 }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsByTags('Destacado', limit);
        
        if (response.success) {
          // Verificamos tanto productos como products para mayor compatibilidad
          const productosData = response.productos || response.products || [];
          setProducts(productosData);
          
          if (productosData.length === 0) {
            console.warn('La respuesta no contiene productos');
          }
        } else {
          console.error('Error al obtener productos destacados:', response.msg);
          setError('No se pudieron cargar los productos destacados');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Ocurrió un error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    if (!initialProducts) {
      fetchFeaturedProducts();
    }
  }, [initialProducts, limit]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <section className="w-full">
      <div className="product-grid">
        {products && products.map((product, index) => (
          <PanelProductCard 
            key={product.id || product._id || index} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

export default PanelCards;
