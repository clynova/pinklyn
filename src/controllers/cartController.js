import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

/**
 * Controlador para manejar todas las operaciones relacionadas con el carrito de compras
 */
class CartController {
    /**
     * Obtiene el carrito del usuario o crea uno nuevo si no existe
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object>} - Carrito del usuario
     */
    async getOrCreateCart(userId) {
        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = await Cart.create({
                    userId,
                    products: []
                });
            }

            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    /**
     * Obtiene el carrito con productos poblados y verificación de disponibilidad
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object>} - Carrito con información detallada y verificaciones
     */
    async getDetailedCart(userId) {
        try {
            // Buscar el carrito y poblar los datos de productos
            let cart = await Cart.findOne({ userId })
                .populate({
                    path: 'products.productId',
                    model: Product,
                    select: 'nombre sku categoria estado multimedia slug tipoProducto variantes'
                });

            if (!cart) {
                return {
                    success: true,
                    msg: "El carrito está vacío"
                };
            }

            // Variables para llevar registro de cambios
            let unavailableProducts = [];
            let hasAdjustments = false;

            // Filtrar productos que no están activos
            cart.products = cart.products.filter(item => {
                if (!item.productId || !item.productId.estado) {
                    unavailableProducts.push({
                        ...item.toObject(),
                        unavailable: true,
                        unavailableReason: "Producto no disponible o eliminado"
                    });
                    return false;
                }
                return true;
            });

            // Verificar stock para cada producto y extraer solo la variante relevante
            for (const item of cart.products) {
                if (item.productId) {
                    const product = item.productId;
                    const variantId = item.variant.varianteId;
                    console.log("variantId", item.variant);

                    // Verificar que el producto tiene variantes
                    if (!product.variantes || !Array.isArray(product.variantes)) {
                        unavailableProducts.push({
                            ...item.toObject(),
                            unavailable: true,
                            unavailableReason: "Producto sin variantes disponibles"
                        });
                        item.unavailable = true;
                        continue;
                    }

                    // Buscar la variante específica
                    const currentVariant = product.variantes.find(
                        v => v._id.toString() === variantId.toString()
                    );

                    // Verificar si la variante existe y tiene suficiente stock
                    if (!currentVariant || !currentVariant.estado) {
                        // La variante ya no existe o está desactivada
                        unavailableProducts.push({
                            ...item.toObject(),
                            unavailable: true,
                            unavailableReason: "Variante no disponible"
                        });
                        // Marcar para eliminar
                        item.unavailable = true;
                    } else if (currentVariant.stockDisponible < item.quantity) {
                        // Stock insuficiente
                        if (currentVariant.stockDisponible === 0) {
                            // Sin stock
                            unavailableProducts.push({
                                ...item.toObject(),
                                unavailable: true,
                                unavailableReason: "Sin stock"
                            });
                            // Marcar para eliminar
                            item.unavailable = true;
                        } else {
                            // Stock limitado, ajustar cantidad
                            item.quantity = currentVariant.stockDisponible;
                            item.adjustedQuantity = true;
                            hasAdjustments = true;
                        }
                    }

                    // Actualizar precio actual de la variante si ha cambiado
                    if (currentVariant && !item.unavailable) {
                        // Calcular precio con descuento
                        const precioActual = currentVariant.descuento > 0
                            ? currentVariant.precio - (currentVariant.precio * currentVariant.descuento / 100)
                            : currentVariant.precio;

                        // Si el precio ha cambiado, actualizar
                        if (item.variant.precio !== precioActual) {
                            item.variant.precio = precioActual;
                            item.priceUpdated = true;
                            hasAdjustments = true;
                        }

                        // Actualizar SKU si ha cambiado
                        if (item.variant.sku !== currentVariant.sku) {
                            item.variant.sku = currentVariant.sku;
                        }

                        // Añadir información adicional de la variante al objeto de respuesta
                        item.variant = {
                            ...item.variant,
                            nombre: currentVariant.nombre,
                            stockDisponible: currentVariant.stockDisponible
                        };
                    }

                    // Eliminar las variantes del objeto del producto para no enviar información innecesaria
                    item.productId.variantes = undefined;
                }
            }

            // Filtrar productos marcados como no disponibles
            cart.products = cart.products.filter(item => !item.unavailable);

            // Si el carrito quedó vacío después de filtrar, eliminarlo
            if (cart.products.length === 0) {
                await Cart.findByIdAndDelete(cart._id);
                return {
                    success: true,
                    msg: "El carrito está vacío",
                    unavailableProducts: unavailableProducts.length > 0 ? unavailableProducts : undefined
                };
            }

            // Si hubo cambios, guardar el carrito actualizado
            if (unavailableProducts.length > 0 || hasAdjustments) {
                await cart.save();
            }

            // Calcular totales
            const subtotal = await this.calculateSubtotal(userId);
            const total = await this.calculateTotal(userId);

            return {
                success: true,
                cart,
                subtotal,
                total,
                msg: "Carrito obtenido correctamente",
                unavailableProducts: unavailableProducts.length > 0 ? unavailableProducts : undefined,
                hasAdjustments: hasAdjustments
            };
        } catch (error) {
            throw new Error(`Error al obtener el carrito detallado: ${error.message}`);
        }
    }

