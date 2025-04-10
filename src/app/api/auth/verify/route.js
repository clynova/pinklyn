import { NextResponse } from 'next/server';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';

/**
 * Verifica el token/código de confirmación del usuario y activa la cuenta
 */
export const POST = withDatabase(async (request) => {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({
        success: false,
        msg: "Código de verificación es obligatorio"
      }, { status: 400 });
    }
    
    try {
      const result = await userController.verifyAccount(token);
      return NextResponse.json(result);
    } catch (error) {
      // Manejo de errores específicos
      if (error.type === 'INVALID_TOKEN') {
        return NextResponse.json({
          success: false,
          msg: error.message
        }, { status: error.status || 400 });
      } else if (error.type === 'EXPIRED_TOKEN') {
        return NextResponse.json({
          success: false,
          msg: error.message
        }, { status: error.status || 400 });
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al verificar cuenta:', error);
    return NextResponse.json({
      success: false,
      msg: "Error en el servidor al verificar la cuenta"
    }, { status: 500 });
  }
});