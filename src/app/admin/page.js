'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaShoppingBag, 
  FaBoxOpen, 
  FaUsers, 
  FaChartLine, 
  FaGift, 
  FaCommentAlt,
  FaEye,
  FaArrowRight 
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Referencias para elementos animados
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const accessRef = useRef(null);
  const tablesRef = useRef(null);
  const bannerRef = useRef(null);
  
  // Aplicar animaciones al cargar la página
  useEffect(() => {
    // Añadir clases de animación con delay progresivo
    if (headerRef.current) headerRef.current.classList.add('animate-fadeIn');
    
    const timer1 = setTimeout(() => {
      if (statsRef.current) statsRef.current.classList.add('animate-fadeIn');
    }, 200);
    
    const timer2 = setTimeout(() => {
      if (accessRef.current) accessRef.current.classList.add('animate-fadeIn');
    }, 400);
    
    const timer3 = setTimeout(() => {
      if (tablesRef.current) tablesRef.current.classList.add('animate-fadeIn');
    }, 600);
    
    const timer4 = setTimeout(() => {
      if (bannerRef.current) bannerRef.current.classList.add('animate-fadeIn');
    }, 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  // Datos de ejemplo para el dashboard
  // En un entorno real, estos datos vendrían de una API o hook personalizado
  const resumenVentas = {
    hoy: 1250,
    semana: 8750,
    mes: 32680,
    crecimiento: 12.5
  };
  
  const ordenesRecientes = [
    { id: 'ORD-2304', cliente: 'Ana García', total: 1250, fecha: '10 Abr, 2025', estado: 'Completado' },
    { id: 'ORD-2303', cliente: 'Luis Martínez', total: 850, fecha: '10 Abr, 2025', estado: 'Procesando' },
    { id: 'ORD-2302', cliente: 'Elena Sánchez', total: 2340, fecha: '09 Abr, 2025', estado: 'Enviado' },
    { id: 'ORD-2301', cliente: 'Carlos Ruiz', total: 1580, fecha: '09 Abr, 2025', estado: 'Completado' }
  ];
  
  const productosPopulares = [
    { id: 1, nombre: 'Kit de Spa Premium', vendidos: 45, ingresos: 13500 },
    { id: 2, nombre: 'Caja de Chocolates Artesanales', vendidos: 38, ingresos: 7600 },
    { id: 3, nombre: 'Joyería Artesanal', vendidos: 32, ingresos: 9600 },
    { id: 4, nombre: 'Vino Reserva Especial', vendidos: 28, ingresos: 5600 }
  ];
  
  const accesoRapido = [
    { nombre: 'Productos', icono: <FaBoxOpen className="text-blue-500" />, ruta: '/admin/productos', descripcion: 'Gestiona tu catálogo' },
    { nombre: 'Pedidos', icono: <FaShoppingBag className="text-amber-500" />, ruta: '/admin/pedidos', descripcion: 'Revisa órdenes recientes' },
    { nombre: 'Usuarios', icono: <FaUsers className="text-emerald-500" />, ruta: '/admin/usuarios', descripcion: 'Administra cuentas' },
    { nombre: 'Comentarios', icono: <FaCommentAlt className="text-purple-500" />, ruta: '/admin/comentarios', descripcion: 'Opiniones de clientes' }
  ];
  
  // Formato de moneda
  const formatoCurrency = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado con bienvenida */}
      <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-200 dark:border-gray-700 opacity-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white" style={{ fontFamily: 'Kaushan Script, cursive' }}>Panel de Administración</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Bienvenido{user?.name ? `, ${user.name}` : ''}. Aquí tienes un resumen de tu tienda.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            Tienda en línea
          </span>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-0">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium opacity-80">Ventas Hoy</p>
              <h3 className="text-2xl font-bold mt-1">{formatoCurrency(resumenVentas.hoy)}</h3>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <FaChartLine className="text-white text-xl company-float" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="font-medium bg-white bg-opacity-30 px-2 py-1 rounded">
              +{resumenVentas.crecimiento}%
            </span>
            <span className="ml-2 opacity-80">vs semana pasada</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium opacity-80">Ventas Semana</p>
              <h3 className="text-2xl font-bold mt-1">{formatoCurrency(resumenVentas.semana)}</h3>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <FaShoppingBag className="text-white text-xl company-float" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="opacity-80">Total de {ordenesRecientes.length} pedidos hoy</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium opacity-80">Ventas Mes</p>
              <h3 className="text-2xl font-bold mt-1">{formatoCurrency(resumenVentas.mes)}</h3>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <FaGift className="text-white text-xl company-float" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="opacity-80">Meta mensual: {formatoCurrency(40000)}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium opacity-80">Productos Vendidos</p>
              <h3 className="text-2xl font-bold mt-1">143</h3>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <FaBoxOpen className="text-white text-xl company-float" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="font-medium bg-white bg-opacity-30 px-2 py-1 rounded">
              +8.2%
            </span>
            <span className="ml-2 opacity-80">vs mes anterior</span>
          </div>
        </div>
      </div>
      
      {/* Accesos rápidos */}
      <div ref={accessRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 opacity-0">
        {accesoRapido.map((acceso, index) => (
          <Link 
            href={acceso.ruta}
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                {acceso.icono}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <FaArrowRight className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-white" style={{ fontFamily: 'Crushed, sans-serif' }}>{acceso.nombre}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{acceso.descripcion}</p>
          </Link>
        ))}
      </div>
      
      {/* Sección de órdenes y productos populares */}
      <div ref={tablesRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0">
        {/* Órdenes recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white" style={{ fontFamily: 'Kings, cursive' }}>Pedidos Recientes</h2>
            <Link href="/admin/pedidos" className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline">
              Ver todos <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Monto</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {ordenesRecientes.map((orden) => (
                    <tr key={orden.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer">
                      <td className="py-3 text-sm font-medium text-blue-600 dark:text-blue-400">{orden.id}</td>
                      <td className="py-3 text-sm text-gray-800 dark:text-gray-200">{orden.cliente}</td>
                      <td className="py-3 text-sm text-gray-800 dark:text-gray-200">{formatoCurrency(orden.total)}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          orden.estado === 'Completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          orden.estado === 'Procesando' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {orden.estado}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{orden.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Productos populares */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white" style={{ fontFamily: 'Kings, cursive' }}>Productos Populares</h2>
            <Link href="/admin/productos" className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline">
              Ver catálogo <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productosPopulares.map((producto) => (
                <div key={producto.id} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 p-3 rounded-lg transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                      <FaGift className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{producto.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{producto.vendidos} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">{formatoCurrency(producto.ingresos)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Banner promocional */}
      <div ref={bannerRef} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white opacity-0">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Kaushan Script, cursive' }}>¿Necesitas ayuda con tu tienda?</h3>
            <p className="mt-1 opacity-90">Descubre consejos para optimizar tus ventas y mejorar la experiencia de tus clientes.</p>
          </div>
          <button className="bg-white text-purple-700 px-5 py-2 rounded-lg font-medium hover:bg-opacity-90 transition animate-bounce">
            Ver guías
          </button>
        </div>
      </div>
    </div>
  );
}