    /**
     * Busca la información de una variante específica de un producto
     * @param {string} productId - ID del producto
     * @param {string} variantId - ID de la variante
     * @returns {Promise<Object>} - Objeto con la información de la variante
     */
    async getProductVariantInfo(productId, variantId) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (!product.variantes || product.variantes.length === 0) {
                throw new Error('El producto no tiene variantes disponibles');
            }

            // Buscar la variante específica por su _id
            const variant = product.variantes.find(v => v._id.toString() === variantId);

            if (!variant) {
                throw new Error('Variante no encontrada para este producto');
            }

            // Calcular el precio final después de aplicar descuento
            const finalPrice = variant.descuento > 0
                ? variant.precio - (variant.precio * variant.descuento / 100)
                : variant.precio;

            return {
                varianteId: variant._id,
                nombre: variant.nombre,
                precio: finalPrice,
                sku: variant.sku,
                precioOriginal: variant.precio,
                descuento: variant.descuento
            };
        } catch (error) {
            throw new Error(`Error al obtener información de variante: ${error.message}`);
        }
    }

    /**
     * Agrega un producto al carrito o aumenta su cantidad si ya existe
     * @param {string} userId - ID del usuario
     * @param {Object} productData - Datos mínimos del producto a añadir (productId, variantId, quantity)
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async addProductToCart(userId, productData) {
        try {
            // Validar que el productId sea un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(productData.productId)) {
                throw new Error('ID de producto inválido');
            }

            // Validar que el variantId sea un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(productData.variantId)) {
                throw new Error('ID de variante inválido');
            }

            // Verificar que la cantidad sea un número positivo
            if (!productData.quantity || productData.quantity < 1) {
                throw new Error('La cantidad debe ser un número positivo');
            }

            // Obtener información completa de la variante del producto
            const variantInfo = await this.getProductVariantInfo(
                productData.productId,
                productData.variantId
            );

            // Obtener el carrito del usuario o crear uno nuevo
            let cart = await this.getOrCreateCart(userId);

            // Buscar si el producto con esa variante ya está en el carrito
            const existingProductIndex = cart.products.findIndex(
                item =>
                    item.productId.toString() === productData.productId.toString() &&
                    item.variant.varianteId.toString() === productData.variantId.toString()
            );

            if (existingProductIndex >= 0) {
                // Si el producto ya existe, aumentar la cantidad
                cart.products[existingProductIndex].quantity += productData.quantity;
            } else {
                // Si no existe, agregar el nuevo producto con la información completa
                cart.products.push({
                    productId: productData.productId,
                    quantity: productData.quantity,
                    variant: {
                        varianteId: variantInfo.varianteId,
                        nombre: variantInfo.nombre,  // Añadiendo el nombre de la variante
                        precio: variantInfo.precio,
                        sku: variantInfo.sku
                    }
                });
            }

            // Guardar y devolver el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     * @param {string} userId - ID del usuario
     * @param {string} productId - ID del producto
     * @param {string} variantId - ID de la variante
     * @param {number} quantity - Nueva cantidad
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async updateProductQuantity(userId, productId, variantId, quantity) {
        try {
            // Validar que la cantidad sea un número positivo
            if (!quantity || quantity < 1) {
                throw new Error('La cantidad debe ser un número positivo');
            }

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Encontrar el índice del producto
            const productIndex = cart.products.findIndex(
                item =>
                    item.productId.toString() === productId &&
                    item.variant.varianteId.toString() === variantId
            );

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            // Actualizar la cantidad
            cart.products[productIndex].quantity = quantity;

            // Guardar y devolver el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    }

    /**
     * Elimina un producto del carrito
     * @param {string} userId - ID del usuario
     * @param {string} productId - ID del producto
     * @param {string} variantId - ID de la variante
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async removeProductFromCart(userId, productId, variantId) {
        try {
            console.log('Intentando eliminar producto:', { userId, productId, variantId });
            
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Log para depuración
            console.log('Carrito antes de eliminar:', JSON.stringify(cart.products.map(p => ({
                productId: p.productId.toString(),
                varianteId: p.variant.varianteId?.toString()
            }))));
            
            // Convertir IDs a strings para comparación
            const prodId = productId.toString();
            const varId = variantId.toString();
            
            // Longitud original para verificar si se eliminó algo
            const originalLength = cart.products.length;
            
            // Intentar primero con los IDs tal como están
            cart.products = cart.products.filter(item => {
                const itemProductId = item.productId.toString();
                const itemVariantId = item.variant?.varianteId?.toString();
                
                // Primera comparación: usar IDs como se proporcionaron
                const matchesDirectly = (itemProductId === prodId && itemVariantId === varId);
                
                // Segunda comparación: considerar que los IDs podrían estar invertidos
                const matchesInverted = (itemProductId === varId && itemVariantId === prodId);
                
                console.log('Comparando normal:', {
                    itemProductId, prodId, 
                    itemVariantId, varId,
                    matchesDirectly
                });
                
                if (matchesInverted) {
                    console.log('¡Coincidencia encontrada con IDs invertidos!');
                }
                
                // Si coincide en cualquiera de las dos formas, eliminar el item
                return !(matchesDirectly || matchesInverted);
            });
            
            // Verificar si se eliminó algún producto
            if (originalLength === cart.products.length) {
                console.log('No se eliminó ningún producto. Longitud original:', originalLength);
            } else {
                console.log('Producto eliminado. Nueva longitud:', cart.products.length);
            }
            
            // Guardar y devolver el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error en removeProductFromCart:', error);
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    /**
     * Vacía el carrito del usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object>} - Carrito vacío
     */
    async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }

    /**
     * Aplica un cupón al carrito
     * @param {string} userId - ID del usuario
     * @param {Object} couponInfo - Información del cupón
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async applyCoupon(userId, couponInfo) {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Aquí irían las validaciones del cupón con la base de datos
            // Por ejemplo, verificar que el cupón existe, está vigente, etc.

            cart.appliedCoupon = {
                code: couponInfo.code,
                discount: couponInfo.discount,
                type: couponInfo.type
            };

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al aplicar cupón: ${error.message}`);
        }
    }

    /**
     * Calcula el subtotal del carrito (sin descuentos)
     * @param {string} userId - ID del usuario
     * @returns {Promise<number>} - Subtotal del carrito
     */
    async calculateSubtotal(userId) {
        try {
            const cart = await Cart.findOne({ userId }).populate('products.productId');
            if (!cart || cart.products.length === 0) {
                return 0;
            }

            let subtotal = 0;
            for (const item of cart.products) {
                subtotal += item.variant.precio * item.quantity;
            }

            return parseFloat(subtotal.toFixed(2));
        } catch (error) {
            throw new Error(`Error al calcular subtotal: ${error.message}`);
        }
    }

    /**
     * Calcula el total del carrito aplicando descuentos
     * @param {string} userId - ID del usuario
     * @returns {Promise<number>} - Total del carrito
     */
    async calculateTotal(userId) {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart || cart.products.length === 0) {
                return 0;
            }

            // Calcular subtotal
            const subtotal = await this.calculateSubtotal(userId);

            // Aplicar descuento de cupón si existe
            let total = subtotal;
            if (cart.appliedCoupon && cart.appliedCoupon.discount) {
                if (cart.appliedCoupon.type === 'PERCENTAGE') {
                    total = subtotal - (subtotal * cart.appliedCoupon.discount / 100);
                } else if (cart.appliedCoupon.type === 'FIXED_AMOUNT') {
                    total = Math.max(0, subtotal - cart.appliedCoupon.discount);
                }
            }

            return parseFloat(total.toFixed(2));
        } catch (error) {
            throw new Error(`Error al calcular total: ${error.message}`);
        }
    }

    /**
     * Cambia el estado del carrito
     * @param {string} userId - ID del usuario
     * @param {string} status - Nuevo estado
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async updateCartStatus(userId, status) {
        try {
            const validStatus = ['ACTIVE', 'SAVED', 'PROCESSING', 'COMPLETED'];
            if (!validStatus.includes(status)) {
                throw new Error('Estado de carrito inválido');
            }

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.status = status;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar estado: ${error.message}`);
        }
    }
}

export default new CartController();