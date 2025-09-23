"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, UserPlus, MessageCircle } from "lucide-react";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
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
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
        setFiltered(data);
      })
      .catch(() => setError("Error al cargar amigos"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setFiltered(friends.filter((f) => f.nombre?.toLowerCase().includes(value)));
  };

  const FriendsContent = ({ isMobile = false }) => (
    <div>
      {/* Header con buscador */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <Users className="w-5 h-5 text-blue-600" /> Amigos
          {friends.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {friends.length}
            </span>
          )}
        </h2>
        {isMobile && (
          <button onClick={() => setShowMobile(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar amigos..."
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                   text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Lista de amigos */}
      {loading ? (
        <p className="text-gray-400 text-center">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                {friend.nombre?.charAt(0) || "?"}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-100 font-medium truncate">{friend.nombre}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">En línea</p>
              </div>
              <button className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No se encontraron amigos</p>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto shadow-lg">
        <FriendsContent />
      </aside>

      {/* Botón flotante en móvil */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-6 lg:hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg z-30"
        onClick={() => setShowMobile(true)}
      >
        <Users className="w-6 h-6" />
      </motion.button>

      {/* Modal móvil */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-end z-50"
            onClick={() => setShowMobile(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <FriendsContent isMobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FriendsList;
