"use client";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import Post from "./Post";
import NuevoPost from "./NuevoPost";
import { AuthContext } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Wifi, WifiOff, TrendingUp, Users, Clock } from "lucide-react";

const SkeletonPost = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 animate-pulse">
    {/* Header */}
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="ml-3 flex-1">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>

    {/* Contenido */}
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>

    {/* Imagen simulada */}
    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>

    {/* Footer acciones */}
    <div className="flex justify-between mt-4">
      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

const FeedFilter = ({ activeFilter, onFilterChange, postCounts }) => {
  const filters = [
    { id: 'recientes', label: 'Recientes', icon: Clock, count: postCounts.recientes },
    { id: 'populares', label: 'Populares', icon: TrendingUp, count: postCounts.populares },
    { id: 'siguiendo', label: 'Siguiendo', icon: Users, count: postCounts.siguiendo }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {filter.label}
              {filter.count > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ConnectionStatus = ({ isOnline, lastUpdate }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}
  >
    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
    <span className="text-sm font-medium">
      {isOnline ? 'En línea' : 'Sin conexión'}
    </span>
    {lastUpdate && (
      <span className="text-xs opacity-75">
        {new Date(lastUpdate).toLocaleTimeString()}
      </span>
    )}
  </motion.div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('recientes');
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postCounts, setPostCounts] = useState({
    recientes: 0,
    populares: 0,
    siguiendo: 0
  });

  const { token, user, loadingAuth } = useContext(AuthContext);
  const observerRef = useRef();

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función para filtrar posts localmente según el filtro activo
  const filterPosts = useCallback((allPosts, filter) => {
    let filteredPosts = [...allPosts];

    switch (filter) {
      case 'populares':
        // Ordenar por likes + comentarios (popularidad)
        filteredPosts.sort((a, b) => {
          const popularityA = (a.likes_count || 0) + (a.comentarios_count || 0);
          const popularityB = (b.likes_count || 0) + (b.comentarios_count || 0);
          return popularityB - popularityA;
        });
        break;
      case 'siguiendo':
        // Filtrar solo posts de usuarios que sigue (si tienes esa info)
        // Por ahora mantenemos todos los posts ya que no tenemos info de seguimientos
        filteredPosts = allPosts.filter(post => post.autor?.es_seguido || false);
        break;
      case 'recientes':
      default:
        // Ordenar por fecha más reciente
        filteredPosts.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
    }

    return filteredPosts;
  }, []);

  const cargarPosts = useCallback(async (append = false) => {
    console.log("🔑 Token usado en Feed:", token);
    
    if (!append) {
      setLoadingPosts(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/publicaciones/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Error en la respuesta del backend:", response.status, text);
        setError("No se pudieron cargar las publicaciones.");
        if (!append) setPosts([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        console.log("📥 Publicaciones cargadas:", data);
        
        // Actualizar contadores para cada filtro
        const counts = {
          recientes: data.length,
          populares: data.filter(post => (post.likes_count || 0) + (post.comentarios_count || 0) > 0).length,
          siguiendo: data.filter(post => post.autor?.es_seguido || false).length
        };
        setPostCounts(counts);

        // Aplicar filtro local
        const filteredPosts = filterPosts(data, activeFilter);
        setPosts(filteredPosts);
        setLastUpdate(new Date());
        
        // Para simular paginación, asumimos que si hay menos de 20 posts, no hay más
        setHasMore(data.length >= 20);
      } else {
        console.error("⚠️ Respuesta inesperada del backend:", data);
        setError("Error al procesar publicaciones.");
        if (!append) setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error cargando publicaciones:", error);
      setError("Hubo un problema al cargar las publicaciones.");
      if (!append) setPosts([]);
    } finally {
      setLoadingPosts(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [token, activeFilter, filterPosts]);

  // Infinite scroll callback (simulado)
  const lastPostElementCallback = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingPosts) {
        // Simular carga de más posts (en una implementación real, cargarías la siguiente página)
        setLoadingMore(true);
        setTimeout(() => {
          setLoadingMore(false);
          setHasMore(false); // Simular que no hay más posts
        }, 1500);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loadingPosts]);

  useEffect(() => {
    if (loadingAuth) return;
    if (token && user) {
      cargarPosts(false);
    } else {
      console.warn("🚫 No hay token o usuario, no se cargan publicaciones");
      setLoadingPosts(false);
    }
  }, [loadingAuth, token, user, cargarPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await cargarPosts(false);
  };

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    setPage(1);
    
    // Aplicar filtro a los posts existentes
    if (posts.length > 0) {
      const filteredPosts = filterPosts(posts, newFilter);
      setPosts(filteredPosts);
    }
  };

  const agregarNuevoPost = (nuevoPost) => {
    setPosts(prev => {
      const newPosts = [nuevoPost, ...prev];
      // Actualizar contadores
      setPostCounts(prevCounts => ({
        ...prevCounts,
        recientes: prevCounts.recientes + 1
      }));
      
      // Aplicar filtro si es necesario
      return filterPosts(newPosts, activeFilter);
    });
  };

  const eliminarPost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const actualizarPost = (postActualizado) => {
    setPosts(prev => prev.map(post => 
      post.id === postActualizado.id ? postActualizado : post
    ));
  };

  return (
    <div className="w-full relative">
      {/* Estado de conexión */}
      <AnimatePresence>
        {!isOnline && (
          <ConnectionStatus isOnline={isOnline} lastUpdate={lastUpdate} />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header con refresh */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Feed
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-xl transition-all duration-200 ${
              refreshing 
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300'
            }`}
          >
            <RefreshCw 
              size={20} 
              className={refreshing ? 'animate-spin' : ''} 
            />
          </button>
        </div>

        {/* Filtros */}
        <FeedFilter 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          postCounts={postCounts}
        />

        {/* Crear nuevo post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            ✏️ Crear una nueva publicación
          </h2>
          <NuevoPost onPostCreado={agregarNuevoPost} />
        </motion.div>

        {/* Estado: cargando inicial */}
        {loadingPosts && posts.length === 0 && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SkeletonPost />
              </motion.div>
            ))}
          </div>
        )}

        {/* Estado: error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800"
          >
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => cargarPosts(false)}
              className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Reintentar
            </button>
          </motion.div>
        )}

        {/* Estado: vacío */}
        {!loadingPosts && posts.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gray-50 dark:bg-gray-800/50 p-12 rounded-2xl"
          >
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No hay publicaciones aún
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              ¡Sé el primero en compartir algo increíble!
            </p>
          </motion.div>
        )}

        {/* Lista de publicaciones */}
        <motion.div layout className="space-y-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => {
              const isLast = index === posts.length - 1;
              return (
                <motion.div
                  key={post.id}
                  ref={isLast ? lastPostElementCallback : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05 
                  }}
                  layout
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Post 
                    post={post} 
                    onDelete={eliminarPost}
                    onUpdate={actualizarPost}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Loading más posts */}
        {loadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <RefreshCw size={20} className="animate-spin" />
              <span>Cargando más publicaciones...</span>
            </div>
          </motion.div>
        )}

        {/* Fin de posts */}
        {!hasMore && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <div className="text-2xl mb-2">🎉</div>
            <p>¡Has visto todas las publicaciones!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;


