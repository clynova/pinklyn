'use client';

import React, { useEffect, useState } from 'react';
import useLoading from '@/hooks/useLoading';
import { LoadingSpinner, SkeletonLoader } from '@/components/ui/loading';

const ProductExample = () => {
  const [products, setProducts] = useState([]);
  
  // Hook para carga individual por componente
  const { isLoading, startLoading, stopLoading, wrapPromise } = useLoading({
    defaultMessage: 'Cargando productos...',
  });
  
  // Hook para carga global (pantalla completa)
  const globalLoader = useLoading({
    useGlobal: true,
    defaultMessage: 'Actualizando catálogo...',
  });

  // Simulación de carga de productos
  const fetchProducts = async () => {
    // Usar wrapPromise para manejar automáticamente el estado de carga
    const data = await wrapPromise(
      // Simulamos una llamada API con un timeout
      new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Regalo sorpresa', price: 20 },
            { id: 2, name: 'Caja de chocolates', price: 15 },
            { id: 3, name: 'Set de velas aromáticas', price: 30 },
          ]);
        }, 1500);
      }),
      'Cargando catálogo de regalos...' // Mensaje personalizado
    );
    
    setProducts(data);
  };
  
  // Simulación de actualización global
  const refreshCatalog = () => {
    // Usar el loader global
    globalLoader.wrapPromise(
      new Promise(resolve => {
        setTimeout(resolve, 2000);
      }),
      'Actualizando todo el catálogo...'
    ).then(() => {
      // Hacer algo después de completar
      console.log('Catálogo actualizado');
    });
  };
  
  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Nuestros Productos</h2>
        
        <div className="flex space-x-4">
          <button 
            onClick={fetchProducts}
            disabled={isLoading}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center"
          >
            {isLoading && <LoadingSpinner variant="small" color="light" className="mr-2" />}
            Recargar
          </button>
          
          <button 
            onClick={refreshCatalog}
            disabled={globalLoader.isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            Actualización Completa
          </button>
        </div>
      </div>
      
      {/* Mostrar skeleton loader durante la carga */}
      {isLoading ? (
        <SkeletonLoader variant="product" count={3} className="grid grid-cols-1 md:grid-cols-3 gap-6" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div 
              key={product.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 dark:bg-gray-800 h-48 rounded-md mb-4"></div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-pink-500 font-medium mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Mostrar un mensaje si no hay productos */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default ProductExample;