import { NextResponse } from 'next/server';
import cartController from '../../../controllers/cartController';
import mongoose from 'mongoose';
import { withAuth } from '../../../middleware/auth/authMiddleware';
import { withDatabase } from '@/middleware/dbConnection';

// Función auxiliar para validar que el ID sea un ObjectId válido
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET - Obtener el carrito del usuario actual con verificación de productos
export const GET = withAuth(withDatabase(async (req) => {
  try {
    // Obtener el ID del usuario directamente de la sesión autenticada
    const userId = req.user._id;
    
    // Usar el método que incluye verificación de disponibilidad y stock
    const result = await cartController.getDetailedCart(userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}));

// POST - Agregar un producto al carrito (versión simplificada)
export const POST = withAuth(withDatabase(async (req) => {
  try {
    // Obtener el ID del usuario directamente de la sesión autenticada
    const userId = req.user._id;
    const data = await req.json();
    
    // Validar datos requeridos - solo necesitamos productId, variantId y quantity
    if (!data.productId || !data.variantId || !data.quantity) {
      return NextResponse.json(
        { error: 'Se requiere ID de producto, ID de variante y cantidad' },
        { status: 400 }
      );
    }

    // Validar que los IDs son válidos
    if (!isValidObjectId(data.productId)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

    if (!isValidObjectId(data.variantId)) {
      return NextResponse.json(
        { error: 'ID de variante inválido' },
        { status: 400 }
      );
    }

    // Validar que la cantidad es un número positivo
    if (typeof data.quantity !== 'number' || data.quantity < 1) {
      return NextResponse.json(
        { error: 'La cantidad debe ser un número positivo' },
        { status: 400 }
      );
    }
    
    const cart = await cartController.addProductToCart(userId, {
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity
    });

    const subtotal = await cartController.calculateSubtotal(userId);
    const total = await cartController.calculateTotal(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Producto añadido al carrito',
      cart,
      subtotal,
      total
    });
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}));

// PUT - Actualizar cantidad de un producto en el carrito
export const PUT = withAuth(withDatabase(async (req) => {
  try {
    // Obtener el ID del usuario directamente de la sesión autenticada
    const userId = req.user._id;
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.productId || !data.variantId || !data.quantity) {
      return NextResponse.json(
        { error: 'Se requiere ID del producto, ID de la variante y cantidad' },
        { status: 400 }
      );
    }

    // Validar que los IDs son válidos
    if (!isValidObjectId(data.productId) || !isValidObjectId(data.variantId)) {
      return NextResponse.json(
        { error: 'IDs inválidos' },
        { status: 400 }
      );
    }
    
    const cart = await cartController.updateProductQuantity(
      userId,
      data.productId,
      data.variantId,
      data.quantity
    );

    const subtotal = await cartController.calculateSubtotal(userId);
    const total = await cartController.calculateTotal(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Cantidad actualizada',
      cart,
      subtotal,
      total
    });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}));

// DELETE - Eliminar un producto del carrito
export const DELETE = withAuth(withDatabase(async (req) => {
  try {
    // Obtener el ID del usuario directamente de la sesión autenticada
    const userId = req.user._id;
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    const variantId = url.searchParams.get('variantId');
    

    console.log(userId, productId, variantId);
    // Validar datos requeridos
    if (!productId || !variantId) {
      return NextResponse.json(
        { error: 'Se requiere ID del producto e ID de la variante' },
        { status: 400 }
      );
    }

    // Validar que los IDs son válidos
    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return NextResponse.json(
        { error: 'IDs inválidos' },
        { status: 400 }
      );
    }
    
    const cart = await cartController.removeProductFromCart(userId, productId, variantId);
    const subtotal = await cartController.calculateSubtotal(userId);
    const total = await cartController.calculateTotal(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Producto eliminado del carrito',
      cart,
      subtotal,
      total
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}));