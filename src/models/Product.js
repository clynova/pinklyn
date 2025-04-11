import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategoriaProducto = [
    'ARTE',            // Pinturas, esculturas, grabados, ilustraciones.
    'JOYERIA',         // Collares, pulseras, anillos, pendientes.
    'DECORACION',      // Macetas, velas decorativas, cojines, cuadros.
    'TEXTILES',        // Mantas, bufandas, toallas bordadas, ropa personalizada.
    'ACCESORIOS',      // Bolsos, carteras, cinturones, llaveros.
    'ALIMENTOS',       // Chocolates, vinos, cervezas artesanales, dulces gourmet.
    'INFANTIL',        // Juguetes artesanales, libros personalizados, ropa infantil.
    'BIENESTAR',       // Velas aromáticas, difusores, jabones naturales.
    'PAPELERIA',       // Libretas, tarjetas personalizadas, marcapáginas.
    'PLANTAS',         // Suculentas, flores secas, plantas decorativas.
    'TECNOLOGIA',      // Fundas personalizadas, cargadores portátiles decorativos.
    'OTRO'             // Para productos que no encajen en las demás categorías.
];
const TipoPersonalizacion = [
    'NOMBRE',          // Grabado de nombres (por ejemplo, en collares o tazas).
    'MENSAJE',         // Mensajes personalizados (por ejemplo, en tarjetas o lienzos).
    'DISENO',          // Diseños únicos creados por el cliente (por ejemplo, en textiles o joyería).
    'FOTOS',           // Incorporación de fotos (por ejemplo, en tazas, lienzos o álbumes).
    'FECHA',           // Inclusión de fechas especiales (por ejemplo, en joyas o decoración).
    'COLOR',           // Elección de colores personalizados (por ejemplo, en textiles o accesorios).
    'NINGUNO'          // Productos sin personalización.
];
const TipoProducto = [
    'ARTESANAL',       // Hecho completamente a mano por un artesano.
    'GENERICO',        // Productos producidos en masa sin un artesano específico.
    'SEMIARTESANAL'    // Mezcla de producción artesanal y procesos industriales.
];

// Base Product Schema
const EsquemaProductoBase = new Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    categoria: {
        type: String,
        enum: CategoriaProducto,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    descripcion: {
        corta: {
            type: String,
            maxlength: 160
        },
        completa: {
            type: String
        },
        caracteristicasDestacadas: [String]
    },
    multimedia: {
        imagenes: [{
            url: {
                type: String,
                required: true
            },
            textoAlternativo: String,
            esPrincipal: {
                type: Boolean,
                default: false
            },
            orden: {
                type: Number,
                default: 0
            }
        }],
        video: String
    },
    seo: {
        metaTitulo: String,
        metaDescripcion: {
            type: String,
            maxlength: 160
        },
        palabrasClave: [String],
        pageTitle: String
    },
    infoAdicional: {
        origen: String,
        artesano: String,
        marca: String,
        proveedor: String,
        certificaciones: [String]
    },
    conservacion: {
        instrucciones: String
    },
    personalizacion: {
        tipo: {
            type: String,
            enum: TipoPersonalizacion,
            default: 'NINGUNO'
        },
        detalles: String
    },
    variantes: [{
        nombre: String,
        precio: Number,
        descuento: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        stockDisponible: {
            type: Number,
            min: 0,
            default: 0
        },
        umbralStockBajo: {
            type: Number,
            default: 5
        },
        sku: String,
        ultimaActualizacion: {
            type: Date,
            default: Date.now
        },
        estado: {
            type: Boolean,
            default: true
        },
        esPredeterminada: {
            type: Boolean,
            default: false
        }
    }],
    tipoProducto: {
        type: String,
        enum: TipoProducto,
        default: 'ARTESANAL'
    },
    tags: [{ type: String, trim: true }],
    usosRecomendados: [String],
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    discriminatorKey: 'tipoProducto',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para seleccionar automáticamente una variante predeterminada
EsquemaProductoBase.virtual('variantePredeterminada').get(function () {
    if (!this.variantes || this.variantes.length === 0) {
        return null;
    }
    
    // Primero buscamos una variante marcada explícitamente como predeterminada
    let predeterminada = this.variantes.find(variante => variante.esPredeterminada);

    // Si no hay ninguna marcada como predeterminada, tomamos la primera disponible con stock
    if (!predeterminada) {
        predeterminada = this.variantes.find(variante => variante.stockDisponible > 0);
    }

    // Si tampoco hay con stock, simplemente tomamos la primera
    if (!predeterminada && this.variantes.length > 0) {
        predeterminada = this.variantes[0];
    }
    
    if (!predeterminada) return null;
    
    // Calculamos el precio final con descuento
    const precio = predeterminada.precio;
    const descuento = predeterminada.descuento || 0;
    const precioFinal = precio - (precio * descuento / 100);
    
    return {
        varianteId: predeterminada._id,
        nombre: predeterminada.nombre,
        precio: precio,
        descuento: descuento,
        precioFinal: parseFloat(precioFinal.toFixed(2)),
        stockDisponible: predeterminada.stockDisponible,
        esPredeterminada: predeterminada.esPredeterminada,
        sku: predeterminada.sku
    };
});




// Virtual que calcula el precio con descuento para cada variante
EsquemaProductoBase.virtual('variantesConPrecioFinal').get(function () {
    if (!this.variantes || this.variantes.length === 0) {
        return [];
    }
    
    return this.variantes.map(variante => {
        const precioConDescuento = variante.descuento > 0
            ? variante.precio - (variante.precio * variante.descuento / 100)
            : variante.precio;

        return {
            varianteId: variante._id,
            nombre: variante.nombre,
            precio: variante.precio,
            descuento: variante.descuento || 0,
            precioFinal: parseFloat(precioConDescuento.toFixed(2)),
            tieneDescuento: variante.descuento > 0,
            stockDisponible: variante.stockDisponible,
            esPredeterminada: variante.esPredeterminada,
            sku: variante.sku,
            estado: variante.estado,
            ultimaActualizacion: variante.ultimaActualizacion
        };
    });
});

// Método para obtener el precio final de una variante específica por su ID
EsquemaProductoBase.methods.calcularPrecioFinal = function (varianteId) {
    const variante = this.variantes.id(varianteId);
    if (!variante) return null;

    const precioConDescuento = variante.descuento > 0
        ? variante.precio - (variante.precio * variante.descuento / 100)
        : variante.precio;

    return parseFloat(precioConDescuento.toFixed(2));
};

// Pre-save hook para garantizar que solo una variante sea la predeterminada
EsquemaProductoBase.pre('save', function (next) {
    // Si hay al menos una variante marcada como predeterminada, nos aseguramos que sea solo una
    const predeterminadas = this.variantes.filter(v => v.esPredeterminada);

    if (predeterminadas.length > 1) {
        // Si hay más de una, dejamos solo la primera como predeterminada
        for (let i = 1; i < predeterminadas.length; i++) {
            predeterminadas[i].esPredeterminada = false;
        }
    } else if (this.variantes.length > 0 && predeterminadas.length === 0) {
        // Si no hay ninguna predeterminada pero hay variantes, establecemos la primera como predeterminada
        this.variantes[0].esPredeterminada = true;
    }

    next();
});

const Product = mongoose.models.Product || mongoose.model('Product', EsquemaProductoBase);

export default Product;