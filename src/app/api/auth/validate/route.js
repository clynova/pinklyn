import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth } from '@/middleware/auth/authMiddleware';

/**
 * Handler para validar token y obtener datos del usuario autenticado
 */
async function validateTokenHandler(request) {
  // La validación ya se realizó en el middleware withAuth
  // y tenemos el usuario disponible en request.user
  
  // Devolver información del usuario sin datos sensibles
  return NextResponse.json({
    success: true,
    user: {
      id: request.user._id,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      email: request.user.email,
      roles: request.user.roles,
      confirmado: request.user.confirmado,
      estado: request.user.estado
    }
  });
}

// GET /api/auth/validate - Validar token y obtener información del usuario
export const GET = withAuth(validateTokenHandler);

/**
 * Handler para verificar manualmente un token sin el middleware de autenticación
 * Útil para componentes que necesitan verificar el token sin proteger toda la ruta
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const token = body.token;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        msg: "Token no proporcionado"
      }, { status: 401 });
    }
    
    // Verificar y decodificar el token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key_development');
      
      // Buscar el usuario en la base de datos
      const user = await User.findById(decoded.userId).select("-password -token");
      
      if (!user) {
        return NextResponse.json({
          success: false,
          msg: 'Usuario no encontrado'
        }, { status: 404 });
      }
      
      // Verificar si el usuario está confirmado
      if (!user.confirmado) {
        return NextResponse.json({
          success: false,
          msg: 'Usuario no confirmado'
        }, { status: 403 });
      }
      
      // Verificar si el usuario está activo
      if (!user.estado) {
        return NextResponse.json({
          success: false,
          msg: 'Usuario desactivado'
        }, { status: 403 });
      }
      
      // Devolver información del usuario
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
          confirmado: user.confirmado,
          estado: user.estado
        }
      });
      
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return NextResponse.json({
          success: false,
          msg: 'Token inválido'
        }, { status: 403 });
      }
      
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json({
          success: false,
          msg: 'Token expirado, por favor inicie sesión nuevamente'
        }, { status: 403 });
      }
      
      console.error("Error en verificación de token:", err);
      return NextResponse.json({
        success: false,
        msg: 'Error en la autenticación'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error general en validación de token:", error);
    return NextResponse.json({
      success: false,
      msg: 'Error en el servidor'
    }, { status: 500 });
  }
}