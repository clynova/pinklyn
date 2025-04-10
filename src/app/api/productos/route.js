import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { validateProductCreate } from '@/middleware/validateProduct';
import { withAuth, withRoles } from '@/middleware/auth/authMiddleware';

// GET /api/productos - Obtener todos los productos con filtros opcionales
export async function GET(request) {
  try {
    await connectDB();
    
    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Construir el filtro
    const filtro = {};
    
    // Filtro por categoría (si se especifica)
    if (searchParams.has('categoria')) {
      filtro.categoria = searchParams.get('categoria');
    }
    
    // Filtro por nombre (búsqueda)
    if (searchParams.has('query')) {
      const searchQuery = searchParams.get('query');
      filtro.nombre = { $regex: searchQuery, $options: 'i' };
    }
    
    // Filtro por precio mínimo
    if (searchParams.has('precioMin')) {
      filtro.precio = { ...filtro.precio || {}, $gte: parseFloat(searchParams.get('precioMin')) };
    }
    
    // Filtro por precio máximo
    if (searchParams.has('precioMax')) {
      filtro.precio = { ...filtro.precio || {}, $lte: parseFloat(searchParams.get('precioMax')) };
    }
    
    // Filtro por estado (activo/inactivo)
    if (searchParams.has('activo')) {
      filtro.activo = searchParams.get('activo') === 'true';
    }
    
    // Opciones de paginación
    const pagina = parseInt(searchParams.get('pagina') || '1');
    const limite = parseInt(searchParams.get('limite') || '10');
    const saltar = (pagina - 1) * limite;
    
    // Ordenar
    const ordenarPor = searchParams.get('ordenarPor') || 'createdAt';
    const orden = searchParams.get('orden') === 'asc' ? 1 : -1;
    
    // Ejecutar consulta con paginación
    const productos = await Product.find(filtro)
      .sort({ [ordenarPor]: orden })
      .skip(saltar)
      .limit(limite);
    
    // Contar total para la paginación
    const total = await Product.countDocuments(filtro);
    
    // Calcular páginas totales
    const totalPaginas = Math.ceil(total / limite);
    
    return NextResponse.json({
      productos,
      paginacion: {
        total,
        totalPaginas,
        paginaActual: pagina,
        limite
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 }
    );
  }
}

// Manejador original para crear un producto
async function handlePostRequest(request) {
  try {
    await connectDB();
    
    // Validar los datos del producto con el middleware
    const clonedRequest = request.clone(); // Clonamos la request porque solo se puede leer una vez
    const validationResult = await validateProductCreate(clonedRequest);
    
    // Si la validación falla, devolver errores
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Errores de validación', errors: validationResult.errors },
        { status: validationResult.status }
      );
    }
    
    const datos = validationResult.body;
    
    // Verificar si ya existe un producto con el mismo SKU o slug
    const productoExistente = await Product.findOne({
      $or: [{ sku: datos.sku }, { slug: datos.slug }]
    });
    
    if (productoExistente) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe un producto con el mismo SKU o slug',
          errors: {
            sku: productoExistente.sku === datos.sku ? 'Este SKU ya está en uso' : undefined,
            slug: productoExistente.slug === datos.slug ? 'Este slug ya está en uso' : undefined
          }
        },
        { status: 409 }
      );
    }

    // Asegurarse de que haya una variante predeterminada
    if (datos.variantes && datos.variantes.length > 0) {
      const tienePredeterminada = datos.variantes.some(v => v.esPredeterminada);
      if (!tienePredeterminada) {
        datos.variantes[0].esPredeterminada = true;
      }
    }
    
    // Asegurarse de que haya una imagen principal
    if (datos.multimedia && datos.multimedia.imagenes && datos.multimedia.imagenes.length > 0) {
      const tienePrincipal = datos.multimedia.imagenes.some(img => img.esPrincipal);
      if (!tienePrincipal) {
        datos.multimedia.imagenes[0].esPrincipal = true;
      }
    }
    
    // Establecer fechas de creación y actualización
    datos.fechaCreacion = new Date();
    datos.fechaActualizacion = new Date();

    // Añadir el userId del creador
    if (request.user && request.user._id) {
      datos.creador = request.user._id;
    }
    
    // Crear el producto
    const nuevoProducto = new Product(datos);
    await nuevoProducto.save();
    
    return NextResponse.json({
      success: true,
      mensaje: 'Producto creado correctamente',
      producto: nuevoProducto
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}

// POST /api/productos - Crear un nuevo producto (Con autenticación y roles)
// Solo usuarios con rol "admin" pueden crear productos
export const POST = withRoles(handlePostRequest, ['admin']);