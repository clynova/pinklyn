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


/* example response getProductsByTags

{
    "success": true,
    "productos": [
        {
            "descripcion": {
                "corta": "Una maceta de cerámica hecha a mano con diseño único.",
                "completa": "Esta maceta está fabricada con cerámica natural y es perfecta para decorar tu hogar.",
                "caracteristicasDestacadas": [
                    "Hecho a mano",
                    "Diseño único",
                    "Material ecológico"
                ]
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://i.pinimg.com/736x/d4/62/5b/d4625bbef4d94935d56e27ca92c3b8e9.jpg",
                        "textoAlternativo": "Maceta de cerámica principal",
                        "esPrincipal": true,
                        "orden": 1,
                        "_id": "67f86ef16142cd2b8292407f",
                        "id": "67f86ef16142cd2b8292407f"
                    },
                    {
                        "url": "https://i.pinimg.com/736x/d4/62/5b/d4625bbef4d94935d56e27ca92c3b8e9.jpg",
                        "textoAlternativo": "Detalle de la maceta",
                        "esPrincipal": false,
                        "orden": 2,
                        "_id": "67f86ef16142cd2b82924080",
                        "id": "67f86ef16142cd2b82924080"
                    }
                ],
                "video": "https://example.com/maceta-video.mp4"
            },
            "seo": {
                "metaTitulo": "Maceta de Cerámica | Pinklyn",
                "metaDescripcion": "Descubre esta hermosa maceta de cerámica hecha a mano con diseño único.",
                "palabrasClave": [
                    "maceta",
                    "cerámica",
                    "decoración",
                    "artesanal"
                ],
                "pageTitle": "Maceta de Cerámica Artesanal | Pinklyn"
            },
            "infoAdicional": {
                "origen": "Perú",
                "artesano": "Carlos Ramírez",
                "marca": null,
                "proveedor": null,
                "certificaciones": [
                    "Hecho a mano",
                    "Producto sostenible"
                ]
            },
            "conservacion": {
                "instrucciones": "Limpiar con un paño húmedo y evitar exposición directa al sol."
            },
            "personalizacion": {
                "tipo": "NINGUNO",
                "detalles": null
            },
            "_id": "67f86ef16142cd2b8292407e",
            "sku": "DEC002",
            "nombre": "Maceta de Cerámica Artesanal",
            "slug": "maceta-de-ceramica-artesanal",
            "categoria": "DECORACION",
            "estado": true,
            "variantes": [
                {
                    "nombre": "Pequeña",
                    "precio": 15,
                    "descuento": 0,
                    "stockDisponible": 20,
                    "umbralStockBajo": 5,
                    "sku": "MACETA-PEQ",
                    "estado": true,
                    "esPredeterminada": true,
                    "_id": "67f86ef16142cd2b82924081",
                    "ultimaActualizacion": "2025-04-11T01:22:57.373Z",
                    "id": "67f86ef16142cd2b82924081"
                },
                {
                    "nombre": "Mediana",
                    "precio": 25,
                    "descuento": 10,
                    "stockDisponible": 15,
                    "umbralStockBajo": 3,
                    "sku": "MACETA-MED",
                    "estado": true,
                    "esPredeterminada": false,
                    "_id": "67f86ef16142cd2b82924082",
                    "ultimaActualizacion": "2025-04-11T01:22:57.373Z",
                    "id": "67f86ef16142cd2b82924082"
                }
            ],
            "tipoProducto": "ARTESANAL",
            "tags": [
                "decoracion",
                "hogar",
                "artesanal"
            ],
            "usosRecomendados": [
                "regalo de casa",
                "decoración interior",
                "cumpleaños"
            ],
            "fechaCreacion": "2025-04-11T01:22:57.369Z",
            "fechaActualizacion": "2025-04-11T01:22:57.369Z",
            "__v": 0,
            "variantePredeterminada": {
                "varianteId": "67f86ef16142cd2b82924081",
                "nombre": "Pequeña",
                "precio": 15,
                "descuento": 0,
                "precioFinal": 15,
                "stockDisponible": 20,
                "esPredeterminada": true,
                "sku": "MACETA-PEQ"
            },
            "variantesConPrecioFinal": [
                {
                    "varianteId": "67f86ef16142cd2b82924081",
                    "nombre": "Pequeña",
                    "precio": 15,
                    "descuento": 0,
                    "precioFinal": 15,
                    "tieneDescuento": false,
                    "stockDisponible": 20,
                    "esPredeterminada": true,
                    "sku": "MACETA-PEQ",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T01:22:57.373Z"
                },
                {
                    "varianteId": "67f86ef16142cd2b82924082",
                    "nombre": "Mediana",
                    "precio": 25,
                    "descuento": 10,
                    "precioFinal": 22.5,
                    "tieneDescuento": true,
                    "stockDisponible": 15,
                    "esPredeterminada": false,
                    "sku": "MACETA-MED",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T01:22:57.373Z"
                }
            ],
            "id": "67f86ef16142cd2b8292407e"
        }
    ],
    "paginacion": {
        "total": 1,
        "totalPaginas": 1,
        "paginaActual": 1,
        "limite": 10
    },
    "incluirVirtuals": false
}
    */

export async function getProductsByTags(tag, limit = 8) {
  try {
    const response = await fetch(`/api/productos?tags=${tag}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

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
