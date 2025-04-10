import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/productos - Obtener todos los productos con filtros opcionales
export async function GET(request) {
  try {
    await connectDB();

    const productos2 = await Product.find()
    
    // Extraer parámetros de consulta
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const busqueda = searchParams.get('busqueda');
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Construir filtro de consulta
    const filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    //if (estado !== undefined) filtro.estado = estado === 'true';
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { 'descripcion.corta': { $regex: busqueda, $options: 'i' } },
        { tags: { $in: [new RegExp(busqueda, 'i')] } }
      ];
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    console.log(filtro)
    
    // Ejecutar consulta
    const productos = await Product.find(filtro)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);
    
    // Contar total para info de paginación
    const total = await Product.countDocuments(filtro);
    
    return NextResponse.json({
      productos,
      paginacion: {
        total,
        paginas: Math.ceil(total / limit),
        paginaActual: page,
        porPagina: limit
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST /api/productos - Crear un nuevo producto
export async function POST(request) {
  try {
    await connectDB();
    
    // Obtener datos del cuerpo de la solicitud
    const datos = await request.json();
    
    // Validar datos mínimos requeridos
    if (!datos.nombre || !datos.sku || !datos.slug || !datos.categoria) {
      return NextResponse.json(
        { error: 'Falta información obligatoria del producto' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe un producto con el mismo SKU o slug
    const productoExistente = await Product.findOne({
      $or: [{ sku: datos.sku }, { slug: datos.slug }]
    });
    
    if (productoExistente) {
      return NextResponse.json(
        { error: 'Ya existe un producto con el mismo SKU o slug' },
        { status: 409 }
      );
    }
    
    // Crear nuevo producto
    const nuevoProducto = await Product.create(datos);
    
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}