import { useEffect, useState, useContext } from "react";
import Post from "./Post";
import NuevoPost from "./NuevoPost";
import { AuthContext } from "../../context/AuthContext";

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

      const text = await response.text();

      if (!response.ok) {
        console.error(
          "❌ Error en la respuesta del backend:",
          response.status,
          text
        );
        setError("No se pudieron cargar las publicaciones.");
        setPosts([]);
        return;
      }

      const data = JSON.parse(text);

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
    console.log(
      "🔄 Feed montado - loadingAuth:",
      loadingAuth,
      "user:",
      user,
      "token:",
      token
    );

    if (loadingAuth) return; // ⏳ Espera a que AuthContext termine

    if (token && user) {
      cargarPosts();
    } else {
      console.warn(
        "🚫 No hay token o usuario, no se cargan publicaciones al recargar"
      );
      setLoadingPosts(false);
    }
  }, [loadingAuth, token, user]);

  const agregarNuevoPost = (nuevoPost) => {
    setPosts([nuevoPost, ...posts]);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Crear una nueva publicación
        </h2>

        {/* Crear nuevo post */}
        <div className="mb-6">
          <NuevoPost onPostCreado={agregarNuevoPost} />
        </div>

        {/* Estado: cargando */}
        {loadingPosts && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Cargando publicaciones...
          </p>
        )}

        {/* Estado: error */}
        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Estado: vacío */}
        {!loadingPosts && posts.length === 0 && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            No hay publicaciones aún.
          </p>
        )}

        {/* Lista de publicaciones */}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;


