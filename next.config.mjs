/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  reactStrictMode: true,
  
  // Corrección: serverComponentsExternalPackages ha sido movido a serverExternalPackages
  serverExternalPackages: ['mongoose']
};

export default nextConfig;
