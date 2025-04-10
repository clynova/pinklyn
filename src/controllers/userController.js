import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';
import { 
  generateToken, 
  generateVerificationToken, 
  hashPassword, 
  comparePasswords, 
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/auth';
import mongoose from 'mongoose';

/**
 * Controlador para manejar todas las operaciones relacionadas con usuarios y autenticación
 */
class UserController {
  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} - Usuario registrado con token de verificación
   */
  async register(userData) {
    try {
      // Verificar si el correo ya existe
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      
      if (existingUser) {
        throw {
          type: 'DUPLICATE_EMAIL',
          message: 'El correo electrónico ya está registrado',
          status: 409
        };
      }

      // Generar hash de la contraseña
      const hashedPassword = await hashPassword(userData.password);

      // Generar token de verificación
      const verificationToken = generateVerificationToken();
      
      // Crear el nuevo usuario
      const newUser = new User({
        ...userData,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        token: verificationToken,
        confirmado: false
      });

      await newUser.save();
      
      // Eliminar la contraseña del objeto de respuesta
      const userResponse = newUser.toObject();
      delete userResponse.password;
      
      return {
        success: true,
        user: userResponse,
        message: 'Usuario registrado correctamente. Por favor verifica tu correo electrónico.'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Inicia sesión con un usuario existente
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Datos del usuario con tokens de acceso y refresco
   */
  async login(email, password) {
    try {
      // Buscar el usuario por email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      // Verificar si el usuario existe
      if (!user) {
        throw {
          type: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas',
          status: 401
        };
      }

      // Verificar si el usuario está verificado (usando confirmado en lugar de verification.verified)
      if (!user.confirmado) {
        throw {
          type: 'UNVERIFIED_USER',
          message: 'Por favor verifica tu cuenta antes de iniciar sesión',
          status: 403
        };
      }

      // Verificar la contraseña
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        throw {
          type: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas',
          status: 401
        };
      }

      // Generar tokens
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      // Actualizar la última sesión del usuario
      user.lastLogin = new Date();
      await user.save();

      // Crear respuesta sin incluir la contraseña
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        user: userResponse,
        accessToken,
        refreshToken,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  /**
   * Verifica el token de un usuario para activar su cuenta
   * @param {string} token - Token de verificación
   * @returns {Promise<Object>} - Confirmación de verificación
   */
  async verifyAccount(token) {
    try {
      // Buscar usuario con el token de verificación
      const user = await User.findOne({ token });

      if (!user) {
        throw {
          type: 'INVALID_TOKEN',
          message: 'Token de verificación inválido',
          status: 400
        };
      }

      // Verificar la cuenta
      user.confirmado = true;
      user.token = null; // Eliminamos el token después de usarlo
      
      await user.save();

      return {
        success: true,
        message: 'Cuenta verificada correctamente'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al verificar cuenta: ${error.message}`);
    }
  }

  /**
   * Reenvía el código de verificación a un usuario
   * @param {string} email - Correo electrónico del usuario
   * @returns {Promise<Object>} - Confirmación del reenvío
   */
  async resendVerificationCode(email) {
    try {
      // Buscar al usuario por email
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        throw {
          type: 'USER_NOT_FOUND',
          message: 'No existe un usuario con ese correo electrónico',
          status: 404
        };
      }

      // Verificar si la cuenta ya está verificada
      if (user.confirmado) {
        throw {
          type: 'ALREADY_VERIFIED',
          message: 'La cuenta ya está verificada',
          status: 400
        };
      }

      // Generar nuevo token de verificación
      const verificationToken = generateVerificationToken();
      
      // Actualizar token
      user.token = verificationToken;
      
      await user.save();

      return {
        success: true,
        verificationToken, // Incluimos el token solo en desarrollo
        message: 'Código de verificación reenviado'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al reenviar código: ${error.message}`);
    }
  }

  /**
   * Obtiene el perfil de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} - Datos del perfil del usuario
   */
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw {
          type: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
          status: 404
        };
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
  }

  /**
   * Actualiza el perfil de un usuario
   * @param {string} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Perfil actualizado
   */
  async updateProfile(userId, updateData) {
    try {
      // Verificar que no se intente cambiar el email o contraseña por esta vía
      if (updateData.email || updateData.password) {
        throw {
          type: 'INVALID_UPDATE',
          message: 'No se puede cambiar el email o contraseña por esta vía',
          status: 400
        };
      }

      // Actualizar el perfil
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        throw {
          type: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
          status: 404
        };
      }

      return {
        success: true,
        user: updatedUser,
        message: 'Perfil actualizado correctamente'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  }

  /**
   * Cambia la contraseña de un usuario
   * @param {string} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} - Confirmación del cambio
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Buscar usuario
      const user = await User.findById(userId);
      
      if (!user) {
        throw {
          type: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
          status: 404
        };
      }

      // Verificar contraseña actual
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isPasswordValid) {
        throw {
          type: 'INVALID_PASSWORD',
          message: 'La contraseña actual es incorrecta',
          status: 400
        };
      }

      // Verificar que la nueva contraseña sea diferente
      if (currentPassword === newPassword) {
        throw {
          type: 'SAME_PASSWORD',
          message: 'La nueva contraseña debe ser diferente a la actual',
          status: 400
        };
      }

      // Actualizar contraseña
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      
      await user.save();

      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };
    } catch (error) {
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Cierra la sesión del usuario
   * @param {string} token - Token de acceso a invalidar
   * @returns {Promise<Object>} - Confirmación del cierre de sesión
   */
  async logout(token) {
    try {
      // Añadir el token a la lista negra
      await TokenBlacklist.create({
        token,
        createdAt: new Date()
      });

      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }

  /**
   * Refresca el token de acceso usando un token de refresco
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} - Nuevo token de acceso
   */
  async refreshToken(refreshToken) {
    try {
      // Verificar y decodificar el token de refresco
      const decoded = verifyRefreshToken(refreshToken);
      
      // Verificar si el usuario existe
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw {
          type: 'INVALID_TOKEN',
          message: 'Token inválido',
          status: 401
        };
      }

      // Generar nuevo token de acceso
      const newAccessToken = generateToken(user);

      return {
        success: true,
        accessToken: newAccessToken
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw {
          type: 'INVALID_TOKEN',
          message: 'Token inválido o expirado',
          status: 401
        };
      }
      
      // Propagar errores específicos
      if (error.type) {
        throw error;
      }
      
      throw new Error(`Error al refrescar token: ${error.message}`);
    }
  }
}

export default new UserController();