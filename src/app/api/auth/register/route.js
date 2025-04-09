import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generarCodigo, enviarEmailConfirmacion } from '@/utils/auth';
import { validateUserRegistration } from '@/middleware/validateUser';

/**
 * Controlador para manejar el registro de usuario
 */
async function registrar(request, validatedData) {
  await connectDB();

  try {
    const { firstName, lastName, email, password } = validatedData;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, msg: 'El correo ya está registrado' }, 
        { status: 400 }
      );
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new User({
      firstName,
      lastName,
      email,
      password,
      token: generarCodigo(),
      estado: true // Establecer estado activo por defecto
    });
    
    const userGuardado = await nuevoUsuario.save();

    // Enviar email de confirmación
    const resultadoEmail = await enviarEmailConfirmacion({
      firstName: userGuardado.firstName,
      email: userGuardado.email,
      token: userGuardado.token
    });

    if (!resultadoEmail.success) {
      console.error("Error al enviar el email de confirmación:", resultadoEmail.error);
      // No devolvemos error al cliente, pero registramos el problema
    }

    // Respuesta al cliente
    return NextResponse.json(
      { 
        success: true, 
        msg: "Usuario registrado correctamente. Por favor, revisa tu email para confirmar la cuenta.",
        data: {
          id: userGuardado._id,
          firstName: userGuardado.firstName,
          lastName: userGuardado.lastName,
          email: userGuardado.email,
          roles: userGuardado.roles,
          confirmado: userGuardado.confirmado
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return NextResponse.json(
      { success: false, msg: "Hubo un error al registrar el usuario" }, 
      { status: 500 }
    );
  }
}

/**
 * Manejador POST para el registro de usuarios
 * Simula el comportamiento de Express: userRoutes.post('/registrar', validateUserRegistration, registrar);
 */
export async function POST(request) {
  // 1. Primero validamos los datos (middleware)
  const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
  const validationResult = await validateUserRegistration(clonedRequest);
  
  // 2. Si la validación falla, devolvemos los errores
  if (!validationResult.success) {
    return NextResponse.json(
      { success: false, msg: 'Errores de validación', errors: validationResult.errors }, 
      { status: validationResult.status }
    );
  }
  
  // 3. Si la validación es exitosa, procedemos con el registro (controlador)
  return registrar(request, validationResult.body);
}