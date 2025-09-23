"use client";
import { useEffect, useState, useContext } from "react";
import Post from "./Post";
import NuevoPost from "./NuevoPost";
import { AuthContext } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

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

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  const { token, user, loadingAuth } = useContext(AuthContext);

  const cargarPosts = async () => {
    console.log("🔑 Token usado en Feed:", token);
    setLoadingPosts(true);
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
        setPosts([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        console.log("📥 Publicaciones cargadas:", data);
        setPosts(data);
      } else {
        console.error("⚠️ Respuesta inesperada del backend:", data);
        setError("Error al procesar publicaciones.");
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error cargando publicaciones:", error);
      setError("Hubo un problema al cargar las publicaciones.");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (loadingAuth) return;
    if (token && user) {
      cargarPosts();
    } else {
      console.warn("🚫 No hay token o usuario, no se cargan publicaciones");
      setLoadingPosts(false);
    }
  }, [loadingAuth, token, user]);

  const agregarNuevoPost = (nuevoPost) => {
    setPosts([nuevoPost, ...posts]);
  };

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Crear nuevo post */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            ✏️ Crear una nueva publicación
          </h2>
          <NuevoPost onPostCreado={agregarNuevoPost} />
        </div>

        {/* Estado: cargando */}
        {loadingPosts && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonPost key={i} />
            ))}
          </div>
        )}

        {/* Estado: error */}
        {error && (
          <div className="text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={cargarPosts}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: vacío */}
        {!loadingPosts && posts.length === 0 && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            No hay publicaciones aún. ¡Sé el primero en publicar! 🚀
          </p>
        )}

        {/* Lista de publicaciones */}
        <motion.div layout className="space-y-6">
          <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md"
            >
              <Post post={post} />
            </motion.div>
          ))}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default Feed;



