import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Verifica el token/código de confirmación del usuario y activa la cuenta
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { token, email } = await request.json();
    
    if (!token || !email) {
      return NextResponse.json({
        success: false,
        msg: "Código y email son obligatorios"
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
        success: true,
        msg: "La cuenta ya ha sido confirmada anteriormente"
      });
    }
    
    // Verificar el token
    if (usuario.token !== token) {
      return NextResponse.json({
        success: false,
        msg: "Código de verificación inválido"
      }, { status: 400 });
    }
    
    // Confirmar la cuenta
    usuario.confirmado = true;
    usuario.token = null;
    await usuario.save();
    
    return NextResponse.json({
      success: true,
      msg: "¡Cuenta verificada exitosamente!"
    });
    
  } catch (error) {
    console.error('Error al verificar cuenta:', error);
    return NextResponse.json({
      success: false,
      msg: "Error en el servidor"
    }, { status: 500 });
  }
}