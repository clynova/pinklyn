'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingBag, FaUsers, FaChartBar, FaCog, FaClipboardList, FaCommentAlt } from 'react-icons/fa';

export function AdminSidebar() {
  const pathname = usePathname();
  
  // Array de enlaces de navegación
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FaChartBar /> },
    { href: '/admin/productos', label: 'Productos', icon: <FaShoppingBag /> },
    { href: '/admin/pedidos', label: 'Pedidos', icon: <FaClipboardList /> },
  ];
  
  // Comprobar si un enlace está activo
  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Panel de Administración</h2>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}