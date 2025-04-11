'use client';

import { useState, useEffect } from 'react';
import PanelProductCard from './PanelProductCard';
import { getProductsByTags } from '../../services/productService';
import SkeletonLoader from '../ui/SkeletonLoader';

// Approximate row height based on CSS (grid-auto-rows: 280px)
const APPROX_ROW_HEIGHT = 280;
// Target viewport height percentage for the container
const TARGET_VH = 0.8; // 70vh

const PanelCards = ({ products: initialProducts, limit = 18, tag = 'Destacado' }) => {
  const [products, setProducts] = useState(initialProducts ? initialProducts.slice(0, limit) : []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [columnCount, setColumnCount] = useState(5);
  const [containerHeight, setContainerHeight] = useState(600); // Default height

  const calculateColumnCount = () => {
    if (typeof window === 'undefined') return 5;
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1440) return 8;
    else if (windowWidth >= 1280) return 6;
    else if (windowWidth >= 1024) return 5;
    else if (windowWidth >= 768) return 4;
    else if (windowWidth >= 640) return 3;
    else return 2;
  };

  // Update column count and container height on mount and resize
  useEffect(() => {
    const updateLayout = () => {
      setColumnCount(calculateColumnCount());
      // Calculate target height in pixels based on viewport
      const targetPixelHeight = typeof window !== 'undefined' ? window.innerHeight * TARGET_VH : 600;
      setContainerHeight(targetPixelHeight);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      if (initialProducts) {
         setProducts(initialProducts.slice(0, limit));
         setLoading(false);
         return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await getProductsByTags(tag, limit);
        if (response.success) {
          const fetchedProducts = response.productos || response.products || [];
          setProducts(fetchedProducts.slice(0, limit));
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
    } else {
       setLoading(false);
       setProducts(currentInitial => currentInitial ? currentInitial.slice(0, limit) : []);
    }
  }, [limit, tag, initialProducts]);

  // --- Mosaic Pattern Logic (unchanged from previous step) ---
  const getLayoutForIndex = (index, totalProducts) => {
     const patternA = ['standard', 'tall', 'standard', 'standard', 'wide', 'standard', 'standard', 'standard', 'wide', 'tall'];
     const patternB = ['standard', 'standard', 'large', 'standard', 'wide', 'tall', 'standard', 'standard', 'standard', 'standard', 'wide', 'standard', 'tall'];
     const patternC = ['wide', 'standard', 'standard', 'tall', 'standard', 'standard', 'wide'];
     const patternXL = ['standard', 'tall', 'standard', 'wide', 'standard', 'wide', 'standard', 'standard', 'tall','standard', 'large', 'standard', 'standard', 'wide'];
     let selectedPattern;
     if (columnCount <= 2) return index % 3 === 0 ? 'wide' : 'standard';
     else if (columnCount === 3) selectedPattern = patternC;
     else if (columnCount === 4) selectedPattern = patternA;
     else if (columnCount === 5) selectedPattern = patternB;
     else selectedPattern = patternXL;
     return selectedPattern[index % selectedPattern.length] || 'standard';
  };

  const handleMouseEnter = (productId) => setHoveredProductId(productId);
  const handleMouseLeave = () => setHoveredProductId(null);

  // --- Create displayProducts for bounded container ---
  let displayProducts = [];
  if (!loading && products.length > 0) {
    // Estimate how many rows fit in the container height
    const estimatedRows = Math.max(1, Math.ceil(containerHeight / APPROX_ROW_HEIGHT));

    // Estimate cells needed to fill these rows densely
    // Add a buffer (e.g., * 1.5) because 'dense' packing + varied sizes needs more items
    const estimatedCellsToFill = Math.ceil(columnCount * estimatedRows * 1.5);

    // Ensure we have at least 'limit' items if limit is larger
    const targetItemCount = Math.max(limit, estimatedCellsToFill);

    if (products.length >= targetItemCount) {
      displayProducts = products.slice(0, targetItemCount);
    } else {
      const repeatCount = Math.ceil(targetItemCount / products.length);
      displayProducts = Array.from({ length: repeatCount })
                           .flatMap(() => products)
                           .slice(0, targetItemCount);
    }
  }

  // --- Rendering ---
  if (loading) {
     // Skeleton respects container height
     const skelCols = `grid-cols-${columnCount}`;
     return (
      <section className="w-full bg-gray-100">
        <div
          className={`grid ${skelCols} auto-rows-[minmax(180px,_auto)] gap-0`}
          style={{ maxHeight: `${containerHeight}px`, minHeight: '300px', overflow: 'hidden' }}
        >
          {Array.from({ length: Math.max(limit, columnCount * 2) }).map((_, index) => (
            <div key={index} className="aspect-square col-span-1 row-span-1">
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

  if (displayProducts.length === 0 && !loading) {
    return <div className="w-full text-center py-10 text-gray-500">No hay productos para mostrar con el tag "{tag}".</div>;
  }

  return (
    <section className="w-full bg-white">
      {/* Apply product-grid class AND inline styles for height/overflow */}
      <div
        className="product-grid"
        style={{
          maxHeight: `${containerHeight}px`, // Use dynamic height
          minHeight: '400px', // Ensure minimum reasonable height
          overflow: 'hidden' // Hide content that exceeds maxHeight
        }}
      >
        {displayProducts.map((product, index) => {
            const actualProductId = product._id || product.id;
            const uniqueKey = `${actualProductId}-${index}`;
            const isDimmed = hoveredProductId !== null && hoveredProductId !== actualProductId;
            const layout = getLayoutForIndex(index, displayProducts.length);
            const productClass = layout === 'standard' ? '' :
                                 layout === 'wide' ? 'product-wide' :
                                 layout === 'tall' ? 'product-tall' :
                                 layout === 'large' ? 'product-large' : '';

            return (
              <div key={uniqueKey} className={`${productClass}`}>
                <PanelProductCard
                  product={product}
                  productId={actualProductId}
                  layout={layout}
                  isDimmed={isDimmed}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            );
          })}
        {/* No filler elements */}
      </div>
    </section>
  );
};

export default PanelCards;
