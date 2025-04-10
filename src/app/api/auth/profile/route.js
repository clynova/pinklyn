import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

/**
 * Maneja la solicitud PUT para actualizar el perfil del usuario
 */
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { firstName, lastName, phone } = await request.json();
    
    await connectToDatabase();
    
    const userEmail = session.user.email;
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        firstName,
        lastName,
        phone
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    return NextResponse.json(
      { message: 'Error al actualizar el perfil', error: error.message },
      { status: 500 }
    );
  }
}