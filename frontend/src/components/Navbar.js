import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useEffect, useState, useContext } from "react";
import { buscarUsuarios, enviarSolicitud } from "../services/amistadesApi";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { 
  Bell, 
  Menu, 
  X, 
  Search, 
  Home, 
  Users, 
  MessageCircle, 
  User,
  Settings,
  ChevronDown,
  UserPlus
} from "lucide-react";



const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [showResultados, setShowResultados] = useState(false);
  const [notifications, setNotifications] = useState(3); // Ejemplo de notificaciones
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // 🔍 Buscar usuarios en tiempo real
useEffect(() => {
  const fetchResultados = async () => {
    if (searchQuery.trim().length > 1) {
      try {
        const token = localStorage.getItem("token");
        const data = await buscarUsuarios(token, searchQuery);
        setResultados(data);
        setShowResultados(true);
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      }
    } else {
      setResultados([]);
      setShowResultados(false);
    }
  };

  const delayDebounce = setTimeout(fetchResultados, 400); // debounce
  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
      setShowMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar lógica de búsqueda
      console.log("Buscando:", searchQuery);
      // Aquí puedes redirigir a página de resultados
      // router.push(`/buscar?q=${searchQuery}`);
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // ➕ Enviar solicitud
const handleEnviarSolicitud = async (usuarioId) => {
  try {
    const token = localStorage.getItem("token");
    await enviarSolicitud(token, usuarioId);
    alert("Solicitud enviada ✅");
  } catch (error) {
    alert("Error al enviar solicitud ❌");
  }
};

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-blue-600 dark:bg-gray-900 text-white flex justify-between items-center px-4 sm:px-6 py-3 fixed top-0 w-full z-50 shadow-lg backdrop-blur-sm"
      >
        {/* Logo */}
        <Link href="/">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-white text-xl sm:text-2xl font-bold cursor-pointer"
          >
            SociaLink
          </motion.span>
        </Link>

        {/* Barra de búsqueda - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en SociaLink..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
            />
          </form>
          {/* 🔽 Resultados */}
{showResultados && (
  <div className="absolute top-12 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
    {resultados.length > 0 ? (
      resultados.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <div className="flex items-center space-x-3">
            <img
              src={u.foto_perfil || "/img/default-profile.png"}
              alt={u.nombre}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-900 dark:text-gray-200">
              {u.nombre}
            </span>
          </div>
          <button
            onClick={() => handleEnviarSolicitud(u.id)}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      ))
    ) : (
      <p className="px-4 py-2 text-gray-500">Sin resultados</p>
    )}
  </div>
)}

        </div>

        {/* Iconos de navegación - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* Home */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Home className="w-6 h-6 text-white dark:text-gray-200" />

            </motion.div>
          </Link>

          {/* Amigos */}
          <Link href="/amigos">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Users className="w-6 h-6 text-white dark:text-gray-200" />
            </motion.div>
          </Link>

          {/* Mensajes */}
          <Link href="/mensajes">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 text-white dark:text-gray-200" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-xs rounded-full px-1.5 py-0.5 text-white font-medium">
                2
              </span>
            </motion.div>
          </Link>

          {/* Notificaciones */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Bell className="w-6 h-6 text-white dark:text-gray-200" />
            {notifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 py-0.5 text-white font-medium"
              >
                {notifications}
              </motion.span>
            )}
          </motion.div>

          {/* Separador */}
          <div className="w-px h-6 bg-white/30"></div>

          {/* Toggle tema */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            {isDark ? "☀️" : "🌙"}
          </motion.button>

          {/* Perfil con dropdown */}
          {user && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <motion.button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <img
                  src={user.foto_perfil_url || "/img/default-profile.png"}
                  alt="Foto de perfil"
                  className="rounded-full object-cover border-2 border-white/50"
                  style={{ width: "32px", height: "32px" }}
                />
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* Dropdown del perfil */}
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    
                    <Link href="/perfil">
                      <div className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <User className="w-4 h-4 mr-3" />
                        Ver perfil
                      </div>
                    </Link>
                    
                    <Link href="/configuracion">
                      <div className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Settings className="w-4 h-4 mr-3" />
                        Configuración
                      </div>
                    </Link>
                    
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    
                    <div className="px-4 py-2">
                      <LogoutButton />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Menú hamburguesa - Mobile */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Notificaciones mobile */}
          <div className="relative">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
                {notifications}
              </span>
            )}
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-40 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Búsqueda móvil */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            </div>

            {/* Enlaces móvil */}
            <div className="py-2">
              <Link href="/">
                <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Home className="w-5 h-5 mr-3" />
                  Inicio
                </div>
              </Link>
              
              <Link href="/perfil">
                <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="w-5 h-5 mr-3" />
                  Mi Perfil
                </div>
              </Link>
              
              <Link href="/amigos">
                <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Users className="w-5 h-5 mr-3" />
                  Amigos
                </div>
              </Link>
              
              <Link href="/mensajes">
                <div className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Mensajes
                  </div>
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">2</span>
                </div>
              </Link>
              
              <Link href="/configuracion">
                <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="w-5 h-5 mr-3" />
                  Configuración
                </div>
              </Link>

              {/* Toggle tema móvil */}
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="mr-3 text-lg">{isDark ? "☀️" : "🌙"}</span>
                {isDark ? "Modo Claro" : "Modo Oscuro"}
              </button>

              {/* Usuario info móvil */}
              {user && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-4 px-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user.foto_perfil_url || "/img/default-profile.png"}
                      alt="Foto de perfil"
                      className="rounded-full object-cover"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <LogoutButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Espaciador */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
