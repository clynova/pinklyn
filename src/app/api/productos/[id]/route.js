import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

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

// PUT /api/productos/[id] - Actualizar un producto existente
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID de producto no válido' },
        { status: 400 }
      );
    }
    
    const datos = await request.json();
    
    // Comprobar si el producto existe
    const productoExistente = await Product.findById(id);
    if (!productoExistente) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si hay otro producto con el mismo SKU o slug (que no sea este mismo)
    if (datos.sku || datos.slug) {
      const filtro = {
        _id: { $ne: id },
        $or: []
      };
      
      if (datos.sku) filtro.$or.push({ sku: datos.sku });
      if (datos.slug) filtro.$or.push({ slug: datos.slug });
      
      if (filtro.$or.length > 0) {
        const duplicado = await Product.findOne(filtro);
        if (duplicado) {
          return NextResponse.json(
            { error: 'Ya existe otro producto con el mismo SKU o slug' },
            { status: 409 }
          );
        }
      }
    }
    
    // Actualizar el producto
    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      { $set: datos },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

// DELETE /api/productos/[id] - Eliminar un producto
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID de producto no válido' },
        { status: 400 }
      );
    }
    
    const productoEliminado = await Product.findByIdAndDelete(id);
    
    if (!productoEliminado) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { mensaje: 'Producto eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}