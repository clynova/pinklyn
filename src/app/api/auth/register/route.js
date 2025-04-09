import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generarCodigo, enviarEmailConfirmacion } from '@/utils/auth';

// Función helper para validar el email
const validarEmail = (email) => {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(String(email).toLowerCase());
};

/**
 * Manejador POST para el registro de usuarios
 */
export async function POST(request) {
  // Conectar a MongoDB
  await connectDB();

  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validaciones básicas
    const errores = [];
    if (!firstName) errores.push({ campo: 'firstName', mensaje: 'El nombre es obligatorio' });
    if (!lastName) errores.push({ campo: 'lastName', mensaje: 'El apellido es obligatorio' });
    if (!email) errores.push({ campo: 'email', mensaje: 'El email es obligatorio' });
    else if (!validarEmail(email)) errores.push({ campo: 'email', mensaje: 'El formato del email no es válido' });
    if (!password) errores.push({ campo: 'password', mensaje: 'La contraseña es obligatoria' });
    else if (password.length < 6) errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres' });

    // Si hay errores, devolver una respuesta de error
    if (errores.length > 0) {
      return NextResponse.json(
        { success: false, msg: 'Errores de validación', errors: errores }, 
        { status: 400 }
      );
    }

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
      ...body,
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