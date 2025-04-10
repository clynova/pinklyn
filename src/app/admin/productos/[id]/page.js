'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import useProductos from '@/hooks/useProductos';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DetalleProductoPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { 
    obtenerProductoPorId, 
    eliminarProducto, 
    cambiarEstadoProducto,
    producto, 
    loading, 
    error 
  } = useProductos();
  
  useEffect(() => {
    if (id) {
      obtenerProductoPorId(id);
    }
  }, [id]);
  
  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      const resultado = await eliminarProducto(id);
      if (resultado) {
        router.push('/admin/productos');
      }
    }
  };
  
  const handleCambiarEstado = async () => {
    if (producto) {
      await cambiarEstadoProducto(id, !producto.estado);
      // Recargar los datos del producto
      obtenerProductoPorId(id);
    }
  };
  
  if (loading && !producto) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <Link href="/admin/productos" className="mt-4 text-blue-600 hover:underline">
            Volver a la lista de productos
          </Link>
        </div>
      </div>
    );
  }
  
  if (!producto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>No se ha encontrado el producto.</p>
          <Link href="/admin/productos" className="mt-4 text-blue-600 hover:underline">
            Volver a la lista de productos
          </Link>
        </div>
      </div>
    );
  }
  
  const variantePredeterminada = producto.variantePredeterminada || (producto.variantes && producto.variantes[0]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/productos" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCambiarEstado}
            className={`px-3 py-2 rounded-md flex items-center ${
              producto.estado 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {producto.estado ? (
              <>
                <FaToggleOn className="mr-2" /> Activo
              </>
            ) : (
              <>
                <FaToggleOff className="mr-2" /> Inactivo
              </>
            )}
          </button>
          
          <Link
            href={`/admin/productos/editar/${id}`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md flex items-center"
          >
            <FaEdit className="mr-2" /> Editar
          </Link>
          
          <button
            onClick={handleEliminar}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center"
          >
            <FaTrash className="mr-2" /> Eliminar
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Galería de imágenes */}
          <div className="p-6 border-r border-gray-200">
            {producto.multimedia?.imagenes && producto.multimedia.imagenes.length > 0 ? (
              <div>
                {/* Imagen principal */}
                <div className="mb-4">
                  <img 
                    src={producto.multimedia.imagenes.find(img => img.esPrincipal)?.url || producto.multimedia.imagenes[0].url} 
                    alt={producto.nombre}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                
                {/* Miniaturas */}
                {producto.multimedia.imagenes.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {producto.multimedia.imagenes.map((imagen, index) => (
                      <div key={index} className="cursor-pointer">
                        <img 
                          src={imagen.url} 
                          alt={imagen.textoAlternativo || `${producto.nombre} - imagen ${index + 1}`}
                          className={`w-full h-auto rounded border-2 ${imagen.esPrincipal ? 'border-blue-500' : 'border-transparent'}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 flex items-center justify-center h-64 rounded-lg">
                <p className="text-gray-500">Sin imágenes</p>
              </div>
            )}
          </div>
          
          {/* Información principal */}
          <div className="p-6 lg:col-span-2">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{producto.nombre}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  producto.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {producto.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mt-1">
                <span>SKU: {producto.sku}</span>
                <span className="mx-2">•</span>
                <span>Categoría: {producto.categoria}</span>
              </div>
              
              {variantePredeterminada && (
                <div className="mt-4">
                  <div className="flex items-baseline">
                    {variantePredeterminada.descuento > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          ${(variantePredeterminada.precio - (variantePredeterminada.precio * variantePredeterminada.descuento / 100)).toFixed(2)}
                        </span>
                        <span className="ml-2 text-xl text-gray-500 line-through">
                          ${variantePredeterminada.precio.toFixed(2)}
                        </span>
                        <span className="ml-2 bg-red-100 text-red-800 text-sm font-semibold px-2 py-0.5 rounded">
                          {variantePredeterminada.descuento}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        ${variantePredeterminada.precio.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      variantePredeterminada.stockDisponible > variantePredeterminada.umbralStockBajo 
                        ? 'bg-green-100 text-green-800' 
                        : variantePredeterminada.stockDisponible > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {variantePredeterminada.stockDisponible > variantePredeterminada.umbralStockBajo 
                        ? 'En stock' 
                        : variantePredeterminada.stockDisponible > 0 
                          ? 'Stock bajo'
                          : 'Sin stock'}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {variantePredeterminada.stockDisponible} unidades disponibles
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 mb-4">{producto.descripcion?.corta || 'Sin descripción corta.'}</p>
              
              {producto.descripcion?.completa && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Descripción completa</h3>
                  <p className="text-gray-600 whitespace-pre-line">{producto.descripcion.completa}</p>
                </div>
              )}
              
              {producto.descripcion?.caracteristicasDestacadas && producto.descripcion.caracteristicasDestacadas.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Características destacadas</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {producto.descripcion.caracteristicasDestacadas.map((caract, index) => (
                      <li key={index}>{caract}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {producto.variantes && producto.variantes.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Variantes disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {producto.variantes.map((variante, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-md ${
                        variante.esPredeterminada ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">
                          {variante.nombre}
                          {variante.esPredeterminada && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              Predeterminada
                            </span>
                          )}
                        </h4>
                        <div>
                          {variante.descuento > 0 ? (
                            <div className="text-right">
                              <span className="text-lg font-semibold text-gray-900">
                                ${(variante.precio - (variante.precio * variante.descuento / 100)).toFixed(2)}
                              </span>
                              <div className="flex items-center justify-end">
                                <span className="text-sm text-gray-500 line-through mr-1">
                                  ${variante.precio.toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
                                  -{variante.descuento}%
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-lg font-semibold text-gray-900">
                              ${variante.precio.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-1 text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          variante.stockDisponible > variante.umbralStockBajo 
                            ? 'bg-green-100 text-green-800' 
                            : variante.stockDisponible > 0 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          Stock: {variante.stockDisponible}
                        </span>
                        
                        {variante.sku && (
                          <span className="ml-2 text-gray-500">
                            SKU: {variante.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {producto.tags && producto.tags.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Información adicional */}
        {(producto.infoAdicional?.origen || 
          producto.infoAdicional?.artesano || 
          (producto.infoAdicional?.certificaciones && producto.infoAdicional.certificaciones.length > 0)) && (
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Información adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {producto.infoAdicional.origen && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Origen</h4>
                  <p className="text-gray-600">{producto.infoAdicional.origen}</p>
                </div>
              )}
              
              {producto.infoAdicional.artesano && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Artesano</h4>
                  <p className="text-gray-600">{producto.infoAdicional.artesano}</p>
                </div>
              )}
              
              {producto.infoAdicional.certificaciones && producto.infoAdicional.certificaciones.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Certificaciones</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {producto.infoAdicional.certificaciones.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Información de conservación */}
        {producto.conservacion?.instrucciones && (
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Cuidado y conservación</h3>
            <p className="text-gray-600">{producto.conservacion.instrucciones}</p>
          </div>
        )}
        
        {/* Información SEO */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Información SEO</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Meta título</h4>
              <p className="text-gray-600">{producto.seo?.metaTitulo || producto.nombre}</p>
              
              <h4 className="font-medium text-gray-700 mt-4 mb-2">Meta descripción</h4>
              <p className="text-gray-600">{producto.seo?.metaDescripcion || producto.descripcion?.corta || 'Sin descripción'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Slug</h4>
              <p className="text-gray-600">{producto.slug}</p>
              
              {producto.seo?.palabrasClave && producto.seo.palabrasClave.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Palabras clave</h4>
                  <div className="flex flex-wrap gap-2">
                    {producto.seo.palabrasClave.map((palabra, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {palabra}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}