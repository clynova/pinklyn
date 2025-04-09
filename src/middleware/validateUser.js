import { NextResponse } from 'next/server';

/**
 * Middleware para validar los datos de registro de usuario
 * @param {Request} request - Objeto de solicitud HTTP
 * @param {Function} next - Función para continuar con el siguiente middleware o controlador
 */
export async function validateUserRegistration(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Array para almacenar errores de validación
    const errors = [];

    // Validar nombre
    if (!firstName || firstName.trim() === '') {
      errors.push({ campo: 'firstName', mensaje: 'El nombre es obligatorio' });
    } else if (firstName.length < 2) {
      errors.push({ campo: 'firstName', mensaje: 'El nombre debe tener al menos 2 caracteres' });
    }

    // Validar apellido
    if (!lastName || lastName.trim() === '') {
      errors.push({ campo: 'lastName', mensaje: 'El apellido es obligatorio' });
    } else if (lastName.length < 2) {
      errors.push({ campo: 'lastName', mensaje: 'El apellido debe tener al menos 2 caracteres' });
    }

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
    } else if (password.length < 6) {
      errors.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres' });
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
    console.error('Error al procesar datos de usuario:', error);
    return {
      success: false,
      errors: [{ mensaje: 'Error al procesar los datos' }],
      status: 500
    };
  }
}