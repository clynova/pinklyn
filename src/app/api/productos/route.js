import { NextResponse } from 'next/server';
import { validateProductCreate } from '@/middleware/validateProduct';
import { withAuth, withRoles } from '@/middleware/auth/authMiddleware';
import { withDatabase } from '@/middleware/dbConnection';
import productController from '@/controllers/productController';

// GET /api/productos - Obtener todos los productos con filtros opcionales
export const GET = withDatabase(async (request) => {
  try {
    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Usar el controlador para obtener productos filtrados
    const result = await productController.getProducts(searchParams);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los productos' },
      { status: 500 }
    );
  }
});

// Manejador para crear un producto
async function handlePostRequest(request) {
  try {
    // Validar los datos del producto con el middleware
    const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
    const validationResult = await validateProductCreate(clonedRequest);
    
    // Si la validación falla, devolver errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Errores de validación', errors: validationResult.errors },
        { status: validationResult.status }
      );
    }
    
    // Usar el controlador para crear el producto
    try {
      const result = await productController.createProduct(validationResult.body, request.user);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      // Manejar errores específicos como duplicados
      if (error.type === 'DUPLICATE_ERROR') {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message,
            errors: error.errors
          },
          { status: error.status || 409 }
        );
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}

// POST /api/productos - Crear un nuevo producto (Con autenticación y roles)
// Solo usuarios con rol "admin" pueden crear productos
export const POST = withRoles(withDatabase(handlePostRequest), ['admin']);