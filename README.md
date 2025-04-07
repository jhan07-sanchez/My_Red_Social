## 🛠️ Panel de Administración – Django Admin

Nuestra red social cuenta con un panel de administración completo y poderoso usando Django Admin.

Desde este panel, los administradores pueden gestionar:

- 👥 Usuarios registrados (editar datos, activar/desactivar cuentas, ver últimos accesos)
- 🎨 Estilos visuales por temporada (Navidad, Halloween, Verano, etc.)
- 📝 Publicaciones y comentarios (moderar contenido, eliminar publicaciones ofensivas)
- 🤝 Relaciones de amistad/seguidores (ver solicitudes, aceptar/bloquear)
- 🚩 Reportes de contenido (reportes hechos por usuarios)
- 📣 Notificaciones globales (avisos o banners para todos los usuarios)
- ⚙️ Configuración del sitio (nombre del sitio, logo, estado de mantenimiento)
- 📊 Estadísticas de uso (usuarios activos, publicaciones recientes, temporadas activas)
- ✅ Sistema de verificación de usuarios (usuarios con insignias especiales)

Todo esto está organizado en el panel Django Admin con filtros, buscadores, y secciones por categoría para facilitar el control total del sistema.

> Solo los usuarios con permisos de administrador tienen acceso a este panel.



Paso a paso para usar .env.local en Next.js
1. Crea el archivo .env.local en la raíz de tu proyecto
Este archivo se debe ubicar donde está tu package.json.
Crea un archivo llamado exactamente:

lua
Copiar
Editar
.env.local
Y dentro escribe:

env
Copiar
Editar
NEXT_PUBLIC_API_BASE_URL=http://192.168.101.7:8000
🔒 NEXT_PUBLIC_ es obligatorio para que las variables estén disponibles en el frontend (cliente).

2. Usa la variable en tu código
En lugar de esto:

js
Copiar
Editar
fetch("http://192.168.101.7:8000/api/usuarios/login/", {
Usa esto:

js
Copiar
Editar
fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usuarios/login/`, {
Esto funciona igual para cualquier otro endpoint de tu API.

3. Reinicia el servidor de desarrollo
Las variables de entorno solo se cargan cuando inicias Next.js, así que si ya lo tenías corriendo, haz esto:

bash
Copiar
Editar
npm run dev
# o
yarn dev
✅ Bonus: Archivos .env recomendados
Puedes tener diferentes entornos si quieres:

.env.local → para desarrollo local

.env.production → para producción (cuando subas al servidor)

