/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */

/**
 * Actualiza los datos de perfil del usuario
 * @param {Object} userData - Los datos del usuario a actualizar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Promesa con los datos del usuario actualizados
 */
export async function updateProfile(userData, token) {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    throw error;
  }
}