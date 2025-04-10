import { NextResponse } from 'next/server';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';

/**
 * Reenvía un nuevo código de verificación al usuario
 */
export const POST = withDatabase(async (request) => {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        msg: "El email es obligatorio"
      }, { status: 400 });
    }
    
    try {
      const result = await userController.resendVerificationCode(email);
      
      // En un entorno de desarrollo, devolvemos el token para facilitar pruebas
      if (process.env.NODE_ENV !== 'production' && result.verificationToken) {
        return NextResponse.json({
          success: true,
          msg: result.message,
          verificationToken: result.verificationToken // Solo en desarrollo
        });
      }
      
      return NextResponse.json({
        success: true,
        msg: result.message
      });
    } catch (error) {
      // Manejo de errores específicos
      if (error.type === 'USER_NOT_FOUND') {
        return NextResponse.json({
          success: false,
          msg: error.message
        }, { status: error.status || 404 });
      } else if (error.type === 'ALREADY_VERIFIED') {
        return NextResponse.json({
          success: false,
          msg: error.message
        }, { status: error.status || 400 });
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error('Error al reenviar código:', error);
    return NextResponse.json({
      success: false,
      msg: "Error en el servidor al reenviar el código"
    }, { status: 500 });
  }
});