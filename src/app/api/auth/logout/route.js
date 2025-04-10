import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TokenBlacklist from '@/models/TokenBlacklist';

/**
 * POST /api/auth/logout - Cierra la sesión del usuario e invalida su token
 * agregándolo a la lista negra para que no pueda ser utilizado nuevamente
 */
export async function POST(request) {
  try {
    await connectDB();
    
    // Obtener el token del cuerpo de la solicitud
    const body = await request.json();
    const { token } = body;
    
    // Validar que se proporcionó un token
    if (!token) {
      return NextResponse.json({
        success: false,
        msg: 'No se proporcionó un token'
      }, { status: 400 });
    }
    
    // Verificar si el token ya está en la lista negra
    const tokenExistente = await TokenBlacklist.findOne({ token });
    if (tokenExistente) {
      return NextResponse.json({
        success: true,
        msg: 'La sesión ya fue cerrada anteriormente'
      });
    }
    
    // Agregar el token a la lista negra
    await TokenBlacklist.create({ token });
    
    return NextResponse.json({
      success: true,
      msg: 'Sesión cerrada correctamente'
    });
    
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json({
      success: false,
      msg: 'Error al cerrar sesión'
    }, { status: 500 });
  }
}