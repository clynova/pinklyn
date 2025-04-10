import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import TokenBlacklist from '@/models/TokenBlacklist';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';

/**
 * Middleware para verificar autenticación en rutas de API de Next.js
 * @param {Function} handler - El manejador de la ruta API que se ejecutará si la autenticación es exitosa
 * @returns {Function} - Función middleware que verifica el token antes de ejecutar el handler
 */
export function withAuth(handler) {
  return async (request, context) => {
    try {
      // Obtener el token del header de autorización
      let token;
      const authHeader = request.headers.get('authorization');
      
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1].trim();
      }

      // Si no hay token en el header, intentar obtenerlo de las cookies HTTP-only
      if (!token) {
        const cookieStore = cookies();
        token = cookieStore.get('token')?.value;
      }

      if (!token) {
        return NextResponse.json({
          success: false,
          msg: 'Acceso denegado: No se proporcionó un token'
        }, { status: 401 });
      }

      // Verificar el token
      try {
        await connectDB();
        
        // Verificar si el token está en la lista negra
        const tokenInBlacklist = await TokenBlacklist.findOne({ token });
        if (tokenInBlacklist) {
          return NextResponse.json({ 
            success: false, 
            msg: "Token inválido. Sesión cerrada." 
          }, { status: 401 });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key_development');
        
        // Buscar usuario
        const user = await User.findById(decoded.userId).select("-password -token");
        
        if (!user) {
          return NextResponse.json({
            success: false,
            msg: 'Acceso denegado: Usuario no encontrado'
          }, { status: 404 });
        }

        // Verificar si el usuario está activo
        if (!user.estado) {
          return NextResponse.json({
            success: false,
            msg: 'Acceso denegado: Usuario desactivado'
          }, { status: 403 });
        }

        // Verificar si el usuario está confirmado
        if (!user.confirmado) {
          return NextResponse.json({
            success: false,
            msg: 'Acceso denegado: Usuario no confirmado'
          }, { status: 403 });
        }

        // Agregar el usuario a la request para que esté disponible en el handler
        request.user = user;
        
        // Continuar con la ejecución del handler
        return handler(request, context);
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

        console.error("Error en withAuth:", err);
        return NextResponse.json({
          success: false,
          msg: 'Error en la autenticación'
        }, { status: 500 });
      }
    } catch (error) {
      console.error("Error general en withAuth:", error);
      return NextResponse.json({
        success: false,
        msg: 'Error en el servidor'
      }, { status: 500 });
    }
  };
}

/**
 * Middleware para verificar roles de usuario
 * @param {Function} handler - El manejador de la ruta API
 * @param {Array<string>} requiredRoles - Los roles requeridos para acceder
 * @returns {Function} - Función middleware que verifica los roles del usuario
 */
export function withRoles(handler, requiredRoles) {
  return async (request, context) => {
    // Primero verificar autenticación
    return withAuth(async (req, ctx) => {
      // A este punto, el usuario ya está autenticado y req.user está disponible
      
      // Verificar roles
      const userRoles = req.user.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return NextResponse.json({
          success: false,
          msg: 'No tienes permisos para realizar esta acción'
        }, { status: 403 });
      }
      
      // Si tiene los permisos, continuar con el handler
      return handler(req, ctx);
    })(request, context);
  };
}

/**
 * Middleware para verificar si el usuario es dueño del recurso o es admin
 * @param {Function} handler - El manejador de la ruta API
 * @param {Function} getResourceOwnerId - Función para obtener el ID del dueño del recurso
 * @returns {Function} - Función middleware
 */
export function withOwnerOrAdmin(handler, getResourceOwnerId) {
  return async (request, context) => {
    // Primero verificar autenticación
    return withAuth(async (req, ctx) => {
      try {
        // A este punto, el usuario ya está autenticado y req.user está disponible
        const userId = req.user._id.toString();
        const isAdmin = req.user.roles.includes('admin');
        
        // Si es admin, permitir acceso de inmediato
        if (isAdmin) {
          return handler(req, ctx);
        }
        
        // Si no es admin, verificar si es dueño
        const resourceOwnerId = await getResourceOwnerId(req, ctx);
        
        if (resourceOwnerId && userId === resourceOwnerId.toString()) {
          return handler(req, ctx);
        }
        
        // No es dueño ni admin
        return NextResponse.json({
          success: false,
          msg: 'No tienes permiso para realizar esta acción'
        }, { status: 403 });
      } catch (error) {
        console.error("Error en withOwnerOrAdmin:", error);
        return NextResponse.json({
          success: false,
          msg: 'Error al verificar permisos'
        }, { status: 500 });
      }
    })(request, context);
  };
}