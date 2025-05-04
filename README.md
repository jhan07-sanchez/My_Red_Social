# 🌐 SOCIALINK - Red Social con Django + React

SOCIALINK es una red social moderna desarrollada con **Django REST Framework** en el backend y **React con Next.js** en el frontend. El objetivo es ofrecer una experiencia similar a Facebook, con funcionalidades sociales completas, autenticación segura y un diseño limpio y responsivo.

## 🧱 Estructura del Proyecto

```
/mi_red_social/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── media/
│   ├── static/
│   ├── backend/
│   └── apps/
│       ├── usuarios/
│       ├── amistades/
│       ├── publicaciones/
│       ├── interacciones/
│       ├── mensajes/
│       ├── notificaciones/
│       ├── configuracion/
│       ├── grupos/
│       ├── historias/
│       └── marketplace/
└── frontend/
    ├── public/
    ├── styles/
    ├── components/
    ├── pages/
    ├── utils/
    ├── context/
    └── .env.local
```

## ✅ Funcionalidades

- [x] Registro de usuarios con verificación por correo electrónico
- [x] Inicio de sesión con email y contraseña
- [x] Autenticación con tokens JWT (guardados en localStorage)
- [x] Modelo de usuario con foto de perfil y biografía
- [x] Sistema de amistad (solicitudes, aceptar/rechazar)
- [x] Página de inicio con Feed de publicaciones
- [x] Publicaciones con texto e imagen
- [x] Reacciones y comentarios a publicaciones
- [ ] Mensajes en tiempo real (en desarrollo)
- [ ] Notificaciones (pendiente)
- [ ] Grupos y comunidades (pendiente)
- [ ] Historias tipo Instagram (pendiente)
- [ ] Marketplace (pendiente)
- [x] Panel de administración en Django Admin

## ⚙️ Tecnologías utilizadas

- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React, Next.js, Tailwind CSS
- **Base de datos**: PostgreSQL
- **Autenticación**: Tokens JWT, verificación por email
- **Despliegue**: Ubuntu Server + Apache (manual)





✅ Funcionalidades ya implementadas o en progreso
Funcionalidad	Estado
Registro con verificación por correo	✅ Completado
Inicio de sesión con email y contraseña	✅ Completado
Autenticación con tokens (localStorage)	✅ Completado
Foto de perfil y biografía en modelo	✅ Completado
Mostrar publicaciones de usuario y amigos	🛠️ En progreso
Crear publicaciones con imagen y texto	🛠️ En progreso
Reacciones y comentarios a publicaciones	🛠️ En progreso
Sistema de amigos/seguidores	✅ Completado
Notificaciones, mensajes, historias, grupos	🔜 Por hacer
Admin Django para gestión total del sistema	✅ Completado
Diseño de frontend tipo Facebook	🛠️ En progreso






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

