import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth/authMiddleware';

/**
 * Manejador para actualizar el perfil del usuario
 */
async function handleUpdateProfile(request) {
  try {
    // El middleware withAuth ya verificó la autenticación y asignó req.user
    // Obtenemos el usuario autenticado
    const user = request.user;
    
    // Obtenemos los datos del cuerpo de la solicitud
    const { firstName, lastName, phone } = await request.json();
    
    await connectDB();
    
    // Actualizamos los datos del usuario
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        phone
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, msg: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true, 
      msg: 'Perfil actualizado correctamente',
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    return NextResponse.json(
      { success: false, msg: 'Error al actualizar el perfil', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Manejador para obtener los datos del perfil
 */
async function handleGetProfile(request) {
  try {
    // El middleware withAuth ya verificó la autenticación y asignó req.user
    // Simplemente devolvemos el usuario (sin la contraseña)
    return NextResponse.json({
      success: true,
      user: request.user
    });
  } catch (error) {
    console.error('Error obteniendo el perfil:', error);
    return NextResponse.json(
      { success: false, msg: 'Error al obtener el perfil', error: error.message },
      { status: 500 }
    );
  }
}

// Proteger todas las rutas con el middleware de autenticación
export const GET = withAuth(handleGetProfile);
export const PUT = withAuth(handleUpdateProfile);