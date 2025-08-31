import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, UserPlus, MessageCircle } from "lucide-react";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes sesión iniciada.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/mis-amigos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) 
            throw new Error("No tienes permiso para ver la lista de amigos.");
          throw new Error("Error en la solicitud.");
        }
        return response.json();
      })
      .then((data) => setFriends(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Cerrar modal móvil al hacer click fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowMobile(false);
    }
  };

  const FriendsContent = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'px-1' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 ${
          isMobile ? 'text-xl' : 'text-lg'
        }`}>
          <Users className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600`} />
          Amigos
          {friends.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
              {friends.length}
            </span>
          )}
        </h2>
        {isMobile && (
          <button
            onClick={() => setShowMobile(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-400 text-sm">Cargando amigos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      ) : friends.length > 0 ? (
        <div className="space-y-2">
          {friends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer ${
                isMobile ? 'active:scale-98' : 'hover:scale-[1.02] hover:shadow-sm'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-sm shadow-md">
                  {friend.nombre?.charAt(0)?.toUpperCase() || "?"}
                </div>
                {/* Indicador de estado online (opcional) */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {friend.nombre}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  En línea
                </p>
              </div>

              {/* Acciones rápidas */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
                  aria-label="Enviar mensaje"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Lógica para enviar mensaje
                    console.log('Enviar mensaje a', friend.nombre);
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No tienes amigos aún</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <UserPlus className="w-4 h-4" />
            Encontrar amigos
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop - Mejorado */}
      <aside className="hidden lg:block w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-700 fixed right-0 top-16 h-[calc(100vh-4rem)] z-20 shadow-xl">
        <div className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <FriendsContent />
        </div>
      </aside>

      {/* Botón flotante móvil - Mejorado */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-6 lg:hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl z-30 border-4 border-white dark:border-gray-800"
        onClick={() => setShowMobile(true)}
        aria-label="Ver amigos"
      >
        <Users className="w-6 h-6" />
        {friends.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white">
            {friends.length > 99 ? '99+' : friends.length}
          </div>
        )}
      </motion.button>

      {/* Modal móvil - Completamente rediseñado */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end lg:hidden z-50"
            onClick={handleOverlayClick}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8 
              }}
              className="bg-white dark:bg-gray-900 w-full rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <FriendsContent isMobile={true} />
              </div>

              {/* Área segura inferior para dispositivos con notch */}
              <div className="pb-safe"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};

export default FriendsList;