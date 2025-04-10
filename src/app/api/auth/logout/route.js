import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TokenBlacklist from '@/models/TokenBlacklist';
import { cookies } from 'next/headers';
import { withAuth } from '@/middleware/auth/authMiddleware';

async function handleLogout(request) {
  try {
    await connectDB();
    
    // Obtener el token del header
    let token;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1].trim();
    }
    
    if (token) {
      // Agregar el token a la lista negra
      const tokenDoc = new TokenBlacklist({ token });
      await tokenDoc.save();
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

export const POST = withAuth(handleLogout);