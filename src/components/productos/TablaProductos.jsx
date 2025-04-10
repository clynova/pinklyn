import React, { useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export default function TablaProductos({ productos, onEliminar, onCambiarEstado, onOrdenar }) {
  const [ordenActual, setOrdenActual] = useState({ campo: 'fechaCreacion', direccion: 'desc' });
  
  const handleOrdenar = (campo) => {
    const nuevaDireccion = 
      ordenActual.campo === campo && ordenActual.direccion === 'asc' ? 'desc' : 'asc';
    
    const nuevoOrden = { campo, direccion: nuevaDireccion };
    setOrdenActual(nuevoOrden);
    
    if (onOrdenar) {
      onOrdenar(nuevoOrden);
    }
  };
  
  const getIconoOrden = (campo) => {
    if (ordenActual.campo !== campo) return <FaSort className="text-gray-300" />;
    return ordenActual.direccion === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleOrdenar('nombre')}>
              <div className="flex items-center">
                Nombre
                {getIconoOrden('nombre')}
              </div>
            </th>
            <th scope="col" className="py-3 px-6">
              SKU
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleOrdenar('categoria')}>
              <div className="flex items-center">
                Categoría
                {getIconoOrden('categoria')}
              </div>
            </th>
            <th scope="col" className="py-3 px-6">
              Estado
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleOrdenar('fechaCreacion')}>
              <div className="flex items-center">
                Fecha
                {getIconoOrden('fechaCreacion')}
              </div>
            </th>
            <th scope="col" className="py-3 px-6">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td colSpan="6" className="py-4 px-6 text-center">
                No hay productos disponibles
              </td>
            </tr>
          ) : (
            productos.map(producto => (
              <tr 
                key={producto._id} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {producto.nombre}
                </td>
                <td className="py-4 px-6">
                  {producto.sku}
                </td>
                <td className="py-4 px-6">
                  {producto.categoria}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${producto.estado 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {producto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {new Date(producto.fechaCreacion).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 flex space-x-2">
                  <Link href={`/admin/productos/${producto._id}`} className="text-blue-600 hover:text-blue-900">
                    <FaEye className="text-xl" />
                  </Link>
                  <Link href={`/admin/productos/editar/${producto._id}`} className="text-yellow-600 hover:text-yellow-900">
                    <FaEdit className="text-xl" />
                  </Link>
                  <button 
                    onClick={() => onCambiarEstado(producto._id, !producto.estado)} 
                    className={`hover:text-gray-900 ${producto.estado ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {producto.estado ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                  </button>
                  <button 
                    onClick={() => onEliminar(producto._id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}