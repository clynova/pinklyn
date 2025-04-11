import Product from '../models/Product';
import mongoose from 'mongoose';

/**
 * Controlador para manejar todas las operaciones relacionadas con productos
 */
class ProductController {
    /**
     * Valida que el ID del producto sea un ObjectId válido de MongoDB
     * @param {string} id - ID a validar
     * @returns {boolean} - true si es válido, false si no lo es
     */
    isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    /**
     * Obtiene todos los productos con filtros opcionales y paginación
     * @param {Object} queryParams - Parámetros de consulta para filtrado y ordenación
     * @returns {Promise<Object>} - Lista de productos y datos de paginación
     */
    async getProducts(queryParams) {
        try {
            // Construir el filtro
            const filtro = {};

            // Filtro por categoría (si se especifica)
            if (queryParams.has('categoria')) {
                filtro.categoria = queryParams.get('categoria');
            }

            // Filtro por nombre (búsqueda)
            if (queryParams.has('query')) {
                const searchQuery = queryParams.get('query');
                filtro.nombre = { $regex: searchQuery, $options: 'i' };
            }

            // Filtro por precio mínimo
            if (queryParams.has('precioMin')) {
                filtro.precio = { ...filtro.precio || {}, $gte: parseFloat(queryParams.get('precioMin')) };
            }

            // Filtro por precio máximo
            if (queryParams.has('precioMax')) {
                filtro.precio = { ...filtro.precio || {}, $lte: parseFloat(queryParams.get('precioMax')) };
            }

            // Filtro por estado (activo/inactivo)
            if (queryParams.has('activo')) {
                filtro.activo = queryParams.get('activo') === 'true';
            }

            // Opciones de paginación
            const pagina = parseInt(queryParams.get('pagina') || '1');
            const limite = parseInt(queryParams.get('limite') || '10');
            const saltar = (pagina - 1) * limite;

            // Ordenar
            const ordenarPor = queryParams.get('ordenarPor') || 'createdAt';
            const orden = queryParams.get('orden') === 'asc' ? 1 : -1;

            // Determinar si incluir virtuals
            const incluirVirtuals = queryParams.get('incluirVirtuals') === 'true';

            // Ejecutar consulta con paginación
            let query = Product.find(filtro)
                .sort({ [ordenarPor]: orden })
                .skip(saltar)
                .limit(limite);
            
            let productos;
            
            // Incluir virtuals si se solicita
            if (incluirVirtuals) {
                // Primero ejecutamos la consulta normal para obtener documentos Mongoose
                const docs = await query;
                
                // Luego convertimos manualmente cada documento a un objeto con virtuals incluidos
                productos = docs.map(doc => {
                    const obj = doc.toObject({ virtuals: true });
                    return obj;
                });
            } else {
                productos = await query;
            }



            // Contar total para la paginación
            const total = await Product.countDocuments(filtro);

            // Calcular páginas totales
            const totalPaginas = Math.ceil(total / limite);

            return {
                success: true,
                productos,
                paginacion: {
                    total,
                    totalPaginas,
                    paginaActual: pagina,
                    limite
                },
                incluirVirtuals
            };
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    /**
     * Obtiene un producto por su ID
     * @param {string} id - ID del producto
     * @param {boolean} incluirVirtuals - Indica si se deben incluir los campos virtuales
     * @returns {Promise<Object>} - Producto encontrado
     */
    async getProductById(id, incluirVirtuals = false) {
        try {
            if (!this.isValidObjectId(id)) {
                throw new Error('ID de producto no válido');
            }

            let query = Product.findById(id);

            // Incluir virtuals si se solicita
            if (incluirVirtuals) {
                query = query.lean({ virtuals: true });
            }

            const producto = await query;

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return {
                success: true,
                producto,
                incluirVirtuals
            };
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }

    /**
     * Crea un nuevo producto
     * @param {Object} datos - Datos validados del producto
     * @param {Object} user - Usuario que crea el producto
     * @returns {Promise<Object>} - Producto creado
     */
    async createProduct(datos, user) {
        try {
            // Verificar si ya existe un producto con el mismo SKU o slug
            const productoExistente = await Product.findOne({
                $or: [{ sku: datos.sku }, { slug: datos.slug }]
            });

            if (productoExistente) {
                const errors = {};
                if (productoExistente.sku === datos.sku) {
                    errors.sku = 'Este SKU ya está en uso';
                }
                if (productoExistente.slug === datos.slug) {
                    errors.slug = 'Este slug ya está en uso';
                }

                throw {
                    type: 'DUPLICATE_ERROR',
                    message: 'Ya existe un producto con el mismo SKU o slug',
                    errors,
                    status: 409
                };
            }

            // Asegurarse de que haya una variante predeterminada
            if (datos.variantes && datos.variantes.length > 0) {
                const tienePredeterminada = datos.variantes.some(v => v.esPredeterminada);
                if (!tienePredeterminada) {
                    datos.variantes[0].esPredeterminada = true;
                }
            }

            // Asegurarse de que haya una imagen principal
            if (datos.multimedia && datos.multimedia.imagenes && datos.multimedia.imagenes.length > 0) {
                const tienePrincipal = datos.multimedia.imagenes.some(img => img.esPrincipal);
                if (!tienePrincipal) {
                    datos.multimedia.imagenes[0].esPrincipal = true;
                }
            }

            // Establecer fechas de creación y actualización
            datos.fechaCreacion = new Date();
            datos.fechaActualizacion = new Date();

            // Añadir el userId del creador
            if (user && user._id) {
                datos.creador = user._id;
            }

            // Crear el producto
            const nuevoProducto = new Product(datos);
            await nuevoProducto.save();

            return {
                success: true,
                mensaje: 'Producto creado correctamente',
                producto: nuevoProducto
            };
        } catch (error) {
            // Propagar errores específicos
            if (error.type) {
                throw error;
            }
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    /**
     * Actualiza un producto existente
     * @param {string} id - ID del producto
     * @param {Object} datos - Datos validados del producto
     * @returns {Promise<Object>} - Producto actualizado
     */
    async updateProduct(id, datos) {
        try {
            if (!this.isValidObjectId(id)) {
                throw new Error('ID de producto no válido');
            }

            // Comprobar si el producto existe
            const productoExistente = await Product.findById(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            // Verificar si hay otro producto con el mismo SKU o slug (que no sea este mismo)
            if (datos.sku || datos.slug) {
                const condicionesDuplicado = [];

                if (datos.sku) condicionesDuplicado.push({ sku: datos.sku });
                if (datos.slug) condicionesDuplicado.push({ slug: datos.slug });

                if (condicionesDuplicado.length > 0) {
                    const duplicado = await Product.findOne({
                        _id: { $ne: id },
                        $or: condicionesDuplicado
                    });

                    if (duplicado) {
                        const errors = {};
                        if (datos.sku && duplicado.sku === datos.sku) {
                            errors.sku = 'Este SKU ya está en uso';
                        }
                        if (datos.slug && duplicado.slug === datos.slug) {
                            errors.slug = 'Este slug ya está en uso';
                        }

                        throw {
                            type: 'DUPLICATE_ERROR',
                            message: 'Ya existe otro producto con el mismo SKU o slug',
                            errors,
                            status: 409
                        };
                    }
                }
            }

            // Si actualizan variantes, asegurar que haya una predeterminada
            if (datos.variantes && Array.isArray(datos.variantes) && datos.variantes.length > 0) {
                const tienePredeterminada = datos.variantes.some(v => v.esPredeterminada);
                if (!tienePredeterminada) {
                    datos.variantes[0].esPredeterminada = true;
                }
            }

            // Si actualizan imágenes, asegurar que haya una principal
            if (datos.multimedia && datos.multimedia.imagenes &&
                Array.isArray(datos.multimedia.imagenes) && datos.multimedia.imagenes.length > 0) {
                const tienePrincipal = datos.multimedia.imagenes.some(img => img.esPrincipal);
                if (!tienePrincipal) {
                    datos.multimedia.imagenes[0].esPrincipal = true;
                }
            }

            // Actualizar fechaActualizacion
            datos.fechaActualizacion = new Date();

            // Actualizar el producto
            const productoActualizado = await Product.findByIdAndUpdate(
                id,
                { $set: datos },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                mensaje: 'Producto actualizado correctamente',
                producto: productoActualizado
            };
        } catch (error) {
            // Propagar errores específicos
            if (error.type) {
                throw error;
            }
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    /**
     * Elimina un producto por su ID
     * @param {string} id - ID del producto a eliminar
     * @returns {Promise<Object>} - Confirmación de eliminación
     */
    async deleteProduct(id) {
        try {
            // Validar que el ID sea válido
            if (!this.isValidObjectId(id)) {
                throw new Error('ID de producto no válido');
            }

            // Verificar que el producto existe antes de eliminar
            const productoExistente = await Product.findById(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            // Eliminar el producto
            const productoEliminado = await Product.findByIdAndDelete(id);

            return {
                success: true,
                mensaje: 'Producto eliminado correctamente',
                id: productoEliminado._id
            };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default new ProductController();