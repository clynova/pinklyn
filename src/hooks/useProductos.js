import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState({
    total: 0,
    paginas: 0,
    paginaActual: 1,
    porPagina: 10
  });
  
  // Usar el contexto de autenticación
  const { isAuthenticated } = useAuth();
  
  // Función para obtener el token de forma segura
  const getAuthToken = () => {
    // Priorizar la cookie sobre localStorage
    return Cookies.get('token') || null;
  };

  // Obtener lista paginada de productos
  const obtenerProductos = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { page = 1, limit = 10, categoria, busqueda, estado } = filtros;
      
      let url = `/api/productos?page=${page}&limit=${limit}`;
      if (categoria) url += `&categoria=${categoria}`;
      if (busqueda) url += `&busqueda=${encodeURIComponent(busqueda)}`;
      if (estado !== undefined) url += `&estado=${estado}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener productos');
      }
      
      const data = await response.json();
      setProductos(data.productos);
      setPaginacion(data.paginacion);
      
      return data;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return { productos: [], paginacion: { total: 0, paginas: 0, paginaActual: 1, porPagina: 10 } };
    } finally {
      setLoading(false);
    }
  };

  // Obtener un producto por su ID
  const obtenerProductoPorId = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/productos/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener el producto');
      }
      
      const data = await response.json();
      setProducto(data);
      
      return data;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo producto
  const crearProducto = async (datosProducto) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token de forma segura
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión para realizar esta acción.');
      }
      
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosProducto)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.msg || 'Error al crear el producto');
      }
      
      const productoCreado = await response.json();
      toast.success('Producto creado correctamente');
      
      return productoCreado;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un producto existente
  const actualizarProducto = async (id, datosProducto) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token de forma segura
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión para realizar esta acción.');
      }
      
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosProducto)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.msg || 'Error al actualizar el producto');
      }
      
      const productoActualizado = await response.json();
      toast.success('Producto actualizado correctamente');
      
      if (producto && producto._id === id) {
        setProducto(productoActualizado);
      }
      
      return productoActualizado;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token de forma segura
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión para realizar esta acción.');
      }
      
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar el producto');
      }
      
      toast.success('Producto eliminado correctamente');
      
      // Actualizar el estado local si estamos viendo una lista de productos
      if (productos.length > 0) {
        setProductos(productos.filter(p => p._id !== id));
      }
      
      // Limpiar el producto actual si es el que estamos eliminando
      if (producto && producto._id === id) {
        setProducto(null);
      }
      
      return true;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el estado de un producto (activo/inactivo)
  const cambiarEstadoProducto = async (id, nuevoEstado) => {
    return actualizarProducto(id, { estado: nuevoEstado });
  };

  return {
    productos,
    producto,
    loading,
    error,
    paginacion,
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto
  };
}