import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { validateProductUpdate } from '@/middleware/validateProduct';
import { withAuth, withRoles, withOwnerOrAdmin } from '@/middleware/auth/authMiddleware';

// Validar que el ID sea un ObjectID válido
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/productos/[id] - Obtener un producto por ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID de producto no válido' },
        { status: 400 }
      );
    }
    
    const producto = await Product.findById(id);
    
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}

// Manejador original para la función PUT
async function handlePutRequest(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto no válido' },
        { status: 400 }
      );
    }
    
    // Validar los datos del producto con el middleware
    const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
    const validationResult = await validateProductUpdate(clonedRequest);
    
    // Si la validación falla, devolver errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Errores de validación', errors: validationResult.errors },
        { status: validationResult.status }
      );
    }
    
    const datos = validationResult.body;
    
    // Comprobar si el producto existe
    const productoExistente = await Product.findById(id);
    if (!productoExistente) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si hay otro producto con el mismo SKU o slug (que no sea este mismo)
    if (datos.sku || datos.slug) {
      const condicionesDuplicado = [];
      
      if (datos.sku) condicionesDuplicado.push({ sku: datos.sku });
      if (datos.slug) condicionesDuplicado.push({ slug: datos.slug });
      
      if (condicionesDuplicado.length > 0) {
        const duplicado = await Product.findOne({
          _id: { $ne: id },
          $or: condicionesDuplicado
        });
        
        if (duplicado) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Ya existe otro producto con el mismo SKU o slug',
              errors: {
                ...(datos.sku && duplicado.sku === datos.sku ? { sku: 'Este SKU ya está en uso' } : {}),
                ...(datos.slug && duplicado.slug === datos.slug ? { slug: 'Este slug ya está en uso' } : {})
              }
            },
            { status: 409 }
          );
        }
      }
    }
    
    // Si actualizan variantes, asegurar que haya una predeterminada
    if (datos.variantes && Array.isArray(datos.variantes) && datos.variantes.length > 0) {
      const tienePredeterminada = datos.variantes.some(v => v.esPredeterminada);
      if (!tienePredeterminada) {
        datos.variantes[0].esPredeterminada = true;
      }
    }
    
    // Si actualizan imágenes, asegurar que haya una principal
    if (datos.multimedia && datos.multimedia.imagenes && 
        Array.isArray(datos.multimedia.imagenes) && datos.multimedia.imagenes.length > 0) {
      const tienePrincipal = datos.multimedia.imagenes.some(img => img.esPrincipal);
      if (!tienePrincipal) {
        datos.multimedia.imagenes[0].esPrincipal = true;
      }
    }
    
    // Actualizar fechaActualizacion
    datos.fechaActualizacion = new Date();
    
    // Actualizar el producto
    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      { $set: datos },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

// Manejador original para la función DELETE
async function handleDeleteRequest(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validar que el ID sea válido
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto no válido' },
        { status: 400 }
      );
    }
    
    // Verificar que el producto existe antes de eliminar
    const productoExistente = await Product.findById(id);
    if (!productoExistente) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    // Eliminar el producto
    const productoEliminado = await Product.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      mensaje: 'Producto eliminado correctamente',
      id: productoEliminado._id
    }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}

// PUT /api/productos/[id] - Actualizar un producto existente (Con autenticación)
// Solo usuarios con rol "admin" pueden actualizar productos
export const PUT = withRoles(handlePutRequest, ['admin']);

// DELETE /api/productos/[id] - Eliminar un producto (Con autenticación)
// Solo usuarios con rol "admin" pueden eliminar productos
export const DELETE = withRoles(handleDeleteRequest, ['admin']);