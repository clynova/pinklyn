"use client";

/**
 * Service to handle product-related API requests
 */

/**
 * Fetch products by tag
 * @param {string} tag - The tag to filter products by
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<{success: boolean, products: Array, msg: string}>}
 */
export async function getProductsByTags(tag, limit = 8) {
  try {
    const response = await fetch(`/api/productos?tag=${tag}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Response de getAllProducts:', data);

    if (response.ok) {
      return {
        success: true,
        products: data.productos || [],
      };
    } else {
      return {
        success: false,
        msg: data.message || 'Error al cargar productos',
        products: [],
      };
    }
  } catch (error) {
    console.error('Error en getProductsByTags:', error);
    return {
      success: false,
      msg: 'Error de conexión al cargar productos',
      products: [],
    };
  }
}

/**
 * Get all products with optional pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{success: boolean, products: Array, totalPages: number, msg: string}>}
 */
const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`/api/productos?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Response de getAllProducts:', response);

    if (response.ok) {
      return {
        success: true,
        products: data.products || [],
        totalPages: data.totalPages || 1,
      };
    } else {
      return {
        success: false,
        msg: data.message || 'Error al cargar productos',
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    return {
      success: false,
      msg: 'Error de conexión al cargar productos',
      products: [],
      totalPages: 0,
    };
  }
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<{success: boolean, product: Object, msg: string}>}
 */
const getProductById = async (id) => {
  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        product: data.product || {},
      };
    } else {
      return {
        success: false,
        msg: data.message || 'Producto no encontrado',
        product: {},
      };
    }
  } catch (error) {
    console.error('Error en getProductById:', error);
    return {
      success: false,
      msg: 'Error de conexión al cargar el producto',
      product: {},
    };
  }
};

// Exportación por defecto de todas las funciones
const productService = {
  getProductsByTags,
  getAllProducts,
  getProductById
};

export default productService;
export { getProductsByTags, getAllProducts, getProductById };
