// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración para imágenes externas
  images: {
    // Dominios permitidos (método compatible con versiones anteriores)
    domains: ['127.0.0.1', 'localhost'],
    
    // Patrones remotos más específicos (para Next.js 12.3+)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      }
    ],
    
    // Configuraciones básicas
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    
    // Tamaños de dispositivo para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Si tienes problemas con la optimización, descomenta la siguiente línea:
    // unoptimized: true,
  },

  // Variables de entorno personalizadas
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Configuración del compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
