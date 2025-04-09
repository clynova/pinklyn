import mongoose from 'mongoose';

// Construir la URI de MongoDB a partir de las variables de entorno existentes
const MONGODB_URI = process.env.DB_URL 
  ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, define las variables de entorno para MongoDB (DB_URL, DB_USER, DB_PASSWORD y DB_NAME) o MONGODB_URI');
}

/**
 * Variable global para mantener la conexión en desarrollo
 */
const cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('MongoDB conectado correctamente');
        return mongoose;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;