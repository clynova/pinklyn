import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generarJWT } from '@/utils/auth';
import { validateLogin } from '@/middleware/validateLogin';

/**
 * Controlador para manejar la autenticación de usuario
 */
async function autenticar(request, validatedData) {
  await connectDB();

  try {
    const { email, password } = validatedData;

    // Buscar usuario por email
    const usuarioExistente = await User.findOne({ email });
    
    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, msg: "El correo ingresado no existe" }, 
        { status: 400 }
      );
    }

    // Verificar si el usuario está activo
    if (!usuarioExistente.estado) {
      return NextResponse.json(
        { success: false, msg: "Usuario desactivado. Contacte al administrador" }, 
        { status: 403 }
      );
    }

    // Verificar si el usuario ha confirmado su cuenta
    if (!usuarioExistente.confirmado) {
      return NextResponse.json(
        { success: false, msg: "El usuario no ha activado su cuenta" }, 
        { status: 400 }
      );
    }

    // Verificar contraseña
    const passwordValido = await usuarioExistente.comprobarPassword(password);
    if (!passwordValido) {
      return NextResponse.json(
        { success: false, msg: "Credenciales incorrectas" }, 
        { status: 400 }
      );
    }

    // Generar JWT
    const token = generarJWT(usuarioExistente._id, usuarioExistente.email);

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        msg: "Autenticación exitosa",
        token,
        user: {
          id: usuarioExistente._id,
          firstName: usuarioExistente.firstName,
          lastName: usuarioExistente.lastName,
          email: usuarioExistente.email,
          roles: usuarioExistente.roles,
          confirmado: usuarioExistente.confirmado,
          estado: usuarioExistente.estado
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json(
      { success: false, msg: "Hubo un error al autenticar el usuario" }, 
      { status: 500 }
    );
  }
}

/**
 * Manejador POST para la autenticación de usuarios
 */
export async function POST(request) {
  // 1. Primero validamos los datos (middleware)
  const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
  const validationResult = await validateLogin(clonedRequest);
  
  // 2. Si la validación falla, devolvemos los errores
  if (!validationResult.success) {
    return NextResponse.json(
      { success: false, msg: 'Errores de validación', errors: validationResult.errors }, 
      { status: validationResult.status }
    );
  }
  
  // 3. Si la validación es exitosa, procedemos con la autenticación
  return autenticar(request, validationResult.body);
}