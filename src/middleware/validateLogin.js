import { NextResponse } from 'next/server';

/**
 * Middleware para validar los datos de inicio de sesión
 * @param {Request} request - Objeto de solicitud HTTP
 */
export async function validateLogin(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Array para almacenar errores de validación
    const errors = [];

    // Validar email
    if (!email || email.trim() === '') {
      errors.push({ campo: 'email', mensaje: 'El email es obligatorio' });
    } else {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!emailRegex.test(email)) {
        errors.push({ campo: 'email', mensaje: 'El formato del email no es válido' });
      }
    }

    // Validar contraseña
    if (!password || password.trim() === '') {
      errors.push({ campo: 'password', mensaje: 'La contraseña es obligatoria' });
    }

    // Si hay errores, devolver una respuesta con los errores
    if (errors.length > 0) {
      return { 
        success: false, 
        errors, 
        status: 400
      };
    }

    // Si no hay errores, permitir continuar con la solicitud
    return {
      success: true,
      body
    };

  } catch (error) {
    console.error('Error al procesar datos de login:', error);
    return {
      success: false,
      errors: [{ mensaje: 'Error al procesar los datos' }],
      status: 500
    };
  }
}