import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth/authMiddleware';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';

/**
 * Manejador para obtener los datos del perfil
 */
async function handleGetProfile(request) {
  try {
    // El middleware withAuth ya verificó la autenticación y asignó req.user
    const userId = request.user._id;
    
    try {
      const result = await userController.getProfile(userId);
      return NextResponse.json(result);
    } catch (error) {
      if (error.type === 'USER_NOT_FOUND') {
        return NextResponse.json(
          { success: false, msg: error.message },
          { status: error.status || 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error obteniendo el perfil:', error);
    return NextResponse.json(
      { success: false, msg: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}

/**
 * Manejador para actualizar el perfil del usuario
 */
async function handleUpdateProfile(request) {
  try {
    // El middleware withAuth ya verificó la autenticación y asignó req.user
    const userId = request.user._id;
    const updateData = await request.json();
    
    try {
      const result = await userController.updateProfile(userId, updateData);
      return NextResponse.json(result);
    } catch (error) {
      if (error.type === 'USER_NOT_FOUND') {
        return NextResponse.json(
          { success: false, msg: error.message },
          { status: error.status || 404 }
        );
      } else if (error.type === 'INVALID_UPDATE') {
        return NextResponse.json(
          { success: false, msg: error.message },
          { status: error.status || 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    return NextResponse.json(
      { success: false, msg: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}

// Proteger todas las rutas con el middleware de autenticación y base de datos
export const GET = withAuth(withDatabase(handleGetProfile));
export const PUT = withAuth(withDatabase(handleUpdateProfile));