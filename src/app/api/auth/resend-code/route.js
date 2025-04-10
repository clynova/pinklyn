import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generarCodigo, enviarEmailConfirmacion } from '@/utils/auth';

/**
 * Reenvía un nuevo código de verificación al usuario
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        msg: "El email es obligatorio"
      }, { status: 400 });
    }
    
    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    
    if (!usuario) {
      return NextResponse.json({
        success: false,
        msg: "Usuario no encontrado"
      }, { status: 404 });
    }
    
    // Verificar si el usuario ya está confirmado
    if (usuario.confirmado) {
      return NextResponse.json({
        success: false,
        msg: "La cuenta ya ha sido confirmada"
      }, { status: 400 });
    }
    
    // Generar nuevo token
    usuario.token = generarCodigo();
    await usuario.save();
    
    // Enviar email de confirmación
    const resultadoEmail = await enviarEmailConfirmacion({
      firstName: usuario.firstName,
      email: usuario.email,
      token: usuario.token
    });

    if (!resultadoEmail.success) {
      console.error("Error al enviar el email de confirmación:", resultadoEmail.error);
      return NextResponse.json({
        success: false,
        msg: "Error al enviar el código de verificación"
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      msg: "Código de verificación enviado correctamente"
    });
    
  } catch (error) {
    console.error('Error al reenviar código:', error);
    return NextResponse.json({
      success: false,
      msg: "Error en el servidor"
    }, { status: 500 });
  }
}