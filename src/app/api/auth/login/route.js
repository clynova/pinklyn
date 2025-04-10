import { NextResponse } from 'next/server';
import { validateLogin } from '@/middleware/validateLogin';
import { authRateLimit } from '@/middleware/rateLimit';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';
import { cookies } from 'next/headers';

/**
 * Manejador POST para la autenticación de usuarios
 */
export const POST = withDatabase(async (request) => {
  try {
    // Aplicar rate limiting primero
    const rateLimitResponse = await authRateLimit()(request, {});
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }
    
    // 1. Validamos los datos (middleware)
    const clonedRequest = request.clone();
    const validationResult = await validateLogin(clonedRequest);
    
    // 2. Si la validación falla, devolvemos los errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, msg: 'Errores de validación', errors: validationResult.errors }, 
        { status: validationResult.status }
      );
    }
    
    // 3. Utilizamos el controlador para el inicio de sesión
    try {
      const { email, password } = validationResult.body;
      const result = await userController.login(email, password);
      
      // 4. Configurar cookie segura para el token (HttpOnly)
      const cookieStore = cookies();
      cookieStore.set('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
        path: '/'
      });
      
      // 5. Respuesta exitosa
      return NextResponse.json({
        success: true,
        msg: result.message,
        token: result.accessToken, // Mantener para compatibilidad con frontend actual
        refreshToken: result.refreshToken,
        user: result.user
      });
      
    } catch (error) {
      // Manejo de errores específicos
      if (error.type === 'INVALID_CREDENTIALS') {
        return NextResponse.json(
          { success: false, msg: 'Credenciales incorrectas' },
          { status: error.status || 401 }
        );
      } else if (error.type === 'UNVERIFIED_USER') {
        return NextResponse.json(
          { success: false, msg: error.message },
          { status: error.status || 403 }
        );
      }
      
      throw error; // Propagar otros errores al handler general
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json(
      { success: false, msg: "Hubo un error al autenticar el usuario" }, 
      { status: 500 }
    );
  }
});