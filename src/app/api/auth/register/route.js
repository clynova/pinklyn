import { NextResponse } from 'next/server';
import { validateUserRegistration } from '@/middleware/validateUser';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';

/**
 * Manejador POST para el registro de usuarios
 */
export const POST = withDatabase(async (request) => {
  try {
    // 1. Validamos los datos con el middleware
    const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
    const validationResult = await validateUserRegistration(clonedRequest);
    
    // 2. Si la validación falla, devolvemos los errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, msg: 'Errores de validación', errors: validationResult.errors }, 
        { status: validationResult.status }
      );
    }
    
    // 3. Si la validación es exitosa, utilizamos el controlador de usuario
    try {
      const result = await userController.register(validationResult.body);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      // Manejo de errores específicos
      if (error.type === 'DUPLICATE_EMAIL') {
        return NextResponse.json(
          { success: false, msg: error.message },
          { status: error.status || 409 }
        );
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return NextResponse.json(
      { success: false, msg: "Hubo un error al registrar el usuario" }, 
      { status: 500 }
    );
  }
});