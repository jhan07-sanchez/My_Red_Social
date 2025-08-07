import { useEffect, useState, useContext } from "react";
import Post from "./Post";
import NuevoPost from "./NuevoPost";
import { AuthContext } from "../../context/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { token, user, loadingAuth } = useContext(AuthContext);

  const cargarPosts = async () => {
    console.log("🔑 Token usado en Feed:", token);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/publicaciones/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();

      if (!response.ok) {
        console.error("❌ Error en la respuesta del backend:", response.status, text);
        return;
      }

      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        console.log("📥 Publicaciones cargadas:", data);
        setPosts(data);
      } else {
        console.error("⚠️ Respuesta inesperada del backend:", data);
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error cargando publicaciones:", error);
    }
  };

  useEffect(() => {
    console.log("🔄 Feed montado - loadingAuth:", loadingAuth, "user:", user, "token:", token);

    if (loadingAuth) return; // ⏳ Espera a que AuthContext termine

    if (token && user) {
      cargarPosts();
    } else {
      console.warn("🚫 No hay token o usuario, no se cargan publicaciones al recargar");
    }
  }, [loadingAuth, token, user]); // Observa loadingAuth correctamente

  const agregarNuevoPost = (nuevoPost) => {
    setPosts([nuevoPost, ...posts]);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear una nueva publicación</h2>

        <div className="mb-6">
          <NuevoPost onPostCreado={agregarNuevoPost} />
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No hay publicaciones aún.</p>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
