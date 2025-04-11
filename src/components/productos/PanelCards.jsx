'use client';

import { useState, useEffect } from 'react';
import PanelProductCard from './PanelProductCard';
import { getProductsByTags } from '../../services/productService';
import SkeletonLoader from '../ui/SkeletonLoader';

const PanelCards = ({ products: initialProducts, limit = 10, tag = 'Destacado' }) => {
  const [products, setProducts] = useState(initialProducts ? initialProducts.slice(0, limit) : []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (initialProducts) return;
      try {
        setLoading(true);
        setError(null);
        const response = await getProductsByTags(tag, limit);
        if (response.success) {
          const fetchedProducts = response.productos || response.products || [];
          setProducts(fetchedProducts);
           if (fetchedProducts.length === 0) {
             console.warn(`No se encontraron productos con el tag "${tag}"`);
          }
        } else {
          console.error(`Error al obtener productos con tag "${tag}":`, response.msg);
          setError(`No se pudieron cargar los productos (${tag})`);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ocurrió un error inesperado al cargar los productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (!initialProducts) {
       fetchProducts();
    }
  }, [limit, tag]); // Removed initialProducts from dependency array as it's handled at init

  // --- Revised Layout Pattern ---
  // Focuses on single-row items (standard, wide) to prevent gaps and excessive height.
  const getLayoutForIndex = (index) => {
     // Example: Wide, Standard, Standard, Standard, Wide, Standard...
    const pattern = [
      'wide', 'standard', 'standard',
      'standard', 'wide', 'standard',
      'wide', 'standard', 'standard',
      'standard', 'standard', 'wide', // Pattern repeats every 12 items
    ];
    // Ensure layout classes map correctly to aspect ratios in PanelProductCard
    // standard -> aspect-square (col-span-1)
    // wide -> aspect-video (col-span-2)
    return pattern[index % pattern.length] || 'standard';
  };

  const handleMouseEnter = (productId) => {
    setHoveredProductId(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProductId(null);
  };

  // --- Create displayProducts array (logic remains the same) ---
  let displayProducts = [];
  if (!loading && products.length > 0) {
    if (products.length >= limit) {
      displayProducts = products.slice(0, limit);
    } else {
      displayProducts = [];
      for (let i = 0; i < limit; i++) {
        displayProducts.push(products[i % products.length]);
      }
    }
  }

  // --- Renderizado ---
  if (loading) {
     return (
      <section className="w-full bg-gray-100">
        {/* Add max-height and overflow-hidden to the grid container for height control */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[minmax(180px,_auto)] gap-0 max-h-[85vh] overflow-hidden"> {/* Adjusted minmax, added max-h and overflow */}
          {Array.from({ length: limit }).map((_, index) => {
             const layout = getLayoutForIndex(index);
             // Only need to adjust col-span based on the simplified layout
             const spanClass = layout === 'wide' ? 'col-span-2' : 'col-span-1';
             // All items are row-span-1 now
             const rowSpanClass = 'row-span-1';
             // Determine aspect ratio for skeleton shape
             const aspectClass = layout === 'standard' ? 'aspect-square' : 'aspect-video';

             return (
                <div key={index} className={`${spanClass} ${rowSpanClass}`}>
                  {/* Make SkeletonLoader fill the container */}
                  <SkeletonLoader className={`w-full h-full ${aspectClass}`} />
                </div>
             );
           })}
        </div>
      </section>
    );
  }

   if (error) {
    return <div className="w-full text-center py-10 text-red-600 bg-red-50 rounded-md">{error}</div>;
  }

  if (displayProducts.length === 0 && !loading) {
    return <div className="w-full text-center py-10 text-gray-500">No hay productos para mostrar con el tag "{tag}".</div>;
  }

  return (
    <section className="w-full bg-white">
       {/* Add max-height and overflow-hidden to the grid container */}
       {/* Slightly adjust grid-auto-rows if needed */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[minmax(180px,_auto)] gap-0 max-h-[85vh] overflow-hidden"> {/* Adjusted minmax, added max-h and overflow */}
        {displayProducts.map((product, index) => {
          const actualProductId = product._id || product.id;
          const uniqueKey = `${actualProductId}-${index}`;
           // The hover logic remains the same, comparing actual product IDs
          const isDimmed = hoveredProductId !== null && hoveredProductId !== actualProductId;
          const layout = getLayoutForIndex(index); // Get layout based on new pattern

          return (
            <PanelProductCard
              key={uniqueKey}
              product={product}
              productId={actualProductId}
              // Pass the layout determined by the new pattern
              layout={layout}
              isDimmed={isDimmed}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>
    </section>
  );
};

export default PanelCards;
