import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

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
          if (response.status === 403) throw new Error("No tienes permiso para ver la lista de amigos.");
          throw new Error("Error en la solicitud.");
        }
        return response.json();
      })
      .then((data) => setFriends(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const FriendsContent = (
    <>
      <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-200 text-lg">Amigos</h2>
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : friends.length > 0 ? (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition"
            >
              <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold uppercase">
                {friend.nombre?.charAt(0) || "?"}
              </div>
              <span className="text-gray-700 dark:text-gray-200">{friend.nombre}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Sin amigos aún.</p>
      )}
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-72 p-4 bg-white/80 dark:bg-neutral-dark/80 min-h-[calc(100vh-4rem)] fixed right-0 top-16 shadow-lg border-l border-gray-100 dark:border-gray-700 z-20 backdrop-blur-md rounded-l-2xl">
        {FriendsContent}
      </aside>
      {/* Botón flotante móvil */}
      <button
        className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full p-4 shadow-2xl z-30 hover:scale-110 transition-transform"
        onClick={() => setShowMobile(true)}
        aria-label="Ver amigos"
      >
        <Users size={28} />
      </button>
      {/* Modal móvil */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-black/40 flex items-end lg:hidden z-40"
          >
            <div className="bg-white/90 dark:bg-neutral-dark/90 backdrop-blur-xl w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto shadow-2xl relative">
              <button
                className="absolute top-4 right-6 text-gray-500 text-2xl"
                onClick={() => setShowMobile(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
              {FriendsContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FriendsList;