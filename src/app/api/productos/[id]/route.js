import { NextResponse } from 'next/server';
import { validateProductUpdate } from '@/middleware/validateProduct';
import { withAuth, withRoles } from '@/middleware/auth/authMiddleware';
import { withDatabase } from '@/middleware/dbConnection';
import productController from '@/controllers/productController';

// GET /api/productos/[id] - Obtener un producto por ID
export const GET = withDatabase(async (request, { params }) => {
  try {
    const { id } = params;
    
    try {
      const result = await productController.getProductById(id);
      return NextResponse.json(result);
    } catch (error) {
      // Manejar errores específicos como ID inválido o producto no encontrado
      if (error.message === 'ID de producto no válido') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      } else if (error.message === 'Producto no encontrado') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
});

// Manejador para actualizar un producto
async function handlePutRequest(request, { params }) {
  try {
    const { id } = params;
    
    // Validar los datos del producto con el middleware
    const clonedRequest = request.clone();
    const validationResult = await validateProductUpdate(clonedRequest);
    
    // Si la validación falla, devolver errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Errores de validación', errors: validationResult.errors },
        { status: validationResult.status }
      );
    }
    
    // Usar el controlador para actualizar el producto
    try {
      const result = await productController.updateProduct(id, validationResult.body);
      return NextResponse.json(result);
    } catch (error) {
      // Manejar errores específicos
      if (error.type === 'DUPLICATE_ERROR') {
        return NextResponse.json(
          { 
            success: false,
            error: error.message,
            errors: error.errors
          },
          { status: error.status || 409 }
        );
      } else if (error.message === 'ID de producto no válido') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      } else if (error.message === 'Producto no encontrado') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

// Manejador para eliminar un producto
async function handleDeleteRequest(request, { params }) {
  try {
    const { id } = params;
    
    try {
      const result = await productController.deleteProduct(id);
      return NextResponse.json(result);
    } catch (error) {
      // Manejar errores específicos
      if (error.message === 'ID de producto no válido') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      } else if (error.message === 'Producto no encontrado') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}

// PUT /api/productos/[id] - Actualizar un producto existente (Con autenticación)
// Solo usuarios con rol "admin" pueden actualizar productos
export const PUT = withRoles(withDatabase(handlePutRequest), ['admin']);

// DELETE /api/productos/[id] - Eliminar un producto (Con autenticación)
// Solo usuarios con rol "admin" pueden eliminar productos
export const DELETE = withRoles(withDatabase(handleDeleteRequest), ['admin']);