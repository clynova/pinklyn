'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaSearch } from 'react-icons/fa';
import TablaProductos from '@/components/productos/TablaProductos';
import useProductos from '@/hooks/useProductos';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductosPage() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    categoria: '',
    estado: '',
    page: 1,
    limit: 10
  });
  const { 
    productos, 
    loading, 
    error, 
    paginacion, 
    obtenerProductos,
    eliminarProducto,
    cambiarEstadoProducto 
  } = useProductos();
  
  // Cargar productos al iniciar y cuando cambien los filtros
  useEffect(() => {
    const cargarProductos = async () => {
      await obtenerProductos({
        ...filtros,
        busqueda: busqueda || undefined
      });
    };
    
    cargarProductos();
  }, [filtros]);
  
  const handleBuscar = (e) => {
    e.preventDefault();
    // Resetear la página a 1 cuando se hace una búsqueda
    setFiltros(prev => ({ ...prev, page: 1 }));
    obtenerProductos({
      ...filtros,
      page: 1,
      busqueda: busqueda || undefined
    });
  };
  
  const handleFiltroCategoria = (e) => {
    setFiltros(prev => ({ 
      ...prev, 
      categoria: e.target.value,
      page: 1 // Resetear a la página 1
    }));
  };
  
  const handleFiltroEstado = (e) => {
    setFiltros(prev => ({ 
      ...prev, 
      estado: e.target.value,
      page: 1 // Resetear a la página 1
    }));
  };
  
  const handleCambioPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.paginas) {
      setFiltros(prev => ({ ...prev, page: nuevaPagina }));
    }
  };

  const handleOrdenar = ({ campo, direccion }) => {
    // Este método se puede implementar cuando añadamos ordenación en el API
    console.log(`Ordenar por ${campo} ${direccion}`);
  };
  
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      const resultado = await eliminarProducto(id);
      if (resultado) {
        // Si se ha eliminado correctamente y estamos en la última página y no hay más productos,
        // retrocedemos a la página anterior
        if (productos.length === 1 && paginacion.paginaActual > 1) {
          setFiltros(prev => ({ ...prev, page: prev.page - 1 }));
        } else {
          // Recargar la página actual
          obtenerProductos({
            ...filtros,
            busqueda: busqueda || undefined
          });
        }
      }
    }
  };
  
  const handleCambiarEstado = async (id, nuevoEstado) => {
    await cambiarEstadoProducto(id, nuevoEstado);
    // Recargar la página actual
    await obtenerProductos({
      ...filtros,
      busqueda: busqueda || undefined
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gestión de Productos</h1>
        <Link 
          href="/admin/productos/crear" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Nuevo Producto
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-1">
            <form onSubmit={handleBuscar}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-blue-600"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
          
          {/* Filtro de categoría */}
          <div>
            <select
              value={filtros.categoria}
              onChange={handleFiltroCategoria}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="ARTE">Arte</option>
              <option value="JOYERIA">Joyería</option>
              <option value="DECORACION">Decoración</option>
              <option value="TEXTILES">Textiles</option>
              <option value="ACCESORIOS">Accesorios</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          
          {/* Filtro de estado */}
          <div>
            <select
              value={filtros.estado}
              onChange={handleFiltroEstado}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla de productos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <TablaProductos 
            productos={productos}
            onEliminar={handleEliminar}
            onCambiarEstado={handleCambiarEstado}
            onOrdenar={handleOrdenar}
          />
          
          {/* Paginación */}
          {paginacion.paginas > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Mostrando {((paginacion.paginaActual - 1) * paginacion.porPagina) + 1} a {Math.min(paginacion.paginaActual * paginacion.porPagina, paginacion.total)} de {paginacion.total} productos
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleCambioPagina(1)}
                  disabled={paginacion.paginaActual === 1}
                  className={`px-3 py-1 rounded-md ${paginacion.paginaActual === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Primera
                </button>
                
                <button
                  onClick={() => handleCambioPagina(paginacion.paginaActual - 1)}
                  disabled={paginacion.paginaActual === 1}
                  className={`px-3 py-1 rounded-md ${paginacion.paginaActual === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Anterior
                </button>
                
                {/* Páginas numeradas */}
                {[...Array(paginacion.paginas)].map((_, i) => {
                  // Mostrar solo algunas páginas para no tener demasiados números
                  if (
                    i === 0 || // Primera página
                    i === paginacion.paginas - 1 || // Última página
                    (i >= paginacion.paginaActual - 2 && i <= paginacion.paginaActual + 0) // Páginas cercanas a la actual
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handleCambioPagina(i + 1)}
                        className={`px-3 py-1 rounded-md ${i + 1 === paginacion.paginaActual ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  // Agregar puntos suspensivos para páginas omitidas
                  else if (
                    i === 1 || // Después de la primera página
                    i === paginacion.paginas - 2 || // Antes de la última página
                    i === paginacion.paginaActual - 3 || // Antes del grupo alrededor de la página actual
                    i === paginacion.paginaActual + 1 // Después del grupo alrededor de la página actual
                  ) {
                    return <span key={i} className="px-3 py-1">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handleCambioPagina(paginacion.paginaActual + 1)}
                  disabled={paginacion.paginaActual === paginacion.paginas}
                  className={`px-3 py-1 rounded-md ${paginacion.paginaActual === paginacion.paginas ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Siguiente
                </button>
                
                <button
                  onClick={() => handleCambioPagina(paginacion.paginas)}
                  disabled={paginacion.paginaActual === paginacion.paginas}
                  className={`px-3 py-1 rounded-md ${paginacion.paginaActual === paginacion.paginas ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Última
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}