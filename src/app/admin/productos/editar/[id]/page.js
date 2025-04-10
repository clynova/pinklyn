'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import FormularioProducto from '@/components/productos/FormularioProducto';
import useProductos from '@/hooks/useProductos';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditarProductoPage({ params }) {
  // Unwrapping params using React.use() to make it future-compatible
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  
  const router = useRouter();
  const { obtenerProductoPorId, actualizarProducto, producto, loading, error } = useProductos();
  
  useEffect(() => {
    if (id) {
      obtenerProductoPorId(id);
    }
  }, [id]);
  
  const handleSubmit = async (datosProducto) => {
    const productoActualizado = await actualizarProducto(id, datosProducto);
    
    if (productoActualizado) {
      // Recargar los datos del producto o redirigir
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex items-center mb-6">
        <Link href="/admin/productos" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
          <FaArrowLeft className="mr-2" /> Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          Editar Producto: {producto?.nombre}
        </h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {producto ? (
          <FormularioProducto 
            producto={producto} 
            onSubmit={handleSubmit} 
            isLoading={loading}
          />
        ) : (
          <p className="text-gray-500">No se ha encontrado el producto.</p>
        )}
      </div>
    </div>
  );
}