import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { withAuth } from '@/middleware/auth/authMiddleware';
import { withDatabase } from '@/middleware/dbConnection';
import userController from '@/controllers/userController';

async function handleLogout(request) {
  try {
    // Obtener el token del header
    let token;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1].trim();
    }
    
    if (token) {
      // Usar el controlador para invalidar el token
      await userController.logout(token);
    }
    
    // Eliminar la cookie del servidor
    const cookieStore = cookies();
    cookieStore.delete('token');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al cerrar sesión' 
    }, { status: 500 });
  }
}

export const POST = withAuth(withDatabase(handleLogout));