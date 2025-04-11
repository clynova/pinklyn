'use client';

import { useState, useEffect } from 'react';
import PanelProductCard from './PanelProductCard';
import { getProductsByTags } from '../../services/productService'; // Asegúrate que la ruta es correcta
import SkeletonLoader from '../ui/SkeletonLoader'; // Usaremos Skeleton para el loading

/**
 * PanelCards - Componente de cuadrícula de productos que muestra una lista de productos
 *              en un layout visualmente atractivo y dinámico.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.products] - Lista inicial de productos (opcional)
 * @param {number} [props.limit=10] - Cantidad máxima de productos a mostrar/buscar (opcional)
 * @param {string} [props.tag='Destacado'] - Tag para buscar productos si no se proveen inicialmente
 * @returns {JSX.Element} - Componente de cuadrícula de productos
 */
const PanelCards = ({ products: initialProducts, limit = 10, tag = 'Destacado' }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (initialProducts) return; // Si ya tenemos productos, no hacemos fetch

      try {
        setLoading(true);
        setError(null);
        // Busca productos por tag si no se pasaron como prop
        const response = await getProductsByTags(tag, limit);

        if (response.success) {
          const fetchedProducts = response.productos || response.products || [];
          if (fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
          } else {
             console.warn(`No se encontraron productos con el tag "${tag}"`);
             // Podrías establecer un estado para mostrar un mensaje si lo deseas
          }
        } else {
          console.error(`Error al obtener productos con tag "${tag}":`, response.msg);
          setError(`No se pudieron cargar los productos (${tag})`);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ocurrió un error inesperado al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts, limit, tag]); // Dependencias del useEffect

  // --- Determinar el Layout de cada Card ---
  // Esta función asigna un tipo de layout basado en el índice
  // Puedes ajustar esta lógica como prefieras (ej. basado en product.tags, etc.)
  const getLayoutForIndex = (index) => {
    const pattern = [
      'wide', 'standard', 'standard', 'tall',
      'standard', 'large', 'standard',
      'standard', 'tall', 'wide'
    ];
    return pattern[index % pattern.length] || 'standard'; // Cicla sobre el patrón
  };

  // --- Renderizado ---
  if (loading) {
    // Muestra Skeletons mientras carga para una mejor UX
    return (
      <section className="w-full bg-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[minmax(200px,_auto)] gap-0">
          {/* Genera N skeletons basados en el limit */}
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className={getLayoutForIndex(index) === 'wide' || getLayoutForIndex(index) === 'large' ? 'col-span-2' : 'col-span-1'}>
               <SkeletonLoader className="w-full h-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="w-full text-center py-10 text-red-600 bg-red-50 rounded-md">{error}</div>;
  }

  if (products.length === 0 && !loading) {
    return <div className="w-full text-center py-10 text-gray-500">No hay productos para mostrar.</div>;
  }

  return (
    <section className="w-full bg-white"> {/* Fondo base */}
      {/* Grid principal sin gap entre elementos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[minmax(200px,_auto)] gap-0">
        {products.map((product, index) => (
          <PanelProductCard
            key={product._id || product.id || index}
            product={product}
            layout={getLayoutForIndex(index)} // Asigna el layout dinámicamente
          />
        ))}
      </div>
    </section>
  );
};

export default PanelCards;
