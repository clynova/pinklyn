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

  // --- Patrón de diseño mosaico artístico mejorado ---
  // Asigna diferentes tamaños y formas para crear un lienzo visualmente variado sin espacios en blanco
  const getLayoutForIndex = (index, totalProducts = products.length) => {
    // Patrones diseñados para encajar perfectamente en bloques completos 
    // Cada conjunto completa un bloque rectangular sin dejar espacios

    // Patrón A: Para filas de 4 columnas con altura doble (6 tarjetas, 8 espacios)
    const patternA = [
      'standard', 'tall', 'standard', 'standard', // Primera fila (4 espacios)
      'wide',     'standard', 'wide'             // Segunda fila (4 espacios)
    ];

    // Patrón B: Para filas de 5 columnas con altura doble (10 tarjetas, 10 espacios)
    const patternB = [
      'standard', 'standard', 'large', 'standard', // Primera fila (5 espacios)
      'wide',     'tall',    'standard', 'standard' // Segunda fila (5 espacios)
    ];

    // Patrón C: Para filas de 3 columnas con altura doble (6 tarjetas, 6 espacios)
    const patternC = [
      'wide', 'standard',               // Primera fila (3 espacios)
      'standard', 'standard', 'standard', // Segunda fila (3 espacios)
      'standard', 'tall'                 // Tercera fila (parcial)
    ];

    // Detectamos el ancho probable del grid basado en el número de columnas
    // que esperamos tener según los diferentes breakpoints de pantalla
    // Calculamos un número basado en el tamaño aproximado de la ventana (simulación)
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    let columnCount = 2; // Móvil por defecto

    if (windowWidth >= 1280) columnCount = 6;      // xl
    else if (windowWidth >= 1024) columnCount = 5; // lg
    else if (windowWidth >= 768) columnCount = 4;  // md
    else if (windowWidth >= 640) columnCount = 3;  // sm
    
    // En base al número de columnas y el total de productos disponibles, 
    // seleccionamos un patrón que se ajuste mejor
    let selectedPattern;
    
    if (columnCount === 2) {
      // En móvil usamos un patrón simple que alterna entre standard y wide
      return index % 3 === 0 ? 'wide' : 'standard';
    } else if (columnCount === 3) {
      selectedPattern = patternC;
    } else if (columnCount === 4) {
      selectedPattern = patternA;
    } else {
      // 5 o 6 columnas
      selectedPattern = patternB;
    }

    // Si el patrón termina, volvemos a comenzar
    return selectedPattern[index % selectedPattern.length] || 'standard';
  };

  const handleMouseEnter = (productId) => {
    setHoveredProductId(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProductId(null);
  };

  // --- Create displayProducts array with enhanced repetition logic ---
  let displayProducts = [];
  if (!loading && products.length > 0) {
    // Calcular el número óptimo de productos para mostrar basado en el tamaño de pantalla
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    // Determinar cuántas columnas tendremos según el ancho de la pantalla
    let columnCount = 2; // Móvil por defecto
    if (windowWidth >= 1280) columnCount = 6;      // xl
    else if (windowWidth >= 1024) columnCount = 5; // lg
    else if (windowWidth >= 768) columnCount = 4;  // md
    else if (windowWidth >= 640) columnCount = 3;  // sm
    
    // Calcular cuántas filas necesitamos para llenar la pantalla
    // Altura aproximada de pantalla dividida por altura de tarjeta (aprox. 300px)
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const approximateRowsNeeded = Math.ceil(screenHeight / 300) + 1; // +1 para asegurar que no quede espacio vacío
    
    // Calcular cuántos productos necesitamos para llenar la pantalla
    // Multiplicamos por 2 para considerar diferentes tamaños de tarjetas (algunas son más grandes)
    const minProductsNeeded = columnCount * approximateRowsNeeded * 2;
    
    // Asegurarnos de tener suficientes productos para llenar la pantalla
    const displayLimit = Math.max(minProductsNeeded, limit);
    
    if (products.length >= displayLimit) {
      // Si tenemos suficientes productos, tomamos los necesarios
      displayProducts = products.slice(0, displayLimit);
    } else {
      // Si no tenemos suficientes, repetimos los productos para llenar todo el espacio
      const repeatCount = Math.ceil(displayLimit / products.length);
      
      for (let i = 0; i < repeatCount; i++) {
        displayProducts = [...displayProducts, ...products];
      }
      
      // Limitamos al número calculado para llenar la pantalla
      displayProducts = displayProducts.slice(0, displayLimit);
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
      {/* Grid con diseño mejorado que evita espacios en blanco */}
      <div className="product-grid">
        {displayProducts.map((product, index) => {
          const actualProductId = product._id || product.id;
          const uniqueKey = `${actualProductId}-${index}`;
          const isDimmed = hoveredProductId !== null && hoveredProductId !== actualProductId;
          const layout = getLayoutForIndex(index);
          
          // Aplicamos las clases según el layout para el contenedor adecuado
          const productClass = layout === 'standard' ? '' : 
                              layout === 'wide' ? 'product-wide' : 
                              layout === 'tall' ? 'product-tall' : 
                              'product-large';

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
        
        {/* Elementos de relleno sutiles para ocupar espacios vacíos */}
        {Array.from({ length: 6 }).map((_, i) => {
          // Alternamos entre espacios estándar y anchos
          const randomLayout = i % 3 === 0 ? 'wide' : 'standard';
          const fillerClass = randomLayout === 'wide' ? 'product-wide' : '';
          
          return (
            <div 
              key={`filler-${i}`}
              className={`${fillerClass} bg-white/40`}
              style={{ 
                height: '100%',
                backgroundImage: `linear-gradient(${Math.floor(Math.random() * 360)}deg, #f9fafb, #ffffff)`,
                opacity: 0.4
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default PanelCards;
