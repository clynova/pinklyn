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
                    "descuento": 5,
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
                "artesanal",
                "Destacado"
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
                "descuento": 5,
                "precioFinal": 14.25,
                "stockDisponible": 20,
                "esPredeterminada": true,
                "sku": "MACETA-PEQ"
            },
            "variantesConPrecioFinal": [
                {
                    "varianteId": "67f86ef16142cd2b82924081",
                    "nombre": "Pequeña",
                    "precio": 15,
                    "descuento": 5,
                    "precioFinal": 14.25,
                    "tieneDescuento": true,
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
        },
        {
            "descripcion": {
                "corta": "Una vela aromática hecha a mano con fragancia relajante.",
                "completa": "Esta vela está hecha con cera de soja natural y es perfecta para crear un ambiente tranquilo en tu hogar.",
                "caracteristicasDestacadas": [
                    "Hecho a mano",
                    "Material ecológico",
                    "Personalizable"
                ]
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://rinconhimalaya.cl/cdn/shop/collections/Post_Instagram_18.jpg?v=1716499101&width=1296",
                        "textoAlternativo": "Vela aromática principal",
                        "esPrincipal": true,
                        "orden": 1,
                        "_id": "67f87642e5202f9486ef9911",
                        "id": "67f87642e5202f9486ef9911"
                    },
                    {
                        "url": "https://rinconhimalaya.cl/cdn/shop/collections/Post_Instagram_18.jpg?v=1716499101&width=1296",
                        "textoAlternativo": "Detalle de la vela",
                        "esPrincipal": false,
                        "orden": 2,
                        "_id": "67f87642e5202f9486ef9912",
                        "id": "67f87642e5202f9486ef9912"
                    }
                ],
                "video": "https://example.com/vela-video.mp4"
            },
            "seo": {
                "metaTitulo": "Vela Aromática | Pinklyn",
                "metaDescripcion": "Descubre esta hermosa vela aromática hecha a mano con fragancia relajante.",
                "palabrasClave": [
                    "vela",
                    "aromática",
                    "bienestar",
                    "personalizado"
                ],
                "pageTitle": "Vela Aromática Personalizada | Pinklyn"
            },
            "infoAdicional": {
                "origen": "España",
                "artesano": "Ana Martínez",
                "marca": null,
                "proveedor": null,
                "certificaciones": [
                    "Producto sostenible",
                    "Hecho a mano"
                ]
            },
            "conservacion": {
                "instrucciones": "Mantener en un lugar fresco y seco. No exponer a la luz solar directa."
            },
            "personalizacion": {
                "tipo": "MENSAJE",
                "detalles": "Incluye un mensaje especial grabado en la etiqueta."
            },
            "_id": "67f87642e5202f9486ef9910",
            "sku": "REG003",
            "nombre": "Vela Aromática Personalizada",
            "slug": "vela-aromatica-personalizada",
            "categoria": "BIENESTAR",
            "estado": true,
            "variantes": [
                {
                    "nombre": "Pequeña",
                    "precio": 12,
                    "descuento": 0,
                    "stockDisponible": 50,
                    "umbralStockBajo": 10,
                    "sku": "VELA-PEQ",
                    "estado": true,
                    "esPredeterminada": true,
                    "_id": "67f87642e5202f9486ef9913",
                    "ultimaActualizacion": "2025-04-11T01:54:10.361Z",
                    "id": "67f87642e5202f9486ef9913"
                },
                {
                    "nombre": "Grande",
                    "precio": 20,
                    "descuento": 10,
                    "stockDisponible": 30,
                    "umbralStockBajo": 5,
                    "sku": "VELA-GRD",
                    "estado": true,
                    "esPredeterminada": false,
                    "_id": "67f87642e5202f9486ef9914",
                    "ultimaActualizacion": "2025-04-11T01:54:10.361Z",
                    "id": "67f87642e5202f9486ef9914"
                }
            ],
            "tipoProducto": "ARTESANAL",
            "tags": [
                "regalo",
                "bienestar",
                "personalizado",
                "Destacado"
            ],
            "usosRecomendados": [
                "cumpleaños",
                "aniversario",
                "relajación"
            ],
            "fechaCreacion": "2025-04-11T01:54:10.356Z",
            "fechaActualizacion": "2025-04-11T01:54:10.356Z",
            "__v": 0,
            "variantePredeterminada": {
                "varianteId": "67f87642e5202f9486ef9913",
                "nombre": "Pequeña",
                "precio": 12,
                "descuento": 0,
                "precioFinal": 12,
                "stockDisponible": 50,
                "esPredeterminada": true,
                "sku": "VELA-PEQ"
            },
            "variantesConPrecioFinal": [
                {
                    "varianteId": "67f87642e5202f9486ef9913",
                    "nombre": "Pequeña",
                    "precio": 12,
                    "descuento": 0,
                    "precioFinal": 12,
                    "tieneDescuento": false,
                    "stockDisponible": 50,
                    "esPredeterminada": true,
                    "sku": "VELA-PEQ",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T01:54:10.361Z"
                },
                {
                    "varianteId": "67f87642e5202f9486ef9914",
                    "nombre": "Grande",
                    "precio": 20,
                    "descuento": 10,
                    "precioFinal": 18,
                    "tieneDescuento": true,
                    "stockDisponible": 30,
                    "esPredeterminada": false,
                    "sku": "VELA-GRD",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T01:54:10.361Z"
                }
            ],
            "id": "67f87642e5202f9486ef9910"
        },
        {
            "descripcion": {
                "corta": "Un collar elegante con opción de grabado personalizado.",
                "completa": "Este collar está hecho de plata pura y puede personalizarse con un nombre o mensaje especial.",
                "caracteristicasDestacadas": [
                    "Hecho a mano",
                    "Personalizable",
                    "Material premium"
                ]
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYSXfT6qpx9kevrSiqu3ykIwVeAfVFpgziQA&s",
                        "textoAlternativo": "Collar con grabado principal",
                        "esPrincipal": true,
                        "orden": 1,
                        "_id": "67f88e0c73ddeeb7097e9cb5",
                        "id": "67f88e0c73ddeeb7097e9cb5"
                    },
                    {
                        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYSXfT6qpx9kevrSiqu3ykIwVeAfVFpgziQA&s",
                        "textoAlternativo": "Detalle del collar",
                        "esPrincipal": false,
                        "orden": 2,
                        "_id": "67f88e0c73ddeeb7097e9cb6",
                        "id": "67f88e0c73ddeeb7097e9cb6"
                    }
                ],
                "video": "https://example.com/collar-video.mp4"
            },
            "seo": {
                "metaTitulo": "Collar con Grabado | Pinklyn",
                "metaDescripcion": "Descubre este collar de plata con opción de grabado personalizado, perfecto como regalo especial.",
                "palabrasClave": [
                    "collar",
                    "joyería",
                    "personalizado",
                    "regalo"
                ],
                "pageTitle": "Collar con Grabado Personalizado | Pinklyn"
            },
            "infoAdicional": {
                "origen": "México",
                "artesano": "María López",
                "certificaciones": [
                    "Hecho a mano",
                    "Material ecológico"
                ]
            },
            "conservacion": {
                "instrucciones": "Limpiar con un paño suave. Evitar contacto con agua o productos químicos."
            },
            "personalizacion": {
                "tipo": "NOMBRE",
                "detalles": "Grabado en la parte trasera del colgante."
            },
            "_id": "67f88e0c73ddeeb7097e9cb4",
            "sku": "JOY004",
            "nombre": "Collar con Grabado Personalizado",
            "slug": "collar-con-grabado-personalizado",
            "categoria": "JOYERIA",
            "estado": true,
            "variantes": [
                {
                    "nombre": "Plata",
                    "precio": 35,
                    "descuento": 0,
                    "stockDisponible": 20,
                    "umbralStockBajo": 5,
                    "sku": "COLLAR-PLATA",
                    "estado": true,
                    "esPredeterminada": true,
                    "_id": "67f88e0c73ddeeb7097e9cb7",
                    "ultimaActualizacion": "2025-04-11T03:35:40.350Z",
                    "id": "67f88e0c73ddeeb7097e9cb7"
                },
                {
                    "nombre": "Oro Rosa",
                    "precio": 45,
                    "descuento": 10,
                    "stockDisponible": 15,
                    "umbralStockBajo": 3,
                    "sku": "COLLAR-ORO",
                    "estado": true,
                    "esPredeterminada": false,
                    "_id": "67f88e0c73ddeeb7097e9cb8",
                    "ultimaActualizacion": "2025-04-11T03:35:40.350Z",
                    "id": "67f88e0c73ddeeb7097e9cb8"
                }
            ],
            "tipoProducto": "ARTESANAL",
            "tags": [
                "regalo",
                "joyería",
                "personalizado",
                "Destacado"
            ],
            "usosRecomendados": [
                "aniversario",
                "cumpleaños",
                "graduación"
            ],
            "fechaCreacion": "2025-04-11T03:35:40.349Z",
            "fechaActualizacion": "2025-04-11T03:35:40.349Z",
            "__v": 0,
            "variantePredeterminada": {
                "varianteId": "67f88e0c73ddeeb7097e9cb7",
                "nombre": "Plata",
                "precio": 35,
                "descuento": 0,
                "precioFinal": 35,
                "stockDisponible": 20,
                "esPredeterminada": true,
                "sku": "COLLAR-PLATA"
            },
            "variantesConPrecioFinal": [
                {
                    "varianteId": "67f88e0c73ddeeb7097e9cb7",
                    "nombre": "Plata",
                    "precio": 35,
                    "descuento": 0,
                    "precioFinal": 35,
                    "tieneDescuento": false,
                    "stockDisponible": 20,
                    "esPredeterminada": true,
                    "sku": "COLLAR-PLATA",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T03:35:40.350Z"
                },
                {
                    "varianteId": "67f88e0c73ddeeb7097e9cb8",
                    "nombre": "Oro Rosa",
                    "precio": 45,
                    "descuento": 10,
                    "precioFinal": 40.5,
                    "tieneDescuento": true,
                    "stockDisponible": 15,
                    "esPredeterminada": false,
                    "sku": "COLLAR-ORO",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T03:35:40.350Z"
                }
            ],
            "id": "67f88e0c73ddeeb7097e9cb4"
        },
        {
            "descripcion": {
                "corta": "Una caja de chocolates artesanales hechos con ingredientes naturales.",
                "completa": "Esta caja incluye una selección de chocolates gourmet elaborados a mano con cacao orgánico.",
                "caracteristicasDestacadas": [
                    "Hecho a mano",
                    "Ingredientes naturales",
                    "Presentación elegante"
                ]
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://media.istockphoto.com/id/1389027480/es/foto/bombones-de-chocolate-en-caja-dorada.jpg?s=612x612&w=0&k=20&c=tjW_tSSp5ptEu9qEZvl_dt7vJO3wAAYBk1HgY8aRakY=",
                        "textoAlternativo": "Caja de chocolates principal",
                        "esPrincipal": true,
                        "orden": 1,
                        "_id": "67f88eb173ddeeb7097e9cf8",
                        "id": "67f88eb173ddeeb7097e9cf8"
                    },
                    {
                        "url": "https://media.istockphoto.com/id/1389027480/es/foto/bombones-de-chocolate-en-caja-dorada.jpg?s=612x612&w=0&k=20&c=tjW_tSSp5ptEu9qEZvl_dt7vJO3wAAYBk1HgY8aRakY=",
                        "textoAlternativo": "Detalle de los chocolates",
                        "esPrincipal": false,
                        "orden": 2,
                        "_id": "67f88eb173ddeeb7097e9cf9",
                        "id": "67f88eb173ddeeb7097e9cf9"
                    }
                ],
                "video": "https://example.com/chocolates-video.mp4"
            },
            "seo": {
                "metaTitulo": "Caja de Chocolates | Pinklyn",
                "metaDescripcion": "Descubre esta caja de chocolates artesanales hechos con ingredientes naturales, perfecta como regalo gourmet.",
                "palabrasClave": [
                    "chocolates",
                    "regalo",
                    "gourmet",
                    "artesanal"
                ],
                "pageTitle": "Caja de Chocolates Artesanales | Pinklyn"
            },
            "infoAdicional": {
                "origen": "Perú",
                "artesano": "Carlos Ramírez",
                "certificaciones": [
                    "Producto orgánico",
                    "Hecho a mano"
                ]
            },
            "conservacion": {
                "instrucciones": "Mantener en un lugar fresco y seco. Consumir antes de la fecha de caducidad."
            },
            "personalizacion": {
                "tipo": "NINGUNO",
                "detalles": null
            },
            "_id": "67f88eb173ddeeb7097e9cf7",
            "sku": "ALI005",
            "nombre": "Caja de Regalo con Chocolates Artesanales",
            "slug": "caja-de-regalo-con-chocolates-artesanales",
            "categoria": "ALIMENTOS",
            "estado": true,
            "variantes": [
                {
                    "nombre": "Pequeña (6 piezas)",
                    "precio": 18,
                    "descuento": 0,
                    "stockDisponible": 30,
                    "umbralStockBajo": 5,
                    "sku": "CHOCO-PEQ",
                    "estado": true,
                    "esPredeterminada": true,
                    "_id": "67f88eb173ddeeb7097e9cfa",
                    "ultimaActualizacion": "2025-04-11T03:38:25.558Z",
                    "id": "67f88eb173ddeeb7097e9cfa"
                },
                {
                    "nombre": "Grande (12 piezas)",
                    "precio": 32,
                    "descuento": 15,
                    "stockDisponible": 20,
                    "umbralStockBajo": 3,
                    "sku": "CHOCO-GRD",
                    "estado": true,
                    "esPredeterminada": false,
                    "_id": "67f88eb173ddeeb7097e9cfb",
                    "ultimaActualizacion": "2025-04-11T03:38:25.558Z",
                    "id": "67f88eb173ddeeb7097e9cfb"
                }
            ],
            "tipoProducto": "ARTESANAL",
            "tags": [
                "regalo",
                "gourmet",
                "artesanal",
                "Destacado"
            ],
            "usosRecomendados": [
                "cumpleaños",
                "aniversario",
                "navidad"
            ],
            "fechaCreacion": "2025-04-11T03:38:25.557Z",
            "fechaActualizacion": "2025-04-11T03:38:25.557Z",
            "__v": 0,
            "variantePredeterminada": {
                "varianteId": "67f88eb173ddeeb7097e9cfa",
                "nombre": "Pequeña (6 piezas)",
                "precio": 18,
                "descuento": 0,
                "precioFinal": 18,
                "stockDisponible": 30,
                "esPredeterminada": true,
                "sku": "CHOCO-PEQ"
            },
            "variantesConPrecioFinal": [
                {
                    "varianteId": "67f88eb173ddeeb7097e9cfa",
                    "nombre": "Pequeña (6 piezas)",
                    "precio": 18,
                    "descuento": 0,
                    "precioFinal": 18,
                    "tieneDescuento": false,
                    "stockDisponible": 30,
                    "esPredeterminada": true,
                    "sku": "CHOCO-PEQ",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T03:38:25.558Z"
                },
                {
                    "varianteId": "67f88eb173ddeeb7097e9cfb",
                    "nombre": "Grande (12 piezas)",
                    "precio": 32,
                    "descuento": 15,
                    "precioFinal": 27.2,
                    "tieneDescuento": true,
                    "stockDisponible": 20,
                    "esPredeterminada": false,
                    "sku": "CHOCO-GRD",
                    "estado": true,
                    "ultimaActualizacion": "2025-04-11T03:38:25.558Z"
                }
            ],
            "id": "67f88eb173ddeeb7097e9cf7"
        }
    ],
    "paginacion": {
        "total": 4,
        "totalPaginas": 1,
        "paginaActual": 1,
        "limite": 10
    },
    "incluirVirtuals": false
}
    */

async function getProductsByTags(tag, limit = 8) {
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


export { getProductsByTags, getAllProducts, getProductById };
