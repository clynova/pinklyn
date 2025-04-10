'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import FormularioProducto from '@/components/productos/FormularioProducto';
import useProductos from '@/hooks/useProductos';
import { Toaster } from 'react-hot-toast';

export default function CrearProductoPage() {
  const router = useRouter();
  const { crearProducto, loading } = useProductos();
  
  const handleSubmit = async (datosProducto) => {
    const producto = await crearProducto(datosProducto);
    
    if (producto) {
      // Redirigir a la página de edición del producto recién creado
      router.push('/admin/productos');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex items-center mb-6">
        <Link href="/admin/productos" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
          <FaArrowLeft className="mr-2" /> Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Producto</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <FormularioProducto onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}